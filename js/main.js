/* ============================================================
   TRADEX ACADEMY — Shared JavaScript
   ============================================================ */

/* ---- Navigation Data ---- */
const NAV_DATA = [
  {
    label: 'Module 1: Visual Foundation',
    items: [
      { icon: '📊', label: 'Intro to Financial Data Viz', href: 'module1/intro-visualization.html' },
      { icon: '🕯️', label: 'Anatomy of a Candlestick',   href: 'module1/candlestick-anatomy.html' },
      { icon: '📈', label: 'Comparative Chart Types',     href: 'module1/chart-types.html' },
      { icon: '🔮', label: 'Exotic Charting Styles',      href: 'module1/exotic-charts.html' },
      { icon: '📦', label: 'The Power of Volume',         href: 'module1/volume-power.html' },
      { icon: '⚙️', label: 'Technical Indicators 101',    href: 'module1/technical-indicators.html' },
    ]
  },
  {
    label: 'Module 2: Paper Trading',
    items: [
      { icon: '📝', label: 'What is Paper Trading?',     href: 'module2/paper-trading-intro.html' },
      { icon: '🖥️', label: 'Navigating the Terminal',    href: 'module2/virtual-terminal.html' },
      { icon: '🎯', label: 'Order Types Explained',      href: 'module2/order-types.html' },
      { icon: '💼', label: 'Portfolio Management',       href: 'module2/portfolio-management.html' },
      { icon: '⚡', label: 'Trade Execution Flow',       href: 'module2/trade-execution.html' },
    ]
  },
  {
    label: 'Module 3: Advanced Analysis',
    items: [
      { icon: '📐', label: 'Trendlines & Channels',      href: 'module3/trendlines-channels.html' },
      { icon: '🔺', label: 'Geometric Chart Patterns',   href: 'module3/chart-patterns.html' },
      { icon: '📚', label: 'Market Depth & Level 2',     href: 'module3/market-depth.html' },
      { icon: '🌡️', label: 'Sector Rotation Heatmaps',  href: 'module3/sector-heatmaps.html' },
      { icon: '🔗', label: 'Correlation Matrix',         href: 'module3/correlation-matrix.html' },
    ]
  },
  {
    label: 'Module 4: Performance Analytics',
    items: [
      { icon: '📉', label: 'The Equity Curve',           href: 'module4/equity-curve.html' },
      { icon: '⚖️', label: 'Risk vs Reward',             href: 'module4/risk-reward.html' },
      { icon: '📊', label: 'Trade Distribution',         href: 'module4/trade-distribution.html' },
      { icon: '🌊', label: 'Drawdown Analysis',          href: 'module4/drawdown-analysis.html' },
    ]
  },
  {
    label: 'Module 5: Resources',
    items: [
      { icon: '📖', label: 'Glossary of Terms',          href: 'module5/glossary.html' },
      { icon: '🔄', label: 'Backtesting vs Paper Trading',href: 'module5/backtesting.html' },
      { icon: '🚀', label: 'Top 5 Beginner Strategies',  href: 'module5/beginner-strategies.html' },
    ]
  }
];

