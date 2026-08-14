/* ============================================================
   ChipIntel Agent — ECharts 渲染层
   ============================================================ */
window.CHIPINTEL = window.CHIPINTEL || {};
CHIPINTEL.chartRegistry = {};

function chartColors(dark){
  return {
    ink: dark ? '#e6edf7' : '#0f172a',
    muted: dark ? '#93a3bb' : '#64748b',
    grid: dark ? '#1f2c45' : '#e2e8f0',
    accent: dark ? '#38bdf8' : '#0b6ea8',
    accent2: dark ? '#22d3ee' : '#00b4d8',
    success: dark ? '#4ade80' : '#059669',
    warn: dark ? '#fbbf24' : '#d97706',
    danger: dark ? '#f87171' : '#dc2626',
    none: dark ? '#64748b' : '#94a3b8',
    tooltipBg: dark ? '#111a2c' : '#ffffff'
  };
}
function baseTooltip(c){
  return {
    backgroundColor:c.tooltipBg, borderColor:c.grid, textStyle:{ color:c.ink, fontSize:12 },
    confine:true, extraCssText:'box-shadow:0 8px 24px rgba(0,0,0,.18);border-radius:10px;'
  };
}
function chartBase(c, dark){
  return {
    textStyle:{ color:c.ink, fontFamily:'Inter, "Noto Sans SC", sans-serif' },
    tooltip:baseTooltip(c),
    grid:{ left:12, right:16, top:30, bottom:8, containLabel:true },
    backgroundColor:'transparent'
  };
}

/* ---------- 注册/清理 ---------- */
CHIPINTEL.registerChart = function(id, inst){ CHIPINTEL.chartRegistry[id] = inst; };
CHIPINTEL.disposeCharts = function(prefix){
  Object.keys(CHIPINTEL.chartRegistry).forEach(function(k){
    if (!prefix || k.indexOf(prefix) === 0){
      CHIPINTEL.chartRegistry[k].dispose();
      delete CHIPINTEL.chartRegistry[k];
    }
  });
};
CHIPINTEL.resizeCharts = function(){
  Object.values(CHIPINTEL.chartRegistry).forEach(function(inst){ if (inst && inst.resize) inst.resize(); });
};

/* ---------- 1. 气泡散点 ---------- */
CHIPINTEL.renderScatter = function(elId, data, dark){
  var el = document.getElementById(elId); if (!el || !window.echarts) return;
  var c = chartColors(dark), dark2 = !!dark;
  var inst = echarts.init(el);
  var pts = (data.points||[]).map(function(p){ return [p.x, p.y, p.size||1, p.name, p.note||'']; });
  var sizes = pts.map(function(p){ return Math.max(10, Math.min(46, 8 + p[2]*8)); });
  var opt = Object.assign(chartBase(c, dark2), {
    title:{ text:data.title||'', subtext:data.subtitle||'', left:0, top:0, textStyle:{color:c.ink,fontSize:14,fontWeight:600}, subtextStyle:{color:c.muted,fontSize:11} },
    xAxis:{ type:'value', name:data.xLabel||'X', nameTextStyle:{color:c.muted}, axisLine:{lineStyle:{color:c.grid}}, splitLine:{lineStyle:{color:c.grid}}, axisLabel:{color:c.muted} },
    yAxis:{ type:'value', name:data.yLabel||'Y', nameTextStyle:{color:c.muted}, axisLine:{lineStyle:{color:c.grid}}, splitLine:{lineStyle:{color:c.grid}}, axisLabel:{color:c.muted} },
    series:[{
      type:'scatter', data:pts, symbolSize:function(v){ return Math.max(10, Math.min(46, 8 + v[2]*8)); },
      itemStyle:{ color:dark2?'#38bdf8':'#0b6ea8', opacity:.82, borderColor:'#fff', borderWidth:1, shadowBlur:8, shadowColor:'rgba(15,76,117,.25)' },
      emphasis:{ itemStyle:{ borderColor:dark2?'#67e8f9':'#0f4c75', borderWidth:2 } },
      label:{ show:true, formatter:function(p){ return p.data[3]; }, position:'top', color:c.ink, fontSize:10.5, fontWeight:600 },
      markLine: data.referenceLine ? { silent:true, symbol:'none', lineStyle:{type:'dashed',color:c.warn}, label:{color:c.muted,fontSize:10}, data:[{ yAxis:data.referenceLine }] } : undefined
    }]
  });
  inst.setOption(opt);
  inst.on('click', function(p){ if (p.data && p.data[4]) CHIPINTEL.showSourceNote(p.data[3], p.data[4]); });
  CHIPINTEL.registerChart(elId, inst);
};

