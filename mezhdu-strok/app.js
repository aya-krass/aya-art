import { QUESTIONS, ENABLE_SAME_REASON, PROMPT_2_TEXT, buildPrompt1, formatAnswers } from './prompts.js';
import { decorate } from './collage.js';
import { renderShareCard } from './sharecard.js';
import { DEMO_ANSWERS, DEMO_RESULT } from './demo.js';

const CONFIG = {
  apiUrl: 'api/analyze',
  shareUrl: '', // открытое решение №2 из ТЗ; пусто → текущий домен
  minItems: 12,
  maxImages: 4,
};
const DRAFT_KEY = 'mezhdu-strok:draft';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const state = {
  answers: Object.fromEntries(QUESTIONS.map((q) => [q.id, ''])),
  workTags: new Set(),
  workCustom: '',
  images: [], // { type, data, url }
  result: null,
  demo: false,
  page: 0,
  manualStep: 1,
};

/* ---------- Навигация ---------- */
function show(name) {
  $$('.screen').forEach((s) => s.classList.toggle('is-active', s.dataset.screen === name));
  window.scrollTo({ top: 0 });
}
document.addEventListener('click', (e) => {
  const go = e.target.closest('[data-go]');
  if (go) show(go.dataset.go);
});

function toast(text) {
  const t = $('#toast');
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Форма ---------- */
function renderQuestions() {
  $('#questions').innerHTML = QUESTIONS.map((q, i) => {
    const num = String(i + 1).padStart(2, '0');
    if (q.tags) {
      return `<fieldset class="q" style="border:0;margin:0">
        <span class="q-num">${num}</span>
        <div><legend class="q-title">${esc(q.title)}</legend>
          <div class="chips">${q.tags.map((t) => `<button type="button" class="chip" aria-pressed="false" data-tag="${esc(t)}">${esc(t)}</button>`).join('')}</div>
          <input type="text" id="q-work-custom" placeholder="+ своё" aria-label="Своё про работу">
        </div></fieldset>`;
    }
    return `<div class="q">
      <span class="q-num">${num}</span>
      <div><label for="q-${q.id}">${esc(q.title)}</label>
        <textarea id="q-${q.id}" data-q="${q.id}" rows="1" placeholder="${esc(q.example)}"></textarea>
        ${q.images ? `<div class="uploads" id="uploads">
          <label class="upload-btn" for="file">Добавить скриншоты</label>
          <input type="file" id="file" accept="image/*" multiple hidden>
        </div>` : ''}
      </div></div>`;
  }).join('');
}

function workValue() {
  return [...state.workTags, ...splitItems(state.workCustom)].join(', ');
}

function splitItems(text) {
  return String(text || '').split(/[,;\n·•]+/).map((s) => s.trim()).filter((s) => s.length > 1);
}

function collectAnswers() {
  return { ...state.answers, work: workValue() };
}

function countItems() {
  const a = collectAnswers();
  let items = 0, spheres = 0;
  for (const q of QUESTIONS) {
    const n = splitItems(a[q.id]).length;
    items += n;
    if (n) spheres += 1;
  }
  if (state.images.length && !splitItems(a.more).length) spheres += 1;
  return { items, spheres };
}

function updateCounter() {
  const { items, spheres } = countItems();
  const need = Math.max(0, CONFIG.minItems - items);
  const enough = need === 0 || state.images.length > 0;
  $('#counter').innerHTML = `<b>${items}</b> ${plural(items, 'вещь', 'вещи', 'вещей')} · ${spheres} ${plural(spheres, 'сфера', 'сферы', 'сфер')}`
    + (enough ? '' : ` · <span class="need">ещё ${need} для анализа</span>`);
  $('#submit').disabled = !enough;
}

function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

function autosize(el) { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px`; }

function saveDraft() {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ answers: state.answers, workTags: [...state.workTags], workCustom: state.workCustom }));
  } catch { /* приватный режим — просто не сохраняем */ }
}

function loadDraft() {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (d) applyAnswers(d.answers, d.workTags, d.workCustom);
  } catch { /* пустой или битый черновик */ }
}

function applyAnswers(answers = {}, tags = [], custom = '') {
  for (const q of QUESTIONS) {
    if (q.tags) continue;
    state.answers[q.id] = answers[q.id] || '';
    const el = $(`#q-${q.id}`);
    if (el) { el.value = state.answers[q.id]; autosize(el); }
  }
  state.workTags = new Set(tags);
  state.workCustom = custom;
  $$('.chip').forEach((c) => c.setAttribute('aria-pressed', String(state.workTags.has(c.dataset.tag))));
  $('#q-work-custom').value = custom;
  updateCounter();
}

