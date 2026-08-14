# -*- coding: utf-8 -*-
"""FastAPI 产品服务（PRD 11 节）：
  uvicorn main:app --reload
接口：
  POST /api/analyze   {"mode":"chip|company","subject":"..."}
  GET  /api/report/{run_id}
  GET  /health
"""
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.engine import run_chip_analysis, run_company_analysis, PipelineError
from app.storage import Store
from app.reporting import build_json

app = FastAPI(title="ChipIntel Agent API", version="3.1.0")
store = Store()

class AnalyzeRequest(BaseModel):
    mode: str
    subject: str
    llm_prefer: str = "auto"  # auto | deepseek | demo

@app.get("/health")
def health():
    return {"status": "ok", "app": "ChipIntel Agent", "version": "3.1.0"}

@app.post("/api/analyze")
def analyze(req: AnalyzeRequest):
    try:
        if req.mode == "chip":
            report = run_chip_analysis(req.subject, llm_prefer=req.llm_prefer)
        elif req.mode == "company":
            report = run_company_analysis(req.subject, llm_prefer=req.llm_prefer)
        else:
            raise HTTPException(400, "mode 仅支持 chip / company")
    except PipelineError as e:
        raise HTTPException(422, str(e))
    run_id = store.save(req.mode, req.subject, report)
    return {"run_id": run_id, "report": report}

@app.get("/api/report/{run_id}")
def get_report(run_id: int):
    row = store.get(run_id)
    if not row:
        raise HTTPException(404, "报告不存在")
    return row

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
