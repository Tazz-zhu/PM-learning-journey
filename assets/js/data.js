/* ============================================================
   ChipIntel Agent v3.1 — 数据层
   内容依据 PRD v3.1（2026-08-13）整理；
   公司/芯片数据为演示数据集，非实时采集结果。
   ============================================================ */
window.CHIPINTEL = window.CHIPINTEL || {};
CHIPINTEL.version = 'v3.1';
CHIPINTEL.generatedAt = '2026-08-13';
CHIPINTEL.baseCompany = '易兆微电子（杭州）';
CHIPINTEL.pipelineSteps = [
  { key:'home', label:'首页', icon:'◉' },
  { key:'collect', label:'采集', icon:'1' },
  { key:'validate', label:'校验', icon:'2' },
  { key:'analyze', label:'分析', icon:'3' },
  { key:'report', label:'报告', icon:'4' },
  { key:'trace', label:'溯源', icon:'5' }
];

/* ---------- 来源可信度分级 ---------- */
CHIPINTEL.SOURCES = {
  official : { key:'official',  label:'官网',       stars:5, weight:1.0, icon:'🏢', color:'#0f4c75' },
  datasheet: { key:'datasheet', label:'Datasheet',  stars:5, weight:1.0, icon:'📄', color:'#0b6ea8' },
  ecommerce: { key:'ecommerce', label:'电商',       stars:4, weight:0.8, icon:'🛒', color:'#0284c7' },
  media    : { key:'media',     label:'新闻',       stars:3, weight:0.6, icon:'📰', color:'#d97706' },
  forum    : { key:'forum',     label:'论坛',       stars:2, weight:0.4, icon:'💬', color:'#7c3aed' },
  social   : { key:'social',    label:'社交',       stars:1, weight:0.2, icon:'📱', color:'#dc2626' },
  report   : { key:'report',    label:'行业报告',   stars:4, weight:0.8, icon:'📊', color:'#059669' },
  patent   : { key:'patent',    label:'招股/专利',  stars:4, weight:0.8, icon:'📑', color:'#0891b2' }
};

/* ---------- 置信度等级工具 ---------- */
function confLevel(v){
  if (v == null) return 'none';
  if (v >= 0.8) return 'high';
  if (v >= 0.5) return 'mid';
  if (v >= 0.3) return 'low';
  return 'none';
}
function confLabel(l){ return { high:'高', mid:'中', low:'低', none:'不足' }[l] || '—'; }

/* ============================================================
   芯片级数据集（模式A）
   ============================================================ */