function bindForm() {
  $('#questions').addEventListener('input', (e) => {
    if (e.target.dataset.q) { state.answers[e.target.dataset.q] = e.target.value; autosize(e.target); }
    if (e.target.id === 'q-work-custom') state.workCustom = e.target.value;
    updateCounter();
    saveDraft();
  });
  $('#questions').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const tag = chip.dataset.tag;
    state.workTags.has(tag) ? state.workTags.delete(tag) : state.workTags.add(tag);
    chip.setAttribute('aria-pressed', String(state.workTags.has(tag)));
    updateCounter();
    saveDraft();
  });
  $('#file').addEventListener('change', async (e) => {
    const files = [...e.target.files].slice(0, CONFIG.maxImages - state.images.length);
    for (const f of files) state.images.push(await shrinkImage(f));
    if (e.target.files.length > files.length) toast(`Не больше ${CONFIG.maxImages} скриншотов`);
    e.target.value = '';
    renderThumbs();
    updateCounter();
  });
  $('#uploads').addEventListener('click', (e) => {
    const rm = e.target.closest('[data-rm]');
    if (!rm) return;
    state.images.splice(Number(rm.dataset.rm), 1);
    renderThumbs();
    updateCounter();
  });
  $('#form').addEventListener('submit', (e) => { e.preventDefault(); analyze(); });
  $('#fill-example').addEventListener('click', () => {
    applyAnswers(DEMO_ANSWERS, ['придумывать новое', 'строить систему', 'делать красиво'], '');
    saveDraft();
    toast('Заполнено примером из подсказок');
  });
  $('#copy-manual').addEventListener('click', copyManualPrompt);
}

function renderThumbs() {
  $$('.thumb', $('#uploads')).forEach((t) => t.remove());
  state.images.forEach((img, i) => {
    const el = document.createElement('div');
    el.className = 'thumb';
    el.style.setProperty('--rot', `${(i % 2 ? 2 : -2)}deg`);
    el.innerHTML = `<img src="${img.url}" alt="Скриншот ${i + 1}"><button type="button" data-rm="${i}" aria-label="Убрать скриншот">×</button>`;
    $('#uploads').appendChild(el);
  });
}

function shrinkImage(file, max = 1400) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      const url = c.toDataURL('image/jpeg', 0.85);
      URL.revokeObjectURL(img.src);
      resolve({ type: 'image/jpeg', data: url.split(',')[1], url });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

async function copyManualPrompt() {
  const btn = $('#copy-manual');
  const text = state.manualStep === 1
    ? buildPrompt1(formatAnswers(collectAnswers()), 'text', ENABLE_SAME_REASON)
    : PROMPT_2_TEXT;
  try {
    await navigator.clipboard.writeText(text);
    if (state.manualStep === 1) {
      toast('Промпт 1 с ответами скопирован. Вставь в новый чат Claude.');
      state.manualStep = 2;
      btn.textContent = 'Скопировать промпт 2 (критик)';
    } else {
      toast('Промпт 2 скопирован. Отправь следующим сообщением.');
      state.manualStep = 1;
      btn.textContent = 'Скопировать промпт для ручного теста';
    }
  } catch {
    toast('Браузер не дал доступ к буферу обмена');
  }
}

/* ---------- Анализ ---------- */
const LOADING_PHRASES = [
  'Раскладываю вещи на свойства',
  'Смотрю не на жанр, а на то, как вещь устроена',
  'Ищу одинаковые механизмы в разных сферах',
  'Еда и работа весят больше, чем два фильма',
  'Смотрю, чего в выборах нет',
  'Редактор вычёркивает то, что подошло бы всем',
  'Проверяю, что у каждой связи есть доказательства',
];

function startLoading() {
  show('loading');
  const phrase = $('#loading-phrase');
  const scraps = $('#loading-scraps');
  const items = QUESTIONS.flatMap((q) => splitItems(collectAnswers()[q.id])).sort(() => Math.random() - 0.5).slice(0, 14);
  scraps.innerHTML = '';
  let i = 0;
  phrase.textContent = LOADING_PHRASES[0];
  const tick = setInterval(() => {
    i += 1;
    phrase.classList.add('fade');
    setTimeout(() => { phrase.textContent = LOADING_PHRASES[i % LOADING_PHRASES.length]; phrase.classList.remove('fade'); }, 400);
  }, 3200);
  let k = 0;
  const drip = setInterval(() => {
    if (k >= items.length) return;
    const s = document.createElement('span');
    s.textContent = items[k];
    s.style.setProperty('--rot', `${(Math.random() - 0.5) * 6}deg`);
    if (Math.random() > 0.6) s.className = 'hit';
    scraps.appendChild(s);
    k += 1;
  }, 1100);
  return () => { clearInterval(tick); clearInterval(drip); };
}