/* ---- Inject Navigation ---- */
function buildNav(base = '') {
  const isHome = base === '';
  const prefix = isHome ? '' : '../';

  const ddLinks = NAV_DATA.map(group => {
    const items = group.items.map(it =>
      `<a href="${prefix}${it.href}">
        <span class="dd-icon">${it.icon}</span>${it.label}
      </a>`
    ).join('');
    const shortLabel = group.label.replace(/^Module \d+: /, '');
    return `
      <li>
        <a href="#">${shortLabel} <span class="chevron">▾</span></a>
        <div class="dropdown">${items}</div>
      </li>`;
  }).join('');

  const mobileNav = NAV_DATA.map(group =>
    `<div class="mobile-nav-section">${group.label}</div>` +
    group.items.map(it => `<a href="${prefix}${it.href}">${it.icon} ${it.label}</a>`).join('')
  ).join('');

  const html = `
  <nav class="navbar">
    <div class="nav-inner">
      <a href="${prefix}index.html" class="nav-logo">
        <div class="logo-icon">📈</div>
        Trade<span>X</span> Academy
      </a>
      <ul class="nav-links">
        <li><a href="${prefix}index.html">Home</a></li>
        ${ddLinks}
      </ul>
      <div class="nav-actions">
        <a href="${prefix}module2/virtual-terminal.html" class="btn btn-primary btn-sm">Start Trading</a>
      </div>
      <button class="nav-burger" id="burger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
  <div class="mobile-nav" id="mobileNav">
    <a href="${prefix}index.html" style="font-weight:700;color:var(--text-primary)">🏠 Home</a>
    ${mobileNav}
    <a href="${prefix}module2/virtual-terminal.html" class="btn btn-primary" style="margin-top:12px">Start Paper Trading</a>
  </div>`;

  document.body.insertAdjacentHTML('afterbegin', html);

  document.getElementById('burger').addEventListener('click', () => {
    document.getElementById('mobileNav').classList.toggle('open');
  });

  // JS-controlled dropdowns — no CSS :hover (prevents flicker)
  _initDropdowns();

  // Close dropdowns when clicking outside nav
  document.addEventListener('click', e => {
    if (!e.target.closest('.navbar')) _closeAllDropdowns();
  });
}

/* ---- Dropdown Controller ---- */
function _closeAllDropdowns() {
  document.querySelectorAll('.nav-links > li > .dropdown').forEach(dd => dd.classList.remove('open'));
}

function _initDropdowns() {
  let closeTimer = null;

  document.querySelectorAll('.nav-links > li').forEach(li => {
    const trigger = li.querySelector('a');
    const dd = li.querySelector('.dropdown');
    if (!dd) return;

    // Open on mouseenter
    li.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      _closeAllDropdowns();       // close sibling dropdowns first
      dd.classList.add('open');
    });

    // Delayed close on mouseleave — prevents flicker when cursor briefly leaves
    li.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => dd.classList.remove('open'), 120);
    });

    // Keep open when mouse re-enters the dropdown itself
    dd.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    dd.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => dd.classList.remove('open'), 120);
    });

    // Also toggle on click (touch devices)
    trigger.addEventListener('click', e => {
      if (dd) { e.preventDefault(); dd.classList.toggle('open'); }
    });
  });
}

/* ---- Tabs ---- */
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabBar => {
    const buttons = tabBar.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.tab;
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        const pane = document.getElementById(target);
        if (pane) pane.classList.add('active');
      });
    });
  });
}