CHIPINTEL.chips = {

/* ---------------- STM32F103（PRD v2 经典示例） ---------------- */
'STM32F103': {
  key:'STM32F103', label:'STM32F103', type:'ARM Cortex-M3 MCU', vendor:'意法半导体 ST',
  tagline:'32位通用MCU · 工业控制经典平台',
  desc:'基于 ARM Cortex-M3 内核的通用 32 位 MCU，72MHz 主频，是工业控制与消费电子领域的“常青树”型号，常被国产 MCU 作为兼容替代目标。',
  dims:['产品定位','价格策略','渠道策略','传播话术','技术参数','目标客户'],

  plan: {
    intro:'Agent 根据“STM32F103”自动识别为 ARM Cortex-M3 MCU，规划以下 6 维度 × 6 来源采集矩阵：',
    note:'绿色 = 计划采集项',
    matrix: [
      { dim:'产品定位',  cells:[1,1,0,1,0,0] },
      { dim:'价格策略',  cells:[0,0,1,1,0,0] },
      { dim:'渠道策略',  cells:[1,0,1,1,0,0] },
      { dim:'传播话术',  cells:[1,0,0,1,1,1] },
      { dim:'技术参数',  cells:[1,1,1,0,0,0] },
      { dim:'目标客户',  cells:[1,0,0,1,1,0] }
    ]
  },
  steps: [
    { label:'采集官网产品页',  detail:'来源可信度 ★★★★★ · 预计2s', status:'ok' },
    { label:'解析 Datasheet PDF', detail:'来源可信度 ★★★★★ · 预计3s', status:'ok' },
    { label:'抓取电商平台报价', detail:'来源可信度 ★★★★ · 立创+得捷 · 预计2s', status:'ok' },
    { label:'检索行业新闻',    detail:'来源可信度 ★★★ · 近90天 · 预计3s', status:'ok' },
    { label:'抓取技术论坛讨论', detail:'来源可信度 ★★ · 21ic+EEVblog · 预计2s', status:'ok' },
    { label:'采集社交媒体信号', detail:'来源可信度 ★ · 微博+B站 · 预计2s', status:'fail' }
  ],
  results: {
    items:47, itemsDesc:'含来源URL和时间戳',
    sourcesSuccess:5, sourcesFail:1, sourcesDesc:'5个成功 / 1个部分失败',
    coverage:'6/6', coverageDesc:'传播话术维度覆盖偏低',
    crossValidated:12, crossDesc:'12条数据有多源验证',
    conflicts:3, conflictDesc:'价格信息存在来源差异',
    gaps:[{ dim:'传播话术', coverage:55, suggest:'Agent建议：自动触发第2轮补充采集，聚焦微信公众号和技术博客。' },
          { dim:'社交媒体', coverage:20, suggest:'社交媒体信号不足，建议补充 B站拆解视频与微博讨论。' }],
    confidence:0.76, confidenceLevel:'mid'
  },

  validation: {
    rows:[
      { point:'主频', values:[{src:'官网',val:'72MHz',url:'https://www.st.com/'},{src:'Datasheet',val:'72MHz',url:'https://www.st.com/resource/en/datasheet/stm32f103c8.pdf'},{src:'电商',val:'72MHz',url:'https://item.szlcsc.com/'}], status:'3源一致', conf:0.80, level:'high' },
      { point:'内核', values:[{src:'官网',val:'Cortex-M3',url:'https://www.st.com/'},{src:'Datasheet',val:'Cortex-M3',url:'https://www.st.com/resource/en/datasheet/stm32f103c8.pdf'}], status:'2源一致', conf:0.80, level:'high' },
      { point:'参考价', values:[{src:'立创',val:'¥8.50',note:'授权电商★4 · 新鲜度1.0',url:'https://item.szlcsc.com/'},{src:'得捷',val:'¥9.20',note:'含运费溢价',url:'https://www.digikey.cn/'},{src:'行业新闻',val:'¥8.80',note:'媒体引用，非实时',url:'https://m.sohu.com/'}], status:'3源冲突', conf:0.38, level:'mid' },
      { point:'Flash', values:[{src:'Datasheet',val:'64KB',url:'https://www.st.com/resource/en/datasheet/stm32f103c8.pdf'},{src:'官网',val:'64KB',url:'https://www.st.com/'}], status:'2源一致', conf:0.80, level:'high' },
      { point:'目标市场', values:[{src:'官网',val:'工业控制',url:'https://www.st.com/'}], status:'单源', conf:0.50, level:'mid' },
      { point:'渠道策略', values:[{src:'官网',val:'代理体系',url:'https://www.st.com/'},{src:'新闻',val:'授权代理20+',url:'https://m.sohu.com/'}], status:'2源一致', conf:0.48, level:'mid' }
    ],
    conflicts:[
      { id:'#1', title:'参考价', desc:'3个来源的价格不一致：立创 ¥8.50、得捷 ¥9.20、行业新闻 ¥8.80。',
        strategy:'保留全部 3 个值，以立创（授权电商★4，新鲜度1.0）为基准值；得捷价格标注“含运费溢价”，新闻价格标注“媒体引用，非实时”。',
        display:'报告中价格区间显示为 ¥8.50-9.20，并标注“3源冲突，已保留全部值”。' }
    ],
    decomposition:[
      { point:'主频 72MHz', factors:['1.0 (官网)','1.0 (7天内)','0.8 (2源一致)'], conf:'0.80', level:'high' },
      { point:'参考价', factors:['0.8 (电商)','1.0 (7天内)','0.3 (冲突)'], conf:'0.24 → 0.38', level:'mid', note:'冲突惩罚系数 ×0.95' },
      { point:'目标市场', factors:['1.0 (官网)','0.6 (90天内)','0.5 (单源)'], conf:'0.30', level:'low' }
    ],
    stats:{ total:47, passed:28, conflictSingle:19, passedDesc:'60% 多源一致', csDesc:'3冲突 + 16单源' },
    formula:'置信度 = 来源可信度权重 × 数据新鲜度系数 × 交叉验证系数；冲突数据点采用“最高单源置信度 × 冲突惩罚系数(0.95)”'
  },

  analysis: {
    dims:[
      { key:'position', label:'产品定位', icon:'🎯',
        conclusion:'STM32F103 定位为“高性能主流通用 MCU”，主打工业控制与中高端消费电子。ST 以“生态完整 + 长期供货 + 可靠性”构建品牌壁垒，而非参数极限。',
        evidence:[
          { layer:'数据', text:'官网定位语“industry-standard”+ 外设清单（7通信接口/3 ADC/2 DAC）+ 应用案例12个。', src:'官网 · 3源交叉验证 · 置信度 0.80' },
          { layer:'发现', text:'对比 GD32F103（108MHz）、CH32F103（144MHz）、AT32F403A（240MHz），ST 主频不占优，但外设完整度最高。', src:'竞品 Datasheet 对比 · 置信度 0.72' },
          { layer:'推论', text:'ST 以“外设完整 + 稳定性 + 生态”取胜，而非频率极限。', src:'参数对比 + 官网外设强调 + 论坛稳定性反馈 · 置信度 0.62' },
          { layer:'建议', text:'国产竞品可主打“频率翻倍 + 外设完整”的差异化组合，瞄准需要更高算力的工控场景。', src:'参数差异 + 市场需求分析 · 建议置信度 0.58' }
        ], conf:0.62, level:'mid' },
      { key:'price', label:'价格策略', icon:'💰',
        conclusion:'STM32F103 参考价区间 ¥8.50-9.20，相对国产替代品（¥4.8-6.8）溢价约 40-45%。ST 采用品牌溢价策略，以可靠性换取价格空间。',
        evidence:[
          { layer:'数据', text:'立创 ¥8.50 / 得捷 ¥9.20 / 新闻 ¥8.80 —— 3源冲突，已保留全部值。', src:'电商+新闻 · 置信度 0.38' },
          { layer:'发现', text:'国产 GD32F103 ¥5.2、CH32F103 ¥4.8、AT32F403A ¥6.8，均显著低于 ST。', src:'电商报价对比 · 置信度 0.80' },
          { layer:'推论', text:'价差来自品牌信任、供货保障与生态成本，而非物料成本。', src:'价格对比 + 渠道分析 · 置信度 0.55' },
          { layer:'建议', text:'国产替代话术应聚焦“同规格省40% + 长期供货承诺”，用具体案例证明替代可行性。', src:'话术空白分析 + 替代成功案例 · 建议置信度 0.42' }
        ], conf:0.38, level:'mid' },
      { key:'channel', label:'渠道策略', icon:'🛰️',
        conclusion:'ST 采用“官方直营 + 授权代理双轨”渠道体系，授权代理 20+，覆盖全球。渠道能力是其护城河之一。',
        evidence:[
          { layer:'数据', text:'官网渠道页“授权代理20+” + 电商平台官方旗舰店存在。', src:'官网+电商 · 置信度 0.48' },
          { layer:'发现', text:'国产竞品主要依赖立创/得捷等第三方电商，缺少全球代理网络。', src:'电商平台对比 · 置信度 0.52' },
          { layer:'推论', text:'渠道壁垒 = 全球供应链覆盖 + 本地化技术支持。', src:'渠道数据 + 行业认知 · 置信度 0.48' },
          { layer:'建议', text:'国产厂商优先布局“电商直营 + 重点区域代理”，先占领中小客户。', src:'渠道空白分析 · 建议置信度 0.44' }
        ], conf:0.48, level:'mid' },
      { key:'messaging', label:'传播话术', icon:'📣',
        conclusion:'STM32F103 的核心话术是 Robust（可靠）、Ecosystem（生态）、Long-term（长期供货）——降低决策风险而非参数炫耀。',
        evidence:[
          { layer:'数据', text:'官网关键词频次统计：“robust”出现约80+次（87次无法定位原文，已降级）。', src:'官网关键词分析 · 置信度 0.55' },
          { layer:'发现', text:'国产竞品话术聚焦“兼容、性价比、自主”，与 ST 形成鲜明反差。', src:'竞品官网对比 · 置信度 0.50' },
          { layer:'推论', text:'ST 面向“风险厌恶型”客户，话术目标是降低采购决策风险。', src:'话术分析 + 客户画像 · 置信度 0.52' },
          { layer:'建议', text:'国产话术应组合“性价比 + 兼容性 + 供应链安全”，对冲 ST 的风险叙事。', src:'话术空白分析 · 建议置信度 0.48' }
        ], conf:0.55, level:'mid' },
      { key:'tech', label:'技术参数', icon:'⚙️',
        conclusion:'核心参数：Cortex-M3 / 72MHz / 64KB Flash / 20KB RAM / 2.0-3.6V / 37个I/O。规格主流，外设丰富度（7通信接口、3 ADC、2 DAC）是工程竞争力核心。',
        evidence:[
          { layer:'数据', text:'Datasheet 完整参数 + 官网规格表 + 电商参数页，3源完全一致。', src:'3源交叉验证 · 置信度 0.80' },
          { layer:'发现', text:'GD32F103 频率108MHz（+50%）但 Flash 相同；CH32F103 频率144MHz（+100%）但外设较少。', src:'竞品 Datasheet 对比 · 置信度 0.72' },
          { layer:'推论', text:'ST 以外设完整性和长期稳定性取胜，而非频率极限。', src:'参数对比 + 论坛反馈 · 置信度 0.62' },
          { layer:'建议', text:'竞品可主打“频率翻倍+外设完整”差异化，针对需要更高算力的场景。', src:'参数差异 + 市场需求 · 建议置信度 0.58' }
        ], conf:0.80, level:'high' },
      { key:'customer', label:'目标客户', icon:'👥',
        conclusion:'目标客户以工业控制(45%)、消费电子(25%)、通信设备(15%)三大领域为主；画像为中大型企业研发部门，关注“十年供货承诺”。',
        evidence:[
          { layer:'数据', text:'官网应用案例12个 / 行业报道客户类型分析。', src:'官网[ST.com] · 置信度 0.30 · 仅1源' },
          { layer:'发现', text:'论坛讨论中，选择 F103 的用户多来自工控领域，关注长期供货。', src:'论坛[21ic][EEVblog] · 置信度 0.35' },
          { layer:'推论', text:'F103 客户选择逻辑是“风险最小化”而非“成本最小化”。', src:'客户类型分析 + 论坛决策因素 · 置信度 0.35' },
          { layer:'建议', text:'竞品可切入中小企业和初创公司，主打“性能足够 + 成本更优”。', src:'客户画像空白分析 · 建议置信度 0.38' }
        ], conf:0.35, level:'low' }
    ],
    customer:null,
    selfCheck:{
      total:24, passed:21, passRate:'88%',
      items:[
        { ok:true, text:'产品定位维度：4条结论全部通过 · 证据链完整' },
        { ok:true, text:'价格策略维度：4条结论全部通过 · 冲突数据已标注' },
        { ok:false, text:'传播话术维度：1条结论引用的“87次robust”无法在数据包中定位原始位置 → 已降级为“约80+次”' },
        { ok:true, text:'技术参数维度：4条结论全部通过 · 3源交叉验证' },
        { ok:false, text:'目标客户维度：置信度整体偏低(0.30-0.38) → 报告中标注“该维度数据不足，结论仅供参考”' }
      ]
    }
  },

  report: {
    overallConf:0.62, overallLevel:'mid', sources:6, sourcesDesc:'5成功/1部分', passRate:'88%', passDesc:'21/24条',
    scatter:{
      title:'竞品定位散点图', subtitle:'X轴=性能（主频×Flash） · Y轴=价格 · 气泡大小=生态丰富度',
      points:[
        { name:'STM32F103', price:8.5, perf:72, eco:5, note:'¥8.5 · 72MHz' },
        { name:'GD32F103',  price:5.2, perf:108, eco:4, note:'¥5.2 · 108MHz' },
        { name:'CH32F103',  price:4.8, perf:144, eco:3, note:'¥4.8 · 144MHz' },
        { name:'AT32F403A', price:6.8, perf:240, eco:3, note:'¥6.8 · 240MHz' }
      ],
      insight:'STM32F103 处于“中高性能 + 中高价格”区域，国产竞品集中在“高性能 + 低价格”区域，替代窗口明确。'
    },
    priceBar:{
      title:'价格对比柱状图', subtitle:'参考价（人民币）· 电商平台报价',
      items:[
        { name:'STM32F103', v:8.5, src:'[立创]', note:'3源冲突，显示区间值 ¥8.5-9.2' },
        { name:'STM32F103·得捷', v:9.2, src:'[得捷]', note:'含运费溢价' },
        { name:'AT32F403A', v:6.8, src:'[立创]', note:'' },
        { name:'GD32F103',  v:5.2, src:'[立创]', note:'' },
        { name:'CH32F103',  v:4.8, src:'[立创]', note:'' }
      ],
      note:'⚠ STM32F103 价格3源冲突，显示区间值'
    },
    radar:{
      title:'渠道能力雷达图', subtitle:'STM32F103 vs 国产均值 · 数据来源：官网+电商+论坛 [多源]',
      dims:['代理覆盖','价格管控','供货稳定','技术支持','生态丰富'],
      main:[90,70,85,80,95], rivals:[45,55,60,50,40]
    },
    heatmap:{
      title:'数据覆盖热力图', subtitle:'6维度 × 6来源 · 单元格=置信度',
      dims:['产品定位','价格策略','渠道策略','传播话术','技术参数','目标客户'],
      sources:['官网 ★5','DS ★5','电商 ★4','新闻 ★3','论坛 ★2','社交 ★1'],
      rows:[
        ['0.80','0.80',null,'0.48',null,null],
        [null,null,'0.38','0.48',null,null],
        ['0.48',null,'0.52','0.48',null,null],
        ['0.55',null,null,'0.50','0.35','0.30'],
        ['0.80','0.80','0.72',null,null,null],
        ['0.30',null,null,'0.35','0.35',null]
      ],
      legend:'高 ≥0.6 · 中 0.4-0.59 · 低 <0.4 · — 无数据'
    },
    confDist:{ title:'置信度分布图', high:9, mid:14, low:8, none:3, total:34, pct:68, note:'中高置信度占比 68% · 低置信度数据点已标注“建议补充验证”' },
    messaging:{
      title:'传播话术对比矩阵', subtitle:'各品牌核心话术 + 传播策略',
      note:'话术来源：各品牌官网关键词分析 [官网] + 行业媒体报道 [媒体] · 置信度 0.55',
      rows:[
        { brand:'STM32F103', m1:'Robust 可靠', m2:'Ecosystem 生态', m3:'Long-term 长期供货', strategy:'降低决策风险' },
        { brand:'GD32F103',  m1:'兼容ST', m2:'Higher Performance', m3:'Cost-effective', strategy:'性能兼容替代' },
        { brand:'CH32F103',  m1:'极致性价比', m2:'Pin-to-Pin', m3:'国产自主', strategy:'价格驱动替代' },
        { brand:'AT32F403A', m1:'超高主频', m2:'丰富外设', m3:'本地化服务', strategy:'性能差异化' }
      ]
    },
    conclusions:[
      { dim:'产品定位', summary:'高性能主流MCU，主打工业控制', conf:0.80, level:'high', refs:'主频/内核/Flash', sources:3 },
      { dim:'价格策略', summary:'品牌溢价，价差40-45%', conf:0.38, level:'mid', refs:'品牌报价', sources:3 },
      { dim:'渠道策略', summary:'授权代理+官方直营双轨', conf:0.48, level:'mid', refs:'代理列表/价格对比', sources:2 },
      { dim:'传播话术', summary:'可靠性+生态+长期供货', conf:0.55, level:'mid', refs:'关键词频次/话术提取', sources:2 },
      { dim:'技术参数', summary:'外设丰富度为核心竞争力', conf:0.72, level:'mid', refs:'完整参数对比', sources:3 },
      { dim:'目标客户', summary:'工业控制为主(45%)', conf:0.30, level:'low', refs:'应用案例/论坛讨论', sources:1 }
    ]
  },

  trace: {
    stats:{ sources:8, conclusions:24, conflicts:3, integrity:'100%' },
    sources:[
      { type:'official',  name:'ST官网',       url:'https://www.st.com/',         stars:5, time:'2026-08-13 18:35', items:9,  status:'已验证' },
      { type:'datasheet', name:'STM32F103 Datasheet', url:'https://www.st.com/resource/en/datasheet/stm32f103c8.pdf', stars:5, time:'2026-08-13 18:36', items:8, status:'已验证' },
      { type:'ecommerce', name:'立创商城',     url:'https://item.szlcsc.com/',    stars:4, time:'2026-08-13 18:37', items:6,  status:'已验证' },
      { type:'ecommerce', name:'得捷电子',     url:'https://www.digikey.cn/',     stars:4, time:'2026-08-13 18:37', items:5,  status:'价格冲突' },
      { type:'media',     name:'半导体行业观察', url:'https://m.sohu.com/',        stars:3, time:'2026-08-13 18:37', items:5,  status:'已验证' },
      { type:'forum',     name:'21ic电子网论坛', url:'https://bbs.21ic.com/',      stars:2, time:'2026-08-13 18:38', items:5,  status:'已验证' },
      { type:'forum',     name:'EEVblog Forum', url:'https://www.eevblog.com/',   stars:2, time:'2026-08-13 18:38', items:3,  status:'已验证' },
      { type:'social',    name:'微博 @半导体老兵', url:'https://weibo.com/',       stars:1, time:'2026-08-13 18:40', items:1,  status:'数据不足' }
    ],
    conclusions:[
      { dim:'产品定位', summary:'高性能主流MCU，主打工业控制', conf:0.80, refs:'主频/内核/Flash', sources:3 },
      { dim:'价格策略', summary:'品牌溢价，价差40-45%', conf:0.38, refs:'品牌报价', sources:3 },
      { dim:'渠道策略', summary:'授权代理+官方直营双轨', conf:0.48, refs:'代理列表/价格对比', sources:2 },
      { dim:'传播话术', summary:'可靠性+生态+长期供货', conf:0.55, refs:'关键词频次/话术提取', sources:2 },
      { dim:'技术参数', summary:'外设丰富度为核心竞争力', conf:0.72, refs:'完整参数对比', sources:3 },
      { dim:'目标客户', summary:'工业控制为主(45%)', conf:0.30, refs:'应用案例/论坛讨论', sources:1 }
    ],
    conflicts:[
      { id:'#1', title:'参考价', desc:'STM32F103参考价，3个来源不一致：立创¥8.50、得捷¥9.20、行业新闻¥8.80。',
        strategy:'保留全部3个值，以立创（授权电商★4，新鲜度1.0）为基准值。',
        display:'价格区间"¥8.50-9.20"，标注"3源冲突，已保留全部值"。', visible:true }
    ],
    checkNote:'所有24条分析结论均已建立完整溯源链。从任意结论出发，可通过4层证据链（数据→发现→推论→建议）逐层追溯至原始数据源（含URL、采集时间、来源类型、置信度）。溯源率100%，无黑箱结论。'
  }
},

/* ---------------- BT8912F（杰理 TWS 主控 · 客户情报示例） ---------------- */
'BT8912F': {
  key:'BT8912F', label:'BT8912F', type:'蓝牙音频 SoC（TWS主控）', vendor:'杰理科技',
  tagline:'TWS耳机主控 · 全球市占率第一阵营',
  desc:'杰理科技 TWS 耳机主控芯片，支持 BT 5.3 + LE Audio，以极致性价比 + 规模化出货成为白牌与品牌 TWS 的主流选择（参考价 ¥1.5-2.5）。',
  dims:['产品定位','价格策略','渠道策略','传播话术','技术参数','目标客户'],
  plan: {
    intro:'Agent 根据“BT8912F”自动识别为蓝牙音频 SoC（TWS主控），规划以下 6 维度 × 6 来源采集矩阵：',
    note:'绿色 = 计划采集项',
    matrix: [
      { dim:'产品定位',  cells:[1,1,0,1,0,1] },
      { dim:'价格策略',  cells:[0,0,1,1,0,1] },
      { dim:'渠道策略',  cells:[1,0,1,1,1,0] },
      { dim:'传播话术',  cells:[1,0,0,1,1,1] },
      { dim:'技术参数',  cells:[1,1,1,0,0,0] },
      { dim:'目标客户',  cells:[1,0,0,1,1,1] }
    ]
  },
  steps: [
    { label:'采集官网产品矩阵',   detail:'来源可信度 ★★★★★ · 预计2s', status:'ok' },
    { label:'解析 Datasheet/规格书', detail:'来源可信度 ★★★★★ · 预计3s', status:'ok' },
    { label:'抓取电商平台报价',   detail:'来源可信度 ★★★★ · 立创 · 预计2s', status:'ok' },
    { label:'检索行业新闻与出货数据', detail:'来源可信度 ★★★ · 近90天 · 预计3s', status:'ok' },
    { label:'抓取拆解报告与BQB/FCC认证', detail:'来源可信度 ★★★★ · 预计3s', status:'ok' },
    { label:'采集社交媒体信号',   detail:'来源可信度 ★ · 微博+B站 · 预计2s', status:'fail' }
  ],
  results: {
    items:55, itemsDesc:'含来源URL和时间戳（含客户情报）',
    sourcesSuccess:5, sourcesFail:1, sourcesDesc:'5个成功 / 1个部分失败',
    coverage:'6/6', coverageDesc:'社交媒体维度覆盖偏低',
    crossValidated:18, crossDesc:'18条数据有多源验证',
    conflicts:2, conflictDesc:'价格与市占率口径存在差异',
    gaps:[{ dim:'社交媒体', coverage:25, suggest:'社交媒体信号不足，建议补充 B站拆解视频与数码博主评测。' }],
    confidence:0.74, confidenceLevel:'mid'
  },
  validation: {
    rows:[
      { point:'蓝牙规格', values:[{src:'官网',val:'BT 5.3 + LE Audio',url:'https://www.jieli.com/'},{src:'Datasheet',val:'BT 5.3 + LE Audio',url:'https://www.jieli.com/'},{src:'拆解报告',val:'BT 5.3',url:'https://www.52audio.com/'}], status:'3源一致', conf:0.82, level:'high' },
      { point:'参考价', values:[{src:'立创',val:'¥1.80',note:'批量价',url:'https://item.szlcsc.com/'},{src:'行业报告',val:'¥1.5-2.5',note:'价格带',url:'https://www.docin.com/'}], status:'2源一致', conf:0.58, level:'mid' },
      { point:'TWS市占率', values:[{src:'行业报告',val:'39.8%',note:'全球第一',url:'https://www.docin.com/'},{src:'财经媒体',val:'40.1%',note:'不同统计口径',url:'https://guba.eastmoney.com/'}], status:'2源基本一致', conf:0.72, level:'mid' },
      { point:'年出货量', values:[{src:'招股书',val:'10.77亿颗(2025)',url:'https://www.jieli.com/'},{src:'财经媒体',val:'10.77亿颗',url:'https://guba.eastmoney.com/'}], status:'2源一致', conf:0.85, level:'high' },
      { point:'工艺制程', values:[{src:'行业报告',val:'台积电22nm ULP',url:'https://www.docin.com/'}], status:'单源', conf:0.55, level:'mid' },
      { point:'客户结构', values:[{src:'拆解报告',val:'小米/OPPO/漫步者等',url:'https://www.52audio.com/'},{src:'BQB认证',val:'多品牌授权记录',url:'https://launchstudio.bluetooth.com/'}], status:'2源一致', conf:0.70, level:'mid' }
    ],
    conflicts:[
      { id:'#1', title:'TWS市占率口径', desc:'行业报告 39.8%（全球TWS主控出货口径）与财经媒体 40.1%（含白牌整机出货推算）存在口径差异。',
        strategy:'保留两个口径，以行业报告 39.8% 为基准值，财经媒体口径标注“含整机推算”。',
        display:'报告中显示“39.8%（口径：TWS主控芯片出货）”，并注明口径差异。' },
      { id:'#2', title:'参考价', desc:'立创批量价 ¥1.80 与行业报告价格带 ¥1.5-2.5 存在差异（含型号差异）。',
        strategy:'保留区间 ¥1.5-2.5，立创 ¥1.80 作为典型值标注。',
        display:'价格区间“¥1.5-2.5”，标注“按型号/批量浮动”。' }
    ],
    decomposition:[
      { point:'蓝牙规格 BT 5.3', factors:['1.0 (官网)','1.0 (7天内)','1.0 (3源一致)'], conf:'0.82', level:'high' },
      { point:'参考价', factors:['0.8 (电商)','1.0 (7天内)','0.8 (2源一致)'], conf:'0.58', level:'mid' },
      { point:'市占率', factors:['0.8 (行业报告)','1.0 (7天内)','0.8 (2源基本一致)'], conf:'0.72', level:'mid' }
    ],
    stats:{ total:55, passed:34, conflictSingle:21, passedDesc:'62% 多源一致', csDesc:'2冲突 + 19单源' },
    formula:'置信度 = 来源可信度权重 × 数据新鲜度系数 × 交叉验证系数；口径差异按“基本一致”处理并透明标注。'
  },
  analysis: {
    dims:[
      { key:'position', label:'产品定位', icon:'🎯',
        conclusion:'BT8912F 定位“极致性价比 TWS 主控”，面向白牌与中低端品牌 TWS 市场；以“够用规格 + 最低成本 + 规模出货”建立价格壁垒。',
        evidence:[
          { layer:'数据', text:'官网产品线：TWS耳机芯片（核心营收），BT8912F 为出货主力。', src:'官网 + 行业报告 · 置信度 0.82' },
          { layer:'发现', text:'参考价 ¥1.5-2.5，显著低于恒玄、络达同类中高端主控（¥5-10）。', src:'电商+行业对比 · 置信度 0.68' },
          { layer:'推论', text:'杰理以“价格屠刀 + 白牌生态”锁定最大出货量，份额优先于毛利。', src:'市占率 + 价格带分析 · 置信度 0.72' },
          { layer:'建议', text:'易兆微音频线应避开 TWS 主控正面价格战，聚焦差异化垂直音频场景。', src:'竞争格局分析 · 建议置信度 0.60' }
        ], conf:0.74, level:'mid' },
      { key:'price', label:'价格策略', icon:'💰',
        conclusion:'BT8912F 参考价 ¥1.5-2.5（立创批量价 ¥1.80），以“以价换量”策略冲击市场，价格带是国产 TWS 主控的最低区间之一。',
        evidence:[
          { layer:'数据', text:'立创 ¥1.80（批量）+ 行业报告 ¥1.5-2.5 价格带。', src:'电商+行业 · 置信度 0.58' },
          { layer:'发现', text:'同规格恒玄/络达主控价格约为其 2-4 倍。', src:'电商对比 · 置信度 0.62' },
          { layer:'推论', text:'规模效应支撑低价：2025年出货10.77亿颗摊薄成本。', src:'出货量 + 成本结构 · 置信度 0.70' },
          { layer:'建议', text:'若对标此价格带，需评估自身产能与成本结构，优先差异化而非价格战。', src:'成本与竞争分析 · 建议置信度 0.55' }
        ], conf:0.58, level:'mid' },
      { key:'channel', label:'渠道策略', icon:'🛰️',
        conclusion:'渠道以“方案商网络 + 白牌供应链”为主，通过方案商与模组厂触达大量中小客户，生态门槛低、走量快。',
        evidence:[
          { layer:'数据', text:'官网方案商/开发者社区入口 + 电商平台在售型号覆盖广。', src:'官网+电商 · 置信度 0.60' },
          { layer:'发现', text:'白牌厂商可低成本获取完整 SDK 与参考设计，快速量产。', src:'论坛+拆解报告 · 置信度 0.55' },
          { layer:'推论', text:'渠道核心不是“代理数量”，而是“方案生态的触达效率”。', src:'渠道结构分析 · 置信度 0.56' },
          { layer:'建议', text:'易兆微可借鉴：以 POS/ETC 行业方案商网络构建垂直渠道壁垒。', src:'渠道空白分析 · 建议置信度 0.54' }
        ], conf:0.56, level:'mid' },
      { key:'messaging', label:'传播话术', icon:'📣',
        conclusion:'核心话术：性价比、兼容主流生态、快速量产支持；以“便宜好用”服务白牌客户，弱化技术营销。',
        evidence:[
          { layer:'数据', text:'官网与行业报道关键词：性价比/方案支持/量产。', src:'官网+媒体 · 置信度 0.52' },
          { layer:'发现', text:'品牌厂商话术强调“音质/降噪”，白牌话术强调“成本/交期”。', src:'话术对比 · 置信度 0.48' },
          { layer:'推论', text:'杰理话术与其白牌客户群高度一致，形成供需共振。', src:'话术-客户匹配分析 · 置信度 0.50' },
          { layer:'建议', text:'易兆微可在垂直行业强调“安全/认证/行业Know-how”，错位竞争。', src:'话术空白分析 · 建议置信度 0.50' }
        ], conf:0.50, level:'mid' },
      { key:'tech', label:'技术参数', icon:'⚙️',
        conclusion:'BT 5.3 + LE Audio，支持主流 TWS 功能（双耳同步、低延时、ANC 透传等），规格满足中低端 TWS 需求，非极致性能路线。',
        evidence:[
          { layer:'数据', text:'Datasheet/规格书：BT 5.3 + LE Audio，3源一致。', src:'3源交叉验证 · 置信度 0.82' },
          { layer:'发现', text:'对比恒玄/络达旗舰：制程与 DSP 算力存在差距，但功能覆盖完整。', src:'规格对比 · 置信度 0.60' },
          { layer:'推论', text:'“规格够用 + 成本最优”是该定位的工程化表达。', src:'规格-价格匹配分析 · 置信度 0.62' },
          { layer:'建议', text:'易兆微音频新品应在“低功耗/连接稳定性/认证齐全”上建立可验证优势。', src:'规格空白分析 · 建议置信度 0.58' }
        ], conf:0.72, level:'mid' },
      { key:'customer', label:'目标客户', icon:'👥',
        conclusion:'目标客户以白牌 TWS 厂商为主，并向小米、OPPO、漫步者等品牌渗透；客户图谱详见下方“客户情报”Tab。',
        evidence:[
          { layer:'数据', text:'拆解报告/BQB/FCC 认证记录显示多品牌采用。', src:'拆解+认证 · 置信度 0.70' },
          { layer:'发现', text:'品牌客户主要集中在中低端产品线（Redmi、Enco Air、X3 Lite）。', src:'客户图谱分析 · 置信度 0.66' },
          { layer:'推论', text:'杰理正在从“白牌之王”向“品牌供应商”升级，客户结构动态变化。', src:'客户结构 + 战略信号 · 置信度 0.62' },
          { layer:'建议', text:'易兆微可盯住品牌客户“第二供应商”需求，以服务能力切入。', src:'客户空白分析 · 建议置信度 0.58' }
        ], conf:0.66, level:'mid' }
    ],
    customer:{
      title:'芯片级客户情报 — BT8912F',
      intro:'以下客户关系基于公开拆解报告、BQB/FCC 认证记录与电商在售产品推断（示例数据集，非实时采集）。',
      rows:[
        { brand:'小米', product:'Redmi Buds 5', chip:'BT8912F', tier:'high', tierLabel:'高', reason:'白牌/价格驱动型，切换成本低，替代机会明确' },
        { brand:'OPPO', product:'Enco Air3', chip:'BT8912F', tier:'mid', tierLabel:'中', reason:'二线品牌，多供应商策略，价格敏感' },
        { brand:'漫步者', product:'X3 Lite', chip:'BT8912F', tier:'mid', tierLabel:'中', reason:'二线品牌，多供应商策略，价格敏感' },
        { brand:'QCY', product:'T13', chip:'BT8912F', tier:'high', tierLabel:'高', reason:'白牌/互联网品牌，极致性价比导向' },
        { brand:'声阔', product:'Liberty Air 2', chip:'BT8912F', tier:'low', tierLabel:'低', reason:'品牌深度合作/定制，切换成本高' }
      ],
      tierDesc:[
        { tier:'high', label:'高', desc:'白牌/价格驱动型/无品牌忠诚度 — 销售线索优先级最高' },
        { tier:'mid', label:'中', desc:'二线品牌/多供应商策略/价格敏感型 — 需突出成本与服务' },
        { tier:'low', label:'低', desc:'品牌深度合作/联合定制/长期合同 — 需长期培育' }
      ]
    },
    selfCheck:{
      total:24, passed:22, passRate:'92%',
      items:[
        { ok:true, text:'产品定位维度：4条结论全部通过 · 证据链完整' },
        { ok:true, text:'价格策略维度：4条结论全部通过 · 价格带已透明标注' },
        { ok:true, text:'渠道策略维度：4条结论全部通过 · 方案商网络有据可查' },
        { ok:false, text:'传播话术维度：1条结论“弱化技术营销”为推断性表述 → 已标注“AI推论”' },
        { ok:true, text:'客户情报维度：5条客户关系均来自拆解/BQB/FCC记录 · 替代机会为AI分级' }
      ]
    }
  },

  report: {
    overallConf:0.70, overallLevel:'mid', sources:6, sourcesDesc:'5成功/1部分', passRate:'92%', passDesc:'22/24条',
    scatter:{
      title:'TWS主控竞品定位散点图', subtitle:'X轴=性能指数 · Y轴=参考价 · 气泡大小=生态丰富度',
      points:[
        { name:'BT8912F', price:2.0, perf:45, eco:5, note:'¥1.5-2.5 · 性价比' },
        { name:'AC700N',  price:2.5, perf:50, eco:4, note:'¥2-3 · 中端TWS' },
        { name:'AW33N',   price:4.0, perf:65, eco:4, note:'¥3-5 · AIoT耳机' },
        { name:'恒玄BES2600', price:6.0, perf:78, eco:4, note:'¥5-8 · 中高端' },
        { name:'络达AB1565', price:7.0, perf:75, eco:3, note:'¥6-9 · 品牌市场' }
      ],
      insight:'BT8912F 处于“中低性能 + 极低价格”区域，与中高端竞品形成明显价格断层；向上延伸（AW33N）是杰理补位 AIoT 的路径。'
    },
    priceBar:{
      title:'TWS主控价格对比', subtitle:'参考价（人民币）· 电商+行业报告',
      items:[
        { name:'BT8912F', v:2.0, src:'[立创]', note:'区间¥1.5-2.5' },
        { name:'AC700N',  v:2.5, src:'[立创]', note:'' },
        { name:'AW33N',   v:4.0, src:'[立创]', note:'' },
        { name:'恒玄BES2600', v:6.0, src:'[电商]', note:'中高端' },
        { name:'络达AB1565', v:7.0, src:'[电商]', note:'品牌市场' }
      ],
      note:'⚠ 价格带按型号/批量浮动，已标注区间'
    },
    radar:{
      title:'渠道能力雷达图', subtitle:'BT8912F（杰理） vs 中高端竞品均值 · 官网+电商+论坛 [多源]',
      dims:['白牌触达','价格优势','方案生态','量产速度','品牌认可'],
      main:[95,95,88,90,55], rivals:[55,45,70,65,85]
    },
    heatmap:{
      title:'数据覆盖热力图', subtitle:'6维度 × 6来源 · 单元格=置信度',
      dims:['产品定位','价格策略','渠道策略','传播话术','技术参数','目标客户'],
      sources:['官网 ★5','DS ★5','电商 ★4','新闻 ★3','论坛 ★2','社交 ★1'],
      rows:[
        ['0.82','0.82',null,'0.60',null,'0.55'],
        [null,null,'0.58','0.62',null,'0.50'],
        ['0.60',null,'0.55','0.56','0.55',null],
        ['0.52',null,null,'0.48','0.50','0.45'],
        ['0.82','0.82','0.60',null,null,null],
        ['0.66',null,null,'0.58','0.60','0.52']
      ],
      legend:'高 ≥0.6 · 中 0.4-0.59 · 低 <0.4 · — 无数据'
    },
    confDist:{ title:'置信度分布图', high:12, mid:15, low:5, none:2, total:34, pct:79, note:'中高置信度占比 79% · 客户情报与价格带已标注口径' },
    messaging:{
      title:'传播话术对比矩阵', subtitle:'TWS主控各品牌核心话术 + 传播策略',
      note:'话术来源：各品牌官网关键词分析 [官网] + 行业媒体报道 [媒体] · 置信度 0.55',
      rows:[
        { brand:'BT8912F', m1:'极致性价比', m2:'方案支持', m3:'快速量产', strategy:'以价换量·白牌生态' },
        { brand:'AC700N', m1:'中端升级', m2:'功能完整', m3:'品牌渗透', strategy:'白牌→品牌过渡' },
        { brand:'AW33N', m1:'AI语音', m2:'IoT互联', m3:'智能升级', strategy:'AIoT卡位' },
        { brand:'恒玄BES2600', m1:'旗舰音质', m2:'低功耗', m3:'品牌背书', strategy:'高端品牌市场' },
        { brand:'络达AB1565', m1:'稳定连接', m2:'专业音频', m3:'大厂合作', strategy:'品牌+ODM市场' }
      ]
    },
    conclusions:[
      { dim:'产品定位', summary:'极致性价比TWS主控，白牌之王', conf:0.74, level:'mid', refs:'产品线/价格带/市占率', sources:3 },
      { dim:'价格策略', summary:'以价换量，价格带¥1.5-2.5', conf:0.58, level:'mid', refs:'立创/行业报告', sources:2 },
      { dim:'渠道策略', summary:'方案商网络+白牌供应链', conf:0.56, level:'mid', refs:'官网/论坛', sources:2 },
      { dim:'传播话术', summary:'性价比+方案支持+快速量产', conf:0.50, level:'mid', refs:'官网关键词', sources:2 },
      { dim:'技术参数', summary:'BT5.3+LE Audio，规格够用', conf:0.72, level:'mid', refs:'Datasheet/拆解', sources:3 },
      { dim:'目标客户', summary:'白牌为主，品牌渗透中（小米/OPPO/漫步者）', conf:0.66, level:'mid', refs:'拆解/BQB/FCC', sources:2 }
    ]
  },

  trace: {
    stats:{ sources:8, conclusions:24, conflicts:2, integrity:'100%' },
    sources:[
      { type:'official',  name:'杰理官网产品页', url:'https://www.jieli.com/',  stars:5, time:'2026-08-13 18:35', items:10, status:'已验证' },
      { type:'datasheet', name:'BT8912F规格书', url:'https://www.jieli.com/',  stars:5, time:'2026-08-13 18:36', items:8,  status:'已验证' },
      { type:'ecommerce', name:'立创商城',      url:'https://item.szlcsc.com/', stars:4, time:'2026-08-13 18:37', items:6,  status:'已验证' },
      { type:'media',     name:'财经媒体(东方财富)', url:'https://guba.eastmoney.com/', stars:3, time:'2026-08-13 18:37', items:5, status:'口径冲突' },
      { type:'report',    name:'行业报告(豆丁)', url:'https://www.docin.com/',  stars:4, time:'2026-08-13 18:37', items:7,  status:'已验证' },
      { type:'patent',    name:'招股书/公司公告', url:'https://www.jieli.com/', stars:4, time:'2026-08-13 18:38', items:6,  status:'已验证' },
      { type:'forum',     name:'拆解报告(我爱音频网)', url:'https://www.52audio.com/', stars:3, time:'2026-08-13 18:38', items:5, status:'已验证' },
      { type:'social',    name:'微博/数码博主',   url:'https://weibo.com/',     stars:1, time:'2026-08-13 18:40', items:1,  status:'数据不足' }
    ],
    conclusions:[
      { dim:'产品定位', summary:'极致性价比TWS主控，白牌之王', conf:0.74, refs:'产品线/价格带/市占率', sources:3 },
      { dim:'价格策略', summary:'以价换量，价格带¥1.5-2.5', conf:0.58, refs:'立创/行业报告', sources:2 },
      { dim:'渠道策略', summary:'方案商网络+白牌供应链', conf:0.56, refs:'官网/论坛', sources:2 },
      { dim:'传播话术', summary:'性价比+方案支持+快速量产', conf:0.50, refs:'官网关键词', sources:2 },
      { dim:'技术参数', summary:'BT5.3+LE Audio，规格够用', conf:0.72, refs:'Datasheet/拆解', sources:3 },
      { dim:'目标客户', summary:'白牌为主，品牌渗透中', conf:0.66, refs:'拆解/BQB/FCC', sources:2 }
    ],
    conflicts:[
      { id:'#1', title:'TWS市占率口径', desc:'39.8%（行业报告，主控出货口径） vs 40.1%（财经媒体，含整机推算）。',
        strategy:'保留两个口径，以39.8%为基准值。',
        display:'报告中标注“39.8%（口径：TWS主控芯片出货）”。', visible:true },
      { id:'#2', title:'参考价', desc:'立创 ¥1.80 vs 行业报告 ¥1.5-2.5（型号差异）。',
        strategy:'保留区间并标注典型值。',
        display:'价格区间“¥1.5-2.5”，典型值¥1.80。', visible:true }
    ],
    checkNote:'BT8912F 全部24条结论均已建立溯源链，客户情报（拆解报告+BQB+FCC）单独索引，替代机会分级为AI推断，已标注。'
  }
},
};

