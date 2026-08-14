/* ============================================================
   ChipIntel Agent — UI 渲染与交互层
   ============================================================ */
window.CHIPINTEL = window.CHIPINTEL || {};
var UI = CHIPINTEL.UI = {};

/* ---------- 工具 ---------- */
UI.esc = function(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
  });
};
UI.stars = function(n){
  n = Math.max(0, Math.min(5, n||0));
  return '<span style="color:var(--warn)">' + '★'.repeat(n) + '</span><span style="color:var(--rule-strong)">' + '☆'.repeat(5-n) + '</span>';
};
UI.confPill = function(v, showVal){
  if (v == null){ return '<span class="conf none"><span class="dot"></span>不足</span>'; }
  var lvl = confLevel(v);
  var num = (typeof v === 'number') ? v.toFixed(2) : v;
  return '<span class="conf ' + lvl + '"><span class="dot"></span>' + confLabel(lvl) + (showVal === false ? '' : ' ' + num) + '</span>';
};
UI.toast = function(msg, type){
  var box = document.getElementById('toast');
  if (!box) return;
  var el = document.createElement('div');
  el.className = 'toast-item ' + (type || '');
  el.textContent = msg;
  box.appendChild(el);
  box.classList.add('show');
  setTimeout(function(){
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    setTimeout(function(){ el.remove(); if (!box.children.length){ box.classList.remove('show'); } }, 300);
  }, 2600);
};
UI.openModal = function(icon, title, html){
  document.getElementById('modalIcon').textContent = icon || '🔎';
  document.getElementById('modalTitle').textContent = title || '详情';
  document.getElementById('modalBody').innerHTML = html || '';
  document.getElementById('modal').hidden = false;
  document.body.style.overflow = 'hidden';
};
UI.closeModal = function(){
  document.getElementById('modal').hidden = true;
  document.body.style.overflow = '';
};
UI.modalSrc = function(src){
  var s = CHIPINTEL.SOURCES[src.type] || {};
  return '<p style="margin-bottom:10px">来源类型：<b>' + UI.esc(s.label || src.type) + '</b> ' + UI.stars(src.stars || s.stars) +
    ' · 可信度权重 ' + (s.weight || '—') + '</p>' +
    '<p style="margin-bottom:10px">采集时间：<span class="mono">' + UI.esc(src.time || '—') + '</span></p>' +
    '<p style="margin-bottom:10px">数据条数：<b>' + (src.items || '—') + '</b> 条 · 状态：' + UI.esc(src.status || '已验证') + '</p>' +
    '<p style="word-break:break-all"><a href="' + UI.esc(src.url || '#') + '" target="_blank" rel="noopener">' + UI.esc(src.url || '') + '</a> ↗</p>';
};

