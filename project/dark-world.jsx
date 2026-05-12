// ═══════════════════════════════════════════════════════
//  AYA WORLD · DARK WORLD
// ═══════════════════════════════════════════════════════

function PowerReveal({ fear, power, loading }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (power) {const t = setTimeout(() => setOn(true), 350);return () => clearTimeout(t);}
  }, [power]);

  return (
    <section className="power-sec" data-screen-label="06 Power">
      <div className="power-left">
        <video className="power-video" src="videos/portrait.mp4" autoPlay muted loop playsInline style={{ height: "50px" }}></video>
        <div className="power-sigil"></div>
      </div>
      <div className="power-right">
        <div className="pr-label">
          you said you were afraid of —<br />
          <span className="fear-said">{fear}</span>
        </div>
        {loading ?
        <div className="pr-loading"><div className="d" /><div className="d" /><div className="d" /></div> :

        <div className={`pr-power${on ? " on" : ""}`}>{power}</div>
        }
        <div className="pr-cont">↓ continue ↓</div>
      </div>
    </section>);

}

function DarkGalleryCover() {
  return (
    <section className="dgallery-cover" data-screen-label="07 Dark Gallery Cover">
      <div className="inner">
        <div className="d-ornament">Act II · the other wing</div>
        <h2 className="d-h2">
          The works that <em>do not whisper.</em>
        </h2>
        <p style={{
          marginTop: 32, fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 20, color: "var(--bone-dim)", maxWidth: "44ch",
          margin: "32px auto 0", lineHeight: 1.7
        }}>
          Behind the soft door, another room. Same artist. Different volume.
          Each painting is a sentence the body finally agreed to say out loud.
        </p>
      </div>
    </section>);

}

function DarkScene({ work, idx }) {
  const flip = idx % 2 === 1;
  return (
    <section
      className={`dscene${flip ? " flip" : ""}`}
      data-screen-label={`08 ${work.n} · ${typeof work.title === "string" ? work.title : work.title.map((p) => typeof p === "string" ? p : p.em).join("")}`}>
      
      <div className="dscene-art">
        <img src={work.img} alt="" />
        <div className="corner">№ {work.n}</div>
        <div className="corner r">{work.year}</div>
      </div>
      <div className="dscene-text">
        <div className="dscene-num">PLATE · {work.n}</div>
        <h3 className="dscene-ttl">{window.renderMixed(work.title)}</h3>
        <div className="dscene-meta">
          <span>{work.medium}</span>
          <span className="v">·</span>
          <span>{work.size}</span>
          <span className="v">·</span>
          <span>{work.year}</span>
        </div>
        <div className="dscene-line"></div>
        <p className="dscene-body">{window.renderMixed(work.body)}</p>
      </div>
    </section>);

}

function DarkGallery() {
  return (
    <div className="dgallery">
      <DarkGalleryCover />
      {window.DARK_WORKS.map((w, i) => <DarkScene key={w.n} work={w} idx={i} />)}
    </div>);

}

function DarkManifesto() {
  return (
    <section className="manifesto-sec" data-screen-label="09 Manifesto">
      <div className="manifesto-inner">
        <div>
          <div className="d-ornament left">Act III · the commandments</div>
          <h2 className="d-h2">
            I would rather be<br />
            <span className="stk">too much</span><br />
            than <em>almost nothing.</em>
          </h2>
          <p style={{
            marginTop: 32, fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 18, color: "var(--bone-dim)", maxWidth: "32ch", lineHeight: 1.7
          }}>
            Eight short laws. Tape them above the easel.
          </p>
        </div>
        <ol className="cmd-list">
          {window.CMDS.map((c) =>
          <li key={c.n} className="cmd-item">
              <div className="cmd-n">№ {c.n}</div>
              <div className="cmd-t">{window.renderMixed(c.t)}</div>
            </li>
          )}
        </ol>
      </div>
    </section>);

}

function DarkCardDraw() {
  const [card, setCard] = useState(null);
  const [shuffling, setShuffling] = useState(false);
  const draw = () => {
    if (shuffling) return;
    setShuffling(true);
    setTimeout(() => {
      setCard(window.CARDS[Math.floor(Math.random() * window.CARDS.length)]);
      setShuffling(false);
    }, 550);
  };
  const fan = [
  { r: "-14deg", ty: "8px", tx: "-30px" },
  { r: "-7deg", ty: "2px", tx: "-15px" },
  { r: "0deg", ty: "-4px", tx: "0px" },
  { r: "7deg", ty: "2px", tx: "15px" },
  { r: "14deg", ty: "8px", tx: "30px" }];

  return (
    <section className="draw-sec" data-screen-label="10 Deck">
      <div className="draw-inner">
        <div className="d-ornament">Act IV · the deck</div>
        <h2 className="d-h2" style={{ fontSize: "clamp(32px,6vw,84px)" }}>
          Ask the deck a <em>question.</em>
        </h2>
        <p className="draw-sub">
          Pull one card. The deck has been shuffled with red thread and a quiet prayer.
          It will answer faster than you would like.
        </p>

        <div className="deck-stage">
          <div className="deck-fan" onClick={!card ? draw : undefined} style={{ cursor: card ? "default" : "pointer" }}>
            {fan.map((f, i) =>
            <div key={i} className="deck-card" style={{ "--r": f.r, "--ty": f.ty, "--tx": f.tx, transitionDelay: shuffling ? `${i * 30}ms` : "0ms" }}>
                <div className="heart"></div>
              </div>
            )}
          </div>
        </div>

        {!card ?
        <div className="draw-hint">― click the deck to draw ―</div> :

        <div className="drawn">
            <div className="ord">— the card you drew —</div>
            <div className="ph">{card.p}</div>
            <div className="sub">{card.s}</div>
            <button className="again-btn" onClick={() => setCard(null)}>Draw again</button>
          </div>
        }
      </div>
    </section>);

}

function DarkSignature() {
  return (
    <section className="sign-sec" data-screen-label="11 Curtain">
      <div className="sign-inner">
        <div className="d-ornament">Final Act · curtain</div>
        <h2 className="d-h2" style={{ fontSize: "clamp(40px,7vw,108px)" }}>
          Stay <em>loud.</em><br />
          Stay <em>seen.</em>
        </h2>
        <p className="sign-credo">
          If you came for permission — <em>take it.</em>
          If you came for proof that softness can be armored,
          that hearts can be crowns, that loud can be holy — <em>it is.</em>
          <br /><br />
          Now go make the thing.
        </p>
        <div className="sign-name">— Aya</div>

        <div className="sign-contact">
          <div className="lbl">commissions · acquisitions · studio visits</div>
          <a href="mailto:studio@ayaworld.art" className="em">studio@ayaworld.art</a>
          <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--bone-dim)", fontSize: 14, maxWidth: "44ch", textAlign: "center", lineHeight: 1.6 }}>
            All works available in original. Prints by request, in editions of ten,
            signed in red.
          </div>
        </div>

        <div className="sign-links">
          <a href="https://instagram.com/ayaparskaya_art" target="_blank" rel="noreferrer">Instagram</a>
          <a href="#">Studio</a>
          <a href="#">Press</a>
          <a href="mailto:studio@ayaworld.art">Email</a>
        </div>

        <div className="colophon">AYA · WORLD · MMXXVI · all works © aya · made with red thread</div>
      </div>
    </section>);

}

Object.assign(window, {
  PowerReveal, DarkGallery, DarkManifesto, DarkCardDraw, DarkSignature
});