/* ---------- 2. 价格/区间柱状图 ---------- */
CHIPINTEL.renderBar = function(elId, data, dark){
  var el = document.getElementById(elId); if (!el || !window.echarts) return;
  var c = chartColors(dark), dark2 = !!dark;
  var inst = echarts.init(el);
  var items = data.items||[];
  var hasRange = items.some(function(i){ return i.low != null; });
  var names = items.map(function(i){ return i.name; });
  var series;
  if (hasRange){
    series = [
      { name:'最低价', type:'bar', data:items.map(function(i){ return i.low; }), itemStyle:{ color:dark2?'#7dd3fc':'#7dd3fc' }, barMaxWidth:14 },
      { name:'最高价', type:'bar', data:items.map(function(i){ return i.high; }), itemStyle:{ color:dark2?'#0ea5e9':'#0b6ea8' }, barMaxWidth:14 }
    ];
  } else {
    series = [{
      name:'参考价', type:'bar', data:items.map(function(i){ return i.v; }),
      itemStyle:{ color:dark2?'#38bdf8':'#0b6ea8', borderRadius:[6,6,0,0] },
      barMaxWidth:34,
      label:{ show:true, position:'top', formatter:function(p){ return '¥'+p.value; }, color:c.ink, fontSize:10.5, fontWeight:600 },
      markPoint:{ data:items.map(function(i){ return { coord:[i.name, i.v], value:i.src||'', symbol:'circle', symbolSize:0 }; }), tooltip:{ formatter:function(p){ return items[p.dataIndex].src||''; } } }
    }];
  }
  var opt = Object.assign(chartBase(c, dark2), {
    title:{ text:data.title||'', subtext:data.subtitle||'', left:0, top:0, textStyle:{color:c.ink,fontSize:14,fontWeight:600}, subtextStyle:{color:c.muted,fontSize:11} },
    tooltip:Object.assign(baseTooltip(c), { formatter:function(p){
      if (hasRange){ var it = items[p.dataIndex]; return it.name + '<br/>' + p.seriesName + ': ¥' + p.value + (it.note?'<br/><span style="color:'+c.muted+'">'+it.note+'</span>':''); }
      var it = items[p.dataIndex]; return '<b>'+it.name+'</b><br/>¥'+p.value+'<br/><span style="color:'+c.muted+'">'+ (it.src||'') + ' ' + (it.note||'') +'</span>';
    }}),
    xAxis:{ type:'category', data:names, axisLabel:{ color:c.muted, interval:0, rotate:names.length>5?18:0 }, axisLine:{lineStyle:{color:c.grid}}, axisTick:{show:false} },
    yAxis:{ type:'value', name:'¥', nameTextStyle:{color:c.muted}, axisLabel:{color:c.muted, formatter:'¥{value}'}, splitLine:{lineStyle:{color:c.grid}} },
    series:series
  });
  inst.setOption(opt);
  CHIPINTEL.registerChart(elId, inst);
};

/* ---------- 3. 雷达图 ---------- */
CHIPINTEL.renderRadar = function(elId, data, dark){
  var el = document.getElementById(elId); if (!el || !window.echarts) return;
  var c = chartColors(dark), dark2 = !!dark;
  var inst = echarts.init(el);
  var opt = Object.assign(chartBase(c, dark2), {
    title:{ text:data.title||'', subtext:data.subtitle||'', left:0, top:0, textStyle:{color:c.ink,fontSize:14,fontWeight:600}, subtextStyle:{color:c.muted,fontSize:11} },
    legend:{ bottom:0, textStyle:{color:c.muted}, data:[data.mainName||'本产品', data.rivalName||'竞品均值'] },
    radar:{
      indicator:(data.dims||[]).map(function(d){ return { name:d, max:100 }; }),
      radius:'62%', center:['50%','52%'],
      axisName:{ color:c.muted, fontSize:11 },
      splitLine:{ lineStyle:{ color:c.grid } }, splitArea:{ areaStyle:{ color:[dark2?'rgba(56,189,248,.03)':'rgba(11,110,168,.03)','transparent'] } },
      axisLine:{ lineStyle:{ color:c.grid } }
    },
    series:[{
      type:'radar',
      data:[
        { name:data.mainName||'本产品', value:data.main, areaStyle:{ color:dark2?'rgba(56,189,248,.22)':'rgba(11,110,168,.18)' }, lineStyle:{ color:dark2?'#38bdf8':'#0b6ea8', width:2 }, itemStyle:{ color:dark2?'#38bdf8':'#0b6ea8' } },
        { name:data.rivalName||'竞品均值', value:data.rivals, areaStyle:{ color:dark2?'rgba(251,191,36,.15)':'rgba(217,119,6,.12)' }, lineStyle:{ color:dark2?'#fbbf24':'#d97706', width:2, type:'dashed' }, itemStyle:{ color:dark2?'#fbbf24':'#d97706' } }
      ]
    }]
  });
  inst.setOption(opt);
  CHIPINTEL.registerChart(elId, inst);
};