/* ---------- 通用表格渲染 ---------- */
UI.renderTable = function(cols, rows, opts){
  opts = opts || {};
  var h = '<div class="tbl-wrap' + (opts.limit ? ' limit' : '') + '"><table class="' + (opts.matrix ? 'matrix ' : '') + '">' +
    '<thead><tr>' + cols.map(function(c){ return '<th>' + UI.esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>';
  rows.forEach(function(r){
    h += '<tr>' + r.map(function(cell, ci){
      if (cell && typeof cell === 'object'){
        return '<td>' + (cell.html || '') + '</td>';
      }
      return '<td>' + UI.esc(cell == null ? '—' : cell) + '</td>';
    }).join('') + '</tr>';
  });
  h += '</tbody></table></div>';
  return h;
};

/* ---------- 证据链 ---------- */
UI.evidenceChain = function(chain){
  var layers = [{n:'数据', i:'📄'},{n:'发现', i:'🔍'},{n:'推论', i:'🧠'},{n:'建议', i:'💡'}];
  return '<div class="evidence-chain">' + (chain||[]).map(function(ev, i){
    var l = layers[i] || { n:'步骤'+(i+1), i:'•' };
    return '<div class="ev-layer"><div class="ev-num"><b>' + l.i + ' ' + l.n + '</b><span>第' + (i+1) + '层</span></div>' +
      '<div class="ev-body"><p>' + UI.esc(ev.text || '') + '</p>' +
      '<div class="ev-meta"><span class="src-cite">' + UI.esc(ev.src || '') + '</span></div></div></div>';
  }).join('') + '</div>';
};

/* ---------- 页头 ---------- */
UI.sectionHead = function(kicker, title, desc){
  return '<div class="section-head"><span class="kicker">' + UI.esc(kicker) + '</span>' +
    (title ? '<h2>' + UI.esc(title) + '</h2>' : '') +
    (desc ? '<div class="desc">' + UI.esc(desc) + '</div>' : '') + '</div>';
};

/* ---------- 模式与导航 ---------- */
UI.setMode = function(mode){
  CHIPINTEL.state.mode = mode;
  CHIPINTEL.state.stage = 'idle';
  CHIPINTEL.state.subject = (mode === 'company') ? '杰理科技' : 'STM32F103';
  var btns = document.querySelectorAll('#modeSwitch button');
  btns.forEach(function(b){ b.classList.toggle('active', b.dataset.mode === mode); });
  UI.renderHome();
  UI.nav('home');
  UI.toast(mode === 'company' ? '已切换：公司级战略分析' : '已切换：芯片级分析', '');
};
UI.nav = function(view){
  CHIPINTEL.state.view = view;
  var btns = document.querySelectorAll('#mainNav button');
  btns.forEach(function(b){ b.classList.toggle('active', b.dataset.view === view); });
  document.querySelectorAll('.view').forEach(function(v){ v.classList.remove('active'); });
  var el = document.getElementById('view-' + view);
  if (!el) view = 'home', el = document.getElementById('view-home');
  el.classList.add('active');
  window.scrollTo({ top:0, behavior:'smooth' });
  UI.updatePipeline();
  if (view === 'home') UI.renderHome();
  else if (view === 'collect') UI.renderCollect();
  else if (view === 'validate') UI.renderValidate();
  else if (view === 'analyze') UI.renderAnalyze();
  else if (view === 'report') UI.renderReport();
  else if (view === 'trace') UI.renderTrace();
};
UI.updatePipeline = function(){
  var map = { home:0, collect:1, validate:2, analyze:3, report:4, trace:5 };
  var cur = map[CHIPINTEL.state.view] || 0;
  var stage = CHIPINTEL.state.stage;
  var doneMap = { collected:1, validated:2, analyzed:3 };
  var home = document.getElementById('homePipeline');
  if (!home) return;
  var steps = ['首页','采集','校验','分析','报告','溯源'];
  home.innerHTML = steps.map(function(s, i){
    var done = false, active = (i === cur);
    if (i === 0) done = true;
    if (i === 1 && (stage === 'collected' || stage === 'validated' || stage === 'analyzed')) done = true;
    if (i === 2 && (stage === 'validated' || stage === 'analyzed')) done = true;
    if (i === 3 && stage === 'analyzed') done = true;
    var cls = done ? 'done' : (active ? 'active' : '');
    return '<span class="pipe-step ' + cls + '"><span class="dot">' + (done && i > 0 ? '✓' : (i+1)) + '</span>' + s + '</span>' +
      (i < steps.length-1 ? '<span class="pipe-arrow">→</span>' : '');
  }).join('');
};

/* ---------- 首页 ---------- */
UI.renderHome = function(){
  var el = document.getElementById('view-home');
  var chipMode = CHIPINTEL.isChip();
  var quickChips = Object.keys(CHIPINTEL.chips);
  var quickCos = Object.keys(CHIPINTEL.companies);
  el.innerHTML =
    '<div class="hero">' +
      '<div class="hero-badge">◈ AI蓝牙芯片竞品情报Agent · PRD v3.1 双模式·客户情报增强版</div>' +
      '<h1>' + (chipMode ? '芯片级分析：单颗芯片的 6 维营销情报' : '公司级分析：友商战略全貌与对易兆微启示') + '</h1>' +
      '<p>输入芯片型号或友商公司名称，Agent 自动执行 <b>采集 → 校验 → 分析 → 报告 → 溯源</b> 闭环：每个结论都带证据链，每条数据都可追溯原始来源。</p>' +
      '<div class="hero-meta">' +
        '<span>📅 生成日期 2026-08-13</span>' +
        '<span>🏢 背景公司 易兆微电子（杭州）</span>' +
        '<span>🎯 赛道 蓝牙芯片（BLE/音频/数传）</span>' +
      '</div>' +
    '</div>' +
    '<div class="pipeline" id="homePipeline"></div>' +
    '<div class="mode-grid">' +
      '<div class="mode-card' + (chipMode ? ' selected' : '') + '" data-mode-card="chip" role="button" tabindex="0">' +
        '<div class="mode-icon">🔬</div><h3>模式A · 芯片级分析</h3>' +
        '<p>输入芯片型号（如 BT8912F、STM32F103），输出产品定位/价格/渠道/话术/技术/客户 6 维分析 + 芯片级客户情报与替代机会。</p>' +
        '<div class="tags"><span class="tag ai">6维度</span><span class="tag new">客户情报</span><span class="tag ghost">证据链</span></div>' +
      '</div>' +
      '<div class="mode-card' + (!chipMode ? ' selected' : '') + '" data-mode-card="company" role="button" tabindex="0">' +
        '<div class="mode-icon">🏢</div><h3>模式B · 公司级分析</h3>' +
        '<p>输入友商公司名称（如 杰理科技），输出产品布局/市场画像/战略布局/趋势预判/客户图谱 5 维战略分析 + 对易兆微启示。</p>' +
        '<div class="tags"><span class="tag must">5维度</span><span class="tag new">客户图谱</span><span class="tag ai">战略预判</span></div>' +
      '</div>' +
    '</div>' +
    '<div class="input-panel">' +
      '<div class="field"><label for="homeSubject">' + (chipMode ? '输入芯片型号（Agent 将自动规划采集方案）' : '输入友商公司名称（Agent 将自动识别并分析该公司全貌）') + '</label>' +
      '<div class="input-row"><input class="input" id="homeSubject" list="homeQuick" placeholder="' + (chipMode ? '例如：BT8912F、STM32F103、YC1308' : '例如：杰理科技、中科蓝讯、恒玄科技') + '" value="' + UI.esc(CHIPINTEL.currentLabel()) + '">' +
      '<datalist id="homeQuick">' + (chipMode ? quickChips : quickCos).map(function(k){ return '<option value="' + UI.esc(k) + '">'; }).join('') + '</datalist>' +
      '<button class="btn btn-primary" id="homeStart">▶ 启动Agent分析</button></div>' +
      '<div class="quick-picks"><span class="lbl">快速选择：</span>' +
      (chipMode ? quickChips : quickCos).map(function(k){
        var active = CHIPINTEL.state.subject === k ? ' active' : '';
        return '<button class="chip' + active + '" data-quick="' + UI.esc(k) + '">' + UI.esc(k) + '</button>';
      }).join('') +
      '</div></div>' +
    '</div>' +
    '<div class="grid grid-4">' +
      '<div class="metric-card"><div class="m-label">📐 数据严谨</div><div class="m-value">≥2<small> 源</small></div><div class="m-desc">高置信结论的最低交叉验证</div></div>' +
      '<div class="metric-card"><div class="m-label">🔗 证据链</div><div class="m-value">4<small> 层</small></div><div class="m-desc">数据→发现→推论→建议</div></div>' +
      '<div class="metric-card"><div class="m-label">📊 可视化</div><div class="m-value">6<small> 种</small></div><div class="m-desc">散点/柱状/雷达/热力等</div></div>' +
      '<div class="metric-card"><div class="m-label">🔁 闭环自检</div><div class="m-value">100<small>%</small></div><div class="m-desc">缺口自动回补·结论可追溯</div></div>' +
    '</div>' +
    '<div class="grid grid-2" style="margin-top:16px">' +
      '<div class="card"><h3><span class="ic">🛡️</span>数据严谨性三重保障</h3>' +
        '<p class="sub" style="margin-bottom:8px">交叉验证 · 置信度评分 · 冲突透明化</p>' +
        '<p class="sub">每个关键数据点至少标注 1 个信息源；高置信度结论需 ≥2 个独立来源交叉验证；来源冲突时保留全部值并标注，不黑箱处理。</p></div>' +
      '<div class="card"><h3><span class="ic">🧠</span>分析可信度三重保障</h3>' +
        '<p class="sub" style="margin-bottom:8px">证据链推理 · 结论自检 · 幻觉防护</p>' +
        '<p class="sub">LLM 输出必须包含 4 层推理链；系统逆向验证引用数据是否真实存在；幻觉引用自动降级或标记“待验证”。</p></div>' +
    '</div>';

  // 事件绑定
  var start = document.getElementById('homeStart');
  start.addEventListener('click', function(){
    var v = document.getElementById('homeSubject').value.trim();
    UI.applySubject(v);
  });
  document.getElementById('homeSubject').addEventListener('keydown', function(e){
    if (e.key === 'Enter'){ var v = this.value.trim(); UI.applySubject(v); }
  });
  el.querySelectorAll('[data-mode-card]').forEach(function(card){
    var fn = function(){ UI.setMode(card.dataset.modeCard); };
    card.addEventListener('click', fn);
    card.addEventListener('keydown', function(e){ if (e.key === 'Enter') fn(); });
  });
  el.querySelectorAll('.chip[data-quick]').forEach(function(c){
    c.addEventListener('click', function(){
      UI.setSubject(c.dataset.quick);
      UI.nav('collect');
    });
  });
  UI.updatePipeline();
};

UI.applySubject = function(v){
  if (!v){ UI.toast('请输入' + (CHIPINTEL.isChip() ? '芯片型号' : '公司名称'), 'warn'); return; }
  var found = UI.setSubject(v);
  if (found){ UI.nav('collect'); }
};
UI.setSubject = function(key){
  var data = CHIPINTEL.isChip() ? CHIPINTEL.chips[key] : CHIPINTEL.companies[key];
  if (!data){
    // 尝试模糊匹配
    var keys = Object.keys(CHIPINTEL.isChip() ? CHIPINTEL.chips : CHIPINTEL.companies);
    var hit = keys.find(function(k){ return k.toLowerCase().indexOf(key.toLowerCase()) >= 0; });
    if (hit){ data = CHIPINTEL.isChip() ? CHIPINTEL.chips[hit] : CHIPINTEL.companies[hit]; key = hit; }
  }
  if (!data){
    UI.toast('未识别：' + key + '（演示数据集支持：' + (CHIPINTEL.isChip() ? Object.keys(CHIPINTEL.chips).join('、') : Object.keys(CHIPINTEL.companies).join('、')) + '）', 'err');
    return false;
  }
  CHIPINTEL.state.subject = key;
  CHIPINTEL.state.stage = 'idle';
  CHIPINTEL.state.integrityChecked = false;
  return true;
};

/* ---------- 采集视图 ---------- */
UI.renderCollect = function(){
  var el = document.getElementById('view-collect');
  var data = CHIPINTEL.current();
  var chip = CHIPINTEL.isChip();
  el.innerHTML =
    UI.sectionHead(chip ? 'Module 05 · 智能采集引擎' : 'Module 10 · 公司级采集引擎',
      (chip ? '芯片级采集 — ' : '公司级采集 — ') + UI.esc(data.label),
      chip ? 'Agent 自动规划 6维度×6来源采集矩阵，分源并行采集，采集完成后执行缺口检测与闭环回补。'
           : 'Agent 自动采集公司全貌信息（官网/行业/招股/电商/新闻/论坛），交叉校验后生成置信度评分。') +
    '<div class="input-panel">' +
      '<div class="field"><label for="collectInput">' + (chip ? '输入芯片型号' : '输入友商公司名称') + '</label>' +
      '<div class="input-row">' +
        '<input class="input" id="collectInput" list="collectQuick" value="' + UI.esc(data.label) + '">' +
        '<datalist id="collectQuick">' + Object.keys(chip ? CHIPINTEL.chips : CHIPINTEL.companies).map(function(k){ return '<option value="' + UI.esc(k) + '">'; }).join('') + '</datalist>' +
        '<button class="btn btn-primary" id="collectBtn">▶ 启动Agent采集</button>' +
      '</div>' +
      '<div class="quick-picks"><span class="lbl">快速选择：</span>' +
      Object.keys(chip ? CHIPINTEL.chips : CHIPINTEL.companies).map(function(k){
        return '<button class="chip' + (CHIPINTEL.state.subject === k ? ' active' : '') + '" data-quick="' + UI.esc(k) + '">' + UI.esc(k) + '</button>';
      }).join('') + '</div>' +
    '</div>' +
    '<div class="card" style="margin-bottom:16px">' +
      '<h3><span class="ic">🗺️</span>Agent 采集规划</h3>' +
      '<p class="sub" id="planIntro" style="margin-bottom:10px"></p>' +
      '<div id="planMatrix"></div>' +
    '</div>' +
    '<div class="card" style="margin-bottom:16px">' +
      '<h3><span class="ic">⚡</span>分源并行采集进度</h3>' +
      '<div class="progress-bar"><span id="collectProgress"></span></div>' +
      '<div id="collectSteps"></div>' +
      '<div class="agent-log" id="collectLog" style="display:none"></div>' +
    '</div>' +
    '<div id="collectResult" style="display:none"></div>' +
    '<div id="collectGap" style="display:none"></div>' +
    '<div class="no-print" id="collectNext" style="display:none;margin-top:14px;gap:10px;flex-wrap:wrap">' +
    '</div>';

  document.getElementById('collectInput').addEventListener('keydown', function(e){
    if (e.key === 'Enter'){ UI.setSubject(this.value.trim()) && UI.renderCollect(); }
  });
  document.getElementById('collectBtn').addEventListener('click', function(){
    var v = document.getElementById('collectInput').value.trim();
    if (v && v !== data.label){ UI.setSubject(v); }
    CHIPINTEL.startCollect();
  });
  el.querySelectorAll('.chip[data-quick]').forEach(function(c){
    c.addEventListener('click', function(){
      UI.setSubject(c.dataset.quick);
      UI.renderCollect();
    });
  });
  UI.renderPlan(data, chip);
};

UI.renderPlan = function(data, chip){
  var intro = document.getElementById('planIntro');
  var box = document.getElementById('planMatrix');
  if (!box) return;
  if (intro){ intro.textContent = data.plan ? data.plan.intro : ''; }
  var h = '';
  if (chip){
    var srcs = ['official','datasheet','ecommerce','media','forum','social'];
    var rows = data.plan ? data.plan.matrix : [];
    h = '<div class="tbl-wrap"><table class="matrix" style="min-width:640px"><thead><tr><th>分析维度</th>';
    srcs.forEach(function(k){
      var s = CHIPINTEL.SOURCES[k];
      h += '<th>' + s.icon + ' ' + UI.esc(s.label) + '<br><span style="font-weight:400;font-size:.68rem">' + UI.stars(s.stars) + '</span></th>';
    });
    h += '</tr></thead><tbody>';
    rows.forEach(function(r){
      h += '<tr><td><b>' + UI.esc(r.dim) + '</b></td>';
      r.cells.forEach(function(c){
        h += c ? '<td class="planned">✓ 规划</td>' : '<td class="skip">—</td>';
      });
      h += '</tr>';
    });
    h += '</tbody></table></div><p class="sub" style="margin-top:6px">' + UI.esc(data.plan ? data.plan.note : '') + '</p>';
  } else {
    h = '<div class="tbl-wrap"><table style="min-width:640px"><thead><tr><th>#</th><th>采集任务</th><th>说明</th><th>预计耗时</th></tr></thead><tbody>';
    (data.steps || []).forEach(function(s, i){
      h += '<tr><td><b>' + (i+1) + '</b></td><td><b>' + UI.esc(s.label) + '</b></td><td class="cell-sub">' + UI.esc(s.detail) + '</td><td class="cell-sub">并行执行</td></tr>';
    });
    h += '</tbody></table></div>';
  }
  box.innerHTML = h;
};

/* ---------- 采集结果概览 ---------- */
UI.renderResults = function(data, supplemented){
  var box = document.getElementById('collectResult');
  if (!box) return;
  var r = data.results;
  box.style.display = 'block';
  box.innerHTML =
    '<div class="card"><h3><span class="ic">📋</span>采集结果概览 ' +
      UI.confPill(r.confidence) + (supplemented ? '<span class="tag new">已补充采集</span>' : '') + '</h3>' +
    '<div class="grid grid-3" style="margin-top:10px">' +
      '<div class="metric-card"><div class="m-label">📥 数据条目</div><div class="m-value">' + r.items + '<small> 条</small></div><div class="m-desc">' + UI.esc(r.itemsDesc) + '</div></div>' +
      '<div class="metric-card"><div class="m-label">🌐 来源数</div><div class="m-value">' + r.sourcesSuccess + '/' + (r.sourcesSuccess + r.sourcesFail) + '<small> 个</small></div><div class="m-desc">' + UI.esc(r.sourcesDesc) + '</div></div>' +
      '<div class="metric-card"><div class="m-label">🧩 维度覆盖</div><div class="m-value">' + UI.esc(r.coverage) + '</div><div class="m-desc">' + UI.esc(r.coverageDesc) + '</div></div>' +
      '<div class="metric-card"><div class="m-label">🔀 交叉验证</div><div class="m-value">' + r.crossValidated + '<small> 条</small></div><div class="m-desc">' + UI.esc(r.crossDesc) + '</div></div>' +
      '<div class="metric-card"><div class="m-label">⚠️ 数据冲突</div><div class="m-value">' + r.conflicts + '<small> 条</small></div><div class="m-desc">' + UI.esc(r.conflictDesc) + '</div></div>' +
      '<div class="metric-card"><div class="m-label">🕳️ 数据缺口</div><div class="m-value">' + r.gaps.length + '<small> 处</small></div><div class="m-desc">缺口自动检测</div></div>' +
    '</div></div>';
  var next = document.getElementById('collectNext');
  if (next){
    next.style.display = 'flex';
    next.innerHTML =
      '<button class="btn btn-success" onclick="CHIPINTEL.UI.goValidate()">下一步：进入校验 →</button>';
  }
};
UI.gapProgressText = function(data){
  var r = data.results;
  var total = 0, improved = 0;
  (r.gaps||[]).forEach(function(g){ total++; if (g.coverage < 60){ improved++; } });
  return '缺口维度 ' + total + ' 处，' + improved + ' 处覆盖率已提升至 60% 以上';
};
UI.gapResolvedText = function(data){
  var r = data.results;
  return (r.gaps||[]).map(function(g){ return '“' + g.dim + '” 覆盖率 ' + g.coverage + '% → ' + Math.min(92, g.coverage + 28) + '%'; }).join('；');
};
UI.renderGap = function(data){
  var box = document.getElementById('collectGap');
  if (!box) return;
  var gaps = (data.results && data.results.gaps) || [];
  if (!gaps.length){ box.style.display = 'none'; return; }
  box.style.display = 'block';
  box.innerHTML = gaps.map(function(g){
    return '<div class="callout warn"><div class="label">🕳️ 缺口检测 — ' + UI.esc(g.dim) + '</div>' +
      '<p><b>' + UI.esc(g.dim) + '</b> 维度数据覆盖率 <b>' + g.coverage + '%</b>（阈值60%）· ' + UI.esc(g.suggest) + '</p></div>';
  }).join('') +
  '<div class="no-print" style="display:flex;gap:10px;flex-wrap:wrap">' +
    '<button class="btn btn-primary" onclick="CHIPINTEL.triggerSupplement()">↻ 触发补充采集</button>' +
    '<button class="btn" onclick="CHIPINTEL.skipSupplement()">跳过，继续分析</button>' +
  '</div>';
};
UI.goValidate = function(){
  CHIPINTEL.state.stage = 'collected';
  UI.nav('validate');
};

/* ---------- 校验视图 ---------- */
UI.renderValidate = function(){
  var el = document.getElementById('view-validate');
  var data = CHIPINTEL.current();
  var chip = CHIPINTEL.isChip();
  var v = data.validation;
  el.innerHTML =
    UI.sectionHead('Module 06 · 数据清洗与交叉校验',
      '数据校验 — ' + UI.esc(data.label),
      '格式归一化 → 交叉验证 → 冲突处理 → 置信度评分 → 输出结构化数据包（作为分析引擎输入）。') +
    '<div class="card" style="margin-bottom:16px">' +
      '<h3><span class="ic">🔀</span>交叉验证表 — ' + UI.esc(data.label) + ' 关键数据点</h3>' +
      '<p class="sub" style="margin-bottom:8px">同一数据点从不同来源获取的值，验证状态：一致 / 基本一致 / 冲突 / 单源。</p>' +
      UI.renderTable(['数据点','来源1','来源2','来源3','验证状态','置信度'],
        (v.rows||[]).map(function(r){
          var cells = [ { html:'<span class="cell-title">' + UI.esc(r.point) + '</span>' } ];
          for (var i = 0; i < 3; i++){
            var src = r.values[i];
            cells.push(src
              ? { html:'<span class="cell-title">' + UI.esc(src.val) + '</span><span class="cell-sub">[' + UI.esc(src.src) + ']' + (src.note ? ' ' + UI.esc(src.note) : '') + '</span>' }
              : '—');
          }
          cells.push({ html:'<span class="tag ' + (r.status.indexOf('冲突') >= 0 ? 'must' : (r.status.indexOf('单源') >= 0 ? 'ghost' : 'new')) + '">' + UI.esc(r.status) + '</span>' });
          cells.push({ html:UI.confPill(r.conf) });
          return cells;
        })
      ) + '</div>';

  // 冲突处理
  if (v.conflicts && v.conflicts.length){
    el.innerHTML += '<div class="card" style="margin-bottom:16px"><h3><span class="ic">⚠️</span>冲突处理 — Agent 透明策略</h3>';
    v.conflicts.forEach(function(c){
      el.innerHTML += '<div class="conflict-card"><div class="c-head"><h4>冲突记录 ' + UI.esc(c.id || '') + ' — ' + UI.esc(c.title) + '</h4>' +
        '<span class="tag must">不掩盖冲突</span></div>' +
        '<p class="sub" style="margin-bottom:8px">' + UI.esc(c.desc) + '</p>' +
        '<div class="c-list"><div class="c-item"><div class="s">Agent 处理策略</div><div class="v" style="font-size:.78rem">' + UI.esc(c.strategy) + '</div></div>' +
        '<div class="c-item"><div class="s">报告展示</div><div class="v" style="font-size:.78rem">' + UI.esc(c.display) + '</div></div></div></div>';
    });
    el.innerHTML += '</div>';
  }

  // 置信度分解
  el.innerHTML += '<div class="card" style="margin-bottom:16px"><h3><span class="ic">🧮</span>置信度评分分解</h3>' +
    '<p class="sub" style="margin-bottom:8px">置信度 = 来源权重 × 新鲜度 × 交叉验证</p>' +
    UI.renderTable(['数据点','来源权重','× 新鲜度','× 交叉验证','= 置信度','等级'],
      (v.decomposition||[]).map(function(d){
        return [
          { html:'<b>' + UI.esc(d.point) + '</b>' + (d.note ? '<br><span class="cell-sub">' + UI.esc(d.note) + '</span>' : '') },
          d.factors[0], d.factors[1], d.factors[2],
          { html:'<b class="mono">' + UI.esc(d.conf) + '</b>' },
          { html:UI.confPill(confLevel(d.level === 'high' ? 0.8 : d.level === 'mid' ? 0.6 : 0.3), false) }
        ];
      })
    ) +
    '<p class="sub" style="margin-top:6px">' + UI.esc(v.formula || '') + '</p></div>';

  // 统计
  el.innerHTML += '<div class="grid grid-3" style="margin:4px 0 16px">' +
    '<div class="metric-card"><div class="m-label">📦 总数据条目</div><div class="m-value">' + v.stats.total + '</div><div class="m-desc">' + UI.esc(data.label) + '</div></div>' +
    '<div class="metric-card"><div class="m-label">✅ 交叉验证通过</div><div class="m-value">' + v.stats.passed + '</div><div class="m-desc" style="color:var(--success)">' + UI.esc(v.stats.passedDesc) + '</div></div>' +
    '<div class="metric-card"><div class="m-label">⚠️ 冲突/单源</div><div class="m-value">' + v.stats.conflictSingle + '</div><div class="m-desc" style="color:var(--warn)">' + UI.esc(v.stats.csDesc) + '</div></div>' +
    '</div>' +
    '<div class="no-print" style="display:flex;gap:10px;flex-wrap:wrap">' +
      '<button class="btn" onclick="CHIPINTEL.UI.nav(\'collect\')">← 返回采集</button>' +
      '<button class="btn btn-success" onclick="CHIPINTEL.UI.goAnalyze()">✓ 校验完成，进入分析 →</button>' +
    '</div>';
};
UI.goAnalyze = function(){
  CHIPINTEL.state.stage = 'validated';
  UI.nav('analyze');
};

/* ---------- 分析视图 ---------- */
UI.renderAnalyze = function(){
  var el = document.getElementById('view-analyze');
  var data = CHIPINTEL.current();
  var chip = CHIPINTEL.isChip();
  var a = data.analysis;
  el.innerHTML =
    UI.sectionHead(chip ? 'Module 07 · 营销分析引擎' : 'Module 10 · 公司级竞品分析引擎',
      (chip ? '6 维营销分析 — ' : '5 维战略分析 — ') + UI.esc(data.label),
      chip ? 'LLM 结构化分析 + 4层证据链（数据→发现→推论→建议）+ 结论自检 + 幻觉防护。'
           : '产品布局矩阵 → 市场信息画像 → 战略布局解读 → 未来趋势预判 → 客户图谱（拆解报告+BQB+FCC）。');

  var tabs = [], panels = [];
  if (chip){
    a.dims.forEach(function(d, i){ tabs.push({ key:d.key, label:d.label, icon:d.icon }); });
    if (a.customer){ tabs.push({ key:'customer', label:'客户情报', icon:'🕸️' }); }
    panels = a.dims.map(function(d){
      return '<div class="card" style="margin-bottom:14px"><h3><span class="ic">' + d.icon + '</span>' + UI.esc(d.label) +
        ' ' + UI.confPill(d.conf) + '</h3>' +
        '<div class="callout success" style="margin:8px 0"><div class="label">LLM 分析结论</div><p>' + UI.esc(d.conclusion) + '</p></div>' +
        '<h4 style="font-size:.9rem;margin:8px 0 4px">证据链推理</h4>' + UI.evidenceChain(d.evidence) + '</div>';
    });
    if (a.customer){ panels.push(UI.customerPanel(a.customer, true)); }
  } else {
    a.tabs.forEach(function(t, i){ tabs.push({ key:t.key, label:t.label, icon:t.icon }); });
    panels = a.tabs.map(function(t){
      var h = '<div class="card" style="margin-bottom:14px"><h3><span class="ic">' + t.icon + '</span>' + UI.esc(t.label) + '</h3>';
      if (t.intro){ h += '<p class="sub" style="margin-bottom:8px">' + UI.esc(t.intro) + '</p>'; }
      if (t.table && t.table.rows && t.table.rows.length){ h += UI.renderTable(t.table.cols, t.table.rows); }
      if (t.insight){ h += '<div class="callout"><div class="label">解读</div><p>' + UI.esc(t.insight) + '</p></div>'; }
      if (t.evidence){ h += '<p class="sub" style="margin-top:6px">' + UI.esc(t.evidence) + '</p>'; }
      if (t.evidenceChain){ h += '<h4 style="font-size:.9rem;margin:10px 0 4px">战略推演 · 证据链</h4>' + UI.evidenceChain(t.evidenceChain); }
      if (t.key === 'trends' && t.table && t.table.rows){
        h += '<div class="chart-card" style="box-shadow:none;border:1px dashed var(--rule-strong)"><div class="c-head"><h3>📈 趋势预判：时间窗口 × 置信度</h3></div><div class="chart-box sm" id="trendChart"></div></div>';
      }
      if (t.key === 'customers'){
        h += UI.customerPanel({ mapping:t.mapping, concentration:t.concentration, tiers:t.tiers, drilldown:t.drilldown }, false, data.label);
      }
      if (t.summary){ h += '<div class="callout danger"><div class="label">趋势预判总结 — 战略预警</div><p>' + UI.esc(t.summary) + '</p></div>'; }
      if (t.disclaimer){ h += '<p class="sub" style="font-size:.72rem">' + UI.esc(t.disclaimer) + '</p>'; }
      if (t.yichip){ h += UI.yichipCard(t.yichip); }
      h += '</div>';
      return h;
    });
  }

  el.innerHTML += '<div class="tabs" id="analyzeTabs">' + tabs.map(function(t, i){
    return '<button class="tab' + (i===0?' active':'') + '" data-tab="' + t.key + '">' + t.icon + ' ' + UI.esc(t.label) + '</button>';
  }).join('') + '</div>' +
  '<div id="analyzePanels">' + panels.map(function(p, i){
    return '<div class="tab-panel' + (i===0?' active':'') + '" data-panel="' + i + '">' + p + '</div>';
  }).join('') + '</div>';

  // Tab 切换
  var tabsBox = document.getElementById('analyzeTabs');
  var panelsBox = document.getElementById('analyzePanels');
  tabsBox.querySelectorAll('.tab').forEach(function(t){
    t.addEventListener('click', function(){
      tabsBox.querySelectorAll('.tab').forEach(function(x){ x.classList.remove('active'); });
      t.classList.add('active');
      var idx = Array.prototype.indexOf.call(tabsBox.querySelectorAll('.tab'), t);
      panelsBox.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); });
      var panel = panelsBox.querySelector('[data-panel="' + idx + '"]');
      if (panel){ panel.classList.add('active'); }
      if (panel){ UI.initPanelCharts(panel, data); }
    });
  });

  // 自检报告（用 insertAdjacentHTML 避免重建 DOM 导致 Tab 监听器丢失）
  el.insertAdjacentHTML('beforeend', '<div class="card" style="margin-top:14px"><h3><span class="ic">🛡️</span>结论自检报告</h3>' +
    '<div class="grid grid-3" style="margin:10px 0">' +
      '<div class="metric-card"><div class="m-label">结论总数</div><div class="m-value">' + a.selfCheck.total + '</div></div>' +
      '<div class="metric-card"><div class="m-label">✅ 通过验证</div><div class="m-value" style="color:var(--success)">' + a.selfCheck.passed + '</div></div>' +
      '<div class="metric-card"><div class="m-label">📊 通过率</div><div class="m-value" style="color:var(--accent-2)">' + UI.esc(a.selfCheck.passRate) + '</div></div>' +
    '</div>' +
    (a.selfCheck.items || []).filter(function(it){ return it && it.text; }).map(function(it){
      return '<div class="ev-layer" style="border-left-color:' + (it.ok ? 'var(--success)' : 'var(--warn)') + '">' +
        '<div class="ev-num"><b>' + (it.ok ? '✓' : '⚠') + '</b></div>' +
        '<div class="ev-body"><p>' + UI.esc(it.text) + '</p></div></div>';
    }).join('') +
    '</div>' +
    '<div class="no-print" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">' +
      '<button class="btn" onclick="CHIPINTEL.UI.nav(\'validate\')">← 返回校验</button>' +
      '<button class="btn btn-success" onclick="CHIPINTEL.UI.goReport()">✓ 确认自检结果，生成报告 →</button>' +
    '</div>');

  UI.initPanelCharts(panelsBox.querySelector('.tab-panel.active'), data);
};
UI.initPanelCharts = function(panel, data){
  var dark = CHIPINTEL.state.theme === 'dark';
  var tc = panel && panel.querySelector('#trendChart');
  if (tc){
    var trendsTab = (data.analysis && data.analysis.tabs) ? data.analysis.tabs.find(function(t){ return t.key === 'trends'; }) : null;
    var rows = trendsTab && trendsTab.table ? trendsTab.table.rows.map(function(r){
      var months = parseInt(r[2]) || 12;
      return { trend:r[0].replace(/^\d+\.\s*/,''), months:months, conf:parseFloat(r[3]) || 0.5, impact:(r[4] && r[4].indexOf('⚠')>=0) ? 3 : 2 };
    }) : [];
    CHIPINTEL.renderTrendScatter('trendChart', { rows:rows }, dark);
  }
  var donut = panel && panel.querySelector('#tierDonut');
  if (donut && CHIPINTEL.renderTierDonut){
    var custTab = (data.analysis && data.analysis.tabs) ? data.analysis.tabs.find(function(t){ return t.key === 'customers'; }) : null;
    var rows2 = custTab && custTab.mapping ? custTab.mapping.rows : [];
    var items = [
      { name:'高', value:rows2.filter(function(r){ return r[3] === '高'; }).length },
      { name:'中', value:rows2.filter(function(r){ return r[3] === '中'; }).length },
      { name:'低', value:rows2.filter(function(r){ return r[3] === '低'; }).length }
    ];
    CHIPINTEL.renderTierDonut('tierDonut', { items:items, title:'替代机会分布', subtitle:'基于客户类型/合作深度/切换成本' }, dark);
  }
};

