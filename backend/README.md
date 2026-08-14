# ChipIntel Agent — 后端产品引擎（按 PRD v3.1 实现）

按 PRD 第 11 节「技术架构与实现方案」实现的产品后端：Agent 闭环编排、置信度评分、交叉校验、缺口检测与补充采集、证据链、结论自检、报告生成、SQLite 存储。

## 快速运行（纯标准库，无需安装）

```bash
cd backend
python run.py chip STM32F103            # 芯片级分析（6维度）
python run.py company 杰理科技          # 公司级分析（5维度）
python run.py chip STM32F103 --json     # 输出结构化 JSON
python run.py company 杰理科技 --html   # 生成 HTML 报告
python run.py chip STM32F103 --save     # 写入 SQLite（chipintel.db）
```

## API 服务（需先安装依赖）

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# POST /api/analyze  {"mode":"chip|company","subject":"STM32F103"}
# GET  /api/report/{run_id}
# GET  /health
```

## 模块对照（PRD → 代码）

| PRD 章节 | 实现 |
| --- | --- |
| 03 Agent闭环编排（LangGraph状态图） | `app/engine.py`：plan→collect→validate→analyze→self_check→report，含 2 条反馈回路（缺口→补充采集≤2轮；低置信→标注） |
| 04 置信度模型 / 回退机制 | `app/confidence.py`：置信度=来源权重×新鲜度×交叉验证；冲突惩罚×0.95；四级映射 |
| 05 采集 / 缺口检测 | `app/collectors.py`（BaseCollector + DemoCollector + Playwright 预留）+ `engine._gap_detection`（覆盖率<60%触发补充） |
| 06 清洗与交叉校验 | `app/validation.py`：归一化、一致/基本一致/冲突/单源判定、冲突保留全部值 |
| 07 分析 + 自检 | `app/llm.py`（DemoLLM / OpenAI兼容适配器）+ 置信度继承 min(支撑数据点) |
| 08 报告 | `app/reporting.py`：JSON 数据包 + 静态 HTML 报告 |
| 11 存储 | `app/storage.py`：SQLite（runs 表）+ JSON |

## 演示 vs 生产

- `DemoCollector` / `DemoLLM`：开箱即跑（内置 STM32F103、杰理科技 演示数据）
- 生产接入点：
  - `PlaywrightCollector.collect()`：真实网页采集（安装 playwright）
  - `OpenAICompatibleLLM.analyze_dimension()`：配置 `OPENAI_API_KEY` 调用 LLM（JSON mode）
  - `demo_data.py` → 替换为真实采集数据源/数据库

## DeepSeek 接入

在 backend/.env 配置（模板见 .env.example）：
DEEPSEEK_API_KEY=sk-xxxx
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat

使用方式（引擎自动读取 .env）：
  python run.py chip STM32F103 --llm deepseek   # 强制 DeepSeek
  python run.py chip STM32F103 --llm auto       # 有 key 自动用 DeepSeek，无 key 用演示

- 每维度调用一次 DeepSeek（JSON mode），结论必须引用数据包数值
- 60s 超时 + 2 次重试；失败自动降级到演示引擎并标注 llm_source=fallback-demo（PRD 回退机制）
- API 层：POST /api/analyze {"mode":"chip","subject":"STM32F103","llm_prefer":"deepseek"}