/* ---------- 精简芯片数据集生成器（YC1308 / AC200N） ---------- */
function demoChip(cfg){
  var dims = cfg.dims || ['产品定位','价格策略','渠道策略','传播话术','技术参数','目标客户'];
  var matrix = cfg.matrix || [
    { dim:'产品定位', cells:[1,1,0,1,0,0] },
    { dim:'价格策略', cells:[0,0,1,1,0,0] },
    { dim:'渠道策略', cells:[1,0,1,1,0,0] },
    { dim:'传播话术', cells:[1,0,0,1,1,1] },
    { dim:'技术参数', cells:[1,1,1,0,0,0] },
    { dim:'目标客户', cells:[1,0,0,1,1,0] }
  ];
  var steps = cfg.steps || [
    { label:'采集官网产品页', detail:'来源可信度 ★★★★★ · 预计2s', status:'ok' },
    { label:'解析 Datasheet PDF', detail:'来源可信度 ★★★★★ · 预计3s', status:'ok' },
    { label:'抓取电商平台报价', detail:'来源可信度 ★★★★ · 预计2s', status:'ok' },
    { label:'检索行业新闻', detail:'来源可信度 ★★★ · 近90天 · 预计3s', status:'ok' },
    { label:'抓取技术论坛讨论', detail:'来源可信度 ★★ · 预计2s', status:'ok' },
    { label:'采集社交媒体信号', detail:'来源可信度 ★ · 预计2s', status:'fail' }
  ];
  return {
    key:cfg.key, label:cfg.key, type:cfg.type, vendor:cfg.vendor,
    tagline:cfg.tagline, desc:cfg.desc,
    dims:dims,
    plan:{ intro:cfg.planIntro || ('Agent 根据“'+cfg.key+'”自动识别为'+cfg.type+'，规划以下 6 维度 × 6 来源采集矩阵：'), note:'绿色 = 计划采集项', matrix:matrix },
    steps:steps,
    results:cfg.results || { items:42, itemsDesc:'含来源URL和时间戳', sourcesSuccess:5, sourcesFail:1, sourcesDesc:'5个成功 / 1个部分失败', coverage:'6/6', coverageDesc:'部分维度覆盖偏低', crossValidated:10, crossDesc:'10条数据有多源验证', conflicts:2, conflictDesc:'价格存在来源差异', gaps:[{ dim:'社交媒体', coverage:20, suggest:'社交媒体信号不足，建议补充补充采集。' }], confidence:0.68, confidenceLevel:'mid' },
    validation:cfg.validation || { rows:[], conflicts:[], decomposition:[], stats:{total:42,passed:24,conflictSingle:18,passedDesc:'57% 多源一致',csDesc:'2冲突 + 16单源'}, formula:'置信度 = 来源可信度权重 × 数据新鲜度系数 × 交叉验证系数' },
    analysis:{ dims:cfg.dimsData || [], customer:cfg.customer || null, selfCheck:cfg.selfCheck || { total:24, passed:21, passRate:'88%', items:[{ok:true,text:'各维度结论通过自检，低置信度条目已标注“AI推论”。'}] } },
    report:{
      overallConf:cfg.overallConf || 0.6, overallLevel:confLevel(cfg.overallConf || 0.6),
      sources:cfg.sources || 6, sourcesDesc:cfg.sourcesDesc || '5成功/1部分',
      passRate:cfg.passRate || '88%', passDesc:cfg.passDesc || '21/24条',
      scatter:cfg.scatter || { title:'竞品定位散点图', subtitle:'X轴=性能指数 · Y轴=价格 · 气泡大小=生态', points:[{name:cfg.key,price:3,perf:50,eco:3,note:'¥3 · 50'},{name:'竞品B',price:4,perf:60,eco:4,note:'¥4 · 60'},{name:'竞品C',price:2,perf:40,eco:2,note:'¥2 · 40'}], insight:'该芯片处于“中性能 + 中低价格”区域，性价比定位明确。' },
      priceBar:cfg.priceBar || { title:'价格对比柱状图', subtitle:'参考价（人民币）', items:[{name:cfg.key,v:3,src:'[电商]',note:''},{name:'竞品B',v:4,src:'[电商]',note:''},{name:'竞品C',v:2,src:'[电商]',note:''}], note:'价格按型号/批量浮动' },
      radar:cfg.radar || { title:'渠道能力雷达图', subtitle:'本芯片 vs 竞品均值', dims:['代理覆盖','价格管控','供货稳定','技术支持','生态丰富'], main:[60,70,65,60,55], rivals:[55,60,55,65,60] },
      heatmap:cfg.heatmap || { title:'数据覆盖热力图', subtitle:'6维度 × 6来源 · 单元格=置信度', dims:['产品定位','价格策略','渠道策略','传播话术','技术参数','目标客户'], sources:['官网 ★5','DS ★5','电商 ★4','新闻 ★3','论坛 ★2','社交 ★1'], rows:[['0.60','0.60',null,'0.45',null,null],[null,null,'0.55','0.45',null,null],['0.55',null,'0.50','0.45',null,null],['0.50',null,null,'0.45','0.40','0.35'],['0.60','0.60','0.55',null,null,null],['0.45',null,null,'0.40','0.40',null]], legend:'高 ≥0.6 · 中 0.4-0.59 · 低 <0.4 · — 无数据' },
      confDist:cfg.confDist || { title:'置信度分布图', high:8, mid:13, low:7, none:2, total:30, pct:70, note:'中高置信度占比 70%' },
      messaging:cfg.messaging || { title:'传播话术对比矩阵', subtitle:'核心话术 + 传播策略', note:'话术来源：官网关键词 + 媒体报道 · 置信度 0.5', rows:[{brand:cfg.key,m1:'稳定可靠',m2:'本地服务',m3:'高性价比',strategy:'行业深耕'},{brand:'竞品B',m1:'生态完整',m2:'全球化',m3:'品牌背书',strategy:'生态绑定'},{brand:'竞品C',m1:'极致低价',m2:'快速出货',m3:'灵活定制',strategy:'价格驱动'}] },
      conclusions:cfg.conclusions || []
    },
    trace:{
      stats:{ sources:cfg.sources || 6, conclusions:24, conflicts:2, integrity:'100%' },
      sources:cfg.traceSources || [
        { type:'official', name:'厂商官网', url:'https://example.com/', stars:5, time:'2026-08-13 18:35', items:8, status:'已验证' },
        { type:'datasheet', name:'Datasheet', url:'https://example.com/', stars:5, time:'2026-08-13 18:36', items:7, status:'已验证' },
        { type:'ecommerce', name:'立创商城', url:'https://item.szlcsc.com/', stars:4, time:'2026-08-13 18:37', items:5, status:'已验证' },
        { type:'media', name:'行业媒体', url:'https://example.com/', stars:3, time:'2026-08-13 18:37', items:4, status:'已验证' },
        { type:'forum', name:'技术论坛', url:'https://bbs.21ic.com/', stars:2, time:'2026-08-13 18:38', items:3, status:'已验证' },
        { type:'social', name:'社交媒体', url:'https://weibo.com/', stars:1, time:'2026-08-13 18:40', items:1, status:'数据不足' }
      ],
      conclusions:cfg.conclusions || [],
      conflicts:cfg.conflicts || [],
      checkNote:cfg.checkNote || '全部结论均已建立溯源链，低置信度条目已标注。'
    }
  };
}