/* ---------- 客户图谱面板 ---------- */
UI.customerPanel = function(cust, isChip, label){
  var h = '<div class="card" style="margin-bottom:14px"><h3><span class="ic">🕸️</span>' + UI.esc(cust.title || (isChip ? '芯片级客户情报' : '客户图谱')) + '</h3>';
  if (cust.intro){ h += '<p class="sub" style="margin-bottom:8px">' + UI.esc(cust.intro) + '</p>'; }
  if (cust.mapping && cust.mapping.rows && cust.mapping.rows.length){
    h += UI.renderTable(cust.mapping.cols || ['品牌产品','芯片型号','证据来源','替代机会'], cust.mapping.rows);
  }
  if (cust.rows){ h += UI.renderTable(['品牌','产品','芯片','替代机会','原因'], cust.rows.map(function(r){
    return [r.brand, r.product, r.chip, { html:'<span class="tag ' + (r.tier==='high'?'new':r.tier==='mid'?'ghost':'must') + '">' + r.tierLabel + '</span>' }, r.reason];
  })); }
  if (cust.concentration){ h += '<div class="callout"><div class="label">客户集中度分析</div><p>' + UI.esc(cust.concentration) + '</p></div>'; }
  if (!isChip){
    h += '<div class="chart-card" style="box-shadow:none;border:1px dashed var(--rule-strong)"><div class="c-head"><h3>🍩 替代机会分布</h3></div><div class="chart-box sm" id="tierDonut"></div></div>';
  } else if (cust.tierDesc){
    h += '<h4 style="font-size:.9rem;margin:10px 0 6px">替代机会分级</h4>' +
      '<div class="grid grid-3" style="margin-bottom:8px">' + cust.tierDesc.map(function(t){
        return '<div class="metric-card"><div class="m-label">' + (t.tier==='high'?'🟢':t.tier==='mid'?'🟡':'🔴') + ' 替代机会 ' + t.label + '</div><div class="m-desc" style="margin-top:6px">' + UI.esc(t.desc) + '</div></div>';
      }).join('') + '</div>';
  }
  if (cust.drilldown){ h += '<div class="callout info" style="border-left-color:var(--info)"><div class="label" style="color:var(--info)">下钻</div><p>' + UI.esc(cust.drilldown) + '</p></div>'; }
  if (cust.yichip){ h += UI.yichipCard(cust.yichip); }
  h += '</div>';
  return h;
};
UI.yichipCard = function(text){
  return '<div class="callout success"><div class="label">💡 对易兆微的启示</div><p>' + UI.esc(text) + '</p>' +
    '<p style="font-size:.7rem;margin-top:6px;color:var(--muted2)">基于公开信息的 AI 推论，仅供参考</p></div>';
};
UI.goReport = function(){
  CHIPINTEL.state.stage = 'analyzed';
  UI.nav('report');
};

