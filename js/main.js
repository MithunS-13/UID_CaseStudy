/* TradeX Academy - main.js */

function buildNav(base) {
  const p = base ? '../' : '';
  const nav = [
    { label: 'Home', href: p+'index.html' },
    { label: 'Charting', href: p+'module1/intro-visualization.html', sub: [
      ['Intro to Visualization', p+'module1/intro-visualization.html'],
      ['Candlestick Anatomy',    p+'module1/candlestick-anatomy.html'],
      ['Chart Types',            p+'module1/chart-types.html'],
      ['Volume & Power',         p+'module1/volume-power.html'],
      ['Technical Indicators',   p+'module1/technical-indicators.html'],
      ['Exotic Charts',          p+'module1/exotic-charts.html'],
    ]},
    { label: 'Paper Trading', href: p+'module2/paper-trading-intro.html', sub: [
      ['Paper Trading Intro', p+'module2/paper-trading-intro.html'],
      ['Order Types',         p+'module2/order-types.html'],
      ['Trade Execution',     p+'module2/trade-execution.html'],
      ['Virtual Terminal',    p+'module2/virtual-terminal.html'],
      ['Portfolio Mgmt',      p+'module2/portfolio-management.html'],
    ]},
    { label: 'Analysis', href: p+'module3/trendlines-channels.html', sub: [
      ['Trendlines & Channels', p+'module3/trendlines-channels.html'],
      ['Chart Patterns',        p+'module3/chart-patterns.html'],
      ['Market Depth',          p+'module3/market-depth.html'],
      ['Sector Heatmaps',       p+'module3/sector-heatmaps.html'],
      ['Correlation Matrix',    p+'module3/correlation-matrix.html'],
    ]},
    { label: 'Performance', href: p+'module4/equity-curve.html', sub: [
      ['Equity Curve',       p+'module4/equity-curve.html'],
      ['Risk / Reward',      p+'module4/risk-reward.html'],
      ['Drawdown Analysis',  p+'module4/drawdown-analysis.html'],
      ['Trade Distribution', p+'module4/trade-distribution.html'],
    ]},
    { label: 'Strategies', href: p+'module5/glossary.html', sub: [
      ['Glossary',            p+'module5/glossary.html'],
      ['Backtesting',         p+'module5/backtesting.html'],
      ['Beginner Strategies', p+'module5/beginner-strategies.html'],
    ]},
  ];

  const ls = nav.map(item => {
    if (!item.sub) return `<li><a href="${item.href}">${item.label}</a></li>`;
    const sub = item.sub.map(([l,h]) => `<a href="${h}">${l}</a>`).join('');
    return `<li><a href="${item.href}">${item.label} ▾</a><div class="dropdown">${sub}</div></li>`;
  }).join('');

  const mob = nav.map(item => {
    let html = `<a href="${item.href}">${item.label}</a>`;
    if (item.sub) html += item.sub.map(([l,h]) => `<a href="${h}" style="padding-left:18px;font-size:0.8rem">↳ ${l}</a>`).join('');
    return html;
  }).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <nav class="navbar">
      <div class="nav-wrap">
        <a href="${p}index.html" class="logo">Trade<span>X</span> Academy</a>
        <ul class="nav-list">${ls}</ul>
        <div class="nav-cta"><a href="${p}signin.html" class="btn btn-blue btn-sm">Start Trading</a></div>
        <button class="burger" id="burger">☰</button>
      </div>
    </nav>
    <div class="mobile-menu" id="mob">${mob}
      <a href="${p}signin.html" class="btn btn-blue" style="margin-top:8px;display:inline-block">Start Paper Trading</a>
    </div>`);
  document.getElementById('burger').addEventListener('click', () => document.getElementById('mob').classList.toggle('open'));
}

function initTabs() {
  document.querySelectorAll('.tabs').forEach(bar => {
    bar.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        bar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        const pane = document.getElementById(this.dataset.tab);
        if (pane) pane.classList.add('active');
      });
    });
  });
}

function generateOHLC(count, start, vol) {
  const bars = []; let price = start;
  for (let i = 0; i < count; i++) {
    const o = price, c = +(o + (Math.random()-.48)*vol).toFixed(2);
    bars.push({ open:o, close:c, high:+(Math.max(o,c)+Math.random()*vol*.4).toFixed(2), low:+(Math.min(o,c)-Math.random()*vol*.4).toFixed(2) });
    price = c;
  }
  return bars;
}

function drawCandles(canvas, bars) {
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : canvas.width;
  const W = canvas.width, H = canvas.height;
  const pad = {t:16,r:8,b:18,l:42};
  const cW = W-pad.l-pad.r, cH = H-pad.t-pad.b;
  const px = bars.flatMap(b=>[b.high,b.low]), minP = Math.min(...px)*.998, maxP = Math.max(...px)*1.002, rng = maxP-minP;
  const toY = p => pad.t + cH*(1-(p-minP)/rng);
  const sp = cW/bars.length, bw = sp*.6;
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
  for (let i=0; i<=4; i++) {
    const y = pad.t+(cH/4)*i;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(W-pad.r,y); ctx.stroke();
    ctx.fillStyle='#7a8fa8'; ctx.font='9px monospace'; ctx.textAlign='right';
    ctx.fillText((maxP-(rng/4)*i).toFixed(0), pad.l-2, y+3);
  }
  bars.forEach((b,i) => {
    const x = pad.l+sp*i+sp/2, g = b.close>=b.open, c = g?'#00d4aa':'#ff4757';
    ctx.strokeStyle=c; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(x,toY(b.high)); ctx.lineTo(x,toY(b.low)); ctx.stroke();
    const t = toY(Math.max(b.open,b.close)), bh = Math.max(1,Math.abs(toY(b.open)-toY(b.close)));
    ctx.fillStyle = g?c:'transparent'; ctx.fillRect(x-bw/2,t,bw,bh); ctx.strokeRect(x-bw/2,t,bw,bh);
  });
}

document.addEventListener('DOMContentLoaded', initTabs);
