/* AYA WORLD — sections */
const { useState, useEffect, useRef, useCallback } = React;

// ------- Data -------
const COMMANDMENTS = [
  { n: "I",   t: <>Refuse <em>the blindfold.</em></> },
  { n: "II",  t: <>Be <em>loud.</em> Be <span className="crash">seen.</span></> },
  { n: "III", t: <>Wear your heart as a <em>crown.</em></> },
  { n: "IV",  t: <>Soft is <em>not</em> small.</> },
  { n: "V",   t: <>Bleed in <em>color.</em></> },
  { n: "VI",  t: <>You are <em>the ace.</em></> },
  { n: "VII", t: <>Open your mouth. <em>Speak red.</em></> },
  { n: "VIII",t: <>You are <em>not</em> a secret.</> }
];

const WORKS = [
  { id:"g1", file:"images/strawberry.png",     title:"Sacred Fruit",    year:"2026", medium:"Oil & gold leaf",    quote:"Sweetness, broken open.", g:"g1" },
  { id:"g2", file:"images/queen-of-hearts.png",title:"Ace of Me",       year:"2026", medium:"Digital, oil treatment", quote:"Hearts on display, on every finger.", g:"g2" },
  { id:"g3", file:"images/queen-curls.png",    title:"Queen Chaos",     year:"2026", medium:"Digital painting",   quote:"Crown soft, gaze sharper.", g:"g3" },
  { id:"g4", file:"images/grunge-woman.png",   title:"The Quiet Pact",  year:"2026", medium:"Lacquer & gold thread",quote:"What I tied, only I can untie.", g:"g4" },
  { id:"g5", file:"images/dice.jpg",           title:"House of Hearts", year:"2026", medium:"Photograph",         quote:"Even the dice are mine.", g:"g5" },
  { id:"g6", file:"images/red-hands.jpg",      title:"Red Verb",        year:"2026", medium:"Photograph",         quote:"Hands that refuse to disappear.", g:"g6" },
  { id:"g7", file:"images/queen-pearls.png",   title:"Pearl Crown",     year:"2026", medium:"Digital painting",   quote:"Pageantry as armor.", g:"g7" },
  { id:"g8", file:"images/aces.jpg",           title:"Four Aces",       year:"2026", medium:"Still life",         quote:"The deck was always stacked. Good.", g:"g8" },
  { id:"g9", file:"images/blindfold.png",      title:"Eyes Closed, Mouth Open", year:"2026", medium:"Oil on canvas", quote:"You don't need to see me to hear me.", g:"g9" },
];

const CARD_PHRASES = [
  { p:<>Refuse the blindfold.</>,            sub:"Today you take what you've been hiding and you bring it into the light." },
  { p:<>Wear your <em>heart</em> as a crown.</>, sub:"Soft is not small. Tender is not weak." },
  { p:<>Open your mouth. <em>Speak red.</em></>, sub:"The thing you've been swallowing is the thing you're meant to say." },
  { p:<>You are <em>the ace.</em></>,         sub:"Stop apologizing for being dealt strong." },
  { p:<>Bleed in color.</>,                   sub:"What you call too much is exactly enough." },
  { p:<>Be <em>loud.</em> Be seen.</>,        sub:"Visibility is not vanity. It is survival." },
  { p:<>Dare to be the spectacle.</>,         sub:"They were always going to look. Give them something." },
  { p:<>You are <em>not</em> a secret.</>,    sub:"Stop folding yourself small enough to fit." },
  { p:<>Soft is <em>not</em> small.</>,       sub:"Your gentleness is one of your weapons." },
  { p:<>Tear the velvet.</>,                  sub:"The pretty thing was holding you in place." }
];

// ============================================
// Heart cursor + petal trail
// ============================================
function HeartCursor(){
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current;
    let raf, x=0, y=0, tx=0, ty=0, lastDrop=0;
    const move = e => {
      tx = e.clientX; ty = e.clientY;
      const now = performance.now();
      if(now - lastDrop > 90 && Math.random() < 0.6){
        lastDrop = now;
        const p = document.createElement('div');
        p.className='petal';
        p.style.left = (e.clientX + (Math.random()*16-8))+'px';
        p.style.top  = (e.clientY + (Math.random()*16-8))+'px';
        p.style.setProperty('--drift', (Math.random()*60-30)+'px');
        p.style.transform = `rotate(${Math.random()*360}deg)`;
        document.body.appendChild(p);
        setTimeout(()=>p.remove(), 2400);
      }
    };
    const tick = () => {
      x += (tx-x)*0.22; y += (ty-y)*0.22;
      if(el) el.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    const over = e => {
      const t = e.target;
      if(el) el.classList.toggle('big', !!(t.closest && t.closest('button, a, .frame, .card, .bf-stage, textarea')));
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    raf = requestAnimationFrame(tick);
    return ()=>{cancelAnimationFrame(raf); window.removeEventListener('mousemove',move); window.removeEventListener('mouseover',over)};
  },[]);
  return <div className="heart-cursor" ref={ref}/>;
}

