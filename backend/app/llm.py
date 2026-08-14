# -*- coding: utf-8 -*-
"""LLM 推理适配层（PRD 04/07/11 节）
- DemoLLM：演示模式，无需 API Key
- DeepSeekLLM：调用 DeepSeek（OpenAI 兼容 /chat/completions，JSON mode）
  超时(>60s)/失败 → 自动降级到 DemoLLM 并标注 llm_source=fallback-demo（PRD 回退机制）
"""
import json, os, urllib.request, urllib.error, datetime

def load_env(path=None):
    """极简 .env 加载（无第三方依赖）"""
    path = path or os.path.join(os.path.dirname(__file__), "..", ".env")
    if not os.path.exists(path):
        return
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, _, v = line.partition("=")
            os.environ.setdefault(k.strip(), v.strip())

load_env()

def get_api_config():
    return {
        "api_key": os.getenv("DEEPSEEK_API_KEY", "").strip(),
        "base_url": os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com").rstrip("/"),
        "model": os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
    }

class BaseLLM:
    def analyze_dimension(self, dimension: str, data_pack: dict) -> dict:
        raise NotImplementedError

class DemoLLM(BaseLLM):
    def __init__(self, templates: dict):
        self.templates = templates
    def analyze_dimension(self, dimension: str, data_pack: dict) -> dict:
        tpl = self.templates.get(dimension, {})
        return {
            "dimension": dimension,
            "conclusion": tpl.get("conclusion", "（演示结论）基于数据包生成的营销分析。"),
            "evidence": tpl.get("evidence", [
                {"layer": "数据", "text": "引用数据包中的具体值+来源", "source": "演示数据包", "confidence": 0.5},
                {"layer": "发现", "text": "跨来源/竞品的对比发现", "source": "演示数据包", "confidence": 0.5},
                {"layer": "推论", "text": "基于发现的逻辑推演", "source": "演示数据包", "confidence": 0.5},
                {"layer": "建议", "text": "可操作的竞品营销建议", "source": "演示数据包", "confidence": 0.5},
            ]),
            "confidence": tpl.get("confidence", 0.5),
            "llm_source": "demo",
        }

class DeepSeekLLM(BaseLLM):
    """DeepSeek 接入：POST {base}/chat/completions，JSON mode，60s 超时，2 次重试"""
    TIMEOUT = 60          # PRD：LLM API 超时阈值 60s
    MAX_RETRIES = 2

    def __init__(self, templates: dict, api_key: str = None, base_url: str = None, model: str = None):
        self.templates = templates
        cfg = get_api_config()
        self.api_key = api_key or cfg["api_key"]
        self.base_url = base_url or cfg["base_url"]
        self.model = model or cfg["model"]
        self._demo = DemoLLM(templates)

    def _prompt(self, dimension: str, data_pack: dict) -> str:
        pts = []
        for p in data_pack.get("data_points", []):
            vals = "；".join("%s[%s %.2f]" % (v.get("value"), v.get("source_name", v.get("source_type")), v.get("conf", 0)) for v in p.get("values", []))
            pts.append("数据点「%s」：%s（验证：%s，置信度 %.2f）" % (p.get("point"), vals, p.get("status"), p.get("conf", 0)))
        return (
            "你是半导体竞品情报分析 Agent（ChipIntel）。请基于以下已校验数据包，对【%s】维度做营销分析。\n"
            "数据包：\n%s\n\n"
            "要求输出 JSON（不要输出其他内容）：\n"
            "{\"dimension\": \"%s\", \"conclusion\": \"一段结论\", "
            "\"evidence\": [{\"layer\": \"数据\", \"text\": \"引用具体数据+来源\", \"confidence\": 0.0}, "
            "{\"layer\": \"发现\", \"text\": \"跨来源/竞品对比发现\", \"confidence\": 0.0}, "
            "{\"layer\": \"推论\", \"text\": \"逻辑推演\", \"confidence\": 0.0}, "
            "{\"layer\": \"建议\", \"text\": \"可操作建议\", \"confidence\": 0.0}], "
            "\"confidence\": 0.0}\n"
            "要求：结论必须引用数据包中的具体数值；confidence 为 0-1 自评；JSON 必须合法。"
        ) % (dimension, "\n".join(pts) if pts else "（该维度数据不足）", dimension)

    def _call(self, dimension: str, data_pack: dict) -> dict:
        if not self.api_key:
            raise RuntimeError("未配置 DEEPSEEK_API_KEY")
        body = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "你是半导体竞品情报分析 Agent，输出严格 JSON。"},
                {"role": "user", "content": self._prompt(dimension, data_pack)},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.3,
            "stream": False,
        }
        req = urllib.request.Request(
            self.base_url + "/chat/completions",
            data=json.dumps(body).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer " + self.api_key,
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=self.TIMEOUT) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
        content = payload["choices"][0]["message"]["content"]
        return json.loads(content)  # JSON mode：content 应为合法 JSON

    def analyze_dimension(self, dimension: str, data_pack: dict) -> dict:
        last_err = None
        for attempt in range(self.MAX_RETRIES + 1):
            try:
                out = self._call(dimension, data_pack)
                return {
                    "dimension": dimension,
                    "conclusion": str(out.get("conclusion", "")),
                    "evidence": out.get("evidence") or [],
                    "confidence": float(out.get("confidence", 0.5)),
                    "llm_source": "deepseek",
                }
            except Exception as e:  # 超时/网络/JSON 解析失败 → 重试 → 降级
                last_err = e
        # PRD 回退机制：LLM 不可用 → 降级为纯数据/演示分析并标注
        result = self._demo.analyze_dimension(dimension, data_pack)
        result["llm_source"] = "fallback-demo"
        result["llm_error"] = "%s: %s" % (type(last_err).__name__, str(last_err)[:120])
        return result

def get_llm(templates: dict, prefer: str = "auto") -> BaseLLM:
    """auto：有 DEEPSEEK_API_KEY 就用 DeepSeek，否则 Demo"""
    cfg = get_api_config()
    use_deepseek = prefer == "deepseek" or (prefer == "auto" and bool(cfg["api_key"]))
    if use_deepseek:
        return DeepSeekLLM(templates)
    return DemoLLM(templates)