/* ---------- 报告视图 ---------- */
UI.renderReport = function(){
  var el = document.getElementById('view-report');
  var data = CHIPINTEL.current();
  var chip = CHIPINTEL.isChip();
  var r = data.report;
  var now = new Date();
  var ts = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' +
            String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');

  el.innerHTML =
    UI.sectionHead('Module 08 · 可视化报告生成',
      (chip ? '芯片竞品营销分析报告 — ' : '公司战略分析报告 — ') + UI.esc(data.label),
      '6 种可视化图表 + 证据链展开 + 一键导出（HTML / PDF / JSON）。') +
    '<div class="card" style="margin-bottom:16px"><div class="grid grid-4" style="margin-top:4px">' +
      '<div class="metric-card accent"><div class="m-label">🎯 整体置信度</div><div class="m-value">' + r.overallConf.toFixed(2) + '<small> ' + confLabel(r.overallLevel) + '</small></div><div class="m-desc">' + (r.overallLevel==='high'?'多源验证':r.overallLevel==='mid'?'单一来源为主':'数据待验证') + '</div></div>' +
      '<div class="metric-card"><div class="m-label">🌐 数据来源</div><div class="m-value">' + r.sources + '<small> 个</small></div><div class="m-desc">' + UI.esc(r.sourcesDesc) + '</div></div>' +
      '<div class="metric-card"><div class="m-label">✅ 结论通过率</div><div class="m-value" style="color:var(--success)">' + UI.esc(r.passRate) + '</div><div class="m-desc">' + UI.esc(r.passDesc) + '</div></div>' +
      '<div class="metric-card"><div class="m-label">📅 生成时间</div><div class="m-value" style="font-size:1.05rem;line-height:1.6">' + UI.esc(ts) + '</div><div class="m-desc">Agent v3.1</div></div>' +
    '</div>' +
    '<div class="no-print" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">' +
      '<button class="btn btn-primary" onclick="CHIPINTEL.UI.exportHTML()">⬇ 导出HTML</button>' +
      '<button class="btn" onclick="CHIPINTEL.UI.exportPDF()">🖨 导出PDF</button>' +
      '<button class="btn" onclick="CHIPINTEL.UI.exportJSON()">⬇ 导出JSON</button>' +
      '<span class="sub" style="align-self:center">文件名：ChipIntel_' + UI.esc(data.key) + '_' + now.getFullYear() + String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0') + '</span>' +
    '</div></div>';

  // 图表区
  var scatterPts = r.scatter.points.map(function(p){
    return chip
      ? { name:p.name, x:p.perf, y:p.price, size:p.eco, note:p.note }
      : { name:p.name, x:p.price, y:Math.round(p.perf*100), size:p.eco, note:p.note };
  });
  el.innerHTML +=
    '<div class="chart-card"><div class="c-head"><h3>📌 图表1：' + UI.esc(r.scatter.title) + '</h3><span class="c-note">' + UI.esc(r.scatter.subtitle) + '</span></div>' +
      '<div class="chart-box" id="chartScatter"></div>' +
      '<div class="chart-insight">💡 <b>洞察：</b>' + UI.esc(r.scatter.insight) + ' · 点击数据点可查看来源证据。</div></div>' +

    '<div class="chart-card"><div class="c-head"><h3>📊 图表2：' + UI.esc(r.priceBar.title) + '</h3><span class="c-note">' + UI.esc(r.priceBar.subtitle) + '</span></div>' +
      '<div class="chart-box sm" id="chartBar"></div>' +
      (r.priceBar.note ? '<div class="chart-insight">' + UI.esc(r.priceBar.note) + '</div>' : '') + '</div>' +

    '<div class="chart-card"><div class="c-head"><h3>🕸️ 图表3：' + UI.esc(r.radar.title) + '</h3><span class="c-note">' + UI.esc(r.radar.subtitle) + '</span></div>' +
      '<div class="chart-box sm" id="chartRadar"></div></div>' +

    '<div class="chart-card"><div class="c-head"><h3>🌡️ 图表4：' + UI.esc(r.heatmap.title) + '</h3><span class="c-note">' + UI.esc(r.heatmap.subtitle) + '</span></div>' +
      '<div class="chart-box tall" id="chartHeatmap"></div>' +
      '<div class="chart-insight">' + UI.esc(r.heatmap.legend) + '</div></div>' +

    '<div class="chart-card"><div class="c-head"><h3>📈 图表5：' + UI.esc(r.confDist.title) + '</h3><span class="c-note">' + UI.esc(r.confDist.note) + '</span></div>' +
      '<div class="chart-box sm" id="chartConf"></div></div>' +

    '<div class="chart-card"><div class="c-head"><h3>🗣️ 图表6：' + UI.esc(r.messaging.title) + '</h3><span class="c-note">' + UI.esc(r.messaging.subtitle) + '</span></div>' +
      UI.renderTable(['品牌/型号','核心话术1','核心话术2','核心话术3','传播策略'],
        r.messaging.rows.map(function(m){ return [m.brand, m.m1, m.m2, m.m3, m.strategy]; })) +
      '<p class="sub" style="margin-top:6px">' + UI.esc(r.messaging.note) + '</p></div>';

  // 结论列表
  el.innerHTML += '<div class="card"><h3><span class="ic">📋</span>分析结论（' + (r.conclusions||[]).length + ' 条 · 均可追溯证据链）</h3>' +
    '<div id="conclusionList"></div></div>';

  var list = document.getElementById('conclusionList');
  (r.conclusions||[]).forEach(function(c, i){
    var ev = UI.evidenceFor(data, c.dim, chip);
    var exp = document.createElement('div');
    exp.className = 'expander';
    exp.innerHTML =
      '<div class="exp-head" role="button" tabindex="0"><span class="tag ai">' + UI.esc(c.dim) + '</span>' +
        '<span style="flex:1">' + UI.esc(c.summary) + '</span>' +
        UI.confPill(c.conf) +
        '<button class="btn btn-sm" onclick="event.stopPropagation();CHIPINTEL.UI.openEvidence(' + i + ')">查看证据</button>' +
        '<span class="chev">▼</span></div>' +
      '<div class="exp-body"><div class="grid grid-3" style="margin:10px 0">' +
        '<div class="metric-card"><div class="m-label">引用数据点</div><div class="m-value" style="font-size:1rem">' + UI.esc(c.refs) + '</div></div>' +
        '<div class="metric-card"><div class="m-label">来源数</div><div class="m-value" style="font-size:1rem">' + c.sources + '</div></div>' +
        '<div class="metric-card"><div class="m-label">证据链</div><div class="m-value" style="font-size:1rem">4层</div></div>' +
      '</div><p class="sub">' + UI.esc(ev.summary || '') + '</p></div>';
    exp.querySelector('.exp-head').addEventListener('click', function(){ exp.classList.toggle('open'); });
    list.appendChild(exp);
  });

  // 底部（用 insertAdjacentHTML 避免重建 DOM 导致展开器监听器丢失）
  el.insertAdjacentHTML('beforeend', '<div class="app-footer" style="margin-top:24px;text-align:left;border:1px solid var(--rule);border-radius:12px">' +
    '<div class="mono">报告生成时间：' + UI.esc(ts) + ' · Agent版本：v3.1 · 赛道：蓝牙芯片（BLE/音频/数传）</div>' +
    '<div style="margin-top:6px">数据来源：' + UI.esc((data.trace && data.trace.sources ? data.trace.sources.length : 0)) + ' 个 · 全部结论可通过「溯源」页面追溯至原始URL</div>' +
    '</div>');

  // 渲染图表
  var dark = CHIPINTEL.state.theme === 'dark';
  CHIPINTEL.disposeCharts('chart');
  CHIPINTEL.renderScatter('chartScatter', {
    title:r.scatter.title, subtitle:r.scatter.subtitle,
    xLabel: chip ? '性能（主频）' : '价格带（¥）',
    yLabel: chip ? '价格（¥）' : '置信度（%）',
    points:scatterPts
  }, dark);
  CHIPINTEL.renderBar('chartBar', { title:r.priceBar.title, subtitle:r.priceBar.subtitle, items:r.priceBar.items }, dark);
  CHIPINTEL.renderRadar('chartRadar', {
    title:r.radar.title, subtitle:r.radar.subtitle, dims:r.radar.dims,
    main:r.radar.main, rivals:r.radar.rivals,
    mainName: data.label, rivalName:'竞品均值'
  }, dark);
  CHIPINTEL.renderHeatmap('chartHeatmap', r.heatmap, dark);
  CHIPINTEL.renderConfDist('chartConf', r.confDist, dark);
};

