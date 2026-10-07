// Коллажные приёмы из референса: рваная бумага, брызги краски, буквы-вырезки.

// Детерминированный random, чтобы коллаж не «прыгал» при каждом рендере.
export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

// clip-path с рваными краями. edges: какие стороны рвать ('t','r','b','l').
export function tornPath({ edges = 'trbl', amp = 6, step = 2.2, seed = 1 } = {}) {
  const r = rng(seed);
  const pts = [];
  const jag = (side) => (edges.includes(side) ? amp * (0.25 + r()) : 0);
  const walk = (from, to, fn) => {
    for (let p = from; from < to ? p <= to : p >= to; p += (from < to ? 1 : -1) * step * (0.5 + r())) fn(Math.max(0, Math.min(100, p)));
  };
  walk(0, 100, (x) => pts.push(`${x.toFixed(2)}% ${jag('t').toFixed(1)}px`));
  walk(0, 100, (y) => pts.push(`calc(100% - ${jag('r').toFixed(1)}px) ${y.toFixed(2)}%`));
  walk(100, 0, (x) => pts.push(`${x.toFixed(2)}% calc(100% - ${jag('b').toFixed(1)}px)`));
  walk(100, 0, (y) => pts.push(`${jag('l').toFixed(1)}px ${y.toFixed(2)}%`));
  return `polygon(${pts.join(',')})`;
}

export function tearAll(root = document) {
  root.querySelectorAll('[data-torn]').forEach((el, i) => {
    const seed = Number(el.dataset.seed) || (i + 1) * 7919;
    el.style.clipPath = tornPath({
      edges: el.dataset.torn || 'trbl',
      amp: Number(el.dataset.amp) || 6,
      step: Number(el.dataset.step) || 2.2,
      seed,
    });
  });
}

// Брызги: клякса с «лучами» + капли вокруг (координаты в квадрате 200×200).
export function splatterGeometry({ seed = 3, drops = 26, spikes = 14 } = {}) {
  const r = rng(seed);
  const cx = 100, cy = 100, base = 34;
  let d = '';
  const n = spikes * 6;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const spike = i % 6 === 0 && r() > 0.35 ? base * (0.5 + r() * 0.9) : 0;
    const rad = base * (0.82 + r() * 0.3) + spike;
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rad).toFixed(1)} ${(cy + Math.sin(a) * rad).toFixed(1)}`;
  }
  const dots = [];
  for (let i = 0; i < drops; i++) {
    const a = r() * Math.PI * 2;
    const dist = base * (1.4 + r() * 1.5);
    dots.push({ x: cx + Math.cos(a) * dist, y: cy + Math.sin(a) * dist, r: 1 + r() * (dist < base * 2 ? 5 : 2.6) });
  }
  return { d: `${d}Z`, dots };
}

export function splatterSVG({ color = 'var(--carmine)', ...opts } = {}) {
  const { d, dots } = splatterGeometry(opts);
  const circles = dots.map((c) => `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${c.r.toFixed(1)}"/>`).join('');
  return `<svg viewBox="0 0 200 200" aria-hidden="true" style="fill:${color}"><path d="${d}"/>${circles}</svg>`;
}

export function splatterAll(root = document) {
  root.querySelectorAll('[data-splatter]').forEach((el, i) => {
    el.innerHTML = splatterSVG({
      color: el.dataset.splatter || 'var(--carmine)',
      seed: Number(el.dataset.seed) || 11 + i * 13,
      drops: Number(el.dataset.drops) || 26,
    });
  });
}

// Буквы-вырезки из разных изданий: каждая на своём клочке бумаги.
const LETTER_STYLES = [
  { font: '"Playfair Display", serif', weight: 900, bg: 'var(--paper)', fg: 'var(--ink)' },
  { font: '"Old Standard TT", serif', weight: 700, bg: 'var(--newsprint)', fg: 'var(--ink)' },
  { font: '"Oswald", sans-serif', weight: 700, bg: 'var(--ink)', fg: 'var(--paper)' },
  { font: '"Playfair Display", serif', weight: 400, italic: true, bg: 'var(--paper)', fg: 'var(--carmine)' },
  { font: '"Oswald", sans-serif', weight: 500, bg: 'var(--carmine)', fg: 'var(--paper)' },
  { font: '"Old Standard TT", serif', weight: 400, bg: 'var(--paper)', fg: 'var(--ink)' },
];

export function ransom(el, text, seed = 5) {
  const r = rng(seed);
  el.setAttribute('aria-label', text);
  el.innerHTML = '';
  text.split(' ').forEach((word, wi) => {
    const w = document.createElement('span');
    w.className = 'ransom-word';
    w.setAttribute('aria-hidden', 'true');
    [...word].forEach((ch, ci) => {
      const s = LETTER_STYLES[Math.floor(r() * LETTER_STYLES.length)];
      const l = document.createElement('span');
      l.className = 'ransom-letter';
      l.textContent = ch;
      l.style.cssText = `font-family:${s.font};font-weight:${s.weight};font-style:${s.italic ? 'italic' : 'normal'};`
        + `background:${s.bg};color:${s.fg};--rot:${((r() - 0.5) * 7).toFixed(1)}deg;--dy:${((r() - 0.5) * 0.12).toFixed(2)}em;`
        + `--i:${wi * 6 + ci};font-size:${(0.86 + r() * 0.26).toFixed(2)}em;`;
      l.style.clipPath = tornPath({ edges: 'trbl', amp: 2.5, step: 7, seed: seed * 31 + wi * 17 + ci });
      w.appendChild(l);
    });
    el.appendChild(w);
  });
}

export function decorate(root = document) {
  tearAll(root);
  splatterAll(root);
  root.querySelectorAll('[data-ransom]').forEach((el, i) => ransom(el, el.dataset.ransom, Number(el.dataset.seed) || 5 + i));
}
