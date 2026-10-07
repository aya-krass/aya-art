// Share card 1080 × 1350: должна читаться за 5 секунд.
// Верх — МЕЖДУ СТРОК, центр — главная фраза на золоте, ниже — паттерны, низ — пары, футер.
import { rng, splatterGeometry } from './collage.js';

const W = 1080, H = 1350;
const C = {
  ivory: '#F2ECDF', paper: '#FBF8F1', newsprint: '#E3DDD0', ink: '#141210', soft: '#4A453E',
  muted: '#8C857A', carmine: '#A3111F', gold: '#C99A2E',
};
const F = {
  serif: '"Playfair Display", Georgia, serif',
  news: '"Old Standard TT", Georgia, serif',
  sans: 'Manrope, system-ui, sans-serif',
  cond: 'Oswald, "Arial Narrow", sans-serif',
};

export async function ensureFonts() {
  if (!document.fonts) return;
  await Promise.all([
    '900 60px "Playfair Display"', '700 40px "Playfair Display"', 'italic 400 40px "Playfair Display"', '400 40px "Playfair Display"',
    '700 40px "Old Standard TT"', '700 40px Oswald', '500 20px Manrope', '700 20px Manrope',
  ].map((f) => document.fonts.load(f, 'АБВ abc').catch(() => null)));
}

function tornRect(ctx, x, y, w, h, seed, amp = 3, step = 9) {
  const r = rng(seed);
  ctx.beginPath();
  ctx.moveTo(x, y + r() * amp);
  for (let px = x; px <= x + w; px += step * (0.5 + r())) ctx.lineTo(Math.min(px, x + w), y + r() * amp);
  for (let py = y; py <= y + h; py += step * (0.5 + r())) ctx.lineTo(x + w - r() * amp, Math.min(py, y + h));
  for (let px = x + w; px >= x; px -= step * (0.5 + r())) ctx.lineTo(Math.max(px, x), y + h - r() * amp);
  for (let py = y + h; py >= y; py -= step * (0.5 + r())) ctx.lineTo(x + r() * amp, Math.max(py, y));
  ctx.closePath();
}

function shadowed(ctx, fn) {
  ctx.save();
  ctx.shadowColor = 'rgba(20,18,16,.28)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 6;
  fn();
  ctx.restore();
}

function wrap(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function ransomTitle(ctx, text, x, y, size) {
  const styles = [
    [`900 ${size}px ${F.serif}`, C.paper, C.ink],
    [`700 ${size}px ${F.news}`, C.newsprint, C.ink],
    [`700 ${size * 0.92}px ${F.cond}`, C.ink, C.paper],
    [`italic 400 ${size}px ${F.serif}`, C.paper, C.carmine],
    [`700 ${size * 0.92}px ${F.cond}`, C.carmine, C.paper],
  ];
  const r = rng(9);
  let cx = x;
  for (const ch of text.toUpperCase()) {
    if (ch === ' ') { cx += size * 0.38; continue; }
    const [font, bg, fg] = styles[Math.floor(r() * styles.length)];
    ctx.font = font;
    const w = ctx.measureText(ch).width + size * 0.22;
    const h = size * 1.08;
    const rot = (r() - 0.5) * 0.11;
    const dy = (r() - 0.5) * size * 0.12;
    ctx.save();
    ctx.translate(cx + w / 2, y + dy);
    ctx.rotate(rot);
    shadowed(ctx, () => { tornRect(ctx, -w / 2, -h / 2, w, h, Math.floor(r() * 1e5), 2.5, 7); ctx.fillStyle = bg; ctx.fill(); });
    ctx.fillStyle = fg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ch, 0, size * 0.04);
    ctx.restore();
    cx += w + size * 0.05;
  }
}

function velvet(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(x, 0, x + w, 0);
  const stops = ['#3a040a', '#7d0b17', '#b8172a', '#d63446', '#a3111f', '#5e0811', '#3a040a'];
  const folds = Math.max(2, Math.round(w / 36));
  for (let f = 0; f < folds; f++) {
    stops.forEach((c, i) => g.addColorStop(Math.min(1, (f + i / (stops.length - 1)) / folds), c));
  }
  ctx.save();
  tornRect(ctx, x - 20, y, w + 20, h, 41, 12, 14);
  ctx.fillStyle = g;
  ctx.fill();
  const shade = ctx.createLinearGradient(0, y, 0, y + h);
  shade.addColorStop(0, 'rgba(0,0,0,.35)'); shade.addColorStop(0.2, 'rgba(0,0,0,0)');
  shade.addColorStop(0.8, 'rgba(0,0,0,0)'); shade.addColorStop(1, 'rgba(0,0,0,.45)');
  ctx.fillStyle = shade;
  ctx.fill();
  ctx.restore();
}

function splatter(ctx, x, y, size, color, seed) {
  const { d, dots } = splatterGeometry({ seed });
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 200, size / 200);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(d));
  dots.forEach((p) => { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); });
  ctx.restore();
}

