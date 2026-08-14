/* ============================================================
   ChipIntel Agent — 状态与 Agent 闭环模拟引擎
   采集 → 校验 → 分析 → 报告 → 溯源（含缺口检测/补充采集）
   ============================================================ */
window.CHIPINTEL = window.CHIPINTEL || {};
CHIPINTEL.state = {
  mode: 'chip',           // 'chip' | 'company'
  subject: 'STM32F103',   // 当前芯片/公司 key
  stage: 'idle',          // idle | collected | validated | analyzed
  collecting: false,
  round: 0,               // 补充采集轮次
  supplementDone: false,
  integrityChecked: false,
  theme: (function(){ try { return localStorage.getItem('chipintel-theme') || 'light'; } catch(e){ return 'light'; } })()
};

CHIPINTEL.isChip = function(){ return CHIPINTEL.state.mode === 'chip'; };
CHIPINTEL.current = function(){
  return CHIPINTEL.isChip()
    ? (CHIPINTEL.chips[CHIPINTEL.state.subject] || CHIPINTEL.chips['STM32F103'])
    : (CHIPINTEL.companies[CHIPINTEL.state.subject] || CHIPINTEL.companies['杰理科技']);
};
CHIPINTEL.currentLabel = function(){
  var d = CHIPINTEL.current();
  return d ? d.label : CHIPINTEL.state.subject;
};

/* ---------- 采集动画 ---------- */
CHIPINTEL.startCollect = function(){
  if (CHIPINTEL.state.collecting) return;
  var data = CHIPINTEL.current();
  if (!data) return;
  CHIPINTEL.state.collecting = true;
  CHIPINTEL.state.stage = 'idle';
  CHIPINTEL.state.supplementDone = false;
  CHIPINTEL.state.round = 0;

  var ui = CHIPINTEL.UI;
  var btn = document.getElementById('collectBtn');
  var stepsBox = document.getElementById('collectSteps');
  var logBox = document.getElementById('collectLog');
  var resultBox = document.getElementById('collectResult');
  var progress = document.getElementById('collectProgress');
  var gapBox = document.getElementById('collectGap');
  if (!stepsBox) return;

  if (btn){ btn.disabled = true; btn.innerHTML = '<span class="spin"></span> Agent采集中…'; }
  if (logBox){ logBox.style.display = 'block'; logBox.innerHTML = ''; }
  if (resultBox){ resultBox.style.display = 'none'; }
  if (gapBox){ gapBox.style.display = 'none'; }

  // 渲染规划矩阵（首次）
  ui.renderPlan(data, CHIPINTEL.isChip());

  // 渲染步骤
  stepsBox.innerHTML = (data.steps||[]).map(function(s, i){
    return '<div class="pstep pending" id="cstep-'+i+'">' +
      '<div class="icon">'+(i+1)+'</div>' +
      '<div class="p-label">'+ui.esc(s.label)+'<span class="detail">'+ui.esc(s.detail)+'</span></div>' +
      '<div class="p-status" id="cstep-status-'+i+'">等待执行</div></div>';
  }).join('');

  var steps = data.steps || [];
  var i = 0;
  var t0 = Date.now();
  function fmt(t){ var s = Math.floor(t/1000); var m = Math.floor(s/60); return (m<10?'0':'')+m+':'+('0'+(s%60)).slice(-2); }
  function addLog(tag, text, cls){
    var line = document.createElement('div');
    line.className = 'log-line';
    line.innerHTML = '<span class="log-time">'+fmt(Date.now()-t0)+'</span><span class="log-tag '+cls+'">'+tag+'</span><span>'+ui.esc(text)+'</span>';
    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;
  }
  function next(){
    if (i < steps.length){
      var s = steps[i];
      var stepEl = document.getElementById('cstep-'+i);
      var stEl = document.getElementById('cstep-status-'+i);
      if (stepEl){ stepEl.className = 'pstep running'; }
      if (stEl){ stEl.textContent = '采集中…'; }
      addLog('INFO', '开始采集：' + s.label, 'info');
      if (progress){ progress.style.width = Math.round((i)/steps.length*100) + '%'; }
      var delay = 380 + Math.random()*420;
      setTimeout(function(){
        var failed = s.status === 'fail';
        if (stepEl){ stepEl.className = 'pstep ' + (failed?'failed':'done'); }
        if (stEl){
          stEl.innerHTML = failed
            ? '<span style="color:var(--danger)">部分失败</span>'
            : '<span style="color:var(--success)">✓ 完成</span>';
        }
        if (failed){ addLog('WARN', s.label + ' 部分失败（部分页面不可达），已保留已有数据', 'warn'); }
        else { addLog('OK', s.label + ' 完成，数据已入库', 'ok'); }
        i++;
        if (progress){ progress.style.width = Math.round(i/steps.length*100) + '%'; }
        next();
      }, delay);
    } else {
      if (progress){ progress.style.width = '100%'; }
      addLog('DONE', '第1轮采集完成：' + (data.results ? data.results.items : '') + ' 条数据入库', 'ok');
      CHIPINTEL.state.collecting = false;
      CHIPINTEL.state.stage = 'collected';
      if (btn){ btn.disabled = false; btn.innerHTML = '↻ 重新采集'; }
      setTimeout(function(){
        ui.renderResults(data);
        ui.renderGap(data);
        ui.updatePipeline();
      }, 200);
    }
  }
  next();
};