/* ---- Scroll Animations ---- */
function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('fade-up'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

/* ---- Shared Chart Helpers ---- */
const CHART_COLORS = {
  green:  '#00d4aa',
  red:    '#ff4757',
  blue:   '#3b82f6',
  gold:   '#f59e0b',
  purple: '#8b5cf6',
  cyan:   '#06b6d4',
  gridLine: 'rgba(255,255,255,0.04)',
  textMuted: '#7a8fa8',
};

function chartDefaults() {
  Chart.defaults.color = CHART_COLORS.textMuted;
  Chart.defaults.borderColor = CHART_COLORS.gridLine;
  Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  Chart.defaults.font.size = 11;
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.tooltip.backgroundColor = '#0d1525';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(59,130,246,0.2)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.titleFont = { weight: '600', size: 12 };

  // Performance: disable animations globally — biggest single perf win
  Chart.defaults.animation = false;
  Chart.defaults.animations = false;
  Chart.defaults.transitions = {};

  // Prevent canvas from growing beyond its container
  // Charts use maintainAspectRatio: false with a fixed canvas height attribute —
  // we force the resize observer to cap at the canvas's natural clientHeight
  const _orig = Chart.prototype.resize;
  Chart.prototype.resize = function(width, height) {
    const canvas = this.canvas;
    const maxH = parseInt(canvas.getAttribute('height') || '400', 10);
    // clamp: never allow the chart to grow taller than its initial height attribute
    if (height && height > maxH * 1.05) height = maxH;
    _orig.call(this, width, height);
  };
}

/* ---- Price Generator ---- */
function generatePrices(count, start, volatility = 1) {
  const prices = [start];
  for (let i = 1; i < count; i++) {
    const change = (Math.random() - 0.48) * volatility;
    prices.push(Math.max(1, +(prices[i-1] + change).toFixed(2)));
  }
  return prices;
}

function generateOHLC(count, start = 100, vol = 2) {
  const bars = [];
  let price = start;
  for (let i = 0; i < count; i++) {
    const open  = price;
    const close = +(open + (Math.random() - 0.48) * vol).toFixed(2);
    const high  = +(Math.max(open, close) + Math.random() * vol * 0.5).toFixed(2);
    const low   = +(Math.min(open, close) - Math.random() * vol * 0.5).toFixed(2);
    bars.push({ open, high, low, close });
    price = close;
  }
  return bars;
}

/* ---- Candlestick Canvas Renderer ---- */
function drawCandlesticks(canvas, bars, opts = {}) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const pad = opts.pad || { top: 20, right: 20, bottom: 30, left: 50 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  const allPrices = bars.flatMap(b => [b.high, b.low]);
  const minP = Math.min(...allPrices) * 0.998;
  const maxP = Math.max(...allPrices) * 1.002;
  const range = maxP - minP;

  const toY = p => pad.top + chartH * (1 - (p - minP) / range);
  const barW = (chartW / bars.length) * 0.6;
  const spacing = chartW / bars.length;

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = pad.top + (chartH / 5) * i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
    const price = maxP - (range / 5) * i;
    ctx.fillStyle = '#7a8fa8'; ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(price.toFixed(2), pad.left - 4, y + 4);
  }

  // Candles
  bars.forEach((bar, i) => {
    const x = pad.left + spacing * i + spacing / 2;
    const isGreen = bar.close >= bar.open;
    const color = isGreen ? opts.green || '#00d4aa' : opts.red || '#ff4757';
    const bodyTop  = toY(Math.max(bar.open, bar.close));
    const bodyH    = Math.max(1, Math.abs(toY(bar.open) - toY(bar.close)));

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    // Wick
    ctx.beginPath();
    ctx.moveTo(x, toY(bar.high));
    ctx.lineTo(x, toY(bar.low));
    ctx.stroke();

    // Body
    ctx.fillStyle = color;
    if (isGreen) {
      ctx.fillRect(x - barW / 2, bodyTop, barW, bodyH);
    } else {
      ctx.strokeRect(x - barW / 2, bodyTop, barW, bodyH);
      ctx.globalAlpha = 0.5;
      ctx.fillRect(x - barW / 2, bodyTop, barW, bodyH);
      ctx.globalAlpha = 1;
    }
  });
}

/* ---- Live Ticker Updater ---- */
function startTickerUpdates(el, basePrice, selector) {
  if (!el) return;
  let price = basePrice;
  setInterval(() => {
    price = +(price + (Math.random() - 0.49) * 3).toFixed(2);
    const change = +(price - basePrice).toFixed(2);
    const pct    = +((change / basePrice) * 100).toFixed(2);
    const el2 = document.querySelector(selector);
    if (el2) el2.textContent = price.toLocaleString('en-US', { minimumFractionDigits: 2 });
    const changeEl = document.querySelector(selector + '-change');
    if (changeEl) {
      changeEl.textContent = `${change >= 0 ? '+' : ''}${change} (${pct >= 0 ? '+' : ''}${pct}%)`;
      changeEl.className = change >= 0 ? 'up' : 'down';
    }
  }, 1800);
}

/* ---- Number Formatters ---- */
function fmt(n, decimals = 2) { return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }); }
function fmtPct(n) { return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`; }

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initScrollReveal();
  if (typeof Chart !== 'undefined') chartDefaults();
});