async function analyze() {
  const stop = startLoading();
  try {
    const res = await fetch(CONFIG.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: collectAnswers(), images: state.images.map(({ type, data }) => ({ type, data })) }),
    });
    if (!res.ok) throw new Error([404, 405, 501].includes(res.status) ? 'no_server' : `http_${res.status}`);
    const { result } = await res.json();
    if (!result?.main_insight) throw new Error('bad_result');
    openResult(result, false);
  } catch (err) {
    showError(err);
  } finally {
    stop();
  }
}

function showError(err) {
  const msg = err.message === 'no_server' || err instanceof TypeError
    ? 'Сервер анализа здесь не подключён. Можно посмотреть пример результата или скопировать промпт для ручного теста в форме.'
    : err.message === 'http_429'
      ? 'Слишком много запросов. Подожди минуту и попробуй ещё раз.'
      : err.message === 'http_422'
        ? 'Модель отказалась отвечать на эти ответы. Попробуй переформулировать что-то из списка.'
        : 'Анализ не получился. Попробуй ещё раз, ответы сохранены.';
  $('#error-text').textContent = msg;
  show('error');
}

/* ---------- Результат ---------- */
function pagesFor(result) {
  const pages = ['insight', 'patterns', 'pairs'];
  if (ENABLE_SAME_REASON && result.same_reason?.length) pages.push('same');
  pages.push('share');
  return pages;
}

function openResult(result, demo) {
  state.result = result;
  state.demo = demo;
  state.page = 0;
  renderResult();
  show('result');
}

function renderResult() {
  const r = state.result;
  const pages = pagesFor(r);
  const demoFlag = state.demo ? '<span class="demo-flag">Пример результата</span>' : '';
  const html = {
    insight: `
      <div class="velvet" data-torn="l" data-amp="10" data-seed="77" aria-hidden="true"></div>
      <div class="splatter s-insight" data-splatter="var(--carmine)" data-seed="5"></div>
      ${demoFlag}
      <h2 class="ransom ransom-md" data-ransom="Между строк" data-seed="9"></h2>
      <p class="insight-phrase"><span class="hl">${esc(r.main_insight)}</span></p>
      <p class="insight-meta"><span class="num">${esc(r.areas_count)}</span> Это повторилось в ${esc(r.areas_count)} ${plural(Number(r.areas_count), 'сфере', 'сферах', 'сферах')} твоих выборов.</p>
      <div class="page-next"><button class="btn btn-primary" data-next>Как это связано</button></div>`,
    patterns: `
      <p class="kicker">Паттерны</p>
      <h2 class="page-title">Что повторяется</h2>
      <p class="page-lede">Три связи, которые держатся на вещах из разных сфер.</p>
      <div class="patterns">${r.patterns.slice(0, 3).map((p, i) => `
        <article class="pattern">
          <span class="pattern-num">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="pattern-title">${esc(p.title)}</h3>
          <p class="pattern-desc">${esc(p.description)}</p>
          <ul class="evidence">${p.evidence.map((ev, j) => `
            <li><button type="button" aria-expanded="false" aria-controls="ev-${i}-${j}">${esc(ev.item)}</button></li>`).join('')}
          </ul>
          ${p.evidence.map((ev, j) => `<p class="evidence-reason" id="ev-${i}-${j}">${esc(ev.reason)}</p>`).join('')}
        </article>`).join('')}
      </div>
      <p class="hint">Нажми на вещь, чтобы увидеть, почему она здесь.</p>
      <div class="page-next"><button class="btn btn-primary" data-next>Неожиданные пары</button></div>`,
    pairs: `
      <p class="kicker">Неожиданные пары</p>
      <h2 class="page-title">Вещи, которые тебе нравятся по одной причине.</h2>
      <div class="pairs" style="margin-top:48px">${r.unexpected_connections.slice(0, 3).map((c) => `
        <div class="pair">
          <div class="pair-item">${esc(c.item_1)}</div>
          <span class="pair-link" aria-label="и">↔</span>
          <div class="pair-item alt">${esc(c.item_2)}</div>
          <p class="pair-text">${esc(c.connection)}</p>
        </div>`).join('')}
      </div>
      <div class="page-next"><button class="btn btn-primary" data-next>Что ещё</button></div>`,
    same: `
      <p class="kicker">Гипотеза</p>
      <h2 class="page-title">По той же причине тебе может понравиться</h2>
      <p class="page-lede">Этих вещей нет в твоих ответах. Попало или мимо?</p>
      <div class="same">${(r.same_reason || []).slice(0, 3).map((s, i) => `
        <article class="same-card">
          <h3 class="same-item">${esc(s.item)}</h3>
          <p class="same-pattern">${esc(s.pattern)}</p>
          <div class="vote" role="group" aria-label="Оценка">
            <button type="button" aria-pressed="false" data-vote="${i}:hit">попало</button>
            <button type="button" aria-pressed="false" data-vote="${i}:miss">мимо</button>
          </div>
        </article>`).join('')}
      </div>
      <div class="page-next"><button class="btn btn-primary" data-next>Карточка</button></div>`,
    share: `
      <p class="kicker">Share card</p>
      <h2 class="page-title">Что повторяется в моих выборах</h2>
      <div class="share-layout">
        <canvas class="share-preview" id="share-canvas" width="1080" height="1350" aria-label="Карточка результата"></canvas>
        <div class="share-actions">
          <p>Вертикальная карточка 1080 × 1350 для сторис и постов. Главная фраза, три паттерна и три пары.</p>
          <button class="btn btn-primary" id="share-download">Скачать PNG</button>
          <button class="btn btn-ghost" id="share-native" hidden>Отправить</button>
          <button class="link-quiet" id="restart">Начать заново</button>
        </div>
      </div>`,
  };

  $('#result-pages').innerHTML = pages.map((p, i) =>
    `<div class="page ${p}-page${i === state.page ? ' is-active' : ''}" data-page="${p}">${html[p]}</div>`).join('');
  decorate($('#result-pages'));
  goPage(state.page);
}

