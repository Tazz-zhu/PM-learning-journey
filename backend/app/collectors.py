# -*- coding: utf-8 -*-
"""数据采集引擎（PRD 05 节）
BaseCollector：真实实现可用 Playwright + BeautifulSoup 接入（见 requirements.txt 可选依赖）；
DemoCollector：演示模式，返回内置样本数据，保证产品开箱可跑。
"""
import datetime
from .sources import SOURCE_TIERS

class BaseCollector:
    source_type = "official"
    def collect(self, subject: str, plan: dict) -> list:
        raise NotImplementedError

class DemoCollector(BaseCollector):
    """演示采集器：按来源类型返回带元信息的样本数据"""
    def __init__(self, source_type: str, sample_rows: list):
        self.source_type = source_type
        self.sample_rows = sample_rows
    def collect(self, subject: str, plan: dict) -> list:
        now = datetime.datetime.now()
        rows = []
        for row in self.sample_rows:
            rows.append({
                "point": row.get("point"),
                "value": row.get("value"),
                "kind": row.get("kind", "text"),
                "source_type": self.source_type,
                "source_name": SOURCE_TIERS[self.source_type]["label"],
                "url": row.get("url", "https://example.com/source"),
                "collected_at": now.strftime("%Y-%m-%d %H:%M:%S"),
                "days": row.get("days", 90),
                "published_days_ago": row.get("days", 90),
            })
        return rows

class PlaywrightCollector(BaseCollector):
    """真实采集入口（需要 pip install playwright）——按 PRD 结构预留"""
    def collect(self, subject: str, plan: dict) -> list:
        # TODO: 使用 Playwright 渲染 JS 页面 + BeautifulSoup 解析静态 HTML
        raise NotImplementedError("请配置 PLAYWRIGHT=1 并安装 playwright 后使用真实采集")
