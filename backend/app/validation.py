# -*- coding: utf-8 -*-
"""数据清洗与交叉校验（PRD 06 节）"""
from .sources import SOURCE_TIERS, freshness_coefficient
from .confidence import CONFLICT_PENALTY

def normalize(value: str, kind: str = "text") -> str:
    """格式归一化：价格→人民币元、日期→ISO8601、单位标准化"""
    v = (value or "").strip()
    if not v:
        return v
    if kind == "price":
        v = v.replace("￥", "¥").replace("元", "").strip()
    elif kind == "date":
        v = v.replace("/", "-")
    return v

def compare_values(a: str, b: str, kind: str = "text") -> str:
    """返回 一致 / 基本一致 / 冲突 / 单源"""
    a, b = normalize(a, kind), normalize(b, kind)
    if a == b:
        return "一致"
    if kind == "price":
        try:
            na = float(a.replace("¥", "")); nb = float(b.replace("¥", ""))
            if na and abs(na - nb) / na <= 0.05:
                return "基本一致"
        except ValueError:
            pass
    return "冲突"

def _single_conf(v) -> float:
    """单源置信度 = 来源权重 × 新鲜度（交叉验证按单源 0.5，PRD 04 示例）"""
    weight = SOURCE_TIERS.get(v.get("source_type", "official"), {}).get("weight", 0.5)
    return weight * freshness_coefficient(v.get("days", 90)) * 0.5

def cross_validate(point: dict) -> dict:
    """对同一数据点的多来源值做交叉验证（PRD 06 节）"""
    values = point.get("values", [])
    n = len(values)
    base = {"point": point.get("point"), "values": values}
    if n == 0:
        return dict(base, status="无数据", conf=0.0, level="none")

    statuses = [compare_values(v["value"], values[0]["value"], point.get("kind", "text")) for v in values]
    if n == 1:
        status, consistent, cross = "单源", False, 0.5
    elif all(s == "一致" for s in statuses):
        status, consistent, cross = "%d源一致" % n, True, (1.0 if n >= 3 else 0.8)
    elif all(s in ("一致", "基本一致") for s in statuses):
        status, consistent, cross = "%d源基本一致" % n, True, (1.0 if n >= 3 else 0.8)
    else:
        status, consistent, cross = "%d源冲突" % n, False, 0.3

    if "冲突" in status:
        # 冲突处理：取最高单源置信度 × 冲突惩罚系数（PRD 06 节）
        conf = round(max(_single_conf(v) for v in values) * CONFLICT_PENALTY, 2)
    else:
        # 正常：取最高权重来源 × 其新鲜度 × 交叉验证系数
        primary = max(values, key=lambda v: SOURCE_TIERS.get(v.get("source_type", "official"), {}).get("weight", 0))
        weight = SOURCE_TIERS.get(primary.get("source_type", "official"), {}).get("weight", 0.5)
        conf = round(weight * freshness_coefficient(primary.get("days", 90)) * cross, 2)

    return dict(base, status=status, conf=conf,
                level="high" if conf >= 0.8 else "mid" if conf >= 0.5 else "low" if conf >= 0.3 else "none")
