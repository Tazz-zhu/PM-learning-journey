<div align="center">

# PM的学习之旅

**产品经理学习之旅 · 实战作品：ChipIntel Agent — AI 蓝牙芯片竞品情报 Agent**

一个完整的「AI 竞品情报 Agent」产品实战：从 PRD 到可运行的前端应用 + 后端引擎，
实现 采集 → 校验 → 分析 → 报告 → 溯源 的闭环，内置演示数据开箱即用。

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![ECharts](https://img.shields.io/badge/ECharts-5.x-AA344D?style=flat-square)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![PRD](https://img.shields.io/badge/PRD-v3.1-blue?style=flat-square)

</div>

---

## 📸 产品截图

| 首页 · 双模式入口 | 芯片级分析报告 |
| --- | --- |
| ![首页](assets/screenshots/home.png) | ![芯片级报告](assets/screenshots/report.png) |

| 公司级战略分析报告 |
| --- |
| ![公司级报告](assets/screenshots/company.png) |

> 截图由真实页面渲染生成，点击可查看大图；直接打开 `ChipIntelAgent.html` 即可体验完整交互。

---

## ✨ 功能特性

- **双模式分析**：芯片级（单颗芯片 6 维营销情报） + 公司级（友商战略全貌 5 维分析）
- **Agent 闭环**：采集 → 校验 → 分析 → 报告 → 溯源，全流程可视化
- **证据链严谨**：高置信结论要求 ≥2 个独立来源交叉验证，4 层证据链（数据→发现→推论→建议）
- **置信度体系**：每个结论附带置信度分数，低置信自动标注
- **6 种可视化图表**：散点 / 柱状 / 雷达 / 热力 / 关系图谱 / 趋势
- **客户图谱**：拆解报告 + BQB + FCC 认证客户识别
- **替代机会分析**：芯片替代关系与厂商机会点
- **报告导出**：一键生成完整报告（前端 / 后端均可）
- **后端可选 LLM**：配置 `DEEPSEEK_API_KEY` 即启用真实推理，未配置自动降级为演示数据

---

## 🏗️ 架构总览

```mermaid
flowchart LR
    A[用户输入<br/>芯片型号 / 公司名] --> B[前端 ChipIntelAgent.html]
    B --> C[采集层<br/>数据源识别 · 抓取]
    C --> D[校验层<br/>多源交叉验证 · 置信度]
    D --> E[分析层<br/>6维/5维 营销情报分析]
    E --> F[报告层<br/>图表 · 客户图谱 · 导出]
    F --> G[溯源层<br/>证据链 · 引用回查]
    B --> H[后端引擎 backend/<br/>FastAPI · Agent 编排 · SQLite]
    H --> F
```

---

## 🚀 快速开始

### 前端（双击即用）

直接打开 `ChipIntelAgent.html`，或启动本地服务：

```bash
python -m http.server 8765
# 访问 http://127.0.0.1:8765/ChipIntelAgent.html
```

### 后端引擎

```bash
cd backend
pip install -r requirements.txt

# 芯片级分析
python run.py chip STM32F103

# 公司级分析（JSON 输出）
python run.py company 杰理科技 --json
```

> 如需真实 LLM 推理：复制 `backend/.env.example` 为 `backend/.env` 并填入 `DEEPSEEK_API_KEY`；未配置时自动使用内置演示数据。

---

## 📁 项目结构

```
PM的学习之旅/
├── ChipIntelAgent.html      # 前端单文件版（双击即用）
├── index.html               # 前端多文件版入口
├── prd.html                 # PRD 交互完善版（原型可交互）
├── PRD任务验收清单.md        # PRD 验收清单
├── assets/
│   ├── css/style.css        # 样式
│   ├── js/                  # 前端源码（app/charts/engine/data…）
│   └── screenshots/         # README 展示截图
├── backend/                 # 后端引擎
│   ├── run.py / main.py     # 入口
│   ├── app/                 # 采集/校验/置信度/报告/存储模块
│   ├── requirements.txt
│   └── .env.example
├── docs/prd.html            # PRD 原文备份
└── _shared/js/echarts.min.js
```

---

## ✅ 实测验证结果

芯片级 STM32F103：产品定位 0.62 / 价格 0.38 / 渠道 0.48 / 话术 0.55 / 技术参数 0.72 / 目标客户 0.12（低，已标注）——与 PRD 示例一致；自检 5/6 通过。

---

## 📄 License

[MIT](LICENSE) © 2026 Tazz-zhu