// Раскладка с масштабом: если текст длинный, уменьшаем шрифты, пока всё не влезет.
function layout(ctx, data, s) {
  const left = 130, right = W - 80, maxW = right - left;
  const blocks = [];
  let y = 250;

  ctx.font = `400 ${Math.round(54 * s)}px ${F.serif}`;
  const phraseLH = Math.round(54 * s * 1.28);
  const phraseLines = wrap(ctx, data.main_insight, maxW - 30);
  blocks.push({ type: 'phrase', y, lines: phraseLines, lh: phraseLH, size: Math.round(54 * s) });
  y += phraseLines.length * phraseLH + 14;

  blocks.push({ type: 'areas', y, size: Math.round(24 * s) });
  y += Math.round(64 * s);

  blocks.push({ type: 'label', y, text: 'ПАТТЕРНЫ' });
  y += 40;
  const pSize = Math.round(34 * s);
  ctx.font = `700 ${pSize}px ${F.serif}`;
  for (const [i, p] of data.patterns.slice(0, 3).entries()) {
    const lines = wrap(ctx, p.title, maxW - 80);
    blocks.push({ type: 'pattern', y, n: i + 1, lines, size: pSize });
    y += lines.length * pSize * 1.2 + Math.round(18 * s);
  }
  y += Math.round(26 * s);

  blocks.push({ type: 'label', y, text: 'ПО ОДНОЙ ПРИЧИНЕ' });
  y += 40;
  const qSize = Math.round(28 * s);
  ctx.font = `500 ${qSize}px ${F.sans}`;
  for (const pair of data.unexpected_connections.slice(0, 3)) {
    const lines = wrap(ctx, `${pair.item_1}  ↔  ${pair.item_2}`, maxW);
    blocks.push({ type: 'pair', y, lines, size: qSize });
    y += lines.length * qSize * 1.3 + Math.round(12 * s);
  }
  return { blocks, bottom: y, left, maxW };
}

export async function renderShareCard(canvas, data, url) {
  await ensureFonts();
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = C.ivory;
  ctx.fillRect(0, 0, W, H);

  velvet(ctx, 0, 0, 74, H);
  splatter(ctx, W - 300, -110, 420, C.carmine, 7);
  splatter(ctx, W - 210, H - 300, 180, C.ink, 29);

  ransomTitle(ctx, 'Между строк', 130, 140, 62);

  const FOOTER_Y = 1215;
  let s = 1.3, L;
  do { L = layout(ctx, data, s); s -= 0.04; } while (L.bottom > FOOTER_Y - 30 && s > 0.55);

  for (const b of L.blocks) {
    if (b.type === 'phrase') {
      ctx.font = `400 ${b.size}px ${F.serif}`;
      ctx.textBaseline = 'alphabetic';
      b.lines.forEach((line, i) => {
        const w = ctx.measureText(line).width;
        const top = b.y + i * b.lh;
        tornRect(ctx, L.left - 10, top + b.lh * 0.08, w + 20, b.lh * 0.9, 300 + i, 3, 10);
        ctx.fillStyle = C.gold;
        ctx.fill();
        ctx.fillStyle = C.ink;
        ctx.fillText(line, L.left, top + b.lh * 0.74);
      });
    } else if (b.type === 'areas') {
      ctx.font = `italic 400 ${b.size}px ${F.serif}`;
      ctx.fillStyle = C.soft;
      ctx.fillText(`Это повторилось в ${data.areas_count} ${spheres(data.areas_count)} моих выборов.`, L.left, b.y + b.size);
    } else if (b.type === 'label') {
      ctx.font = `700 17px ${F.sans}`;
      ctx.fillStyle = C.muted;
      ctx.fillText(spaced(b.text), L.left, b.y + 20);
      ctx.fillRect(L.left, b.y + 30, 60, 2);
    } else if (b.type === 'pattern') {
      ctx.font = `italic 400 ${b.size}px ${F.serif}`;
      ctx.fillStyle = C.carmine;
      ctx.fillText(String(b.n).padStart(2, '0'), L.left, b.y + b.size);
      ctx.font = `700 ${b.size}px ${F.serif}`;
      ctx.fillStyle = C.ink;
      b.lines.forEach((line, i) => ctx.fillText(line, L.left + 72, b.y + b.size + i * b.size * 1.2));
    } else if (b.type === 'pair') {
      ctx.font = `500 ${b.size}px ${F.sans}`;
      ctx.fillStyle = C.ink;
      b.lines.forEach((line, i) => ctx.fillText(line, L.left, b.y + b.size + i * b.size * 1.3));
    }
  }

  // Футер
  ctx.fillStyle = C.ink;
  ctx.fillRect(130, FOOTER_Y, W - 210, 2);
  ctx.font = `italic 400 28px ${F.serif}`;
  ctx.fillText('Что повторяется в моих выборах', 130, FOOTER_Y + 56);
  ctx.font = `700 18px ${F.sans}`;
  ctx.fillStyle = C.soft;
  ctx.textAlign = 'right';
  ctx.fillText(spaced(`МЕЖДУ СТРОК${url ? ` · ${url}` : ''}`), W - 80, FOOTER_Y + 52);
  ctx.textAlign = 'left';
  return canvas;
}

function spaced(t) { return t.split('').join(' '); }

function spheres(n) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'сфере';
  return 'сферах';
}