/* ---------------- YC1308（易兆微 · 蓝牙SoC，自研对标） ---------------- */
CHIPINTEL.chips['YC1308'] = demoChip({
  key:'YC1308', type:'蓝牙 SoC（BLE数传）', vendor:'易兆微电子（杭州）',
  tagline:'易兆微自研 BLE SoC · IoT/POS/ETC 行业应用',
  desc:'易兆微电子蓝牙 SoC（YC13XX 系列）代表型号，面向 IoT、POS、ETC、电子价签等垂直行业，主打低功耗、高性价比与本地化服务。',
  overallConf:0.61, passRate:'86%', passDesc:'21/24条',
  planIntro:'Agent 根据“YC1308”自动识别为蓝牙 SoC（BLE数传），规划以下 6 维度 × 6 来源采集矩阵：',
  results:{ items:44, itemsDesc:'含来源URL和时间戳', sourcesSuccess:5, sourcesFail:1, sourcesDesc:'5个成功 / 1个部分失败', coverage:'6/6', coverageDesc:'价格与传播话术维度覆盖偏低', crossValidated:11, crossDesc:'11条数据有多源验证', conflicts:2, conflictDesc:'电商价格存在来源差异', gaps:[{dim:'价格策略', coverage:50, suggest:'电商报价不足，建议补充渠道询价。'},{dim:'社交媒体', coverage:15, suggest:'社交媒体信号不足。'}], confidence:0.66, confidenceLevel:'mid' },
  validation:{ rows:[
    { point:'蓝牙版本', values:[{src:'官网',val:'BLE 5.2',url:'http://www.yichip.com/'},{src:'Datasheet',val:'BLE 5.2',url:'http://www.yichip.com/'}], status:'2源一致', conf:0.80, level:'high' },
    { point:'参考价', values:[{src:'立创',val:'¥2.8',url:'https://item.szlcsc.com/'},{src:'渠道',val:'¥3.0-3.5',note:'批量浮动',url:'https://item.szlcsc.com/'}], status:'2源基本一致', conf:0.52, level:'mid' },
    { point:'目标市场', values:[{src:'官网',val:'IoT/POS/ETC/电子价签',url:'http://www.yichip.com/'},{src:'行业新闻',val:'POS/ETC 应用',url:'https://m.sohu.com/'}], status:'2源一致', conf:0.60, level:'mid' },
    { point:'出货规模', values:[{src:'行业分析',val:'行业估算',note:'未上市，财务数据为估算',url:'https://www.docin.com/'}], status:'单源', conf:0.38, level:'low' }
  ], conflicts:[
    { id:'#1', title:'参考价', desc:'立创 ¥2.8 与渠道批量价 ¥3.0-3.5 存在差异（含批量与渠道层级差异）。', strategy:'保留区间 ¥2.8-3.5，立创 ¥2.8 作为电商典型值。', display:'价格区间“¥2.8-3.5”，标注“按批量/渠道浮动”。' }
  ], decomposition:[
    { point:'蓝牙版本 BLE 5.2', factors:['1.0 (官网)','1.0 (7天内)','0.8 (2源一致)'], conf:'0.80', level:'high' },
    { point:'参考价', factors:['0.8 (电商)','1.0 (7天内)','0.8 (基本一致)'], conf:'0.52', level:'mid' },
    { point:'出货规模', factors:['0.6 (行业分析)','0.6 (90天内)','0.5 (单源)'], conf:'0.38', level:'low' }
  ], stats:{total:44,passed:26,conflictSingle:18,passedDesc:'59% 多源一致',csDesc:'2冲突 + 16单源'}, formula:'置信度 = 来源可信度权重 × 数据新鲜度系数 × 交叉验证系数' },
  dimsData:[
    { key:'position', label:'产品定位', icon:'🎯', conf:0.62, level:'mid', conclusion:'YC1308 定位“垂直行业 BLE SoC”，以低功耗、高性价比和本地化服务切入 POS/ETC/电子价签，避开 TWS 主控价格战。',
      evidence:[
        { layer:'数据', text:'官网产品线 YC13XX + 应用案例（POS/ETC/可穿戴/智能家居）。', src:'官网[易兆微] · 置信度 0.62' },
        { layer:'发现', text:'同类竞品（泰凌微/杰理AW31N）以通用IoT生态为主，垂直行业方案深度不及。', src:'竞品对比 · 置信度 0.55' },
        { layer:'推论', text:'易兆微选择“行业Know-how + 本地服务”差异化路线。', src:'产品布局分析 · 置信度 0.58' },
        { layer:'建议', text:'强化 POS/ETC 认证与行业方案展示，巩固垂直壁垒。', src:'竞争空白分析 · 建议置信度 0.55' } ] },
    { key:'price', label:'价格策略', icon:'💰', conf:0.52, level:'mid', conclusion:'参考价区间 ¥2.8-3.5，处于 BLE SoC 中低价位，与杰理 AW31N（¥2-4）接近，低于中高端恒玄/络达。',
      evidence:[
        { layer:'数据', text:'立创 ¥2.8 + 渠道批量 ¥3.0-3.5。', src:'电商+渠道 · 置信度 0.52' },
        { layer:'发现', text:'价格与国产 IoT SoC 主流区间一致，无明显溢价空间。', src:'电商对比 · 置信度 0.55' },
        { layer:'推论', text:'价格策略为“跟随 + 服务增值”，而非单纯低价。', src:'价格-服务组合分析 · 置信度 0.50' },
        { layer:'建议', text:'以“整体方案成本”叙事替代“单芯片价格”叙事。', src:'营销策略建议 · 建议置信度 0.50' } ] },
    { key:'channel', label:'渠道策略', icon:'🛰️', conf:0.55, level:'mid', conclusion:'渠道以行业方案商与直销大客户为主，配合电商现货覆盖中小客户；本地化技术支持是核心粘性。',
      evidence:[
        { layer:'数据', text:'官网渠道/联系入口 + 电商在售记录。', src:'官网+电商 · 置信度 0.55' },
        { layer:'发现', text:'垂直行业客户更依赖厂商直接技术支持。', src:'行业访谈/论坛 · 置信度 0.50' },
        { layer:'推论', text:'直销+方案商是垂直行业主渠道。', src:'渠道结构分析 · 置信度 0.52' },
        { layer:'建议', text:'建立行业方案商认证体系，扩大触达。', src:'渠道建议 · 建议置信度 0.50' } ] },
    { key:'messaging', label:'传播话术', icon:'📣', conf:0.50, level:'mid', conclusion:'核心话术：低功耗、稳定连接、本地化服务、认证齐全；面向行业客户强调“可靠”而非“性价比”。',
      evidence:[
        { layer:'数据', text:'官网关键词：低功耗/稳定/服务。', src:'官网 · 置信度 0.50' },
        { layer:'发现', text:'行业客户采购决策权重：供货稳定 > 价格 > 品牌。', src:'行业分析 · 置信度 0.45' },
        { layer:'推论', text:'话术应突出“行业级可靠性”。', src:'话术-需求匹配 · 置信度 0.48' },
        { layer:'建议', text:'增加 POS/ETC 白皮书与案例营销。', src:'营销建议 · 建议置信度 0.48' } ] },
    { key:'tech', label:'技术参数', icon:'⚙️', conf:0.72, level:'mid', conclusion:'BLE 5.2，支持主流 BLE 数传能力，低功耗特性满足 POS/可穿戴/传感应用；具体射频指标以 Datasheet 为准。',
      evidence:[
        { layer:'数据', text:'Datasheet + 官网：BLE 5.2，2源一致。', src:'2源交叉验证 · 置信度 0.80' },
        { layer:'发现', text:'对比泰凌微 TLSR9 系列，功能覆盖相当，生态规模略小。', src:'规格对比 · 置信度 0.60' },
        { layer:'推论', text:'技术规格“够用 + 行业适配”导向。', src:'规格分析 · 置信度 0.62' },
        { layer:'建议', text:'公开完整 Datasheet 与参考设计，降低客户评估门槛。', src:'技术营销建议 · 建议置信度 0.60' } ] },
    { key:'customer', label:'目标客户', icon:'👥', conf:0.55, level:'mid', conclusion:'目标客户：POS/ETC/电子价签/智能家居行业方案商与整机厂，重视供货稳定与本地支持。',
      evidence:[
        { layer:'数据', text:'官网应用案例（IoT/POS/ETC/可穿戴）。', src:'官网[易兆微] · 置信度 0.58' },
        { layer:'发现', text:'行业客户决策周期长、认证门槛高，替换成本高。', src:'行业分析 · 置信度 0.52' },
        { layer:'推论', text:'客户粘性来自认证绑定与技术支持。', src:'客户结构分析 · 置信度 0.54' },
        { layer:'建议', text:'深耕存量认证客户，逐行业复制。', src:'客户策略建议 · 建议置信度 0.52' } ] }
  ],
  conclusions:[
    { dim:'产品定位', summary:'垂直行业BLE SoC，避开TWS价格战', conf:0.62, level:'mid', refs:'官网产品线/应用案例', sources:2 },
    { dim:'价格策略', summary:'跟随+服务增值，¥2.8-3.5', conf:0.52, level:'mid', refs:'立创/渠道', sources:2 },
    { dim:'渠道策略', summary:'直销+方案商+电商现货', conf:0.55, level:'mid', refs:'官网/电商', sources:2 },
    { dim:'传播话术', summary:'低功耗+稳定+本地服务', conf:0.50, level:'mid', refs:'官网关键词', sources:1 },
    { dim:'技术参数', summary:'BLE 5.2，行业适配导向', conf:0.72, level:'mid', refs:'Datasheet/官网', sources:2 },
    { dim:'目标客户', summary:'POS/ETC/电子价签行业客户', conf:0.55, level:'mid', refs:'官网应用案例', sources:1 }
  ],
  conflicts:[{ id:'#1', title:'参考价', desc:'立创 ¥2.8 与渠道批量 ¥3.0-3.5 存在差异。', strategy:'保留区间并标注典型值。', display:'价格区间“¥2.8-3.5”。', visible:true }],
  checkNote:'YC1308 结论基于公开信息与行业常识（演示数据集），未上市公司的财务与出货数据均为估算，已标注低置信度。'
});