function goPage(i) {
  const pages = $$('.page');
  state.page = Math.max(0, Math.min(pages.length - 1, i));
  pages.forEach((p, j) => p.classList.toggle('is-active', j === state.page));
  $('#result-counter').textContent = `${String(state.page + 1).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')}`;
  $('#progress-bar').style.width = `${((state.page + 1) / pages.length) * 100}%`;
  window.scrollTo({ top: 0 });
  if (pages[state.page].dataset.page === 'share') drawShare();
}

async function drawShare() {
  const canvas = $('#share-canvas');
  await renderShareCard(canvas, state.result, CONFIG.shareUrl || location.host);
  const native = $('#share-native');
  canvas.toBlob((blob) => {
    state.shareBlob = blob;
    const file = new File([blob], 'mezhdu-strok.png', { type: 'image/png' });
    native.hidden = !(navigator.canShare && navigator.canShare({ files: [file] }));
  }, 'image/png');
}

function bindResult() {
  $('#result-pages').addEventListener('click', async (e) => {
    if (e.target.closest('[data-next]')) return goPage(state.page + 1);

    const ev = e.target.closest('.evidence button');
    if (ev) {
      const open = ev.getAttribute('aria-expanded') !== 'true';
      ev.setAttribute('aria-expanded', String(open));
      $(`#${ev.getAttribute('aria-controls')}`).classList.toggle('show', open);
      return;
    }

    const vote = e.target.closest('[data-vote]');
    if (vote) {
      $$('button', vote.parentElement).forEach((b) => b.setAttribute('aria-pressed', String(b === vote)));
      return;
    }

    if (e.target.closest('#share-download')) {
      const a = document.createElement('a');
      a.href = $('#share-canvas').toDataURL('image/png');
      a.download = 'mezhdu-strok.png';
      a.click();
      return;
    }
    if (e.target.closest('#share-native') && state.shareBlob) {
      const file = new File([state.shareBlob], 'mezhdu-strok.png', { type: 'image/png' });
      try { await navigator.share({ files: [file], title: 'Между строк' }); } catch { /* отменили */ }
      return;
    }
    if (e.target.closest('#restart')) show('form');
  });
  $('#result-back').addEventListener('click', () => (state.page === 0 ? show('form') : goPage(state.page - 1)));
  document.addEventListener('keydown', (e) => {
    if (!$('[data-screen="result"]').classList.contains('is-active')) return;
    if (e.key === 'ArrowRight') goPage(state.page + 1);
    if (e.key === 'ArrowLeft') goPage(state.page - 1);
  });
  $('#retry').addEventListener('click', analyze);
  $('#show-demo').addEventListener('click', () => openResult(DEMO_RESULT, true));
}

/* ---------- Старт ---------- */
renderQuestions();
bindForm();
bindResult();
loadDraft();
updateCounter();
decorate(document);

const params = new URLSearchParams(location.search);
if (params.has('demo')) openResult(DEMO_RESULT, true);

