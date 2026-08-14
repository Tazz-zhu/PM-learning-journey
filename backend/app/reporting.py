# -*- coding: utf-8 -*-
"""报告生成（PRD 08 节）：JSON 结构化数据包 + 静态 HTML 报告"""
import json, html as _h

def build_json(report: dict) -> str:
    return json.dumps(report, ensure_ascii=False, indent=2)

_TEMPLATE = """<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">
<title>ChipIntel_%(subject)s</title>
<style>body{font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;max-width:860px;margin:0 auto;padding:30px 20px;color:#1a202c;line-height:1.7}
h1{font-size:24px}h2{border-bottom:2px solid #0f4c75;padding-bottom:6px;margin-top:26px}
table{width:100%%;border-collapse:collapse;font-size:13px;margin:10px 0}
th{background:#0f4c75;color:#fff;padding:8px;text-align:left}td{padding:7px 8px;border-bottom:1px solid #e2e8f0}
.metric{display:inline-block;border:1px solid #e2e8f0;border-radius:10px;padding:10px 18px;margin:6px 10px 6px 0}
.metric b{font-size:20px;color:#0f4c75}.foot{color:#718096;font-size:12px;margin-top:30px}</style></head><body>
<h1>%(mode)s 竞品情报报告 — %(subject)s</h1>
<p>生成时间：%(generated_at)s · ChipIntel Agent v3.1</p>
<div class="metric">整体置信度 <b>%(overall_confidence).2f</b>（%(level)s）</div>
<div class="metric">数据条目 <b>%(data_items)s</b></div>
<div class="metric">来源数 <b>%(sources)s</b></div>
<div class="metric">补充采集轮次 <b>%(supplement_rounds)s</b></div>
<h2>维度分析结论</h2><table><tr><th>维度</th><th>结论</th><th>置信度</th><th>证据起点</th></tr>%(dims)s</table>
<h2>缺口与闭环</h2><p>%(gaps)s</p>
<p class="foot">演示数据集 · 趋势预判基于公开信息推理，不构成投资建议</p>
</body></html>"""

def build_html(report: dict) -> str:
    esc = _h.escape
    dims = "".join(
        "<tr><td>%s</td><td>%s</td><td>%.2f</td><td>%s</td></tr>" % (
            esc(d.get("dimension", "")), esc(d.get("conclusion", "")),
            d.get("confidence", 0), esc((d.get("evidence") or [{}])[0].get("text", "")))
        for d in report.get("dimensions", []))
    gaps = report.get("gaps", [])
    gaps_html = esc(json.dumps(gaps, ensure_ascii=False)) if gaps else "无缺口（覆盖率达标）"
    ctx = dict(report)
    ctx["dims"] = dims
    ctx["gaps"] = gaps_html
    return _TEMPLATE % ctx
