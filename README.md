# PM的学习之旅

本项目为产品经理（PM）学习之旅中的实战作品：**ChipIntel Agent — AI 蓝牙芯片竞品情报 Agent 产品**（按 PRD v3.1 生成）。

## 产品组成

| 部分 | 路径 | 说明 |
| --- | --- | --- |
| 前端产品（单文件） | `ChipIntelAgent.html` | 双模式闭环交互应用：采集→校验→分析→报告→溯源、6 图表、客户图谱、导出，双击即可打开 |
| 前端源码 | `index.html` + `assets/` | 前端多文件版（源码） |
| 后端引擎 | `backend/` | Agent 闭环编排、置信度计算、交叉校验、缺口补充采集、自检、报告、SQLite（见 `backend/README.md`） |
| PRD 交互完善版 | `prd.html` | PRD 文档本身（原型全部可交互） |
| PRD 原文备份 | `docs/prd.html` | 原始版本 |

## 快速体验

1. **前端**：直接打开 `ChipIntelAgent.html`，或本地服务 `python -m http.server 8765` 后访问 `http://127.0.0.1:8765/ChipIntelAgent.html`
2. **后端引擎**：
   ```bash
   cd backend
   python run.py chip STM32F103
   python run.py company 杰理科技 --json
   ```

## 后端验证结果（实测）

芯片级 STM32F103：产品定位 0.62 / 价格 0.38 / 渠道 0.48 / 话术 0.55 / 技术参数 0.72 / 目标客户 0.12（低，已标注）——与 PRD 示例一致；自检 5/6 通过。

## 说明

- 后端需在 `backend/.env` 中配置 `DEEPSEEK_API_KEY`（参考 `backend/.env.example`），未配置时自动降级为内置演示数据。
