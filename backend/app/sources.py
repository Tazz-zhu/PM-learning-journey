# -*- coding: utf-8 -*-
"""来源可信度分级（PRD 03/04 节）"""

SOURCE_TIERS = {
    "official":   {"label": "官网",       "weight": 1.0, "stars": 5},
    "datasheet":  {"label": "Datasheet",  "weight": 1.0, "stars": 5},
    "ecommerce":  {"label": "电商",       "weight": 0.8, "stars": 4},
    "media":      {"label": "新闻",       "weight": 0.6, "stars": 3},
    "forum":      {"label": "论坛",       "weight": 0.4, "stars": 2},
    "social":     {"label": "社交",       "weight": 0.2, "stars": 1},
    "report":     {"label": "行业报告",   "weight": 0.8, "stars": 4},
    "patent":     {"label": "招股/专利",  "weight": 0.8, "stars": 4},
}

# 数据新鲜度系数（PRD 04 节）
def freshness_coefficient(days: int) -> float:
    if days <= 7:
        return 1.0
    if days <= 30:
        return 0.8
    if days <= 90:
        return 0.6
    if days <= 180:
        return 0.4
    return 0.2

# 交叉验证系数（PRD 04 节）
def cross_validation_coefficient(sources: int, consistent: bool = True) -> float:
    if not consistent:
        return 0.3
    if sources >= 3:
        return 1.0
    if sources == 2:
        return 0.8
    return 0.5  # 单源
