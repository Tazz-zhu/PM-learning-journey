# -*- coding: utf-8 -*-
"""内置演示数据（与前端演示数据集同源；生产环境由真实采集替换）"""

CHIP_DEMO = {
    "STM32F103": {
        "type": "ARM Cortex-M3 MCU",
        "collect": {
            "official":  [{"point":"主频","value":"72MHz","days":5,"url":"https://www.st.com/"},
                          {"point":"内核","value":"Cortex-M3","days":5,"url":"https://www.st.com/"},
                          {"point":"Flash","value":"64KB","days":5,"url":"https://www.st.com/"},
                          {"point":"目标市场","value":"工业控制","days":90,"url":"https://www.st.com/"},
                          {"point":"渠道策略","value":"授权代理20+","days":90,"url":"https://www.st.com/"},
                          {"point":"传播话术","value":"robust可靠/生态完整/长期供货","days":10,"url":"https://www.st.com/"}],
            "datasheet": [{"point":"主频","value":"72MHz","days":5},
                          {"point":"内核","value":"Cortex-M3","days":5},
                          {"point":"Flash","value":"64KB","days":5}],
            "ecommerce": [{"point":"主频","value":"72MHz","days":3,"url":"https://item.szlcsc.com/"},
                          {"point":"参考价","value":"¥8.50","kind":"price","days":3,"url":"https://item.szlcsc.com/"},
                          {"point":"参考价","value":"¥9.20","kind":"price","days":3,"url":"https://www.digikey.cn/"}],
            "media":     [{"point":"参考价","value":"¥8.80","kind":"price","days":30,"url":"https://m.sohu.com/"},
                          {"point":"渠道策略","value":"授权代理20+","days":60,"url":"https://m.sohu.com/"},
                          {"point":"传播话术","value":"robust可靠/生态完整/长期供货","days":10,"url":"https://m.sohu.com/"}],
            "forum":     [{"point":"目标客户","value":"工控用户为主","days":45,"url":"https://bbs.21ic.com/"}],
            "social":    [],
        },
        "dim_points": {
            "产品定位": ["主频", "内核", "Flash"],
            "价格策略": ["参考价"],
            "渠道策略": ["渠道策略"],
            "传播话术": ["传播话术"],
            "技术参数": ["主频", "Flash"],
            "目标客户": ["目标市场", "目标客户"],
        },
        "llm": {
            "产品定位": {"conclusion": "高性能主流通用MCU，主打工业控制；以生态完整+长期供货建立壁垒。", "confidence": 0.62},
            "价格策略": {"conclusion": "参考价区间¥8.50-9.20，相对国产替代品溢价40-45%，为品牌溢价策略。", "confidence": 0.38},
            "渠道策略": {"conclusion": "官方直营+授权代理双轨，授权代理20+，渠道覆盖全球。", "confidence": 0.48},
            "传播话术": {"conclusion": "核心话术：Robust可靠 / Ecosystem生态 / Long-term长期供货，降低决策风险。", "confidence": 0.55},
            "技术参数": {"conclusion": "Cortex-M3/72MHz/64KB Flash，外设丰富度是工程竞争力核心。", "confidence": 0.72},
            "目标客户": {"conclusion": "以工业控制(45%)/消费电子(25%)/通信设备(15%)为主，关注长期供货。", "confidence": 0.35},
        },
    },
}

COMPANY_DEMO = {
    "杰理科技": {
        "type": "蓝牙音频SoC厂商",
        "collect": {
            "official":  [{"point":"产品线","value":"TWS/音箱/AIoT/MCU/充电IC","days":10,"url":"https://www.jieli.com/"},
                          {"point":"代表型号","value":"BT8912F/AC200N/AW33N","days":10,"url":"https://www.jieli.com/"}],
            "report":    [{"point":"TWS市占率","value":"39.8%（全球第一）","days":15,"url":"https://www.docin.com/"},
                          {"point":"代工工艺","value":"台积电22nm ULP","days":90,"url":"https://www.docin.com/"},
                          {"point":"核心客户","value":"白牌为主，向小米/OPPO渗透","days":15,"url":"https://www.docin.com/"}],
            "patent":    [{"point":"TWS年出货","value":"10.77亿颗（2025）","days":20,"url":"https://www.jieli.com/"},
                          {"point":"营收规模","value":"约107.9亿元（2025）","days":30,"url":"https://www.jieli.com/"}],
            "ecommerce": [{"point":"价格策略","value":"TWS主控¥1.5-2.5","kind":"price","days":5,"url":"https://item.szlcsc.com/"}],
            "media":     [{"point":"核心客户","value":"白牌为主，向小米/OPPO渗透","days":15,"url":"https://m.sohu.com/"}],
            "forum":     [{"point":"客户图谱","value":"小米Redmi Buds5/OPPO Enco Air3等","days":10,"url":"https://www.52audio.com/"}],
        },
        "dim_points": {
            "产品布局": ["产品线", "代表型号"],
            "市场信息": ["TWS市占率", "TWS年出货", "营收规模", "价格策略", "核心客户"],
            "战略布局": ["代工工艺", "TWS年出货"],
            "趋势预判": ["产品线", "代表型号", "TWS年出货"],
            "客户图谱": ["核心客户", "客户图谱"],
        },
        "llm": {
            "产品布局": {"conclusion": "金字塔结构：底层AC/GP量大价低，中层BT8912F核心利润，顶层AW33N AIoT卡位。", "confidence": 0.68},
            "市场信息": {"conclusion": "TWS市占率39.8%全球第一，年出货10.77亿颗，营收约107.9亿元。", "confidence": 0.78},
            "战略布局": {"conclusion": "从规模致胜向生态锁定转型，用上市资金加速AIoT与品牌客户渗透。", "confidence": 0.62},
            "趋势预判": {"conclusion": "TWS价格下探¥1以下、LE Audio迁移、AIoT成第二曲线（附时间窗口与置信度）。", "confidence": 0.55},
            "客户图谱": {"conclusion": "白牌为主，品牌渗透中；TOP5客户约占25-30%，替代机会高中低分级已生成。", "confidence": 0.66},
        },
    },
}