/* ---------------- AC200N（杰理 · 蓝牙音箱芯片） ---------------- */
CHIPINTEL.chips['AC200N'] = demoChip({
  key:'AC200N', type:'蓝牙音频 SoC（音箱主控）', vendor:'杰理科技',
  tagline:'中低端蓝牙音箱主控 · “价格屠刀”定位',
  desc:'杰理科技蓝牙音箱主控芯片，BT 5.0，定位中低端音箱市场（参考价 ¥1-2），以极致性价比覆盖白牌音箱出货主力。',
  overallConf:0.64, passRate:'88%', passDesc:'21/24条',
  planIntro:'Agent 根据“AC200N”自动识别为蓝牙音频 SoC（音箱主控），规划以下 6 维度 × 6 来源采集矩阵：',
  results:{ items:46, itemsDesc:'含来源URL和时间戳', sourcesSuccess:5, sourcesFail:1, sourcesDesc:'5个成功 / 1个部分失败', coverage:'6/6', coverageDesc:'传播话术维度覆盖偏低', crossValidated:12, crossDesc:'12条数据有多源验证', conflicts:2, conflictDesc:'电商价格存在来源差异', gaps:[{dim:'传播话术', coverage:45, suggest:'话术关键词不足，建议补充微信公众号与技术博客。'}], confidence:0.69, confidenceLevel:'mid' },
  validation:{ rows:[
    { point:'蓝牙规格', values:[{src:'官网',val:'BT 5.0',url:'https://www.jieli.com/'},{src:'Datasheet',val:'BT 5.0',url:'https://www.jieli.com/'},{src:'电商',val:'BT 5.0',url:'https://item.szlcsc.com/'}], status:'3源一致', conf:0.82, level:'high' },
    { point:'参考价', values:[{src:'立创',val:'¥1.2',url:'https://item.szlcsc.com/'},{src:'行业报告',val:'¥1-2',note:'价格带',url:'https://www.docin.com/'}], status:'2源基本一致', conf:0.60, level:'mid' },
    { point:'目标市场', values:[{src:'官网',val:'中低端音箱',url:'https://www.jieli.com/'},{src:'行业新闻',val:'白牌音箱主力',url:'https://m.sohu.com/'}], status:'2源一致', conf:0.62, level:'mid' }
  ], conflicts:[
    { id:'#1', title:'参考价', desc:'立创 ¥1.2 与行业报告 ¥1-2 价格带存在差异（含型号与批量差异）。', strategy:'保留区间 ¥1-2，立创 ¥1.2 作为典型值。', display:'价格区间“¥1-2”，典型值¥1.2。' }
  ], decomposition:[
    { point:'蓝牙规格 BT 5.0', factors:['1.0 (官网)','1.0 (7天内)','1.0 (3源一致)'], conf:'0.82', level:'high' },
    { point:'参考价', factors:['0.8 (电商)','1.0 (7天内)','0.8 (基本一致)'], conf:'0.60', level:'mid' },
    { point:'目标市场', factors:['1.0 (官网)','0.6 (90天内)','0.8 (2源一致)'], conf:'0.62', level:'mid' }
  ], stats:{total:46,passed:28,conflictSingle:18,passedDesc:'61% 多源一致',csDesc:'2冲突 + 16单源'}, formula:'置信度 = 来源可信度权重 × 数据新鲜度系数 × 交叉验证系数' },
  dimsData:[
    { key:'position', label:'产品定位', icon:'🎯', conf:0.68, level:'mid', conclusion:'AC200N 定位“中低端蓝牙音箱主控”，以 ¥1-2 的价格带服务白牌音箱市场，是杰理“价格屠刀”策略的代表型号。',
      evidence:[
        { layer:'数据', text:'官网产品线 AC200N 系列 + 行业报告价格带 ¥1-2。', src:'官网+行业 · 置信度 0.68' },
        { layer:'发现', text:'价格显著低于中高端音箱主控（¥3-5）。', src:'电商对比 · 置信度 0.65' },
        { layer:'推论', text:'以量取胜：白牌音箱出货量支撑规模效应。', src:'出货结构分析 · 置信度 0.62' },
        { layer:'建议', text:'易兆微音频线可聚焦智能音箱/行业音箱细分，避开低价红海。', src:'竞争空白分析 · 建议置信度 0.58' } ] },
    { key:'price', label:'价格策略', icon:'💰', conf:0.60, level:'mid', conclusion:'参考价 ¥1-2（立创 ¥1.2），处于音箱主控最低价格带，价格策略为“极致性价比 + 规模摊薄”。',
      evidence:[
        { layer:'数据', text:'立创 ¥1.2 + 行业报告 ¥1-2。', src:'电商+行业 · 置信度 0.60' },
        { layer:'发现', text:'同类竞品价格普遍 ¥2-4。', src:'电商对比 · 置信度 0.60' },
        { layer:'推论', text:'低价由出货规模与成本控制支撑。', src:'成本结构分析 · 置信度 0.58' },
        { layer:'建议', text:'评估成本底线后再决定是否跟进价格带。', src:'成本策略建议 · 建议置信度 0.52' } ] },
    { key:'channel', label:'渠道策略', icon:'🛰️', conf:0.56, level:'mid', conclusion:'渠道以白牌供应链 + 方案商为主，电商现货为辅，覆盖大量中小音箱厂商。',
      evidence:[
        { layer:'数据', text:'官网方案支持 + 电商在售。', src:'官网+电商 · 置信度 0.56' },
        { layer:'发现', text:'白牌厂商看重方案成熟度与交期。', src:'论坛+行业 · 置信度 0.52' },
        { layer:'推论', text:'方案生态是渠道核心。', src:'渠道分析 · 置信度 0.54' },
        { layer:'建议', text:'提供开箱即用参考设计吸引白牌客户。', src:'渠道建议 · 建议置信度 0.52' } ] },
    { key:'messaging', label:'传播话术', icon:'📣', conf:0.52, level:'mid', conclusion:'核心话术：极致性价比、成熟方案、快速量产；面向白牌客户以“便宜好用”为传播主轴。',
      evidence:[
        { layer:'数据', text:'官网与行业报道关键词：性价比/方案。', src:'官网+媒体 · 置信度 0.52' },
        { layer:'发现', text:'白牌客户决策以成本与交期为主。', src:'行业认知 · 置信度 0.48' },
        { layer:'推论', text:'话术与客户需求高度匹配。', src:'话术分析 · 置信度 0.50' },
        { layer:'建议', text:'若进入该市场，用“行业音箱认证”差异化。', src:'话术空白分析 · 建议置信度 0.48' } ] },
    { key:'tech', label:'技术参数', icon:'⚙️', conf:0.74, level:'mid', conclusion:'BT 5.0，支持主流音箱功能（双声道、低延时、TWS互联），规格覆盖中低端音箱需求。',
      evidence:[
        { layer:'数据', text:'官网 + Datasheet + 电商：BT 5.0，3源一致。', src:'3源交叉验证 · 置信度 0.82' },
        { layer:'发现', text:'对比中高端主控，DSP 与音频指标存在差距。', src:'规格对比 · 置信度 0.62' },
        { layer:'推论', text:'“够用 + 最便宜”是该定位的核心。', src:'规格-价格分析 · 置信度 0.64' },
        { layer:'建议', text:'差异化可聚焦“低延时游戏音箱”等细分规格。', src:'规格空白分析 · 建议置信度 0.58' } ] },
    { key:'customer', label:'目标客户', icon:'👥', conf:0.60, level:'mid', conclusion:'目标客户：白牌音箱厂商为主，覆盖电商爆款音箱的绝大多数出货。',
      evidence:[
        { layer:'数据', text:'行业报告 + 电商爆款拆解。', src:'行业+拆解 · 置信度 0.60' },
        { layer:'发现', text:'白牌客户无品牌忠诚，价格敏感。', src:'行业分析 · 置信度 0.55' },
        { layer:'推论', text:'客户结构高度分散、价格驱动。', src:'客户分析 · 置信度 0.58' },
        { layer:'建议', text:'面向音箱品牌商提供“第二供应商”方案。', src:'客户策略建议 · 建议置信度 0.55' } ] }
  ],
  conclusions:[
    { dim:'产品定位', summary:'中低端音箱主控，价格屠刀定位', conf:0.68, level:'mid', refs:'官网/行业报告', sources:2 },
    { dim:'价格策略', summary:'极致性价比，¥1-2', conf:0.60, level:'mid', refs:'立创/行业报告', sources:2 },
    { dim:'渠道策略', summary:'白牌供应链+方案商', conf:0.56, level:'mid', refs:'官网/电商', sources:2 },
    { dim:'传播话术', summary:'性价比+成熟方案+快速量产', conf:0.52, level:'mid', refs:'官网关键词', sources:2 },
    { dim:'技术参数', summary:'BT 5.0，规格覆盖中低端需求', conf:0.74, level:'mid', refs:'3源一致', sources:3 },
    { dim:'目标客户', summary:'白牌音箱厂商为主', conf:0.60, level:'mid', refs:'行业/拆解', sources:2 }
  ],
  conflicts:[{ id:'#1', title:'参考价', desc:'立创 ¥1.2 与行业报告 ¥1-2 存在差异。', strategy:'保留区间并标注典型值。', display:'价格区间“¥1-2”，典型值¥1.2。', visible:true }],
  checkNote:'AC200N 结论基于公开信息（演示数据集），价格带已透明标注。'
});

/* ============================================================
   公司级数据集（模式B）
   ============================================================ */
CHIPINTEL.companies = CHIPINTEL.companies || {};

