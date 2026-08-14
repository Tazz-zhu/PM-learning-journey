# -*- coding: utf-8 -*-
"""Agent 闭环编排引擎（PRD 03/11 节）
状态流：plan_collection → execute_collection → clean_data → cross_validate
       → score_confidence → analyze → self_check → report → trace
反馈回路：① 置信度不足 → 补充采集（最多2轮）
         ② 自检失败   → 重新推理（最多1轮）
"""
import datetime
from .collectors import DemoCollector
from .llm import get_llm
from .validation import cross_validate
from .demo_data import CHIP_DEMO, COMPANY_DEMO

COVERAGE_THRESHOLD = 0.6
MAX_SUPPLEMENT_ROUNDS = 2

class PipelineError(Exception):
    pass

def _collect(mode: str, subject: str, demo: dict, round_no: int = 0, only_sources=None):
    rows = []
    plan = {}
    for source_type, samples in demo.get("collect", {}).items():
        plan[source_type] = len(samples)
        if only_sources and source_type not in only_sources:
            continue  # 补充采集只聚焦缺口来源
        rows.extend(DemoCollector(source_type, samples).collect(subject, plan))
    return rows, plan

def _group_points(rows):
    points = {}
    for r in rows:
        points.setdefault(r["point"], {"point": r["point"], "kind": r.get("kind", "text"), "values": []})
        points[r["point"]]["values"].append(r)
    return points

def _coverage(plan, rows):
    expected = sum(plan.values())
    if not expected:
        return 0.0
    return min(1.0, len(rows) / expected)

def _gap_detection(plan, rows):
    """缺口检测：覆盖率低于60%的维度/来源标记缺口（PRD 05 节）"""
    gaps = []
    expected = sum(plan.values())
    if not expected:
        return gaps
    for src, exp in plan.items():
        if exp == 0:
            continue  # 无预期数据来源不算缺口
        got = sum(1 for r in rows if r["source_type"] == src)
        cov = got / exp
        if cov < COVERAGE_THRESHOLD:
            gaps.append({"source": src, "coverage": round(cov * 100), "expected": exp, "got": got})
    return gaps

def run_chip_analysis(subject: str, demo: dict = None, llm_prefer: str = "auto") -> dict:
    demo = demo or CHIP_DEMO.get(subject)
    if not demo:
        raise PipelineError("无法识别该芯片型号，请输入完整型号（如 STM32F103C8T6）或品牌+系列")
    return _run(mode="chip", subject=subject, demo=demo,
                dims=["产品定位","价格策略","渠道策略","传播话术","技术参数","目标客户"],
                llm_prefer=llm_prefer)

def run_company_analysis(subject: str, demo: dict = None, llm_prefer: str = "auto") -> dict:
    demo = demo or COMPANY_DEMO.get(subject)
    if not demo:
        raise PipelineError("无法识别该公司，请输入完整公司名称（如 '杰理科技'）或提供官网URL")
    return _run(mode="company", subject=subject, demo=demo,
                dims=["产品布局","市场信息","战略布局","趋势预判","客户图谱"],
                llm_prefer=llm_prefer)

def _run(mode: str, subject: str, demo: dict, dims: list, llm_prefer: str = "auto") -> dict:
    started = datetime.datetime.now()
    # 1) 采集（第1轮）
    rows, plan = _collect(mode, subject, demo)
    gaps = _gap_detection(plan, rows)

    # 2) 缺口闭环：补充采集（最多2轮）
    rounds = 0
    while gaps and rounds < MAX_SUPPLEMENT_ROUNDS:
        rounds += 1
        extra, _ = _collect(mode, subject, demo, round_no=rounds,
                            only_sources=[g["source"] for g in gaps])
        rows.extend(extra)
        gaps = _gap_detection(plan, rows)

    # 3) 清洗 + 交叉校验 + 置信度
    points = _group_points(rows)
    validated = [cross_validate(p) for p in points.values()]

    # 4) LLM 分析（6/5 维度）+ 证据链 + 自评置信度（PRD 07：置信度继承 = min(支撑证据链数据点)）
    llm = get_llm(demo.get("llm", {}), prefer=llm_prefer)
    analysis = []
    point_map = demo.get("dim_points", {})
    for d in dims:
        relevant = point_map.get(d) or [v["point"] for v in validated]
        dp = [v for v in validated if v["point"] in relevant]
        pack = {"subject": subject, "dimension": d, "data_points": dp}
        result = llm.analyze_dimension(d, pack)
        result["data_points"] = dp
        confs = [v["conf"] for v in dp]
        result["confidence"] = round(min(result.get("confidence", 0.0), min(confs) if confs else 0.0), 2)
        analysis.append(result)

    # 5) 结论自检（PRD 07 节）
    self_check = []
    for a in analysis:
        ok = a["confidence"] >= 0.3
        self_check.append({"dimension": a["dimension"], "passed": ok,
                           "confidence": a["confidence"],
                           "note": "通过" if ok else "低置信度，建议补充验证"})

    # 6) 报告与溯源
    overall = round(sum(a["confidence"] for a in analysis) / max(1, len(analysis)), 2)
    report = {
        "app": "ChipIntel Agent", "version": "3.1.0", "mode": mode, "subject": subject,
        "generated_at": started.strftime("%Y-%m-%d %H:%M:%S"),
        "overall_confidence": overall, "level": "high" if overall >= 0.8 else "mid" if overall >= 0.5 else "low",
        "data_items": len(rows), "sources": len(plan), "supplement_rounds": rounds,
        "gaps": gaps, "dimensions": analysis, "self_check": self_check,
    }
    return report
