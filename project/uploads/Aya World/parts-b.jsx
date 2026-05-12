/* AYA WORLD — sections (continued) */
const { useState: useStateB, useEffect: useEffectB, useRef: useRefB, useCallback: useCallbackB } = React;

// ============================================
// ACT III — The Court (gallery)
// ============================================
function Court(){
  const [open, setOpen] = useStateB(null);
  useEffectB(()=>{
    const onKey = e => { if(e.key==='Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return ()=>window.removeEventListener('keydown', onKey);
  },[]);
  return (
    <section id="court" className="court" data-screen-label="03 The Court">
      <div className="hall-header">
        <div className="ornament" style={{marginBottom:24}}>ACT III · THE COURT</div>
        <h2 className="display">A hall of <em style={{fontStyle:'italic',color:'var(--gold-bright)',fontFamily:'var(--serif)'}}>her own making.</em></h2>
        <p className="sub">Nine works. Tap any frame to step closer.</p>
      </div>

      <div className="gallery">
        {WORKS.map((w,i)=>(
          <figure key={w.id} className={`frame ${w.g}`}>
            <div className="photo">
              <image-slot id={`court-${w.id}`} shape="rect" placeholder={`Drop "${w.title}"`} style={{width:'100%',height:'100%'}}></image-slot>
            </div>
            <figcaption className="plaque">
              <span className="l">{String(i+1).padStart(2,'0')} · {w.title}</span>
              <span className="r">{w.year}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

// ============================================
// ACT IV — Draw a Card
// ============================================
function DrawCard(){
  const [drawn, setDrawn] = useStateB(null);
  const [shuffled, setShuffled] = useStateB(()=>shuffle());
  function shuffle(){
    return [...CARD_PHRASES].sort(()=>Math.random()-0.5).slice(0,5);
  }
  const reset = () => { setDrawn(null); setTimeout(()=>setShuffled(shuffle()), 600); };

  // fan layout: 5 cards
  const fan = [
    { x:-280, r:-14, y: 30 },
    { x:-150, r:-7,  y:  6 },
    { x:   0, r: 0,  y:  0 },
    { x: 150, r: 7,  y:  6 },
    { x: 280, r:14,  y: 30 },
  ];

  return (
    <section id="draw" className="draw" data-screen-label="04 Draw a Card">
      <div className="head">
        <div className="ornament" style={{marginBottom:24}}>ACT IV · THE DECK</div>
        <h2 className="display">Ask the deck a <em>question.</em></h2>
        <p>Pull one card. The deck has been shuffled with red thread and a quiet prayer.</p>
      </div>

      <div className="tableau">
        <div className="deck-fan">
          {shuffled.map((c, i) => {
            const f = fan[i];
            const isDrawn = drawn === i;
            const isAway = drawn !== null && !isDrawn;
            return (
              <div key={i}
                   className={`card ${isDrawn?'drawn':''} ${isAway?'away':''}`}
                   style={{['--x']: f.x+'px', ['--r']: f.r+'deg', ['--y']: f.y+'px'}}
                   onClick={()=>{ if(drawn===null) setDrawn(i); }}>
                <div className="face back">
                  <div className="corner tl">A<span style={{display:'block',fontSize:10}}>♥</span></div>
                  <div className="mono-monogram">A</div>
                  <div className="corner br">A<span style={{display:'block',fontSize:10}}>♥</span></div>
                </div>
                <div className="face front">
                  <div className="pip">A<span className="h">♥</span></div>
                  <div className="center-glyph">♥</div>
                  <div className="pip br">A<span className="h">♥</span></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`reading ${drawn!==null?'on':''}`}>
          <div className="label">YOUR READING</div>
          <div className="phrase">{drawn!==null && shuffled[drawn].p}</div>
          <p style={{fontFamily:'var(--serif)',fontStyle:'italic',color:'var(--bone)',marginTop:18,fontSize:18,lineHeight:1.5}}>
            {drawn!==null && shuffled[drawn].sub}
          </p>
          <button className="again" onClick={reset}>Shuffle & Draw Again</button>
        </div>
      </div>
    </section>
  );
}

// ============================================
// ACT V — Untie the Blindfold (drag)
// ============================================
function Blindfold(){
  const [pct, setPct] = useStateB(55);
  const stageRef = useRefB(null);
  const dragging = useRefB(false);

  const onPointer = useCallbackB(e=>{
    if(!dragging.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const y = (e.touches? e.touches[0].clientY : e.clientY) - r.top;
    const p = Math.max(0, Math.min(100, (y/r.height)*100));
    setPct(p);
  },[]);
  const stop = ()=>{ dragging.current=false; };
  useEffectB(()=>{
    const m = e => onPointer(e);
    const u = ()=>stop();
    window.addEventListener('mousemove', m);
    window.addEventListener('mouseup', u);
    window.addEventListener('touchmove', m, {passive:true});
    window.addEventListener('touchend', u);
    return ()=>{ window.removeEventListener('mousemove',m); window.removeEventListener('mouseup',u); window.removeEventListener('touchmove',m); window.removeEventListener('touchend',u); };
  },[onPointer]);

  const fully = pct < 8;

  return (
    <section id="blindfold" className="blindfold" data-screen-label="05 Untie">
      <div className="col">
        <div className={`bf-stage ${fully?'fully':''}`} ref={stageRef}
             onMouseDown={e=>{dragging.current=true; onPointer(e);}}
             onTouchStart={e=>{dragging.current=true; onPointer(e);}}>
          <div className="photo"/>
          <div className="reveal" style={{['--bfh']: pct+'%'}}/>
          <div className="grip" style={{top: pct+'%'}}>DRAG<br/>UP</div>
          <div className="hint">{fully ? "EYES OPEN" : "PULL THE BANDAGE"}</div>
        </div>
        <div className="bf-text">
          <div className="ornament" style={{marginBottom:24,justifyContent:'flex-start'}}>ACT V · THE BANDAGE</div>
          <h2 className="display">Untie the blindfold. <em>Look.</em></h2>
          <p>For a long time I painted with my eyes covered — afraid the world would not love what I made if I made it loud.</p>
          <p className="italic">It loved the wrong me anyway. So I took the bandage off.</p>
          <p>This is what it's like to make work without permission. To be visible without apology. The hands lift. The mouth stays red.</p>
          <span className="hint-mono">↑ DRAG THE BANDAGE TO REVEAL</span>
        </div>
      </div>
    </section>
  );
}

// ============================================
// ACT VI — Signature
// ============================================
function Signature(){
  return (
    <section id="signature" className="signature" data-screen-label="06 Curtain">
      <div className="ornament">ACT VI · CURTAIN</div>
      <h2 className="display">
        Stay loud.<br/>
        Stay <span className="strike">seen.</span>
      </h2>
      <p className="credo">
        If you came here for permission — take it. If you came here for proof that softness can be armored, that hearts can be crowns, that loud can be holy — it is. <em>Now go make the thing.</em>
      </p>
      <div className="signed">— Aya</div>

      <div className="links">
        <a href="#" onClick={e=>e.preventDefault()}>Instagram</a>
        <a href="#" onClick={e=>e.preventDefault()}>Shop / Prints</a>
        <a href="#" onClick={e=>e.preventDefault()}>Studio Visits</a>
        <a href="#" onClick={e=>e.preventDefault()}>Mailing List</a>
        <a href="#" onClick={e=>e.preventDefault()}>Contact</a>
      </div>
      <div className="colophon">AYA WORLD · MMXXVI · ALL WORKS © AYA · MADE WITH RED THREAD</div>
    </section>
  );
}

window.Court = Court;
window.DrawCard = DrawCard;
window.Blindfold = Blindfold;
window.Signature = Signature;