/* ---------------- 杰理科技（完整示例） ---------------- */
CHIPINTEL.companies['杰理科技'] = {
  key:'杰理科技', label:'杰理科技', tagline:'蓝牙音频芯片龙头 · TWS全球市占率39.8%',
  type:'TWS耳机芯片 + 蓝牙音箱/AIoT SoC',
  desc:'珠海杰理科技股份有限公司，蓝牙音频芯片龙头：TWS耳机主控全球市占率 39.8%（2025），年出货 10.77 亿颗，2025 年北交所上市。产品覆盖 TWS、蓝牙音箱、AIoT、MCU、充电管理 IC。',
  steps: [
    { label:'采集公司官网产品矩阵', detail:'来源可信度 ★★★★★ · 预计3s', status:'ok' },
    { label:'采集行业报告与市场数据', detail:'来源可信度 ★★★★ · 预计4s', status:'ok' },
    { label:'采集投融资/专利/人才信息', detail:'来源可信度 ★★★ · 预计3s', status:'ok' },
    { label:'采集电商报价与出货信息', detail:'来源可信度 ★★★★ · 预计2s', status:'ok' },
    { label:'交叉校验 + 置信度评分', detail:'Agent自检 · 预计2s', status:'ok' }
  ],
  results:{ items:86, itemsDesc:'含来源URL', confidence:0.71, confidenceLevel:'mid', passRate:'92%', passDesc:'22/24条', sources:6, sourcesDesc:'6类来源 · 5成功/1部分', crossValidated:31, crossDesc:'31条多源验证', conflicts:3, conflictDesc:'市占率/出货/价格口径差异', gaps:[{dim:'客户图谱', coverage:58, suggest:'客户关系部分来自拆解与认证推断，建议补充供应链访谈。'}] },
  validation:{
    rows:[
      { point:'TWS芯片市占率', values:[{src:'行业报告',val:'39.8%（全球第一）',url:'https://www.docin.com/'},{src:'财经媒体',val:'40.1%（含整机推算）',url:'https://guba.eastmoney.com/'}], status:'2源基本一致', conf:0.82, level:'high' },
      { point:'TWS芯片年出货', values:[{src:'招股书',val:'10.77亿颗（2025）',url:'https://www.jieli.com/'},{src:'行业报告',val:'10.77亿颗',url:'https://www.docin.com/'}], status:'2源一致', conf:0.85, level:'high' },
      { point:'累计出货', values:[{src:'公司公告',val:'57.36亿颗',url:'https://www.jieli.com/'}], status:'单源', conf:0.80, level:'high' },
      { point:'营收规模', values:[{src:'招股书',val:'约107.9亿元（2025）',url:'https://www.jieli.com/'},{src:'财经媒体',val:'约108亿元',url:'https://guba.eastmoney.com/'}], status:'2源一致', conf:0.78, level:'mid' },
      { point:'核心客户', values:[{src:'行业分析',val:'白牌厂商为主，向小米/OPPO渗透',url:'https://m.sohu.com/'},{src:'拆解报告',val:'小米/OPPO/漫步者等',url:'https://www.52audio.com/'}], status:'2源一致', conf:0.62, level:'mid' },
      { point:'价格策略', values:[{src:'电商',val:'TWS主控¥1.5-2.5',url:'https://item.szlcsc.com/'},{src:'行业报告',val:'以价换量',url:'https://www.docin.com/'}], status:'2源一致', conf:0.58, level:'mid' },
      { point:'代工/工艺', values:[{src:'行业报告',val:'台积电22nm ULP',url:'https://www.docin.com/'}], status:'单源', conf:0.55, level:'mid' }
    ],
    conflicts:[
      { id:'#1', title:'TWS市占率口径', desc:'39.8%（主控芯片出货口径，行业报告） vs 40.1%（含整机推算，财经媒体）。', strategy:'保留两个口径，以39.8%为基准，40.1%标注“含整机推算”。', display:'报告中显示“39.8%（口径：TWS主控芯片出货）”。' },
      { id:'#2', title:'营收规模', desc:'招股书 107.9亿元 与财经媒体“约108亿元”为同一口径取整差异。', strategy:'取招股书 107.9亿元 为基准值。', display:'显示“约107.9亿元（2025）”。' },
      { id:'#3', title:'TWS主控价格带', desc:'立创典型价 ¥1.80 与行业报告 ¥1.5-2.5（型号差异）。', strategy:'保留区间，立创价作为典型值。', display:'价格区间“¥1.5-2.5”。' }
    ],
    stats:{ total:86, passed:52, conflictSingle:34, passedDesc:'60% 多源一致', csDesc:'3口径差异 + 31单源' },
    formula:'公司级数据同样执行“置信度 = 来源权重 × 新鲜度 × 交叉验证”，口径差异透明标注，不掩盖。'
  },
  analysis:{
    tabs:[
      { key:'products', label:'产品布局矩阵', icon:'📦',
        intro:'Agent 从官网、行业报告、电商等 6 类来源采集到杰理科技 5 大产品线、28+ 款芯片型号。',
        table:{
          cols:['产品线','代表型号','蓝牙规格','目标应用','价格带','定位','置信度'],
          rows:[
            ['TWS耳机芯片（核心营收）','BT8912F','BT 5.3 + LE','TWS耳机主控','¥1.5-2.5','性价比断层领先','0.82'],
            ['','AC700N系列','BT 5.2','中端TWS','¥2-3','白牌+品牌渗透','0.75'],
            ['','AW33N系列','BT 5.3','AIoT耳机','¥3-5','向高端延伸','0.58'],
            ['蓝牙音箱芯片','AC200N系列','BT 5.0','中低端音箱','¥1-2','“价格屠刀”定位','0.78'],
            ['','AC800N系列','BT 5.2','中高端音箱','¥3-5','品牌音箱市场','0.60'],
            ['AIoT芯片','AW31N系列','BT 5.2 BLE','智能家居/穿戴','¥2-4','IoT生态布局','0.55'],
            ['','AW33N系列','BT 5.3 + WiFi','AI语音交互','¥4-6','AI语音入口','0.52'],
            ['MCU/外设','GP系列','—','通用MCU','¥0.5-2','泛消费电子','0.50'],
            ['充电管理IC','—','—','TWS充电仓','¥0.3-1','配套芯片','0.38']
          ]
        },
        insight:'杰理产品战略：以 TWS 耳机芯片为核心营收引擎（全球市占率39.8%），向下以 AC200N“价格屠刀”覆盖低端音箱，向上以 AW33N 向 AIoT 和 AI 语音延伸。产品线呈“金字塔”结构：底层量大价低（AC/GP 系列），中层核心利润（BT8912F TWS），顶层战略卡位（AW33N AIoT）。',
        evidence:'证据来源：官网产品页 [杰理官网] + 行业报告 [豆丁] + 电商报价 [立创] · 整体置信度 0.68',
        yichip:'易兆微在蓝牙音频（YC11XX）直接面对杰理碾压式竞争。差异化方向：①杰理强在音频SoC，易兆微可在蓝牙数传+安全芯片（YC10XX+YC3X）组合上避开正面战场；②杰理主打白牌，易兆微可聚焦 POS/ETC/电子价签等垂直行业市场。'
      },
      { key:'market', label:'市场信息画像', icon:'📊',
        table:{
          cols:['维度','数据','来源','置信度'],
          rows:[
            ['TWS芯片市占率','39.8%（全球第一）','行业报告 [报告]','0.82'],
            ['TWS芯片年出货','10.77亿颗（2025）','招股书+行业 [招股书]','0.85'],
            ['累计出货','57.36亿颗','公司公告 [公告]','0.80'],
            ['核心客户','白牌厂商为主，向小米/OPPO品牌渗透','行业分析 [分析]','0.62'],
            ['价格策略','TWS芯片¥1.5-2.5，以价换量','电商+行业 [电商]','0.58'],
            ['代工合作','台积电22nm ULP工艺','行业报告 [报告]','0.55'],
            ['营收规模','约107.9亿元（2025）','招股书 [招股书]','0.78']
          ]
        },
        insight:'杰理 = 蓝牙音频芯片的“联发科”：以极致性价比 + 规模化出货建立断层式领先。39.8% 的全球 TWS 市占率意味着每 10 颗 TWS 耳机芯片中约 4 颗来自杰理。其核心壁垒不是技术领先（高通/恒玄在高端更强），而是“成本控制 + 出货规模 + 白牌生态”的三重飞轮。',
        yichip:'易兆微在蓝牙音频（YC11XX）赛道直接面对杰理的碾压式竞争。差异化方向：①杰理强在音频SoC，易兆微可在蓝牙数传+安全芯片（YC10XX+YC3X）组合上避开正面战场；②杰理主打白牌，易兆微可聚焦POS/ETC/电子价签等垂直行业市场。'
      },
      { key:'strategy', label:'战略布局解读', icon:'🧭',
        table:{
          cols:['战略维度','杰理布局信号','解读','置信度'],
          rows:[
            ['技术路线','22nm ULP工艺 + 自研DSP','从28nm向22nm迁移，追求功耗极限','0.55'],
            ['产品延伸','TWS→音箱→AIoT→MCU','从音频主控向泛消费IC扩张','0.72'],
            ['客户升级','白牌→品牌（小米/OPPO）','从“价格屠刀”向“品牌供应商”转型','0.62'],
            ['资本运作','2025年北交所上市融资扩产','加速AIoT布局','0.85'],
            ['生态建设','开发者社区+方案商网络','降低客户开发门槛，锁定生态','0.50'],
            ['专利布局','蓝牙协议栈/音频解码/低功耗','构建技术护城河','0.38']
          ]
        },
        evidenceChain:[
          { layer:'数据', text:'杰理2025年北交所上市，融资规模超预期。', src:'招股书[招股书] + 财经媒体[报道] · 置信度 0.85' },
          { layer:'发现', text:'产品线从TWS向AIoT/MCU扩张，客户从白牌向品牌渗透。', src:'官网产品矩阵 + 行业分析 · 置信度 0.72' },
          { layer:'推论', text:'杰理战略从“规模致胜”向“生态锁定”转型，用上市资金加速AIoT布局。', src:'产品延伸+客户升级+资本运作三重信号 · 置信度 0.62' },
          { layer:'建议', text:'易兆微应在杰理AIoT布局成熟前，抢占垂直行业IoT市场（POS/ETC/电子价签）。', src:'杰理AIoT尚在早期（置信度0.52），易兆微已有行业客户基础 · 建议置信度 0.58' }
        ],
        yichip:'杰理正在用上市资金加速 AIoT 与品牌客户布局；易兆微的窗口期在垂直行业 IoT（POS/ETC/电子价签）——杰理覆盖广度大但垂直深度不足，易兆微应加速行业认证与方案沉淀。'
      },
      { key:'trends', label:'未来趋势预判', icon:'🔮',
        table:{
          cols:['趋势预判','信号依据','时间窗口','置信度','对易兆微影响'],
          rows:[
            ['1. TWS价格继续下探至¥1以下','AC200N已到¥1-2，规模效应持续','6-12个月','0.65','⚠ 音频赛道利润空间进一步压缩'],
            ['2. 向LE Audio全面迁移','BT8912F已支持5.3+LE','12-18个月','0.72','需跟进LE Audio技术栈'],
            ['3. AIoT芯片成第二增长曲线','AW33N系列已发布','12-24个月','0.55','⚠ 直接威胁易兆微IoT市场'],
            ['4. 品牌客户占比提升至30%+','小米/OPPO合作深化','18个月','0.50','品牌市场门槛提高'],
            ['5. 向车载蓝牙延伸','暂无明确信号','24个月+','0.30','暂无直接影响']
          ]
        },
        summary:'最紧迫的威胁（6-12个月）：杰理 TWS 芯片价格下探至 ¥1 以下，蓝牙音频赛道利润空间将被进一步压缩，易兆微在音频芯片（YC11XX）上的竞争压力加剧。',
        disclaimer:'所有趋势预判均基于公开信息推理，不构成投资建议。'
      },
      { key:'customers', label:'客户图谱', icon:'🕸️',
        intro:'客户图谱由公开拆解报告、BQB 认证、FCC 认证、电商在售产品与论坛信息交叉构建（演示数据集，非实时采集）。',
        mapping:{
          cols:['品牌产品','芯片型号','证据来源','替代机会'],
          rows:[
            ['小米 Redmi Buds 5','BT8912F','拆解报告 + BQB认证','高'],
            ['OPPO Enco Air3','BT8912F','拆解报告 + FCC认证','中'],
            ['漫步者 X3 Lite','BT8912F','拆解报告','中'],
            ['QCY T13','BT8912F','拆解报告 + 电商','高'],
            ['声阔 Liberty Air 2','BT8912F','BQB认证','低'],
            ['小米/红米 多款音箱','AC200N','拆解报告','中'],
            ['白牌音箱 多款','AC200N/AC800N','电商+论坛','高']
          ]
        },
        concentration:'客户集中度：TOP5 品牌客户（小米/OPPO/漫步者/QCY/声阔）合计约占总出货 25-30%，其余为高度分散的白牌客户——客户集中度低，单一客户依赖风险小，但也意味着议价权弱。',
        tiers:[
          { tier:'high', label:'高', desc:'白牌/价格驱动型/无品牌忠诚度 — 替代机会最高，销售线索优先级最高' },
          { tier:'mid',  label:'中', desc:'二线品牌/多供应商策略/价格敏感型 — 需突出成本与服务' },
          { tier:'low',  label:'低', desc:'品牌深度合作/联合定制/长期合同 — 需长期培育' }
        ],
        drilldown:'公司级 → 芯片级下钻：点击“BT8912F”可查看芯片级客户列表（见芯片分析·客户情报 Tab）：小米 Redmi Buds 5、OPPO Enco Air3、漫步者 X3 Lite…',
        yichip:'杰理客户以白牌为主、品牌渗透中；易兆微可重点瞄准“第二供应商”需求的中型品牌客户，以及 POS/ETC 行业的品牌整机厂。'
      }
    ],
    selfCheck:{
      total:24, passed:22, passRate:'92%',
      items:[
        { ok:true, text:'产品布局矩阵：8条结论全部通过 · 官网+行业报告交叉验证' },
        { ok:true, text:'市场信息画像：7条数据全部通过 · 市占率口径已透明标注' },
        { ok:false, text:'趋势预判：5条预判均为AI推理 → 已标注“基于公开信息推理，不构成投资建议”' },
        { ok:true, text:'客户图谱：7条客户关系来自拆解/BQB/FCC记录 · 替代机会为AI分级' },
        { ok:false, text:'专利布局：置信度0.38（仅1源）→ 已标注“建议补充验证”' }
      ]
    }
  },
  report:{
    overallConf:0.71, overallLevel:'mid', sources:6, sourcesDesc:'5成功/1部分', passRate:'92%', passDesc:'22/24条',
    scatter:{
      title:'产品线定位散点图', subtitle:'X轴=价格带（¥） · Y轴=定位置信度 · 气泡大小=代表型号数',
      points:[
        { name:'BT8912F TWS', price:2.0, perf:0.82, eco:3, note:'¥1.5-2.5 · 核心营收' },
        { name:'AC700N', price:2.5, perf:0.75, eco:1, note:'¥2-3' },
        { name:'AW33N AIoT', price:4.0, perf:0.58, eco:2, note:'¥3-5' },
        { name:'AC200N', price:1.5, perf:0.78, eco:2, note:'¥1-2 · 价格屠刀' },
        { name:'AC800N', price:4.0, perf:0.60, eco:1, note:'¥3-5' },
        { name:'AW31N', price:3.0, perf:0.55, eco:1, note:'¥2-4' },
        { name:'GP MCU', price:1.25, perf:0.50, eco:1, note:'¥0.5-2' },
        { name:'充电IC', price:0.65, perf:0.38, eco:1, note:'¥0.3-1' }
      ],
      insight:'杰理产品线“金字塔”结构清晰：底层（音箱/MCU/充电IC）量大价低，中层（TWS）核心利润，顶层（AIoT/AI语音）战略卡位。'
    },
    priceBar:{
      title:'产品线价格带分布', subtitle:'各产品线参考价区间（人民币）',
      items:[
        { name:'充电管理IC', low:0.3, high:1 },
        { name:'GP MCU', low:0.5, high:2 },
        { name:'AC200N 音箱', low:1, high:2 },
        { name:'BT8912F TWS', low:1.5, high:2.5 },
        { name:'AC700N TWS', low:2, high:3 },
        { name:'AW31N AIoT', low:2, high:4 },
        { name:'AC800N 音箱', low:3, high:5 },
        { name:'AW33N AIoT', low:3, high:5 },
        { name:'AW33N AI语音', low:4, high:6 }
      ],
      note:'⚠ 价格带按型号/批量浮动，来源：立创+行业报告'
    },
    radar:{
      title:'公司能力雷达图', subtitle:'杰理科技 vs 中高端竞品均值（恒玄/络达/高通）',
      dims:['成本控制','出货规模','白牌生态','品牌渗透','AIoT布局'],
      main:[95,95,90,55,50], rivals:[60,55,50,90,70]
    },
    heatmap:{
      title:'数据覆盖热力图', subtitle:'5分析维度 × 6类来源 · 单元格=置信度',
      dims:['产品布局','市场信息','战略布局','趋势预判','客户图谱'],
      sources:['官网 ★5','行业 ★4','招股 ★4','电商 ★4','新闻 ★3','论坛 ★2'],
      rows:[
        ['0.82','0.68','0.60','0.58','0.55','0.50'],
        ['0.80','0.85','0.78','0.58','0.62','0.45'],
        ['0.55','0.62','0.85','0.40','0.55','0.38'],
        ['0.52','0.72','0.50','0.45','0.55','0.30'],
        ['0.58','0.55','0.62','0.60','0.52','0.55']
      ],
      legend:'高 ≥0.6 · 中 0.4-0.59 · 低 <0.4 · — 无数据'
    },
    confDist:{ title:'置信度分布图', high:11, mid:15, low:6, none:2, total:34, pct:76, note:'中高置信度占比 76% · 趋势预判与客户分级已标注AI推理' },
    messaging:{
      title:'公司核心话术对比矩阵', subtitle:'各友商公司传播策略',
      note:'话术来源：各公司官网 + 行业媒体报道 · 置信度 0.55',
      rows:[
        { brand:'杰理科技', m1:'极致性价比', m2:'规模化出货', m3:'方案生态', strategy:'以价换量·白牌为王' },
        { brand:'中科蓝讯', m1:'RISC-V自主', m2:'高性价比', m3:'快速迭代', strategy:'国产自主替代' },
        { brand:'恒玄科技', m1:'旗舰音质', m2:'低功耗', m3:'品牌合作', strategy:'中高端品牌市场' },
        { brand:'泰凌微电子', m1:'BLE Mesh', m2:'IoT生态', m3:'低功耗', strategy:'IoT/车载深耕' },
        { brand:'络达(联发科系)', m1:'大厂品质', m2:'稳定连接', m3:'ODM支持', strategy:'品牌+ODM市场' },
        { brand:'高通', m1:'顶级性能', m2:'骁龙生态', m3:'全场景', strategy:'高端旗舰标杆' }
      ]
    },
    conclusions:[
      { dim:'产品布局', summary:'金字塔结构：TWS核心+音箱+AIoT+MCU', conf:0.68, level:'mid', refs:'官网产品矩阵/行业报告', sources:3 },
      { dim:'市场信息', summary:'TWS市占39.8%第一，年出货10.77亿颗', conf:0.78, level:'mid', refs:'招股书/行业报告', sources:3 },
      { dim:'战略布局', summary:'从“规模致胜”向“生态锁定”转型', conf:0.62, level:'mid', refs:'产品/客户/资本三重信号', sources:3 },
      { dim:'趋势预判', summary:'TWS价格下探¥1以下，AIoT成第二曲线', conf:0.55, level:'mid', refs:'产品发布/出货数据', sources:2 },
      { dim:'客户图谱', summary:'白牌为主，品牌渗透中，TOP5占25-30%', conf:0.66, level:'mid', refs:'拆解/BQB/FCC', sources:2 }
    ]
  },
  trace:{
    stats:{ sources:10, conclusions:24, conflicts:3, integrity:'100%' },
    sources:[
      { type:'official', name:'杰理官网', url:'https://www.jieli.com/', stars:5, time:'2026-08-13 18:35', items:14, status:'已验证' },
      { type:'report', name:'行业报告(豆丁)', url:'https://www.docin.com/', stars:4, time:'2026-08-13 18:36', items:12, status:'已验证' },
      { type:'patent', name:'招股书/公司公告', url:'https://www.jieli.com/', stars:4, time:'2026-08-13 18:37', items:10, status:'已验证' },
      { type:'ecommerce', name:'立创商城', url:'https://item.szlcsc.com/', stars:4, time:'2026-08-13 18:37', items:8, status:'已验证' },
      { type:'media', name:'财经媒体(东方财富)', url:'https://guba.eastmoney.com/', stars:3, time:'2026-08-13 18:38', items:7, status:'口径冲突' },
      { type:'media', name:'搜狐行业报道', url:'https://m.sohu.com/', stars:3, time:'2026-08-13 18:38', items:6, status:'已验证' },
      { type:'forum', name:'我爱音频网(拆解)', url:'https://www.52audio.com/', stars:3, time:'2026-08-13 18:39', items:9, status:'已验证' },
      { type:'patent', name:'BQB认证库', url:'https://launchstudio.bluetooth.com/', stars:4, time:'2026-08-13 18:39', items:7, status:'已验证' },
      { type:'patent', name:'FCC认证库', url:'https://www.fcc.gov/', stars:4, time:'2026-08-13 18:40', items:6, status:'已验证' },
      { type:'social', name:'社交媒体', url:'https://weibo.com/', stars:1, time:'2026-08-13 18:41', items:2, status:'数据不足' }
    ],
    conclusions:[
      { dim:'产品布局', summary:'金字塔结构：TWS核心+音箱+AIoT+MCU', conf:0.68, refs:'官网产品矩阵/行业报告', sources:3 },
      { dim:'市场信息', summary:'TWS市占39.8%第一，年出货10.77亿颗', conf:0.78, refs:'招股书/行业报告', sources:3 },
      { dim:'战略布局', summary:'从“规模致胜”向“生态锁定”转型', conf:0.62, refs:'产品/客户/资本三重信号', sources:3 },
      { dim:'趋势预判', summary:'TWS价格下探¥1以下，AIoT成第二曲线', conf:0.55, refs:'产品发布/出货数据', sources:2 },
      { dim:'客户图谱', summary:'白牌为主，品牌渗透中，TOP5占25-30%', conf:0.66, refs:'拆解/BQB/FCC', sources:2 }
    ],
    conflicts:[
      { id:'#1', title:'TWS市占率口径', desc:'39.8%（主控出货口径） vs 40.1%（含整机推算）。', strategy:'保留两口径，以39.8%为基准。', display:'标注“口径：TWS主控芯片出货”。', visible:true },
      { id:'#2', title:'营收规模', desc:'招股书107.9亿元 vs 财经媒体约108亿元（取整差异）。', strategy:'取招股书107.9亿元为基准。', display:'显示“约107.9亿元（2025）”。', visible:true },
      { id:'#3', title:'TWS主控价格带', desc:'立创¥1.80 vs 行业报告¥1.5-2.5。', strategy:'保留区间并标注典型值。', display:'价格区间“¥1.5-2.5”。', visible:true }
    ],
    checkNote:'杰理科技全部24条结论均建立溯源链；客户图谱基于拆解+BQB+FCC三重证据，替代机会为AI分级。'
  }
};

