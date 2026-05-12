/* AYA WORLD — intriguing additions: Ask Aya + The Pact */
const { useState: useStateC, useEffect: useEffectC, useRef: useRefC } = React;

// ============================================
// ACT — Ask Aya (Claude-powered oracle)
// ============================================
function AskAya(){
  const [q, setQ] = useStateC("");
  const [a, setA] = useStateC("");
  const [busy, setBusy] = useStateC(false);
  const [count, setCount] = useStateC(()=>{
    try{ return parseInt(localStorage.getItem('aya_qs')||'0',10) || 0; }catch(e){ return 0; }
  });

  const ask = async () => {
    if(!q.trim() || busy) return;
    setBusy(true); setA("");
    try{
      const prompt = `You are Aya — a fearless, theatrical visual artist whose work centers on red, gold, queens, blindfolds and being unapologetically seen. Your voice is intimate, slightly poetic, never preachy. Speak in the second person ("you"). Two to four short sentences only. No emoji. No advice clichés. End with one short imperative line on its own.

The visitor asks: "${q.trim()}"

Answer as Aya:`;
      const text = await window.claude.complete(prompt);
      setA(text.trim());
      const next = count+1;
      setCount(next);
      try{ localStorage.setItem('aya_qs', String(next)); }catch(e){}
    }catch(e){
      setA("The line is quiet. Try again, louder.");
    }
    setBusy(false);
  };

  return (
    <section id="ask" className="ask" data-screen-label="05 Ask Aya">
      <div className="ask-inner">
        <div className="ornament" style={{marginBottom:24}}>ACT V · THE ORACLE</div>
        <h2 className="display">Ask Aya <em>anything.</em></h2>
        <p className="ask-sub">She is listening. About fear, about being seen, about the work you haven't made yet.<br/><span className="ask-count">{count===0?'Be the first to ask today.':`${count} ${count===1?'question':'questions'} answered for you.`}</span></p>

        <div className="ask-form">
          <textarea
            value={q}
            onChange={e=>setQ(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter' && (e.metaKey||e.ctrlKey)) ask(); }}
            placeholder="What are you afraid to make?"
            rows={3}
            disabled={busy}
          />
          <button onClick={ask} disabled={busy || !q.trim()}>
            {busy ? "she is listening…" : "ASK"}
          </button>
        </div>

        {(busy || a) && (
          <div className={`ask-answer ${busy?'pulse':''}`}>
            <div className="quote-mark">"</div>
            {busy ? (
              <div className="dots"><span/><span/><span/></div>
            ) : (
              <p>{a}</p>
            )}
            <div className="signed-mini">— A.</div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================
// ACT — The Pact (seal a fear in red wax)
// ============================================
const PACT_SIGILS = ['♥','♠','♦','♣','✦','✧','❦','❧','✤','♛','♚','✠'];

function Pact(){
  const [power, setPower] = useStateC("");
  const [sealed, setSealed] = useStateC(false);
  const [pacts, setPacts] = useStateC(()=>{
    try{ return JSON.parse(localStorage.getItem('aya_powers')||'[]'); }catch(e){ return []; }
  });
  const [mySigil, setMySigil] = useStateC(null);

  const seal = () => {
    if(!power.trim()) return;
    const sigil = PACT_SIGILS[Math.floor(Math.random()*PACT_SIGILS.length)];
    const fragment = power.trim().slice(0,38);
    const next = [{f:fragment, s:sigil, t:Date.now()}, ...pacts].slice(0,40);
    setPacts(next);
    setMySigil(sigil);
    setSealed(true);
    try{ localStorage.setItem('aya_powers', JSON.stringify(next)); }catch(e){}
  };

  const reset = () => { setPower(""); setSealed(false); setMySigil(null); };

  return (
    <section id="pact" className="pact" data-screen-label="06 The Pact" style={{position:'relative',overflow:'hidden'}}>
      <video className="pact-bg" src="uploads/video2_file-1778251433751.mp4" autoPlay muted loop playsInline style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:.22,mixBlendMode:'screen',zIndex:0,pointerEvents:'none'}}/>
      <div className="pact-grid" style={{position:'relative',zIndex:1}}>
        <div className="pact-left">
          <div className="ornament" style={{marginBottom:24,justifyContent:'flex-start'}}>ACT VI · THE PACT</div>
          <h2 className="display">Name your <em>power.</em></h2>
          <p>Write the thing you are. The unapologetic thing. The one you've been told is too much. We seal it in red wax, give it a sigil, and pin it to the wall — yours, alongside everyone who chose to be seen.</p>

          {!sealed ? (
            <div className="pact-form">
              <textarea
                value={power}
                onChange={e=>setPower(e.target.value)}
                placeholder="My power is…"
                rows={3}
                maxLength={140}
              />
              <div className="pact-counter">{power.length}/140 · claim it. out loud.</div>
              <button onClick={seal} disabled={!power.trim()}>
                <span className="wax">●</span> SEAL IN RED WAX
              </button>
            </div>
          ) : (
            <div className="pact-confirmation">
              <div className="seal">
                <div className="seal-disc">
                  <span className="seal-sigil">{mySigil}</span>
                </div>
                <div className="seal-drips"/>
              </div>
              <p className="confirm-text"><em>Claimed.</em> Your sigil is <span className="gold" style={{fontFamily:'var(--display)',fontSize:24}}>{mySigil}</span> — yours alone. Come back and find it on the wall.</p>
              <button className="again" onClick={reset}>Claim another</button>
            </div>
          )}
        </div>

        <div className="pact-wall" aria-label="Wall of Powers">
          <div className="wall-header"><span className="mono">THE WALL · {pacts.length} {pacts.length===1?'POWER':'POWERS'} CLAIMED</span></div>
          <div className="wall-grid">
            {(pacts.length===0 ? Array.from({length:9}).map((_,i)=>({f:'—',s:'·',t:i,placeholder:true})) : pacts.slice(0,18)).map((p,i)=>(
              <div key={p.t+'-'+i} className={`pact-card ${p.placeholder?'ghost':''}`} style={{transform:`rotate(${(i*7)%9-4}deg)`}}>
                <div className="pact-sigil">{p.s}</div>
                <div className="pact-text">{p.f}</div>
                <div className="pact-stamp">SEALED</div>
              </div>
            ))}
          </div>
          {pacts.length===0 && <div className="wall-empty mono">YOUR POWER COULD BE THE FIRST</div>}
        </div>
      </div>
    </section>
  );
}

window.AskAya = AskAya;
window.Pact = Pact;

// ============================================
// ACT — The Reel (cinematic video)
// ============================================
function Reel(){
  const [playing, setPlaying] = useStateC(false);
  const ref = useRefC(null);
  const toggle = () => {
    const v = ref.current; if(!v) return;
    if(v.paused){ v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };
  return (
    <section id="reel" className="reel" data-screen-label="07 The Reel">
      <div className="reel-inner">
        <div className="ornament" style={{marginBottom:24}}>ACT VII · THE REEL</div>
        <h2 className="display">A moving <em>portrait.</em></h2>
        <p className="sub">Press to play. Sound on, if you dare.</p>
        <div className={`reel-stage ${playing?'playing':''}`} onClick={toggle}>
          <video ref={ref} src="videos/portrait.mp4" playsInline preload="metadata" onEnded={()=>setPlaying(false)}/>
          <div className="play"><div className="ring"><div className="tri"/></div></div>
          <div className="play-label">{playing?'CLICK TO PAUSE':'CLICK TO PLAY'}</div>
        </div>
      </div>
    </section>
  );
}
window.Reel = Reel;
