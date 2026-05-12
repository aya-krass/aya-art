// ═══════════════════════════════════════════════════════
//  AYA WORLD · data — works, manifesto, cards, fear→power
// ═══════════════════════════════════════════════════════

// ── Light gallery (interior, gentle works) ───────────
// The artist's softer works. 1 real, 4 image-slots for upcoming works.
const LIGHT_WORKS = [
  {
    id: "strawberry",
    title: "A Strawberry, gilded",
    year: "2025",
    medium: "Oil & gold leaf on linen",
    size: "40 × 40 cm",
    note: "Sweet things take their time to ripen. Beneath them, gold.",
    src: "images/strawberry.png",
    span: 6,
  },
  { id: "interior_1", placeholder: "interior · landscape · 30×40", title: "(coming soon)", year: "2025", medium: "Oil on linen", size: "30 × 40 cm", note: "A quiet morning. A vase. A patch of sun on the wall.", span: 6 },
  { id: "interior_2", placeholder: "interior · still life", title: "(coming soon)", year: "2025", medium: "Oil on canvas", size: "50 × 60 cm", note: "What lives on the table when the table is alone.", span: 4 },
  { id: "interior_3", placeholder: "interior · figure", title: "(coming soon)", year: "2024", medium: "Oil on linen", size: "70 × 90 cm", note: "Softness, in good light.", span: 4 },
  { id: "interior_4", placeholder: "interior · floral", title: "(coming soon)", year: "2024", medium: "Oil & wax on canvas", size: "30 × 30 cm", note: "Bouquet, fading on purpose.", span: 4 },
];

// ── Dark gallery (the provocative side) ──────────────
const DARK_WORKS = [
  {
    n: "I",
    title: ["Refuse the", { em: "blindfold." }],
    img: "images/blindfold.png",
    medium: "Oil on linen, gold dust",
    size: "100 × 100 cm",
    year: "2025",
    body: ["They covered the eyes and called it modesty. The mouth, still painted, answered anyway. ", { em: "What the eyes cannot say, the lips will." }],
  },
  {
    n: "II",
    title: ["Queen of", { em: "Hearts." }],
    img: "images/queen-of-hearts.png",
    medium: "Oil on canvas",
    size: "90 × 130 cm",
    year: "2025",
    body: ["She does not deal the cards. She is the cards. ", { em: "The ace was never up the sleeve — it was the woman." }],
  },
  {
    n: "III",
    title: ["The", { em: "Coronation." }],
    img: "images/queen-pearls.png",
    medium: "Oil & lacquer on canvas",
    size: "80 × 110 cm",
    year: "2024",
    body: ["Pearls and a crown of fur — the kind a girl makes for herself when no one is offering one. ", { em: "Wear it." }],
  },
  {
    n: "IV",
    title: ["The", { em: "Spectacle." }],
    img: "images/queen-curls.png",
    medium: "Oil on linen",
    size: "70 × 100 cm",
    year: "2024",
    body: ["They were always going to look. ", { em: "Give them something to look at." }],
  },
  {
    n: "V",
    title: ["Grunge", { em: "Madonna." }],
    img: "images/grunge-woman.png",
    medium: "Oil & gold leaf on linen",
    size: "120 × 120 cm",
    year: "2024",
    body: ["A saint with a thread of gold for stitches. ", { em: "The cracks are where the gold gets in." }],
  },
];

// ── Manifesto ────────────────────────────────────────
const CMDS = [
  { n: "I",    t: ["Refuse the ", { em: "blindfold." }] },
  { n: "II",   t: ["Be loud. ", { em: "Be seen." }] },
  { n: "III",  t: ["Wear your heart ", { em: "as a crown." }] },
  { n: "IV",   t: ["Soft is ", { em: "not small." }] },
  { n: "V",    t: ["Bleed ", { em: "in colour." }] },
  { n: "VI",   t: ["You are ", { em: "the ace." }] },
  { n: "VII",  t: ["Open your mouth. ", { em: "Speak red." }] },
  { n: "VIII", t: ["You are not ", { em: "a secret." }] },
];