/* ---------- 公司数据集生成器（其余友商） ---------- */
function demoCompany(cfg){
  var defaultSteps = [
    { label:'采集公司官网产品矩阵', detail:'来源可信度 ★★★★★ · 预计3s', status:'ok' },
    { label:'采集行业报告与市场数据', detail:'来源可信度 ★★★★ · 预计4s', status:'ok' },
    { label:'采集投融资/专利/人才信息', detail:'来源可信度 ★★★ · 预计3s', status:'ok' },
    { label:'采集电商报价与出货信息', detail:'来源可信度 ★★★★ · 预计2s', status:'ok' },
    { label:'交叉校验 + 置信度评分', detail:'Agent自检 · 预计2s', status:'ok' }
  ];
  var defaultSources = [
    { type:'official', name:cfg.label+'官网', url:cfg.url||'https://example.com/', stars:5, time:'2026-08-13 18:35', items:10, status:'已验证' },
    { type:'report', name:'行业报告', url:'https://www.docin.com/', stars:4, time:'2026-08-13 18:36', items:8, status:'已验证' },
    { type:'patent', name:'招股书/公告', url:'https://example.com/', stars:4, time:'2026-08-13 18:37', items:7, status:cfg.listed?'已验证':'数据有限' },
    { type:'ecommerce', name:'立创商城', url:'https://item.szlcsc.com/', stars:4, time:'2026-08-13 18:37', items:6, status:'已验证' },
    { type:'media', name:'财经/行业媒体', url:'https://m.sohu.com/', stars:3, time:'2026-08-13 18:38', items:5, status:'已验证' },
    { type:'forum', name:'技术社区/拆解', url:'https://www.52audio.com/', stars:3, time:'2026-08-13 18:39', items:4, status:'已验证' }
  ];
  return {
    key:cfg.key, label:cfg.key, tagline:cfg.tagline, type:cfg.type, desc:cfg.desc,
    listed:cfg.listed, url:cfg.url,
    steps:cfg.steps || defaultSteps,
    results:cfg.results || { items:72, itemsDesc:'含来源URL', confidence:0.62, confidenceLevel:'mid', passRate:'88%', passDesc:'21/24条', sources:6, sourcesDesc:'6类来源 · 5成功/1部分', crossValidated:22, crossDesc:'22条多源验证', conflicts:2, conflictDesc:'口径差异已标注', gaps:cfg.gaps || [{dim:'客户图谱', coverage:45, suggest:'客户关系部分来自拆解与认证推断，建议补充访谈。'}] },
    validation:{
      rows:cfg.validationRows || [
        { point:'营收规模', values:[{src:'招股书/公告',val:cfg.revenue||'行业估算',note:cfg.listed?'':'未上市，数据为估算',url:cfg.url||'https://example.com/'},{src:'行业报告',val:cfg.revenue2||'估算',url:'https://www.docin.com/'}], status:cfg.listed?'2源一致':'单源估算', conf:cfg.revConf||0.5, level:confLevel(cfg.revConf||0.5) },
        { point:'核心产品线', values:[{src:'官网',val:cfg.products||'—',url:cfg.url||'https://example.com/'},{src:'行业报告',val:cfg.products2||'—',url:'https://www.docin.com/'}], status:'2源一致', conf:0.7, level:'mid' },
        { point:'目标市场', values:[{src:'官网',val:cfg.market||'—',url:cfg.url||'https://example.com/'},{src:'行业报告',val:cfg.market2||'—',url:'https://www.docin.com/'}], status:'2源一致', conf:0.65, level:'mid' },
        { point:'技术路线', values:[{src:'官网',val:cfg.tech||'—',url:cfg.url||'https://example.com/'}], status:'单源', conf:0.6, level:'mid' }
      ],
      conflicts:cfg.conflicts || [],
      stats:cfg.stats || { total:72, passed:42, conflictSingle:30, passedDesc:'58% 多源一致', csDesc:'2口径差异 + 28单源' },
      formula:'公司级数据同样执行“置信度 = 来源权重 × 新鲜度 × 交叉验证”，口径差异透明标注，不掩盖。'
    },
    analysis:{
      tabs:[
        { key:'products', label:'产品布局矩阵', icon:'📦',
          intro:cfg.productsIntro || ('Agent 采集到 '+cfg.label+' 的核心产品线与代表型号（演示数据集）。'),
          table:{ cols:['产品线','代表型号','蓝牙规格','目标应用','价格带','定位','置信度'], rows:cfg.productRows || [] },
          insight:cfg.productInsight || '',
          evidence:cfg.productEvidence || '',
          yichip:cfg.yichipProducts || '对易兆微启示：建议结合自身产品线对比，识别差异化空间。' },
        { key:'market', label:'市场信息画像', icon:'📊',
          table:{ cols:['维度','数据','来源','置信度'], rows:cfg.marketRows || [] },
          insight:cfg.marketInsight || '',
          yichip:cfg.yichipMarket || '对易兆微启示：结合市场定位，寻找错位竞争窗口。' },
        { key:'strategy', label:'战略布局解读', icon:'🧭',
          table:{ cols:['战略维度','布局信号','解读','置信度'], rows:cfg.strategyRows || [] },
          evidenceChain:cfg.evidenceChain || [],
          yichip:cfg.yichipStrategy || '对易兆微启示：跟踪其战略动向，及时调整自身布局。' },
        { key:'trends', label:'未来趋势预判', icon:'🔮',
          table:{ cols:['趋势预判','信号依据','时间窗口','置信度','对易兆微影响'], rows:cfg.trendRows || [] },
          summary:cfg.trendSummary || '',
          disclaimer:'所有趋势预判均基于公开信息推理，不构成投资建议。' },
        { key:'customers', label:'客户图谱', icon:'🕸️',
          intro:'客户图谱由公开拆解报告、BQB 认证、FCC 认证与电商在售信息交叉构建（演示数据集）。',
          mapping:{ cols:['品牌产品','芯片型号','证据来源','替代机会'], rows:cfg.customerRows || [] },
          concentration:cfg.concentration || '',
          tiers:[
            { tier:'high', label:'高', desc:'白牌/价格驱动型/无品牌忠诚度 — 替代机会最高' },
            { tier:'mid',  label:'中', desc:'二线品牌/多供应商策略/价格敏感型' },
            { tier:'low',  label:'低', desc:'品牌深度合作/联合定制/长期合同' }
          ],
          drilldown:cfg.drilldown || '',
          yichip:cfg.yichipCustomers || '对易兆微启示：识别多供应商策略客户，作为销售线索。' }
      ],
      selfCheck:cfg.selfCheck || { total:24, passed:21, passRate:'88%', items:[{ok:true,text:'各维度结论通过自检；趋势预判与客户分级已标注AI推理。'},{ok:false,text:cfg.listed?'':'未上市公司财务数据为行业估算，已标注低置信度。'}] }
    },
    report:{
      overallConf:cfg.overallConf || 0.62, overallLevel:confLevel(cfg.overallConf || 0.62),
      sources:6, sourcesDesc:'5成功/1部分', passRate:cfg.passRate || '88%', passDesc:cfg.passDesc || '21/24条',
      scatter:cfg.scatter || { title:'产品线定位散点图', subtitle:'X轴=价格带（¥） · Y轴=定位置信度', points:[{name:cfg.key,price:3,perf:0.6,eco:1,note:'¥3'},{name:'产品线B',price:4,perf:0.65,eco:1,note:'¥4'},{name:'产品线C',price:2,perf:0.5,eco:1,note:'¥2'}], insight:cfg.reportInsight || '' },
      priceBar:cfg.priceBar || { title:'产品线价格带分布', subtitle:'参考价区间（人民币）', items:[{name:'产品线A',low:2,high:4},{name:'产品线B',low:3,high:6},{name:'产品线C',low:1,high:3}], note:'⚠ 价格带按型号/批量浮动' },
      radar:cfg.radar || { title:'公司能力雷达图', subtitle:cfg.key+' vs 竞品均值', dims:['成本控制','出货规模','生态','品牌认可','技术领先'], main:[70,60,60,55,60], rivals:[65,65,60,65,70] },
      heatmap:cfg.heatmap || { title:'数据覆盖热力图', subtitle:'5分析维度 × 6类来源 · 单元格=置信度', dims:['产品布局','市场信息','战略布局','趋势预判','客户图谱'], sources:['官网 ★5','行业 ★4','招股 ★4','电商 ★4','新闻 ★3','论坛 ★2'], rows:[['0.60','0.55','0.50','0.50','0.45','0.40'],['0.60','0.60','0.55','0.45','0.50','0.40'],['0.50','0.50','0.55','0.40','0.45','0.35'],['0.45','0.50','0.45','0.40','0.45','0.30'],['0.45','0.45','0.50','0.45','0.40','0.40']], legend:'高 ≥0.6 · 中 0.4-0.59 · 低 <0.4 · — 无数据' },
      confDist:cfg.confDist || { title:'置信度分布图', high:9, mid:14, low:7, none:2, total:32, pct:72, note:'中高置信度占比 72%' },
      messaging:cfg.messaging || { title:'公司核心话术对比矩阵', subtitle:'各友商公司传播策略', note:'话术来源：各公司官网 + 行业媒体报道 · 置信度 0.5', rows:[{brand:cfg.key,m1:cfg.msg1||'性价比',m2:cfg.msg2||'生态',m3:cfg.msg3||'服务',strategy:cfg.msgStrategy||'行业深耕'},{brand:'杰理科技',m1:'极致性价比',m2:'规模化出货',m3:'方案生态',strategy:'以价换量'},{brand:'恒玄科技',m1:'旗舰音质',m2:'低功耗',m3:'品牌合作',strategy:'中高端品牌'}] },
      conclusions:cfg.conclusions || []
    },
    trace:{
      stats:{ sources:6, conclusions:24, conflicts:cfg.conflicts?cfg.conflicts.length:0, integrity:'100%' },
      sources:cfg.traceSources || defaultSources,
      conclusions:cfg.conclusions || [],
      conflicts:cfg.conflicts || [],
      checkNote:cfg.checkNote || '全部结论均已建立溯源链；未上市公司的财务与出货数据为行业估算，已标注。'
    }
  };
}

/* ---------------- 中科蓝讯 ---------------- */
CHIPINTEL.companies['中科蓝讯'] = demoCompany({
  key:'中科蓝讯', listed:true, url:'https://www.bluetrum.com/',
  tagline:'RISC-V内核 · 高性价比蓝牙音频新势力',
  type:'蓝牙音频/数传 SoC（全系RISC-V）',
  desc:'深圳市中科蓝讯科技股份有限公司，科创板上市（2022），全系芯片采用自研 RISC-V 内核，主打高性价比，覆盖 TWS、蓝牙音箱、数传与智能穿戴市场。',
  revenue:'约15亿元（2025，估算）', revenue2:'估算', revConf:0.45,
  products:'TWS（AB5365/AB5366）· 音箱（AB5352）· 数传（BT8922B）', products2:'TWS/音箱/数传',
  market:'白牌TWS与音箱市场为主', market2:'白牌+品牌入门线',
  tech:'自研RISC-V内核 + 自研DSP',
  productRows:[
    ['TWS耳机芯片','AB5365/AB5366','BT 5.3','TWS主控','¥1.5-3','高性价比','0.58'],
    ['蓝牙音箱芯片','AB5352','BT 5.0','中低端音箱','¥1-2','性价比','0.60'],
    ['蓝牙数传芯片','BT8922B','BT 5.1','数传/IoT','¥1.5-2.5','通用','0.55'],
    ['智能穿戴','AB5661','BT 5.2','手表/手环','¥2-4','新兴','0.45']
  ],
  productInsight:'中科蓝讯以“全系 RISC-V 自研 + 高性价比”复刻杰理路径：TWS 主控为基本盘，向音箱/穿戴延伸；RISC-V 内核使其在成本与自主可控叙事上具备差异化。',
  marketRows:[
    ['营收规模','约15亿元（2025，估算）','招股书+行业 [估算]','0.45'],
    ['核心产品','TWS主控为基本盘','官网 [官网]','0.60'],
    ['技术路线','全系自研RISC-V','官网+行业 [官网]','0.58'],
    ['价格策略','对标杰理，略低于其价格带','电商 [电商]','0.52'],
    ['目标市场','白牌为主，品牌入门线渗透','行业分析 [分析]','0.50']
  ],
  marketInsight:'中科蓝讯是“RISC-V 叙事 + 杰理打法”的组合：自主内核降低授权成本与国产化门槛，价格带紧贴杰理，是白牌市场的第二极。',
  strategyRows:[
    ['技术路线','全系RISC-V自研','形成成本与自主可控双壁垒','0.58'],
    ['产品延伸','TWS→音箱→穿戴→数传','全品类覆盖泛音频','0.62'],
    ['客户升级','白牌→品牌入门线','跟随杰理路径','0.48'],
    ['资本运作','2022年科创板上市','募资扩产，加速研发','0.70'],
    ['生态建设','RISC-V开发者生态','差异化叙事','0.45']
  ],
  evidenceChain:[
    { layer:'数据', text:'科创板上市（2022），全系RISC-V内核公开资料。', src:'招股书+官网 · 置信度 0.70' },
    { layer:'发现', text:'产品线与价格带与杰理高度重合，客户结构相似。', src:'官网产品矩阵+电商 · 置信度 0.60' },
    { layer:'推论', text:'中科蓝讯是杰理最直接的“影子竞争者”，差异化在RISC-V自主叙事。', src:'产品/价格/客户对比 · 置信度 0.55' },
    { layer:'建议', text:'易兆微应警惕其数传产品向 IoT 延伸，加快行业认证布局。', src:'竞争态势分析 · 建议置信度 0.52' }
  ],
  trendRows:[
    ['1. RISC-V全系渗透，成本进一步下探','自研内核规模化','6-12个月','0.55','⚠ 价格战加剧'],
    ['2. 向智能穿戴延伸','AB5661已发布','12-18个月','0.50','穿戴市场门槛提高'],
    ['3. 品牌入门线客户提升','客户结构变化','18个月','0.45','品牌合作空间缩小']
  ],
  trendSummary:'最紧迫影响：RISC-V 规模化将进一步压低白牌音频芯片价格，加剧易兆微音频线（YC11XX）的竞争压力；穿戴与数传延伸直接触碰易兆微 IoT 市场。',
  customerRows:[
    ['白牌TWS厂商（多款）','AB5365/AB5366','电商+拆解','高'],
    ['白牌音箱厂商','AB5352','电商','高'],
    ['入门品牌TWS','AB5365','拆解报告','中']
  ],
  concentration:'客户高度分散（白牌为主），集中度低；替代机会集中在价格敏感型白牌与入门品牌客户。',
  drilldown:'公司级 → 芯片级：暂无公开芯片级客户下钻数据（演示数据集，建议补充拆解报告）。',
  yichipProducts:'中科蓝讯与杰理打法相似；易兆微应避免与其在白牌音频正面竞争，聚焦行业数传/安全芯片组合。',
  conclusions:[
    { dim:'产品布局', summary:'全系RISC-V，TWS+音箱+穿戴+数传', conf:0.58, level:'mid', refs:'官网产品线', sources:2 },
    { dim:'市场信息', summary:'营收约15亿（估算），白牌第二极', conf:0.45, level:'low', refs:'招股书/行业估算', sources:2 },
    { dim:'战略布局', summary:'RISC-V自主+全品类延伸', conf:0.55, level:'mid', refs:'技术路线/产品线', sources:2 },
    { dim:'趋势预判', summary:'价格继续下探，穿戴/数传延伸', conf:0.50, level:'mid', refs:'产品发布', sources:2 },
    { dim:'客户图谱', summary:'白牌为主，高度分散', conf:0.50, level:'mid', refs:'电商/拆解', sources:2 }
  ],
  conflicts:[{ id:'#1', title:'营收规模', desc:'招股书与行业估算口径不一（未更新财报）。', strategy:'采用估算值并标注“估算”。', display:'显示“约15亿元（2025，估算）”。', visible:true }],
  checkNote:'中科蓝讯部分财务数据为行业估算（公开财报更新滞后），已标注低置信度；其余结论基于官网与公开资料。'
});

/* ---------------- 恒玄科技 ---------------- */
CHIPINTEL.companies['恒玄科技'] = demoCompany({
  key:'恒玄科技', listed:true, url:'https://www.bestechnic.com/',
  tagline:'中高端品牌音频SoC · 低功耗高性能',
  type:'智能音频 SoC（品牌市场）',
  desc:'恒玄科技（Best）科创板上市（2020），定位中高端品牌音频 SoC，客户覆盖华为、小米、三星、OPPO 等头部品牌，主打低功耗高性能 DSP 与品牌服务能力。',
  revenue:'约25亿元（2025，估算）', revenue2:'估算', revConf:0.5,
  products:'BES2500/BES2600系列（TWS/智能音频）', products2:'TWS/音箱/手表',
  market:'品牌TWS与智能音频市场', market2:'中高端品牌',
  tech:'自研低功耗DSP + 22nm/28nm工艺',
  productRows:[
    ['TWS主控（旗舰）','BES2600系列','BT 5.3 + LE','旗舰TWS','¥6-10','中高端品牌','0.65'],
    ['TWS主控（主流）','BES2500系列','BT 5.2','中高端TWS','¥4-6','品牌市场','0.62'],
    ['智能音频','BES2700系列','BT 5.3','智能音箱/手表','¥5-8','生态延伸','0.55'],
    ['可穿戴','BES2800系列','BT 5.3','手表/手环','¥4-7','新兴','0.50']
  ],
  productInsight:'恒玄定位“品牌音频 SoC”：BES2600 面向旗舰 TWS，性能与功耗对标高通，价格显著高于杰理/中科蓝讯，是白牌厂商难以跨越的品牌门槛。',
  marketRows:[
    ['营收规模','约25亿元（2025，估算）','招股书+行业 [估算]','0.50'],
    ['核心客户','华为/小米/三星/OPPO','行业报道 [报道]','0.65'],
    ['技术路线','自研低功耗DSP','官网 [官网]','0.62'],
    ['价格策略','中高端，¥4-10','电商 [电商]','0.58'],
    ['目标市场','品牌TWS与智能音频','行业分析 [分析]','0.60']
  ],
  marketInsight:'恒玄是“技术+品牌”路线代表：自研 DSP 提供性能与功耗优势，客户结构以头部品牌为主，价格与毛利显著高于白牌厂商。',
  strategyRows:[
    ['技术路线','自研DSP + 先进制程','性能/功耗双领先','0.62'],
    ['客户升级','头部品牌深度绑定','品牌壁垒高','0.65'],
    ['产品延伸','TWS→音箱→手表→智能音频','全场景音频','0.60'],
    ['生态建设','与品牌联合定制','锁定长期合作','0.58'],
    ['资本运作','2020年科创板上市','持续研发投入','0.72']
  ],
  evidenceChain:[
    { layer:'数据', text:'科创板上市（2020），客户与产品线公开信息。', src:'招股书+官网 · 置信度 0.70' },
    { layer:'发现', text:'BES2600 进入多款旗舰TWS，价格带¥6-10。', src:'电商+拆解 · 置信度 0.62' },
    { layer:'推论', text:'恒玄与品牌客户形成联合定制壁垒，不易被低价切入。', src:'客户结构+定制模式 · 置信度 0.58' },
    { layer:'建议', text:'易兆微音频线短期难与恒玄正面对抗，应聚焦垂直行业音频场景。', src:'竞争态势分析 · 建议置信度 0.55' }
  ],
  trendRows:[
    ['1. 向智能手表/可穿戴延伸','BES2800系列','12-18个月','0.55','可穿戴SoC竞争加剧'],
    ['2. 与头部品牌联合定制加深','客户合作模式','12个月','0.62','品牌市场门槛提高'],
    ['3. 低功耗技术持续领先','先进制程+自研DSP','18个月','0.60','技术差距拉大']
  ],
  trendSummary:'恒玄的战略重心在“品牌 + 技术”双壁垒，短期不会下探白牌价格带；其对易兆微的威胁主要在可穿戴延伸与行业高端市场。',
  customerRows:[
    ['华为 FreeBuds系列','BES2600','拆解+BQB','低'],
    ['小米 中高端TWS','BES2600/2500','拆解报告','低'],
    ['三星 Galaxy Buds','BES2600','BQB认证','低'],
    ['OPPO Enco系列','BES2500','拆解+FCC','中']
  ],
  concentration:'客户集中度高（头部品牌为主），深度绑定、切换成本高，替代机会整体为“低-中”。',
  drilldown:'公司级 → 芯片级：BES2600 客户列表见芯片级情报（演示数据集）。',
  yichipProducts:'恒玄占领品牌高端；易兆微应避免高端正面竞争，可关注其未覆盖的行业音频/数传组合。',
  conclusions:[
    { dim:'产品布局', summary:'BES2500/2600，品牌音频SoC', conf:0.62, level:'mid', refs:'官网/电商', sources:2 },
    { dim:'市场信息', summary:'营收约25亿（估算），头部品牌客户', conf:0.55, level:'mid', refs:'行业报道', sources:2 },
    { dim:'战略布局', summary:'技术+品牌双壁垒，联合定制', conf:0.62, level:'mid', refs:'客户结构', sources:2 },
    { dim:'趋势预判', summary:'可穿戴延伸，技术持续领先', conf:0.55, level:'mid', refs:'产品发布', sources:2 },
    { dim:'客户图谱', summary:'头部品牌深度绑定，切换成本高', conf:0.58, level:'mid', refs:'拆解/BQB', sources:2 }
  ],
  conflicts:[{ id:'#1', title:'营收规模', desc:'行业估算口径不一。', strategy:'采用估算值并标注。', display:'显示“约25亿元（2025，估算）”。', visible:true }],
  checkNote:'恒玄科技财务数据为行业估算，已标注；客户关系基于拆解/BQB认证（演示数据集）。'
});

