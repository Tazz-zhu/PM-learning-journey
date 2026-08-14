# -*- coding: utf-8 -*-
"""置信度评分模型（PRD 04 节）"""
from .sources import SOURCE_TIERS, freshness_coefficient, cross_validation_coefficient

CONFLICT_PENALTY = 0.95
LEVELS = [
    (0.8, "high", "高"),
    (0.5, "mid", "中"),
    (0.3, "low", "低"),
    (0.0, "none", "不足"),
]

def confidence(source_type: str, days: int, n_sources: int, consistent: bool = True) -> float:
    """置信度 = 来源权重 × 新鲜度 × 交叉验证"""
    weight = SOURCE_TIERS.get(source_type, {}).get("weight", 0.5)
    return weight * freshness_coefficient(days) * cross_validation_coefficient(n_sources, consistent)

def confidence_conflict(values: list) -> float:
    """冲突数据点：最高单源置信度 × 冲突惩罚系数（PRD 06 节）"""
    best = max(v.get("conf", 0.0) for v in values)
    return round(best * CONFLICT_PENALTY, 2)

def level_of(conf: float) -> str:
    for threshold, key, _ in LEVELS:
        if conf >= threshold:
            return key
    return "none"

def level_label(key: str) -> str:
    return dict(LEVELS)[key][1] if key in dict(LEVELS) else "—"