/* ---------- 4. 数据覆盖热力图 ---------- */
CHIPINTEL.renderHeatmap = function(elId, data, dark){
  var el = document.getElementById(elId); if (!el || !window.echarts) return;
  var c = chartColors(dark), dark2 = !!dark;
  var inst = echarts.init(el);
  var dims = data.dims||[], srcs = data.sources||[], rows = data.rows||[];
  var vals = [], noData = [];
  dims.forEach(function(d, i){
    srcs.forEach(function(s, j){
      var v = rows[i] && rows[i][j];
      if (v == null || v === ''){
        vals.push([j, i, -1]); noData.push([j, i, '—']);
      } else {
        vals.push([j, i, parseFloat(v)]);
      }
    });
  });
  var opt = Object.assign(chartBase(c, dark2), {
    title:{ text:data.title||'', subtext:data.subtitle||'', left:0, top:0, textStyle:{color:c.ink,fontSize:14,fontWeight:600}, subtextStyle:{color:c.muted,fontSize:11} },
    tooltip:Object.assign(baseTooltip(c), { formatter:function(p){
      if (p.value[2] < 0) return srcs[p.value[0]] + '<br/>' + dims[p.value[1]] + '<br/><span style="color:'+c.muted+'">无数据</span>';
      var lv = p.value[2]>=0.6?'高':(p.value[2]>=0.4?'中':'低');
      return srcs[p.value[0]] + '<br/>' + dims[p.value[1]] + '<br/>置信度: <b>' + p.value[2].toFixed(2) + '</b> (' + lv + ')';
    }}),
    grid:{ left:90, right:24, top:56, bottom:40 },
    xAxis:{ type:'category', data:srcs, axisLabel:{ color:c.muted, interval:0, rotate:18 }, axisLine:{lineStyle:{color:c.grid}}, splitArea:{show:true, areaStyle:{color:['rgba(0,0,0,0)','rgba(0,0,0,0)']}} },
    yAxis:{ type:'category', data:dims, axisLabel:{ color:c.ink, fontSize:11 }, axisLine:{lineStyle:{color:c.grid}} },
    visualMap:{ min:-1, max:1, calculable:false, orient:'horizontal', left:'center', bottom:0,
      textStyle:{ color:c.muted }, formatter:function(v){ return v<0?'无数据':(v>=0.6?'高':(v>=0.4?'中':'低')); },
      pieces:[
        { min:0.6, max:1, color:dark2?'#4ade80':'#059669', label:'高 ≥0.6' },
        { min:0.4, lt:0.6, color:dark2?'#fbbf24':'#d97706', label:'中 0.4-0.59' },
        { min:0.3, lt:0.4, color:dark2?'#f87171':'#dc2626', label:'低 <0.4' },
        { min:-1, max:-1, color:dark2?'#1e293b':'#e2e8f0', label:'— 无数据' }
      ] },
    series:[{
      type:'heatmap', data:vals,
      label:{ show:true, formatter:function(p){ return p.value[2]<0 ? '—' : p.value[2].toFixed(2); }, color:c.ink, fontSize:9.5 },
      itemStyle:{ borderColor:dark2?'#111a2c':'#fff', borderWidth:2, borderRadius:4 }
    }]
  });
  inst.setOption(opt);
  CHIPINTEL.registerChart(elId, inst);
};