/* ---------------- 泰凌微电子 ---------------- */
CHIPINTEL.companies['泰凌微电子'] = demoCompany({
  key:'泰凌微电子', listed:true, url:'https://www.telink-semi.com/',
  tagline:'BLE Mesh/IoT 龙头 · 蓝牙物联网市占率14.5%',
  type:'BLE数传/Mesh/IoT SoC',
  desc:'泰凌微电子（Telink）科创板上市（2023），聚焦低功耗蓝牙（BLE）数传、Mesh 与 IoT 应用，BLE 物联网赛道市占率约 14.5%，产品覆盖智能家居、照明、传感器、车载与定位。',
  revenue:'约8亿元（2025，估算）', revenue2:'估算', revConf:0.5,
  products:'TLSR9系列（BLE Mesh/IoT）· TLSR8系列（BLE数传）', products2:'Mesh/数传/IoT',
  market:'BLE IoT/智能家居/照明/车载', market2:'IoT垂直行业',
  tech:'自研BLE协议栈 + 低功耗射频',
  productRows:[
    ['BLE SoC（旗舰）','TLSR9258系列','BT 5.4 + Mesh','智能家居/照明','¥2-4','IoT旗舰','0.68'],
    ['BLE SoC（主流）','TLSR922x系列','BT 5.3 + Mesh','传感器/定位','¥1.5-3','走量主力','0.65'],
    ['BLE数传','TLSR8258','BT 5.0','数传/外设','¥1-2','经典款','0.62'],
    ['车载/专用','TLSR9车载系列','BT 5.3','车联网','¥3-6','高附加值','0.50']
  ],
  productInsight:'泰凌微是“IoT 专业化”代表：TLSR9 系列以 BLE Mesh/Thread/Matter 协议能力覆盖智能家居与照明，出货以模组与行业客户为主，而非消费音频。',
  marketRows:[
    ['营收规模','约8亿元（2025，估算）','招股书+行业 [估算]','0.50'],
    ['BLE IoT市占率','约14.5%','行业报告 [报告]','0.72'],
    ['核心客户','智能家居/照明/模组厂','行业分析 [分析]','0.62'],
    ['技术路线','自研BLE协议栈','官网 [官网]','0.66'],
    ['目标市场','IoT/车载/定位','行业分析 [分析]','0.60']
  ],
  marketInsight:'泰凌微是易兆微在 BLE 数传/IoT 赛道最直接的对手之一：自研协议栈 + 模组生态成熟，市占率领先；但消费级品牌声量弱于杰理/恒玄。',
  strategyRows:[
    ['技术路线','自研BLE协议栈+低功耗射频','协议与功耗双壁垒','0.66'],
    ['市场聚焦','IoT/照明/车载垂直深耕','避开消费音频红海','0.62'],
    ['生态建设','模组+方案商网络','降低客户开发门槛','0.58'],
    ['资本运作','2023年科创板上市','研发与市场投入','0.68'],
    ['产品延伸','Matter/Thread多协议','智能家居标准卡位','0.55']
  ],
  evidenceChain:[
    { layer:'数据', text:'科创板上市（2023），TLSR9系列与BLE IoT市占率公开信息。', src:'招股书+行业报告 · 置信度 0.70' },
    { layer:'发现', text:'产品线聚焦IoT/照明/车载，与杰理/恒玄音频路线明显不同。', src:'官网产品矩阵 · 置信度 0.65' },
    { layer:'推论', text:'泰凌微以“协议+模组生态”深耕IoT，是易兆微在数传赛道最直接的竞品。', src:'产品/市场对比 · 置信度 0.60' },
    { layer:'建议', text:'易兆微应强化 POS/ETC 等行业认证与场景方案，在细分行业建立差异化。', src:'竞争态势分析 · 建议置信度 0.58' }
  ],
  trendRows:[
    ['1. Matter/Thread多协议普及','协议栈布局','12-18个月','0.55','⚠ 智能家居门槛提高'],
    ['2. 车载蓝牙放量','车载系列推进','18-24个月','0.50','车载市场争夺'],
    ['3. 模组生态继续扩大','方案商网络','12个月','0.58','IoT渠道竞争加剧']
  ],
  trendSummary:'最紧迫影响：泰凌微在 BLE IoT 赛道持续扩张，Matter/Thread 多协议将抬高智能家居芯片门槛；易兆微需加快垂直行业（POS/ETC/电子价签）方案沉淀。',
  customerRows:[
    ['智能家居模组厂（多家）','TLSR9258/TLSR922x','电商+行业','中'],
    ['照明方案商','TLSR922x','行业报告','中'],
    ['车载客户','TLSR9车载系列','招股书','低'],
    ['传感器模组厂','TLSR922x','论坛','高']
  ],
  concentration:'客户以模组厂与行业方案商为主，相对分散；替代机会以中小模组厂（价格敏感）为高。',
  drilldown:'公司级 → 芯片级：TLSR9258 客户列表可下钻（演示数据集）。',
  yichipProducts:'泰凌微是易兆微数传/IoT 赛道的直接竞品：易兆微应聚焦行业认证（POS/ETC/电子价签）+本地服务，避开其模组生态正面竞争。',
  conclusions:[
    { dim:'产品布局', summary:'TLSR9系列，BLE Mesh/IoT专业化', conf:0.65, level:'mid', refs:'官网产品线', sources:2 },
    { dim:'市场信息', summary:'BLE IoT市占率14.5%，营收约8亿（估算）', conf:0.60, level:'mid', refs:'行业报告/估算', sources:2 },
    { dim:'战略布局', summary:'协议+模组生态，垂直深耕IoT', conf:0.62, level:'mid', refs:'技术路线/生态', sources:2 },
    { dim:'趋势预判', summary:'Matter/Thread普及，车载延伸', conf:0.54, level:'mid', refs:'产品布局', sources:2 },
    { dim:'客户图谱', summary:'模组厂为主，中小客户替代机会高', conf:0.55, level:'mid', refs:'行业/论坛', sources:2 }
  ],
  conflicts:[{ id:'#1', title:'营收规模', desc:'行业估算口径不一。', strategy:'采用估算值并标注。', display:'显示“约8亿元（2025，估算）”。', visible:true }],
  checkNote:'泰凌微财务数据为行业估算，已标注；BLE IoT市占率引用行业报告（置信度0.72）。'
});

/* ---------------- 络达（联发科系） ---------------- */
CHIPINTEL.companies['络达(联发科系)'] = demoCompany({
  key:'络达(联发科系)', listed:false, url:'https://www.airoha.com/',
  tagline:'联发科旗下 · 品牌与ODM音频SoC',
  type:'蓝牙音频 SoC（品牌/ODM）',
  desc:'络达（Airoha）为联发科旗下子公司，蓝牙音频 SoC 覆盖 TWS、音箱与助听/辅听市场，客户以品牌与 ODM 厂商为主，主打稳定连接与专业音频。',
  revenue:'未单独披露', revenue2:'—', revConf:0.3,
  products:'AB1565系列（TWS）· AB155x（音箱/音频）', products2:'TWS/音箱/辅听',
  market:'品牌TWS与ODM市场', market2:'品牌+ODM',
  tech:'联发科平台整合 + 成熟音频方案',
  productRows:[
    ['TWS主控（高端）','AB1565系列','BT 5.3 + LE','品牌TWS','¥6-9','品牌市场','0.62'],
    ['TWS主控（主流）','AB1562系列','BT 5.2','TWS/ODM','¥4-6','ODM主力','0.60'],
    ['音箱/音频','AB155x系列','BT 5.0','音箱/音频','¥2-5','通用','0.52'],
    ['辅听/医疗','AB157x系列','BT 5.3','助听/辅听','¥8-15','高附加值','0.45']
  ],
  productInsight:'络达借力联发科平台与供应链，主打“稳定 + ODM 友好”，价格带介于恒玄与杰理之间，是品牌客户的多供应商选择。',
  marketRows:[
    ['营收规模','未单独披露','—','0.30'],
    ['核心客户','品牌与ODM厂商','行业分析 [分析]','0.55'],
    ['技术路线','联发科平台整合','官网 [官网]','0.55'],
    ['价格策略','中高端，¥4-9','电商 [电商]','0.55'],
    ['目标市场','品牌TWS/音箱/辅听','行业分析 [分析]','0.52']
  ],
  marketInsight:'络达以联发科资源为后盾，在品牌与 ODM 市场具备稳定供货与成本优势；辅听/医疗是其高附加值新方向。',
  strategyRows:[
    ['技术路线','联发科平台整合','供应链与成本优势','0.55'],
    ['客户结构','品牌+ODM','稳定订单','0.58'],
    ['产品延伸','TWS→辅听/医疗','高附加值新赛道','0.48'],
    ['生态协同','联发科生态','平台协同','0.52']
  ],
  evidenceChain:[
    { layer:'数据', text:'联发科旗下Airoha，AB1565等产品公开信息。', src:'官网+行业 · 置信度 0.60' },
    { layer:'发现', text:'价格带¥4-9，介于恒玄与杰理之间。', src:'电商 · 置信度 0.55' },
    { layer:'推论', text:'络达是品牌客户“第二/第三供应商”的常见选择。', src:'客户结构分析 · 置信度 0.55' },
    { layer:'建议', text:'易兆微可关注其未覆盖的行业音频细分。', src:'竞争态势分析 · 建议置信度 0.50' }
  ],
  trendRows:[
    ['1. 辅听/医疗音频放量','AB157x布局','12-24个月','0.45','医疗音频新赛道'],
    ['2. 与联发科平台协同加深','生态整合','12个月','0.50','平台化竞争加剧']
  ],
  trendSummary:'络达的威胁主要在品牌/ODM 市场与辅听等新赛道；对易兆微当前数传/IoT 市场影响有限。',
  customerRows:[
    ['品牌TWS客户（多家）','AB1565','拆解+BQB','低'],
    ['ODM厂商','AB1562','行业报告','中'],
    ['辅听设备商','AB157x','BQB认证','低']
  ],
  concentration:'客户以品牌与 ODM 为主，集中度中等；替代机会以 ODM 厂商（多供应商）为中。',
  drilldown:'公司级 → 芯片级：暂无公开下钻数据（演示数据集）。',
  yichipProducts:'络达聚焦品牌/ODM音频；易兆微可避开其主战场，专注行业数传与安全芯片组合。',
  conclusions:[
    { dim:'产品布局', summary:'AB1565/AB155x，品牌+ODM+辅听', conf:0.58, level:'mid', refs:'官网', sources:2 },
    { dim:'市场信息', summary:'营收未单独披露', conf:0.30, level:'low', refs:'—', sources:1 },
    { dim:'战略布局', summary:'联发科平台协同+辅听新赛道', conf:0.52, level:'mid', refs:'产品线', sources:2 },
    { dim:'趋势预判', summary:'辅听/医疗放量', conf:0.45, level:'low', refs:'产品布局', sources:1 },
    { dim:'客户图谱', summary:'品牌+ODM，中等集中度', conf:0.52, level:'mid', refs:'行业分析', sources:1 }
  ],
  conflicts:[{ id:'#1', title:'营收规模', desc:'络达财务数据未单独披露。', strategy:'标注“未披露”。', display:'“未单独披露”。', visible:true }],
  checkNote:'络达为联发科子公司，财务数据未单独披露；其余结论基于官网与行业公开信息。'
});

/* ---------------- 高通（Qualcomm） ---------------- */
CHIPINTEL.companies['高通'] = demoCompany({
  key:'高通', listed:true, url:'https://www.qualcomm.com/',
  tagline:'全球半导体巨头 · 高端音频标杆',
  type:'旗舰蓝牙音频 SoC（骁龙生态）',
  desc:'高通（Qualcomm）以骁龙平台与 Snapdragon Sound 定义高端音频体验，蓝牙音频芯片（QCC 系列）覆盖旗舰 TWS、音箱与车机，是高端市场的技术与生态标杆。',
  revenue:'全球营收（含手机等全业务）', revenue2:'全业务口径', revConf:0.3,
  products:'QCC5171/QCC5151（Snapdragon Sound）', products2:'旗舰TWS/音箱',
  market:'高端旗舰与车机', market2:'全球高端',
  tech:'骁龙生态 + aptX无损 + 低功耗',
  productRows:[
    ['旗舰TWS','QCC5171','BT 5.3 + LE','旗舰TWS','¥10-20','高端标杆','0.62'],
    ['主流TWS','QCC5151','BT 5.2','中高端TWS','¥8-15','骁龙生态','0.58'],
    ['音箱/音频','QCC3056','BT 5.2','智能音箱','¥6-12','全场景','0.52'],
    ['车机音频','高通座舱平台','BT 5.3','车机','¥20+','高附加值','0.50']
  ],
  productInsight:'高通以“骁龙生态 + aptX 无损音质”定义高端：QCC 系列价格带 ¥8-20，是白牌厂商难以企及的技术与品牌天花板。',
  marketRows:[
    ['营收规模','全业务口径（含手机等）','财报 [财报]','0.30'],
    ['核心客户','苹果/三星/安卓旗舰','行业分析 [分析]','0.68'],
    ['技术路线','骁龙生态+aptX','官网 [官网]','0.66'],
    ['价格策略','高端，¥8-20','电商 [电商]','0.58'],
    ['目标市场','旗舰TWS/车机','行业分析 [分析]','0.60']
  ],
  marketInsight:'高通的威胁不在价格战，而在“生态标准”：Snapdragon Sound 定义无损音频体验，车机与旗舰市场其地位难以撼动。',
  strategyRows:[
    ['技术路线','aptX无损+低功耗','音频体验标准制定者','0.66'],
    ['生态建设','骁龙生态+合作品牌','生态锁定','0.64'],
    ['市场布局','旗舰/车机高附加值','避开低价市场','0.62'],
    ['资本运作','全球巨头','持续研发投入','0.70']
  ],
  evidenceChain:[
    { layer:'数据', text:'QCC系列与Snapdragon Sound公开信息。', src:'官网+行业 · 置信度 0.66' },
    { layer:'发现', text:'价格带¥8-20，显著高于国产厂商。', src:'电商 · 置信度 0.58' },
    { layer:'推论', text:'高通以生态标准而非价格参与竞争。', src:'生态分析 · 置信度 0.62' },
    { layer:'建议', text:'易兆微无需对标高通高端市场，聚焦国产替代窗口。', src:'竞争态势分析 · 建议置信度 0.55' }
  ],
  trendRows:[
    ['1. Snapdragon Sound生态扩张','合作品牌增加','12-18个月','0.60','高端标准固化'],
    ['2. 车机音频升级','座舱平台迭代','18-24个月','0.55','车机门槛提高']
  ],
  trendSummary:'高通持续定义高端音频标准，但不会下探白牌价格带；对易兆微的直接影响有限，间接抬高品牌市场门槛。',
  customerRows:[
    ['苹果（间接，平台生态）','骁龙平台','行业分析','低'],
    ['三星 Galaxy Buds','QCC系列','拆解+BQB','低'],
    ['安卓旗舰品牌','QCC系列','拆解报告','低']
  ],
  concentration:'客户为全球顶级品牌，深度绑定，替代机会整体为“低”。',
  drilldown:'公司级 → 芯片级：高通芯片客户以旗舰品牌为主（演示数据集）。',
  yichipProducts:'高通占据高端标准；易兆微应聚焦国产化替代与垂直行业市场，不与其正面竞争。',
  conclusions:[
    { dim:'产品布局', summary:'QCC系列，旗舰TWS+车机', conf:0.60, level:'mid', refs:'官网', sources:2 },
    { dim:'市场信息', summary:'全球巨头，全业务口径', conf:0.45, level:'low', refs:'财报/行业', sources:2 },
    { dim:'战略布局', summary:'生态标准制定者', conf:0.64, level:'mid', refs:'Snapdragon Sound', sources:2 },
    { dim:'趋势预判', summary:'高端标准固化，车机升级', conf:0.58, level:'mid', refs:'产品路线图', sources:2 },
    { dim:'客户图谱', summary:'顶级品牌深度绑定', conf:0.55, level:'mid', refs:'拆解/BQB', sources:2 }
  ],
  conflicts:[{ id:'#1', title:'营收规模', desc:'高通为全业务口径，无法拆分音频芯片营收。', strategy:'标注“全业务口径”。', display:'“全业务口径”。', visible:true }],
  checkNote:'高通数据为全业务公开信息；音频芯片细分营收未单独披露，已标注。'
});

