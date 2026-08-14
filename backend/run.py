# -*- coding: utf-8 -*-
"""产品 CLI（纯标准库，开箱即跑）：
  python run.py chip STM32F103                    # 演示模式（无 API Key）
  python run.py company 杰理科技 --llm deepseek   # 使用 DeepSeek 推理
  python run.py chip STM32F103 --json
"""
import argparse, json, sys
from app.engine import run_chip_analysis, run_company_analysis, PipelineError
from app.storage import Store
from app.reporting import build_json, build_html

def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")

    parser = argparse.ArgumentParser(description="ChipIntel Agent v3.1 — 按 PRD 实现的产品引擎")
    parser.add_argument("mode", choices=["chip", "company"])
    parser.add_argument("subject")
    parser.add_argument("--json", action="store_true", help="输出 JSON")
    parser.add_argument("--html", action="store_true", help="输出 HTML 报告到文件")
    parser.add_argument("--save", action="store_true", help="写入 SQLite")
    parser.add_argument("--llm", choices=["auto", "deepseek", "demo"], default="auto",
                        help="推理引擎：auto=有 DEEPSEEK_API_KEY 则用 DeepSeek，否则演示")
    args = parser.parse_args()

    try:
        report = (run_chip_analysis if args.mode == "chip" else run_company_analysis)(
            args.subject, llm_prefer=args.llm)
    except PipelineError as e:
        print("错误：%s" % e, file=sys.stderr); sys.exit(1)

    if args.save:
        run_id = Store().save(args.mode, args.subject, report)
        print("已写入数据库 run_id=%d（%s）" % (run_id, Store().path))
    if args.html:
        name = "ChipIntel_%s_%s.html" % (args.subject, report["generated_at"][:10].replace("-", ""))
        open(name, "w", encoding="utf-8").write(build_html(report))
        print("已生成报告：%s" % name)
    if args.json:
        print(build_json(report))
    else:
        print("== %s 分析报告：%s ==" % (args.mode, args.subject))
        print("整体置信度 %.2f（%s）· 数据条目 %d · 来源 %d · 补充采集 %d 轮" % (
            report["overall_confidence"], report["level"], report["data_items"], report["sources"], report["supplement_rounds"]))
        for d in report["dimensions"]:
            src = d.get("llm_source", "?")
            print("  [%s] 置信度 %.2f（%s）：%s" % (d["dimension"], d["confidence"], src, d["conclusion"]))
        print("自检：%s" % "; ".join("%s %s" % (s["dimension"], "✓通过" if s["passed"] else "⚠低置信") for s in report["self_check"]))

if __name__ == "__main__":
    main()