/* ---------- 第2轮补充采集 ---------- */
CHIPINTEL.triggerSupplement = function(){
  var data = CHIPINTEL.current();
  var ui = CHIPINTEL.UI;
  CHIPINTEL.state.round = 1;
  CHIPINTEL.state.supplementDone = true;
  var gapBox = document.getElementById('collectGap');
  if (gapBox){
    gapBox.innerHTML =
      '<div class="callout success"><div class="label">⟳ 补充采集进行中</div>' +
      '<p>Agent 正在聚焦缺口维度补充采集：微信公众号 / 技术博客 / B站评测…</p>' +
      '<div class="progress-bar" style="margin:6px 0 4px"><span style="width:100%"></span></div></div>';
  }
  var logBox = document.getElementById('collectLog');
  if (logBox){
    var line = document.createElement('div');
    line.className = 'log-line';
    line.innerHTML = '<span class="log-time">--:--</span><span class="log-tag warn">GAP</span><span>触发第2轮补充采集，聚焦缺口维度…</span>';
    logBox.appendChild(line); logBox.scrollTop = logBox.scrollHeight;
  }
  setTimeout(function(){
    if (gapBox){
      gapBox.innerHTML =
        '<div class="callout success"><div class="label">✓ 补充采集完成</div>' +
        '<p>缺口维度覆盖率已提升：' + ui.gapProgressText(data) + '</p>' +
        '<p style="margin-top:6px">' + ui.gapResolvedText(data) + '</p></div>';
    }
    if (logBox){
      var line = document.createElement('div');
      line.className = 'log-line';
      line.innerHTML = '<span class="log-time">--:--</span><span class="log-tag ok">GAP</span><span>补充采集完成，缺口已回补</span>';
      logBox.appendChild(line); logBox.scrollTop = logBox.scrollHeight;
    }
    ui.renderResults(data, true);
    ui.toast('补充采集完成：缺口维度数据已回补', 'ok');
  }, 1600);
};

/* ---------- 跳过补充采集 ---------- */
CHIPINTEL.skipSupplement = function(){
  CHIPINTEL.state.supplementDone = true;
  var gapBox = document.getElementById('collectGap');
  if (gapBox){
    gapBox.innerHTML =
      '<div class="callout warn"><div class="label">已跳过补充采集</div>' +
      '<p>缺口维度将以“数据不足”标注进入分析，报告中该维度置信度上限为“中”。</p></div>';
  }
  CHIPINTEL.UI.toast('已跳过补充采集，缺口维度将标注“数据不足”', 'warn');
};

/* ---------- 完整性校验（溯源页） ---------- */
CHIPINTEL.runIntegrityCheck = function(){
  if (CHIPINTEL.state.integrityChecked){ return; }
  var data = CHIPINTEL.current();
  var ui = CHIPINTEL.UI;
  var box = document.getElementById('integrityResult');
  if (!box) return;
  box.innerHTML =
    '<div class="callout"><div class="label">⟳ 完整性校验中</div>' +
    '<div class="progress-bar"><span style="width:0;transition:width .05s linear"></span></div></div>';
  var p = box.querySelector('.progress-bar span');
  var v = 0;
  var timer = setInterval(function(){
    v += 8 + Math.random()*10;
    if (v >= 100){ v = 100; clearInterval(timer); }
    p.style.width = v + '%';
  }, 90);
  setTimeout(function(){
    clearInterval(timer);
    p.style.width = '100%';
    CHIPINTEL.state.integrityChecked = true;
    var pass = (data.analysis && data.analysis.selfCheck) ? data.analysis.selfCheck : null;
    var rate = pass ? pass.passRate : '100%';
    var anomalies = (pass && pass.items) ? pass.items.filter(function(it){ return !it.ok; }).length : 0;
    box.innerHTML =
      '<div class="callout success"><div class="label">✓ 完整性校验完成</div>' +
      '<p>结论通过率：<b>' + rate + '</b>（' + (pass?pass.passDesc:'—') + '）· 异常条目：<b>' + anomalies + '</b> 条</p>' +
      '<p style="margin-top:6px">' + ui.esc((data.trace && data.trace.checkNote) || '') + '</p></div>';
    ui.toast('完整性校验完成：通过率 ' + rate, 'ok');
  }, 2200);
};