/* ---------- 5. 置信度分布图 ---------- */
CHIPINTEL.renderConfDist = function(elId, data, dark){
  var el = document.getElementById(elId); if (!el || !window.echarts) return;
  var c = chartColors(dark), dark2 = !!dark;
  var inst = echarts.init(el);
  var cats = ['高 (≥0.8)','中 (0.5-0.79)','低 (0.3-0.49)','数据不足'];
  var vals = [data.high||0, data.mid||0, data.low||0, data.none||0];
  var colors = [dark2?'#4ade80':'#059669', dark2?'#fbbf24':'#d97706', dark2?'#f87171':'#dc2626', dark2?'#64748b':'#94a3b8'];
  var opt = Object.assign(chartBase(c, dark2), {
    title:{ text:data.title||'', subtext:(data.total?('共 '+data.total+' 个数据点 · 中高置信度占比 '+data.pct+'%'):''), left:0, top:0, textStyle:{color:c.ink,fontSize:14,fontWeight:600}, subtextStyle:{color:c.muted,fontSize:11} },
    xAxis:{ type:'category', data:cats, axisLabel:{ color:c.muted }, axisLine:{lineStyle:{color:c.grid}}, axisTick:{show:false} },
    yAxis:{ type:'value', name:'数据点', nameTextStyle:{color:c.muted}, axisLabel:{color:c.muted}, splitLine:{lineStyle:{color:c.grid}} },
    series:[{
      type:'bar', data:vals.map(function(v,i){ return { value:v, itemStyle:{ color:colors[i], borderRadius:[6,6,0,0] } }; }),
      barMaxWidth:56,
      label:{ show:true, position:'top', formatter:function(p){ return p.value; }, color:c.ink, fontSize:12, fontWeight:700 }
    }]
  });
  inst.setOption(opt);
  CHIPINTEL.registerChart(elId, inst);
};

/* ---------- 6. 客户替代机会分布（环形图） ---------- */
CHIPINTEL.renderTierDonut = function(elId, data, dark){
  var el = document.getElementById(elId); if (!el || !window.echarts) return;
  var c = chartColors(dark), dark2 = !!dark;
  var inst = echarts.init(el);
  var opt = Object.assign(chartBase(c, dark2), {
    title:{ text:data.title||'替代机会分布', subtext:data.subtitle||'', left:0, top:0, textStyle:{color:c.ink,fontSize:14,fontWeight:600}, subtextStyle:{color:c.muted,fontSize:11} },
    tooltip:{ trigger:'item', formatter:'{b}: {c} 个客户 ({d}%)' },
    legend:{ bottom:0, textStyle:{color:c.muted} },
    color:[dark2?'#4ade80':'#059669', dark2?'#fbbf24':'#d97706', dark2?'#f87171':'#dc2626'],
    series:[{
      type:'pie', radius:['45%','68%'], center:['50%','48%'], avoidLabelOverlap:true,
      itemStyle:{ borderRadius:8, borderColor:dark2?'#111a2c':'#fff', borderWidth:2 },
      label:{ show:true, formatter:'{b}\n{c}个', color:c.ink, fontSize:11 },
      data:data.items || []
    }]
  });
  inst.setOption(opt);
  CHIPINTEL.registerChart(elId, inst);
};

/* ---------- 7. 趋势预判气泡图 ---------- */
CHIPINTEL.renderTrendScatter = function(elId, data, dark){
  var el = document.getElementById(elId); if (!el || !window.echarts) return;
  var c = chartColors(dark), dark2 = !!dark;
  var inst = echarts.init(el);
  var pts = (data.rows||[]).map(function(r, i){
    return { value:[r.months||12, (r.conf||0.5)*100, r.impact||2], name:r.trend||('趋势'+(i+1)) };
  });
  var opt = Object.assign(chartBase(c, dark2), {
    title:{ text:data.title||'趋势预判：时间窗口 × 置信度', subtext:data.subtitle||'气泡大小=对易兆微影响程度', left:0, top:0, textStyle:{color:c.ink,fontSize:14,fontWeight:600}, subtextStyle:{color:c.muted,fontSize:11} },
    xAxis:{ type:'value', name:'时间窗口（月）', min:0, max:30, nameTextStyle:{color:c.muted}, axisLabel:{color:c.muted}, splitLine:{lineStyle:{color:c.grid}} },
    yAxis:{ type:'value', name:'置信度（%）', min:0, max:100, nameTextStyle:{color:c.muted}, axisLabel:{color:c.muted, formatter:'{value}%'}, splitLine:{lineStyle:{color:c.grid}} },
    series:[{
      type:'scatter', data:pts,
      symbolSize:function(v){ return 12 + v[2]*6; },
      itemStyle:{ color:dark2?'#22d3ee':'#00b4d8', opacity:.8, borderColor:'#fff', borderWidth:1 },
      label:{ show:true, formatter:function(p){ return p.data.name; }, position:'top', color:c.ink, fontSize:10 },
      tooltip:{ formatter:function(p){ return '<b>'+p.data.name+'</b><br/>时间窗口: '+p.data.value[0]+'个月<br/>置信度: '+p.data.value[1]+'%'; } }
    }]
  });
  inst.setOption(opt);
  CHIPINTEL.registerChart(elId, inst);
};