/* ---------- 结论证据查询 ---------- */
UI.evidenceFor = function(data, dim, chip){
  if (chip){
    var d = data.analysis.dims.find(function(x){ return x.label === dim || x.key === dim; });
    return { chain: d ? d.evidence : null, summary: d ? d.conclusion : '' };
  }
  var t = data.analysis.tabs.find(function(x){ return x.label === dim || x.key === dim; });
  if (!t) return { chain:null, summary:'' };
  if (t.evidenceChain) return { chain:t.evidenceChain, summary:t.insight || '' };
  var rows = t.table && t.table.rows ? t.table.rows : [];
  var chain = rows.slice(0,4).map(function(r, i){
    return { text: (t.table.cols||[]).map(function(c,j){ return c+'：'+(r[j]||'—'); }).join('；'), src:'数据表第'+(i+1)+'行 · 来源：官网/行业/电商' };
  });
  return { chain:chain, summary:t.insight || '' };
};
UI.openEvidence = function(idx){
  var data = CHIPINTEL.current();
  var chip = CHIPINTEL.isChip();
  var c = data.report.conclusions[idx];
  if (!c) return;
  var ev = UI.evidenceFor(data, c.dim, chip);
  var html = '<div class="callout"><div class="label">' + UI.esc(c.dim) + ' · ' + UI.esc(c.summary) + '</div>' +
    '<p>置信度：' + (typeof c.conf === 'number' ? c.conf.toFixed(2) : c.conf) + ' · 引用数据点：' + UI.esc(c.refs) + ' · 来源数：' + c.sources + '</p></div>' +
    (ev.chain ? UI.evidenceChain(ev.chain) : '<p class="sub">该结论暂无完整证据链（数据不足）。</p>') +
    '<div class="no-print" style="margin-top:10px;text-align:right"><button class="btn btn-sm" onclick="CHIPINTEL.UI.nav(\'trace\');CHIPINTEL.UI.closeModal()">前往溯源中心 →</button></div>';
  UI.openModal('🔗', '证据链 — ' + c.dim, html);
};