// ── Card deck (oracle messages) ──────────────────────
const CARDS = [
  { p: "Refuse the blindfold.",            s: "Today you take what you have been hiding and bring it into the light." },
  { p: "Wear your heart as a crown.",      s: "Soft is not small. Tender is not weak." },
  { p: "Open your mouth. Speak red.",      s: "The thing you have been swallowing is what you are meant to say." },
  { p: "You are the ace.",                 s: "Stop apologising for being dealt strong." },
  { p: "Bleed in colour.",                 s: "What you call ‘too much’ is exactly enough." },
  { p: "Be loud. Be seen.",                s: "Visibility is not vanity. It is survival." },
  { p: "Dare to be the spectacle.",        s: "They were always going to look. Give them something." },
  { p: "You are not a secret.",            s: "Stop folding yourself small enough to fit." },
  { p: "Tear the velvet.",                 s: "The pretty thing was holding you in place." },
  { p: "Soft is not small.",               s: "Your gentleness is one of your weapons." },
  { p: "The crack is the point.",          s: "Make it broken, and make it yours. Sign it." },
  { p: "Walk into the room you dread.",    s: "It is the only one with a window." },
];

// ── Fear → Power mapping ─────────────────────────────
const FEAR_MAP = [
  { re: /too much|overwhelming|intense|loud/i, power: "You are too much. That is precisely the point.\nThe world is drowning in not-enough.\nBe the flood. Be the excess.\nStay loud." },
  { re: /seen|visible|noticed|exposed|public|judg/i, power: "You have always been visible.\nYou were pretending you could choose otherwise.\nThe question was never whether they would look —\nit was what you would give them to see." },
  { re: /enough|worthy|talented|good enough/i, power: "Enough was never the bar.\nYou set it low to avoid the leap.\nYou are not too little —\nyou have been hoarding yourself. Open the vault." },
  { re: /reject|fail|mistake|wrong/i, power: "Rejection is the shape of a door not meant for you.\nYou have not failed —\nyou have been eliminating the wrong rooms.\nThe right one opens from the inside." },
  { re: /alone|lonely|nobody|no one|unseen/i, power: "Every artist has always been alone in the making.\nThat solitude is not emptiness — it is the studio.\nWork in it.\nThe work will find its people." },
  { re: /perfect|imperfect|flawed|broken|mess/i, power: "Imperfect is how the gold gets in.\nThe crack is not the flaw —\nit is the whole point.\nMake it broken, and sign it." },
  { re: /age|old|young|time|late/i, power: "Time is the medium.\nYou have been afraid of the very thing\nthat makes a painting an icon.\nKeep painting." },
  { re: /money|poor|broke|sell|commerce/i, power: "The work knows its own price.\nMake it anyway.\nThe market is the last room you walk into,\nnot the first." },
  { re: /love|relationship|partner|alone again/i, power: "You are not a question to be answered by another person.\nYou are the statement.\nWalk in already in love with yourself.\nThe rest is theatre." },
];
const FALLBACKS = [
  "Your fear knows exactly which door you need to walk through.\nIt is standing in front of it.\nPush past.\nThe other side is yours.",
  "What frightens you is the outline of your power.\nTrace it carefully.\nThat shape is your work.\nMake it. Now.",
  "The thing you named is not a wall.\nIt is the gate.\nYou have been standing outside long enough.\nStep through.",
];
function curatedTransform(fear) {
  for (const { re, power } of FEAR_MAP) if (re.test(fear)) return power;
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}
async function transformFear(fear) {
  try {
    if (window.claude && window.claude.complete) {
      const text = await window.claude.complete({
        messages: [{
          role: "user",
          content:
`You are AYA — a fearless, theatrical visual artist whose work is about red, gold, visibility, courage and softness as armor.
Transform this person's fear into a fierce poetic declaration of power addressed to them. 3-4 short lines. Second person ("you"). No preamble. Theatrical and alive, never therapeutic. End with one short imperative.
Fear: "${fear}"`
        }]
      });
      if (text && typeof text === "string" && text.trim()) return text.trim();
    }
  } catch (e) {}
  return curatedTransform(fear);
}

// Helper: render mixed text (string | {em: "..."}) safely.
function renderMixed(parts) {
  if (typeof parts === "string") return parts;
  return parts.map((p, i) =>
    typeof p === "string" ? p : <em key={i}>{p.em}</em>
  );
}

Object.assign(window, {
  LIGHT_WORKS, DARK_WORKS, CMDS, CARDS,
  transformFear, curatedTransform, renderMixed,
});