// ============================================
// Threshold — knock to enter
// ============================================
function Threshold(){
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(()=>{
    if(opening){ const t=setTimeout(()=>setGone(true), 1700); return ()=>clearTimeout(t); }
  },[opening]);
  if(gone) return null;
  return (
    <div className={`threshold ${opening?'opening':''}`} onClick={()=>!opening && setOpening(true)}>
      <div className="curtain-pair">
        <div className="half left"/>
        <div className="half right"/>
      </div>
      <div className="knock">
        <div className="ring"><div className="inner">KNOCK</div></div>
        <div className="label">Click to enter</div>
        <div className="sub">Aya World is waiting.</div>
      </div>
    </div>
  );
}

// ============================================
// Chrome + Act rail
// ============================================
function Chrome(){
  return (
    <div className="chrome">
      <div><span className="dot"/>AYA · WORLD · MMXXVI</div>
      <div>A SOLO EXHIBITION · IN ONE ACT</div>
    </div>
  );
}

const ACTS = [
  { id:"overture", n:"I",    label:"Overture" },
  { id:"manifesto",n:"II",   label:"Manifesto" },
  { id:"court",    n:"III",  label:"The Court" },
  { id:"draw",     n:"IV",   label:"Draw a Card" },
  { id:"ask",      n:"V",    label:"Ask Aya" },
  { id:"pact",     n:"VI",   label:"The Pact" },
  { id:"reel",     n:"VII",  label:"The Reel" },
  { id:"blindfold",n:"VIII", label:"Untie" },
  { id:"signature",n:"IX",   label:"Curtain" },
];

function ActRail(){
  const [active,setActive] = useState("overture");
  useEffect(()=>{
    const obs = new IntersectionObserver(es=>{
      es.forEach(e=>{ if(e.isIntersecting && e.intersectionRatio>0.35) setActive(e.target.id) });
    },{threshold:[0.35,0.6]});
    ACTS.forEach(a=>{const el=document.getElementById(a.id); if(el) obs.observe(el)});
    return ()=>obs.disconnect();
  },[]);
  return (
    <nav className="actrail" aria-label="Acts">
      {ACTS.map(a=>(
        <button key={a.id} className={active===a.id?'on':''} onClick={()=>document.getElementById(a.id).scrollIntoView({behavior:'smooth'})}>
          <span>{a.n}</span><span className="tick"/><span>{a.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ============================================
// ACT I — Overture
// ============================================
function Overture(){
  return (
    <section id="overture" className="overture" data-screen-label="01 Overture">
      <video className="hero-video" src="videos/hero.mp4" autoPlay muted loop playsInline poster="images/blindfold.png"/>
      <div className="vignette"/>
      <div className="stack">
        <div className="small-mono">A SOLO EXHIBITION BY AYA · IN ONE ACT</div>
        <h1 className="title-aya">AYA<span className="world">— WORLD —</span></h1>
        <p className="tag">A statement on becoming strong, brave, visible.<br/>On the holy refusal to be unseen.</p>
      </div>
      <div className="scrollhint">
        <span>SCROLL · TO · ENTER</span>
        <span className="line"/>
      </div>
    </section>
  );
}

// ============================================
// ACT II — Manifesto
// ============================================
function Manifesto(){
  return (
    <section id="manifesto" className="manifesto" data-screen-label="02 Manifesto">
      <div className="inner">
        <div className="header">
          <div className="ornament" style={{marginBottom:24}}>ACT II · THE MANIFESTO</div>
          <h2 className="display">
            I would rather be <span className="strike">too much</span><br/>
            than <em>almost nothing.</em>
          </h2>
        </div>

        <ol className="commandments">
          {COMMANDMENTS.map(c=>(
            <li key={c.n} className="item">
              <div className="num">{c.n}.</div>
              <div className="text">{c.t}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

window.HeartCursor = HeartCursor;
window.Threshold = Threshold;
window.Chrome = Chrome;
window.ActRail = ActRail;
window.Overture = Overture;
window.Manifesto = Manifesto;
window.WORKS = WORKS;
window.CARD_PHRASES = CARD_PHRASES;