/* ---------- 导出 ---------- */
UI.buildExportPayload = function(){
  var data = CHIPINTEL.current();
  var chip = CHIPINTEL.isChip();
  return {
    app:'ChipIntel Agent', version:CHIPINTEL.version, mode:chip?'chip':'company',
    subject:data.key, generatedAt:CHIPINTEL.generatedAt,
    results:data.results, validation:data.validation,
    analysis:data.analysis, report:data.report, trace:data.trace,
    disclaimer:'演示数据集，非实时采集结果；趋势预判基于公开信息推理，不构成投资建议。'
  };
};
UI.download = function(name, content, type){
  var blob = new Blob([content], { type:type || 'text/plain;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 400);
};
UI.exportJSON = function(){
  var data = CHIPINTEL.current();
  var d = new Date();
  var name = 'ChipIntel_' + data.key + '_' + d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0') + '.json';
  UI.download(name, JSON.stringify(UI.buildExportPayload(), null, 2), 'application/json');
  UI.toast('JSON 数据包已导出（含全部数据点与证据链）', 'ok');
};
UI.exportPDF = function(){
  window.print();
};
UI.exportHTML = function(){
  var data = CHIPINTEL.current();
  var chip = CHIPINTEL.isChip();
  var r = data.report;
  var dark = CHIPINTEL.state.theme === 'dark';
  var images = ['chartScatter','chartBar','chartRadar','chartHeatmap','chartConf'].map(function(id){
    var dom = document.getElementById(id);
    if (!dom || !window.echarts) return { id:id, data:'' };
    var inst = echarts.getInstanceByDom(dom);
    if (!inst) return { id:id, data:'' };
    try { return { id:id, data:inst.getDataURL({ type:'png', pixelRatio:2, backgroundColor: dark ? '#111a2c' : '#ffffff' }) }; }
    catch(e){ return { id:id, data:'' }; }
  });
  var d = new Date();
  var ts = d.toLocaleString('zh-CN');
  var html = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>ChipIntel_' + data.key + '</title>' +
    '<style>body{font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;max-width:900px;margin:0 auto;padding:32px 20px;color:#0f172a;line-height:1.7}' +
    'h2{border-bottom:2px solid #0f4c75;padding-bottom:6px;margin-top:28px}h3{color:#0f4c75}table{width:100%;border-collapse:collapse;font-size:13px;margin:10px 0}' +
    'th{background:#0f4c75;color:#fff;padding:8px;text-align:left}td{padding:7px 8px;border-bottom:1px solid #e2e8f0}' +
    '.conf{display:inline-block;padding:2px 8px;border-radius:6px;font-size:12px;font-weight:600}.high{background:#dcfce7;color:#14532d}.mid{background:#fef3c7;color:#78350f}.low{background:#fee2e2;color:#7f1d1d}.none{background:#e2e8f0;color:#334155}' +
    'img{max-width:100%;border:1px solid #e2e8f0;border-radius:10px;margin:8px 0}.card{border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin:12px 0}' +
    '.metrics{display:flex;gap:14px;flex-wrap:wrap}.metric{flex:1;min-width:150px;border:1px solid #e2e8f0;border-radius:10px;padding:12px}' +
    '.metric b{font-size:22px;color:#0f4c75}.foot{margin-top:30px;color:#64748b;font-size:12px;border-top:1px solid #e2e8f0;padding-top:12px}</style></head><body>' +
    '<h1 style="font-size:26px;margin-bottom:4px">' + (chip?'芯片竞品营销分析报告':'公司战略分析报告') + ' — ' + data.label + '</h1>' +
    '<p style="color:#64748b">生成于 ' + ts + ' · ChipIntel Agent v3.1 · 背景公司：易兆微电子（杭州）</p>' +
    '<div class="metrics">' +
      '<div class="metric"><div>整体置信度</div><b>' + r.overallConf.toFixed(2) + '</b> ' + confLabel(r.overallLevel) + '</div>' +
      '<div class="metric"><div>数据来源</div><b>' + r.sources + '</b> 个</div>' +
      '<div class="metric"><div>结论通过率</div><b>' + r.passRate + '</b></div>' +
    '</div>' +
    images.map(function(im, i){
      return '<h2>图表' + (i+1) + '</h2>' + (im.data ? '<img src="' + im.data + '" alt="图表' + (i+1) + '">' : '<p>图表渲染失败</p>');
    }).join('') +
    '<h2>分析结论</h2>' +
    '<table><tr><th>维度</th><th>结论摘要</th><th>置信度</th><th>引用数据点</th><th>来源数</th></tr>' +
    (r.conclusions||[]).map(function(c){
      return '<tr><td>' + c.dim + '</td><td>' + c.summary + '</td><td><span class="conf ' + c.level + '">' + c.conf + '</span></td><td>' + c.refs + '</td><td>' + c.sources + '</td></tr>';
    }).join('') + '</table>' +
    '<h2>关键数据表</h2>' +
    (function(){
      var rows = (data.validation && data.validation.rows) || [];
      return '<table><tr><th>数据点</th><th>来源值</th><th>验证状态</th><th>置信度</th></tr>' +
        rows.map(function(r){
          return '<tr><td>' + r.point + '</td><td>' + r.values.map(function(v){ return v.val + ' [' + v.src + ']'; }).join('；') + '</td><td>' + r.status + '</td><td><span class="conf ' + r.level + '">' + r.conf + '</span></td></tr>';
        }).join('') + '</table>';
    })() +
    '<h2>来源列表</h2><table><tr><th>来源</th><th>类型</th><th>URL</th><th>采集时间</th><th>状态</th></tr>' +
    (data.trace.sources||[]).map(function(s){
      return '<tr><td>' + s.name + '</td><td>' + (CHIPINTEL.SOURCES[s.type]?CHIPINTEL.SOURCES[s.type].label:s.type) + '</td><td>' + s.url + '</td><td>' + s.time + '</td><td>' + s.status + '</td></tr>';
    }).join('') + '</table>' +
    '<div class="foot">演示数据集，非实时采集结果 · 趋势预判基于公开信息推理，不构成投资建议 · 来源URL可点击验证</div>' +
    '</body></html>';
  var name = 'ChipIntel_' + data.key + '_' + d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0') + '.html';
  UI.download(name, html, 'text/html;charset=utf-8');
  UI.toast('HTML 报告已导出（含图表快照）', 'ok');
};

/* ---------- 溯源视图 ---------- */
UI.renderTrace = function(){
  var el = document.getElementById('view-trace');
  var data = CHIPINTEL.current();
  var chip = CHIPINTEL.isChip();
  var t = data.trace;
  var order = ['official','datasheet','ecommerce','report','patent','media','forum','social'];
  var grouped = {};
  (t.sources||[]).forEach(function(s){ (grouped[s.type] = grouped[s.type] || []).push(s); });

  el.innerHTML =
    UI.sectionHead('Module 09 · 数据溯源中心',
      '全链路溯源 — ' + UI.esc(data.label),
      '每个数据点、每条结论都绑定唯一 ID；从任意结论出发，可通过 4 层证据链追溯至原始来源 URL。') +
    '<div class="grid grid-4" style="margin-bottom:16px">' +
      '<div class="metric-card"><div class="m-label">📚 数据源</div><div class="m-value">' + t.stats.sources + '<small> 个</small></div><div class="m-desc">含URL与采集时间戳</div></div>' +
      '<div class="metric-card"><div class="m-label">🔗 可追溯结论</div><div class="m-value">' + t.stats.conclusions + '<small> 条</small></div><div class="m-desc">溯源率100%</div></div>' +
      '<div class="metric-card"><div class="m-label">⚠️ 冲突记录</div><div class="m-value">' + t.stats.conflicts + '<small> 条</small></div><div class="m-desc">透明展示不掩盖</div></div>' +
      '<div class="metric-card"><div class="m-label">✅ 完整性</div><div class="m-value" style="color:var(--success)">' + UI.esc(t.stats.integrity || '—') + '</div><div class="m-desc">结论↔数据包一致性</div></div>' +
    '</div>';

  // 数据源列表
  el.innerHTML += '<div class="card" style="margin-bottom:16px"><h3><span class="ic">📚</span>完整数据源列表</h3>' +
    '<p class="sub" style="margin-bottom:8px">按来源类型分组，点击“详情”查看可信度权重与采集信息；点击 URL 可直接访问原始页面验证。</p>';
  order.forEach(function(type){
    var list = grouped[type] || [];
    if (!list.length) return;
    var s = CHIPINTEL.SOURCES[type];
    el.innerHTML += '<h4 style="margin-top:12px">' + s.icon + ' ' + UI.esc(s.label) + ' ' + UI.stars(s.stars) +
      ' <span class="sub">可信度权重 ' + s.weight + '</span></h4>' +
      UI.renderTable(['来源名称','可信度','采集时间','数据条数','验证状态','操作'],
        list.map(function(src){
          return [
            { html:'<a href="' + UI.esc(src.url) + '" target="_blank" rel="noopener" style="font-weight:600">' + UI.esc(src.name) + '</a>' },
            { html:UI.stars(src.stars) },
            src.time, src.items,
            { html:'<span class="tag ' + (src.status==='已验证'?'new':src.status.indexOf('冲突')>=0?'must':src.status==='数据不足'?'ghost':'ghost') + '">' + UI.esc(src.status) + '</span>' },
            { html:'<button class="btn btn-sm" onclick="CHIPINTEL.UI.openSrcModal(\'' + UI.esc(src.url) + '\')">详情</button>' }
          ];
        })
      );
  });
  el.innerHTML += '</div>';

  // 结论溯源索引
  el.innerHTML += '<div class="card" style="margin-bottom:16px"><h3><span class="ic">🧾</span>结论溯源索引</h3>' +
    '<p class="sub" style="margin-bottom:8px">报告中的每条结论均可追溯至原始数据源。点击「查看证据」查看完整推理链。</p>' +
    UI.renderTable(['维度','结论摘要','置信度','引用数据点','来源数','溯源操作'],
      (t.conclusions||[]).map(function(c, i){
        return [
          { html:'<span class="tag ai">' + UI.esc(c.dim) + '</span>' },
          c.summary,
          { html:UI.confPill(c.conf) },
          c.refs, c.sources,
          { html:'<button class="btn btn-sm" onclick="CHIPINTEL.UI.openEvidence(' + i + ')">🔗 查看证据</button>' }
        ];
      })
    ) + '</div>';

  // 冲突历史
  el.innerHTML += '<div class="card" style="margin-bottom:16px"><h3><span class="ic">⚖️</span>冲突处理历史</h3>' +
    '<p class="sub" style="margin-bottom:8px">所有存在来源冲突的数据点均有独立处理记录，用户可自行判断。</p>';
  (t.conflicts||[]).forEach(function(c){
    el.innerHTML += '<div class="conflict-card"><div class="c-head"><h4>冲突记录 ' + UI.esc(c.id) + ' — ' + UI.esc(c.title) + '</h4>' +
      '<span class="tag ' + (c.visible===false?'ghost':'must') + '">' + (c.visible===false?'已隐藏':'用户可见') + '</span></div>' +
      '<p class="sub" style="margin-bottom:8px">' + UI.esc(c.desc) + '</p>' +
      '<div class="c-list"><div class="c-item"><div class="s">处理策略</div><div class="v" style="font-size:.78rem">' + UI.esc(c.strategy) + '</div></div>' +
      '<div class="c-item"><div class="s">报告展示</div><div class="v" style="font-size:.78rem">' + UI.esc(c.display) + '</div></div></div></div>';
  });
  el.innerHTML += '</div>';

  // 完整性校验
  el.innerHTML += '<div class="card"><h3><span class="ic">🛡️</span>数据完整性校验</h3>' +
    '<p class="sub" style="margin-bottom:10px">一键验证报告中所有结论的引用数据是否都存在于数据包中、是否存在“幻觉引用”。</p>' +
    '<div class="no-print" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">' +
      '<button class="btn btn-primary" onclick="CHIPINTEL.runIntegrityCheck()">🔍 运行完整性校验</button>' +
      (CHIPINTEL.state.integrityChecked ? '<span class="tag new">✓ 已校验</span>' : '') +
    '</div><div id="integrityResult" style="margin-top:10px"></div>' +
    '<div class="callout" style="margin-top:12px"><div class="label">溯源验证</div><p>' + UI.esc(t.checkNote || '') + '</p></div>' +
    '</div>' +
    '<div class="no-print" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">' +
      '<button class="btn" onclick="CHIPINTEL.UI.nav(\'report\')">← 返回报告</button>' +
    '</div>';
};
UI.currentSrc = function(url){
  var data = CHIPINTEL.current();
  var s = (data.trace && data.trace.sources || []).find(function(x){ return x.url === url; });
  return s || { type:'official', name:'来源', url:url, stars:5, time:'—', items:'—', status:'已验证' };
};
UI.openSrcModal = function(url){
  var src = UI.currentSrc(url);
  var s = CHIPINTEL.SOURCES[src.type] || {};
  UI.openModal(s.icon || '🔎', src.name, UI.modalSrc(src));
};
  
/* ---------- 主题 ---------- */
UI.applyTheme = function(){
  document.documentElement.dataset.theme = CHIPINTEL.state.theme;
  try { localStorage.setItem('chipintel-theme', CHIPINTEL.state.theme); } catch(e){}
};
UI.toggleTheme = function(){
  CHIPINTEL.state.theme = CHIPINTEL.state.theme === 'dark' ? 'light' : 'dark';
  UI.applyTheme();
  // 重新渲染当前视图，让图表适配主题
  var v = CHIPINTEL.state.view || 'home';
  if (v === 'home') UI.renderHome();
  else if (v === 'collect') UI.renderCollect();
  else if (v === 'validate') UI.renderValidate();
  else if (v === 'analyze') UI.renderAnalyze();
  else if (v === 'report') UI.renderReport();
  else if (v === 'trace') UI.renderTrace();
  UI.updatePipeline();
  UI.toast(CHIPINTEL.state.theme === 'dark' ? '已切换深色主题' : '已切换浅色主题', '');
};

/* ---------- 初始化 ---------- */
document.addEventListener('DOMContentLoaded', function(){
  UI.applyTheme();
  document.getElementById('mainNav').querySelectorAll('button').forEach(function(b){
    b.addEventListener('click', function(){ UI.nav(b.dataset.view); });
  });
  document.getElementById('modeSwitch').querySelectorAll('button').forEach(function(b){
    b.addEventListener('click', function(){ UI.setMode(b.dataset.mode); });
  });
  document.getElementById('themeToggle').addEventListener('click', UI.toggleTheme);
  document.getElementById('modalClose').addEventListener('click', UI.closeModal);
  document.getElementById('modal').addEventListener('click', function(e){
    if (e.target === this) UI.closeModal();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') UI.closeModal();
  });
  window.addEventListener('resize', function(){
    clearTimeout(UI._rs);
    UI._rs = setTimeout(function(){ CHIPINTEL.resizeCharts(); }, 150);
  });
  UI.renderHome();
});


