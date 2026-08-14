# -*- coding: utf-8 -*-
"""数据存储（PRD 11 节）：SQLite 记录任务/报告/溯源，JSON 保留证据链"""
import json, os, sqlite3, datetime

class Store:
    def __init__(self, path: str = None):
        self.path = path or os.path.join(os.path.dirname(__file__), "..", "chipintel.db")
        self.conn = sqlite3.connect(self.path)
        self._init()

    def _init(self):
        self.conn.execute("""CREATE TABLE IF NOT EXISTS runs(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mode TEXT, subject TEXT, created_at TEXT, report TEXT)""")

    def save(self, mode: str, subject: str, report: dict) -> int:
        cur = self.conn.execute(
            "INSERT INTO runs(mode, subject, created_at, report) VALUES(?,?,?,?)",
            (mode, subject, datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
             json.dumps(report, ensure_ascii=False)))
        self.conn.commit()
        return cur.lastrowid

    def get(self, run_id: int):
        row = self.conn.execute("SELECT * FROM runs WHERE id=?", (run_id,)).fetchone()
        if not row:
            return None
        return {"id": row[0], "mode": row[1], "subject": row[2], "created_at": row[3], "report": json.loads(row[4])}
