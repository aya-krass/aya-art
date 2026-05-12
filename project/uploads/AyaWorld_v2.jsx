import { useState, useEffect, useRef } from "react";

// ── Curated fear → power fallbacks (no API needed for deployed version) ──
const FEAR_MAP = [
  { re: /too much|overwhelming|intense|loud/i, power: "You are too much. That is precisely the point.\nThe world is drowning in not-enough.\nBe the flood. Be the excess. Let them handle it.\nStay loud." },
  { re: /seen|visible|noticed|exposed|public|judgment/i, power: "You have always been visible.\nYou were just pretending you could choose otherwise.\nThe question was never whether they would look —\nit was what you would give them to see. Give them everything." },
  { re: /enough|worthy|good|talented|good enough/i, power: "Enough was never the bar.\nYou set it deliberately low to avoid the leap.\nYou are not too little. You have been hoarding yourself.\nOpen the vault." },
  { re: /reject|failure|fail|mistake|wrong/i, power: "Rejection is the shape of a door that was not meant for you.\nYou have not failed. You have been eliminating the wrong rooms.\nThe right one opens from the inside.\nWalk through." },
  { re: /alone|lonely|nobody|no one|unseen/i, power: "Every artist has always been alone in the making.\nThat solitude is not emptiness — it is the studio.\nWork in it.\nThe work will find its people." },
  { re: /perfect|imperfect|flawed|broken|mess/i, power: "Imperfect is how the gold gets in.\nThe crack is not the flaw — it is the whole point.\nMake it broken and make it yours.\nSign it." },
];
const FALLBACKS = [
  "Your fear knows exactly which door you need to walk through.\nIt is standing in front of it.\nPush past.\nThe other side is yours.",
  "What frightens you is the outline of your power.\nTrace it carefully. That shape is your work.\nMake it. Now.",
  "The thing you named is not a wall.\nIt is the gate.\nYou have been standing outside long enough.\nStep through.",
];
function curatedTransform(fear) {
  for (const { re, power } of FEAR_MAP) {
    if (re.test(fear)) return power;
  }
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

async function transformFear(fear) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are AYA — a fearless, theatrical visual artist. Your work is about red, gold, visibility, courage.
Transform this fear into a fierce poetic declaration of power. 2-4 short lines. Second person ("you"). No preamble. 
Start directly. End with one short imperative. Theatrical, alive, red.
Fear: "${fear}"`
        }]
      })
    });
    const data = await res.json();
    const text = data.content?.[0]?.text?.trim();
    return text || curatedTransform(fear);
  } catch {
    return curatedTransform(fear);
  }
}

const CARDS = [
  { p: "Refuse the blindfold.", s: "Today you take what you've been hiding and bring it into the light." },
  { p: "Wear your heart as a crown.", s: "Soft is not small. Tender is not weak." },
  { p: "Open your mouth. Speak red.", s: "The thing you've been swallowing is what you're meant to say." },
  { p: "You are the ace.", s: "Stop apologizing for being dealt strong." },
  { p: "Bleed in color.", s: "What you call too much is exactly enough." },
  { p: "Be loud. Be seen.", s: "Visibility is not vanity. It is survival." },
  { p: "Dare to be the spectacle.", s: "They were always going to look. Give them something." },
  { p: "You are not a secret.", s: "Stop folding yourself small enough to fit." },
  { p: "Tear the velvet.", s: "The pretty thing was holding you in place." },
  { p: "Soft is not small.", s: "Your gentleness is one of your weapons." },
];
const CMDS = [
  { n: "I", t: "Refuse the blindfold." },
  { n: "II", t: "Be loud. Be seen." },
  { n: "III", t: "Wear your heart as a crown." },
  { n: "IV", t: "Soft is not small." },
  { n: "V", t: "Bleed in color." },
  { n: "VI", t: "You are the ace." },
  { n: "VII", t: "Open your mouth. Speak red." },
  { n: "VIII", t: "You are not a secret." },
];

// ══════════════════════════════════════
//  STYLES
// ══════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Montserrat:wght@200;300;400;600&display=swap');

:root {
  --cream: #faf6ef;
  --blush: #edddd0;
  --petal: #e8c9c9;
  --mrose: #b89090;
  --taupe: #7a6b62;
  --sgold: #c8a96e;
  --ink: #080506;
  --oxblood: #140308;
  --red: #c41a2a;
  --red2: #e02638;
  --gold: #d4af37;
  --gold2: #f0ce5e;
  --bone: #efe4cc;
  --dim: #9a8872;
  --serif: 'Cormorant Garant', Georgia, serif;
  --disp: 'Playfair Display', Georgia, serif;
  --sans: 'Montserrat', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { overflow-x: hidden; font-family: var(--serif); -webkit-font-smoothing: antialiased; cursor: crosshair; }

/* ── INK OVERLAY ── */
.ink-veil {
  position: fixed; inset: 0; z-index: 500;
  background: var(--ink);
  clip-path: circle(0% at 50% 50%);
  transition: clip-path 2s cubic-bezier(0.76, 0, 0.24, 1);
  pointer-events: none;
}
.ink-veil.spread { clip-path: circle(160% at 50% 50%); }
.ink-veil.fade { opacity: 0; transition: clip-path 2s cubic-bezier(0.76, 0, 0.24, 1), opacity 1s ease 0.3s; }

/* ══════════════════════
   LIGHT WORLD
══════════════════════ */
.lw { background: var(--cream); color: #2e1f1a; }

/* hero */
.lhero {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
  padding: 80px 24px; position: relative; overflow: hidden;
}
.lhero-glow {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 40%, #fdeee8 0%, var(--cream) 65%);
}
.lhero-floaters { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.fp {
  position: absolute; color: var(--sgold); opacity: 0.2;
  animation: floatP var(--d,7s) var(--del,0s) ease-in-out infinite alternate;
  font-size: 14px; user-select: none;
}
@keyframes floatP {
  from { transform: translateY(0) rotate(0deg); opacity: 0.15; }
  to   { transform: translateY(-30px) rotate(20deg); opacity: 0.3; }
}
.lhero-c { position: relative; z-index: 1; max-width: 640px; }
.lhero-eye {
  font-family: var(--sans); font-size: 10px; letter-spacing: 0.35em;
  color: var(--mrose); text-transform: uppercase; margin-bottom: 32px;
}
.lhero-h1 {
  font-family: var(--disp); font-size: clamp(52px,10vw,108px);
  font-weight: 300; line-height: 0.95; color: #2e1f1a; letter-spacing: -0.02em;
}
.lhero-h1 em { font-style: italic; color: var(--mrose); }
.lhero-tag {
  font-family: var(--serif); font-size: 18px; font-style: italic;
  color: var(--taupe); margin-top: 28px; line-height: 1.8;
}
.scroll-hint {
  margin-top: 60px; display: flex; flex-direction: column; align-items: center;
  gap: 8px; font-family: var(--sans); font-size: 10px;
  letter-spacing: 0.28em; color: var(--mrose); opacity: 0.6;
}
.scroll-line {
  width: 1px; height: 48px;
  background: linear-gradient(to bottom, transparent, var(--mrose));
  animation: sline 2.2s ease-in-out infinite;
}
@keyframes sline {
  0%   { transform: scaleY(0); transform-origin: top; }
  49%  { transform: scaleY(1); transform-origin: top; }
  50%  { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

/* welcome */
.lwelcome {
  padding: 100px 24px; max-width: 680px; margin: 0 auto; text-align: center;
}
.l-orn {
  font-family: var(--sans); font-size: 10px; letter-spacing: 0.32em;
  color: var(--sgold); text-transform: uppercase; margin-bottom: 32px;
}
.l-h2 {
  font-family: var(--disp); font-size: clamp(26px,5vw,52px);
  font-weight: 400; font-style: italic; color: #2e1f1a;
  line-height: 1.3; margin-bottom: 28px;
}
.l-body { font-family: var(--serif); font-size: 18px; color: var(--taupe); line-height: 1.9; }
.l-divider {
  width: 60px; height: 1px; margin: 48px auto;
  background: linear-gradient(to right, transparent, var(--sgold), transparent);
}

/* promises */
.lpromises { padding: 60px 24px 80px; background: #fff8f3; }
.lp-inner { max-width: 580px; margin: 0 auto; }
.lp-item {
  padding: 22px 0; border-bottom: 1px solid rgba(200,169,110,0.2);
  display: flex; gap: 24px; align-items: flex-start;
}
.lp-num {
  font-family: var(--serif); font-size: 30px; color: var(--sgold);
  opacity: 0.45; line-height: 1; flex-shrink: 0; min-width: 28px;
}
.lp-txt {
  font-family: var(--disp); font-size: clamp(18px,2.8vw,26px);
  color: #2e1f1a; line-height: 1.35;
}
.lp-txt em { font-style: italic; color: var(--mrose); }

/* fear section */
.fear-sec {
  padding: 120px 24px 140px; text-align: center; position: relative; overflow: hidden;
}
.fear-sec::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse 70% 80% at 50% 110%, #f5dada 0%, transparent 65%);
}
.fear-inner { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; }
.fear-orn {
  font-family: var(--sans); font-size: 10px; letter-spacing: 0.32em;
  color: var(--mrose); text-transform: uppercase; margin-bottom: 40px; opacity: 0.75;
}
.fear-q {
  font-family: var(--disp); font-size: clamp(28px,5vw,56px);
  font-style: italic; font-weight: 300; color: #2e1f1a; line-height: 1.25; margin-bottom: 12px;
}
.fear-sub {
  font-family: var(--serif); font-size: 16px; color: var(--taupe);
  font-style: italic; margin-bottom: 40px; line-height: 1.7;
}
.fear-ta {
  width: 100%; background: rgba(255,255,255,0.85);
  border: 1px solid rgba(200,169,110,0.4); border-radius: 2px;
  padding: 20px 24px; font-family: var(--serif); font-size: 18px;
  color: #2e1f1a; resize: none; outline: none; line-height: 1.65;
  transition: border-color 0.3s;
}
.fear-ta::placeholder { color: var(--mrose); opacity: 0.55; font-style: italic; }
.fear-ta:focus { border-color: rgba(196,26,42,0.35); }
.dare-btn {
  margin-top: 24px; display: inline-flex; align-items: center; gap: 10px;
  background: transparent; border: 1px solid rgba(196,26,42,0.3);
  color: var(--red); font-family: var(--sans); font-size: 12px;
  letter-spacing: 0.3em; text-transform: uppercase; padding: 16px 44px;
  cursor: pointer; position: relative; overflow: hidden; transition: color 0.4s;
}
.dare-btn::before {
  content: ''; position: absolute; inset: 0; background: var(--red);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.45s cubic-bezier(0.76, 0, 0.24, 1);
}
.dare-btn:hover::before, .dare-btn:active::before { transform: scaleX(1); }
.dare-btn:hover, .dare-btn:active { color: white; }
.dare-btn span { position: relative; z-index: 1; }
.dare-btn:disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
.dare-note {
  margin-top: 14px; font-family: var(--serif); font-size: 13px;
  font-style: italic; color: var(--taupe); opacity: 0.55;
}

/* ══════════════════════
   DARK WORLD
══════════════════════ */
.dw { background: var(--ink); color: var(--bone); }

/* grain overlay */
.dw::after {
  content: ''; position: fixed; inset: -50%; pointer-events: none; z-index: 99;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.94  0 0 0 0 0.88  0 0 0 0 0.8  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='.4'/></svg>");
  opacity: 0.14; mix-blend-mode: overlay;
  animation: grain 1.3s steps(6) infinite;
}
@keyframes grain {
  0%   { transform: translate(0,0); }
  20%  { transform: translate(-3%,2%); }
  40%  { transform: translate(2%,-3%); }
  60%  { transform: translate(-1%,3%); }
  80%  { transform: translate(3%,1%); }
  100% { transform: translate(0,0); }
}

.d-ornament {
  font-family: var(--sans); font-size: 10px; letter-spacing: 0.35em;
  color: var(--gold); text-transform: uppercase; margin-bottom: 40px;
  display: flex; align-items: center; gap: 16px;
}
.d-ornament::before, .d-ornament::after {
  content: ''; flex: 1; height: 1px;
}
.d-ornament::before { background: linear-gradient(to right, transparent, var(--gold)); }
.d-ornament::after  { background: linear-gradient(to left,  transparent, var(--gold)); }
.d-h2 {
  font-family: var(--disp); font-size: clamp(36px,7vw,84px);
  font-weight: 900; color: var(--bone); line-height: 1; margin-bottom: 48px;
}
.d-h2 em { color: var(--red2); font-style: italic; }
.d-h2 .stk { text-decoration: line-through; opacity: 0.35; }

/* power reveal */
.power-sec {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 80px 24px; text-align: center; position: relative; overflow: hidden;
}
.power-sec::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse 50% 50% at 50% 50%, rgba(196,26,42,0.07) 0%, transparent 70%);
}
.power-inner { position: relative; z-index: 1; max-width: 720px; }
.pr-fear-label {
  font-family: var(--sans); font-size: 11px; letter-spacing: 0.22em;
  color: rgba(239,228,204,0.35); text-transform: uppercase; margin-bottom: 48px;
  line-height: 1.8;
}
.pr-fear-label s { color: rgba(196,26,42,0.5); }
.pr-sigil {
  font-size: 52px; color: var(--gold); margin-bottom: 28px;
  animation: psigil 3s ease-in-out infinite;
}
@keyframes psigil { 0%,100% { opacity: 0.75; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }
.pr-power {
  font-family: var(--disp); font-size: clamp(22px,4vw,48px); font-style: italic;
  font-weight: 700; color: var(--bone); line-height: 1.4;
  white-space: pre-line;
  opacity: 0; transform: translateY(16px);
  transition: opacity 0.9s ease, transform 0.9s ease;
}
.pr-power.on { opacity: 1; transform: translateY(0); }
.pr-power em { color: var(--red2); }
.pr-dots { display: flex; gap: 10px; justify-content: center; padding: 40px; }
.pr-dot {
  width: 8px; height: 8px; background: var(--red); border-radius: 50%;
  animation: pdot 1.5s ease-in-out infinite;
}
.pr-dot:nth-child(2) { animation-delay: 0.2s; }
.pr-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes pdot { 0%,80%,100% { transform: scale(0.7); opacity: 0.35; } 40% { transform: scale(1.2); opacity: 1; } }
.pr-scroll {
  margin-top: 64px; font-family: var(--sans); font-size: 10px;
  letter-spacing: 0.28em; color: rgba(239,228,204,0.25); text-transform: uppercase;
  animation: breathe 3.5s ease-in-out infinite;
}
@keyframes breathe { 0%,100% { opacity: 0.25; } 50% { opacity: 0.6; } }

/* manifesto */
.manifesto-sec { padding: 120px 24px; max-width: 820px; margin: 0 auto; }
.cmd-list { list-style: none; }
.cmd-item {
  display: flex; gap: 24px; padding: 20px 0;
  border-bottom: 1px solid rgba(212,175,55,0.12); align-items: flex-start;
}
.cmd-n {
  font-family: var(--sans); font-size: 10px; letter-spacing: 0.2em;
  color: var(--gold); opacity: 0.6; flex-shrink: 0; padding-top: 5px; min-width: 44px;
}
.cmd-t {
  font-family: var(--disp); font-size: clamp(18px,2.8vw,30px);
  color: var(--bone); line-height: 1.3;
}

/* card draw */
.draw-sec {
  padding: 120px 24px; text-align: center;
  background: #0d0508; position: relative; overflow: hidden;
}
.draw-sec::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(to right, transparent, var(--gold), transparent);
}
.draw-inner { max-width: 600px; margin: 0 auto; }
.draw-sub {
  font-family: var(--serif); font-size: 17px; color: rgba(239,228,204,0.55);
  font-style: italic; margin: 16px 0 64px; line-height: 1.7;
}
.card-fan { position: relative; height: 170px; margin: 0 auto 48px; width: 280px; cursor: pointer; }
.crd {
  position: absolute; width: 96px; height: 136px;
  background: #1a0508; border: 1px solid rgba(212,175,55,0.25); border-radius: 6px;
  left: 50%; top: 50%;
  transform: translate(-50%,-50%) rotate(var(--r,0deg)) translateY(var(--ty,0px));
  transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
  display: flex; align-items: center; justify-content: center;
}
.card-fan:hover .crd { transform: translate(-50%,-50%) rotate(var(--r,0deg)) translateY(calc(var(--ty,0px) - 8px)) scale(1.04); }
.crd-glyph { font-size: 30px; color: var(--gold); opacity: 0.65; }
.card-msg {
  min-height: 110px; padding: 32px 24px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
  border: 1px solid rgba(196,26,42,0.2); border-radius: 2px;
  background: rgba(196,26,42,0.04); transition: all 0.5s;
}
.card-phrase {
  font-family: var(--disp); font-size: clamp(18px,3.2vw,30px);
  font-style: italic; color: var(--bone); line-height: 1.3;
}
.card-sub-txt {
  font-family: var(--serif); font-size: 15px; color: rgba(239,228,204,0.55);
  font-style: italic; line-height: 1.6;
}
.draw-hint {
  font-family: var(--sans); font-size: 10px; letter-spacing: 0.25em;
  color: rgba(239,228,204,0.25); text-transform: uppercase; margin-bottom: 32px;
}
.again-btn {
  margin-top: 20px; background: transparent; border: 1px solid rgba(212,175,55,0.3);
  color: var(--gold); font-family: var(--sans); font-size: 11px;
  letter-spacing: 0.25em; text-transform: uppercase; padding: 12px 32px;
  cursor: pointer; transition: background 0.3s;
}
.again-btn:hover { background: rgba(212,175,55,0.08); }

/* signature */
.sign-sec {
  padding: 160px 24px; text-align: center; position: relative; overflow: hidden;
}
.sign-sec::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse 55% 45% at 50% 50%, rgba(196,26,42,0.06) 0%, transparent 70%);
}
.sign-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
.sign-credo {
  font-family: var(--serif); font-size: 19px; line-height: 2;
  color: rgba(239,228,204,0.65); font-style: italic; margin: 40px 0;
}
.sign-credo em { color: var(--bone); font-style: normal; }
.sign-name {
  font-family: var(--disp); font-size: 60px; font-style: italic; color: var(--red2);
  margin-top: 48px; letter-spacing: -0.02em;
}
.sign-links {
  margin-top: 64px; display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;
}
.sign-links a {
  font-family: var(--sans); font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
  color: rgba(239,228,204,0.35); text-decoration: none; transition: color 0.3s;
}
.sign-links a:hover { color: var(--gold); }
.colophon {
  margin-top: 80px; font-family: var(--sans); font-size: 10px;
  letter-spacing: 0.2em; color: rgba(239,228,204,0.18); text-transform: uppercase;
}

@media (max-width: 600px) {
  .fear-q { font-size: 32px; }
  .d-h2 { font-size: 40px; }
  .pr-power { font-size: 24px; }
  .sign-name { font-size: 48px; }
}
`;

// ══════════════════════════════════════
//  LIGHT WORLD
// ══════════════════════════════════════
function LightHero() {
  const petals = Array.from({ length: 14 }, (_, i) => ({
    left: `${(i * 7.1 + 3) % 100}%`,
    top: `${(i * 13.3 + 10) % 90}%`,
    d: `${6 + (i % 4)}s`,
    del: `${(i % 5) * 0.8}s`,
  }));
  return (
    <section className="lhero">
      <div className="lhero-glow" />
      <div className="lhero-floaters">
        {petals.map((p, i) => (
          <div key={i} className="fp" style={{ left: p.left, top: p.top, "--d": p.d, "--del": p.del }}>✦</div>
        ))}
      </div>
      <div className="lhero-c">
        <div className="lhero-eye">A solo exhibition · in one act</div>
        <h1 className="lhero-h1">Aya<br /><em>— World —</em></h1>
        <p className="lhero-tag">A gentle place. For art. For feeling.<br />For everything that is beautiful and true.</p>
        <div className="scroll-hint">
          SCROLL · TO · ENTER
          <div className="scroll-line" />
        </div>
      </div>
    </section>
  );
}

function LightWelcome() {
  return (
    <section className="lwelcome">
      <div className="l-orn">A welcome</div>
      <h2 className="l-h2">Everything here is made<br />with care and quiet intention.</h2>
      <div className="l-divider" />
      <p className="l-body">
        You are safe here. The work is soft. The intention is pure.
        Take your time. There is no rush, no judgment. The door is always open.
      </p>
    </section>
  );
}

const PROMISES = [
  { t: <>This is a place for <em>quiet hearts.</em></> },
  { t: <>Beauty lives here, <em>undisturbed.</em></> },
  { t: <>Softness is welcome. <em>You are welcome.</em></> },
  { t: <>Everything here is <em>gentle and good.</em></> },
  { t: <>There is <em>nothing to be afraid of.</em></> },
];

function LightPromises() {
  return (
    <section className="lpromises">
      <div className="lp-inner">
        {PROMISES.map((p, i) => (
          <div key={i} className="lp-item">
            <div className="lp-num">{i + 1}</div>
            <div className="lp-txt">{p.t}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FearSection({ onDare }) {
  const [fear, setFear] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!fear.trim() || loading) return;
    setLoading(true);
    await onDare(fear.trim());
  };

  return (
    <section className="fear-sec">
      <div className="fear-inner">
        <div className="fear-orn">Before you go further</div>
        <h2 className="fear-q">What are you<br />afraid of?</h2>
        <p className="fear-sub">You can say it here. It won't be held against you.</p>
        <textarea
          className="fear-ta"
          rows={3}
          placeholder="I am afraid of…"
          value={fear}
          onChange={e => setFear(e.target.value)}
          disabled={loading}
        />
        <div>
          <button className="dare-btn" onClick={handleSubmit} disabled={!fear.trim() || loading}>
            <span>{loading ? "transforming your fear…" : "Come if you dare  →"}</span>
          </button>
        </div>
        <div className="dare-note">
          {fear.trim() ? "Your fear will be transformed." : "Write your fear. Then step through."}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════
//  DARK WORLD
// ══════════════════════════════════════
function PowerReveal({ fear, power, loading }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (power) { const t = setTimeout(() => setOn(true), 400); return () => clearTimeout(t); }
  }, [power]);

  return (
    <section className="power-sec">
      <div className="power-inner">
        <div className="pr-fear-label">
          You said you were afraid of<br />
          <s>{fear}</s>
        </div>
        {loading ? (
          <div className="pr-dots">
            <div className="pr-dot" /><div className="pr-dot" /><div className="pr-dot" />
          </div>
        ) : (
          <>
            <div className="pr-sigil">♥</div>
            <div className={`pr-power${on ? " on" : ""}`}>{power}</div>
          </>
        )}
        <div className="pr-scroll">↓ · scroll · to · continue · ↓</div>
      </div>
    </section>
  );
}

function DarkManifesto() {
  return (
    <section className="manifesto-sec">
      <div className="d-ornament">Act II · The Manifesto</div>
      <h2 className="d-h2">
        I would rather be <span className="stk">too much</span><br />
        than <em>almost nothing.</em>
      </h2>
      <ol className="cmd-list">
        {CMDS.map(c => (
          <li key={c.n} className="cmd-item">
            <div className="cmd-n">{c.n}.</div>
            <div className="cmd-t">{c.t}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function DarkCardDraw() {
  const [card, setCard] = useState(null);
  const pick = () => setCard(CARDS[Math.floor(Math.random() * CARDS.length)]);
  const reset = () => setCard(null);
  const fan = [
    { r: "-10deg", ty: "6px" }, { r: "-5deg", ty: "2px" }, { r: "0deg", ty: "0px" },
    { r: "5deg", ty: "2px" }, { r: "10deg", ty: "6px" },
  ];
  return (
    <section className="draw-sec">
      <div className="draw-inner">
        <div className="d-ornament">Act III · The Deck</div>
        <h2 className="d-h2" style={{ fontSize: "clamp(28px,5vw,64px)" }}>Ask the deck a <em>question.</em></h2>
        <p className="draw-sub">Pull one card. The deck has been shuffled with red thread and a quiet prayer.</p>
        <div className="card-fan" onClick={!card ? pick : undefined}>
          {fan.map((f, i) => (
            <div key={i} className="crd" style={{ "--r": f.r, "--ty": f.ty }}>
              <div className="crd-glyph">♥</div>
            </div>
          ))}
        </div>
        {!card
          ? <div className="draw-hint">Click the deck to draw</div>
          : (
            <div className="card-msg">
              <div className="card-phrase">{card.p}</div>
              <div className="card-sub-txt">{card.s}</div>
              <button className="again-btn" onClick={reset}>Draw again</button>
            </div>
          )
        }
      </div>
    </section>
  );
}

function DarkSignature() {
  return (
    <section className="sign-sec">
      <div className="sign-inner">
        <div className="d-ornament">Final Act · Curtain</div>
        <h2 className="d-h2" style={{ fontSize: "clamp(32px,6vw,76px)" }}>Stay <em>loud.</em><br />Stay seen.</h2>
        <p className="sign-credo">
          If you came here for permission — <em>take it.</em> If you came here for proof
          that softness can be armored, that hearts can be crowns,
          that loud can be holy — it is. <em>Now go make the thing.</em>
        </p>
        <div className="sign-name">— Aya</div>
        <div className="sign-links">
          <a href="https://instagram.com/ayaparskaya_art" target="_blank">Instagram</a>
          <a href="#">Shop / Prints</a>
          <a href="#">Studio Visits</a>
          <a href="#">Contact</a>
        </div>
        <div className="colophon">AYA WORLD · MMXXVI · ALL WORKS © AYA · MADE WITH RED THREAD</div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════
//  APP
// ══════════════════════════════════════
export default function App() {
  const [world, setWorld] = useState("light");   // "light" | "dark"
  const [fear, setFear] = useState("");
  const [power, setPower] = useState("");
  const [powerLoading, setPowerLoading] = useState(true);
  const inkRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleDare = async (fearText) => {
    setFear(fearText);
    setPower("");
    setPowerLoading(true);

    // Start ink spreading
    if (inkRef.current) inkRef.current.classList.add("spread");

    // Fetch transformation in parallel
    const powerText = await transformFear(fearText);

    // Wait for ink to fully cover screen (2s), then switch
    await new Promise(r => setTimeout(r, 2000));
    setWorld("dark");
    window.scrollTo({ top: 0 });

    // Short pause, then fade ink out to reveal dark world
    await new Promise(r => setTimeout(r, 300));
    if (inkRef.current) inkRef.current.classList.add("fade");

    // Show power text after ink clears
    await new Promise(r => setTimeout(r, 800));
    setPower(powerText);
    setPowerLoading(false);
  };

  return (
    <>
      {/* Ink veil — always in DOM */}
      <div ref={inkRef} className="ink-veil" />

      {world === "light" && (
        <div className="lw">
          <LightHero />
          <LightWelcome />
          <LightPromises />
          <FearSection onDare={handleDare} />
        </div>
      )}

      {world === "dark" && (
        <div className="dw">
          <PowerReveal fear={fear} power={power} loading={powerLoading} />
          <DarkManifesto />
          <DarkCardDraw />
          <DarkSignature />
        </div>
      )}
    </>
  );
}
