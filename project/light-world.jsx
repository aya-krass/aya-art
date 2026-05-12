// ═══════════════════════════════════════════════════════
//  AYA WORLD · LIGHT WORLD
// ═══════════════════════════════════════════════════════
const { useState, useEffect, useRef } = React;

function Playbill() {
  return (
    <div className="playbill" data-screen-label="00 Chrome">
      <div><span className="dot"></span>AYA · WORLD · MMXXVI</div>
      <div>A solo exhibition · in two acts</div>
    </div>);

}

function LightHero({ onScrollDown }) {
  return (
    <section className="lhero" data-screen-label="01 Light Hero">
      <div className="lhero-left">
        <div className="lhero-eyebrow"><span className="ln"></span>Act I · the threshold</div>
        <h1 className="lhero-h1">
          Aya Krass
          <em>— world —</em>
        </h1>
        <p className="lhero-tag">
          A gentle place, at first. For art. For feeling.<br />
          For everything that is <em>beautiful and true.</em>
        </p>
        <div className="lhero-meta">
          <span>Studio · 2026</span>
          <span className="v">·</span>
          <span>oil · linen · gold leaf</span>
          <span className="v">·</span>
          <span>solo show</span>
        </div>
        <div className="scroll-hint">
          enter quietly
          <div className="scroll-line"></div>
        </div>
      </div>
      <div className="lhero-right">
        <video className="lhero-video" src="videos/hero.mp4" autoPlay muted loop playsInline></video>
        <div className="lhero-vignette"></div>
        <div className="lhero-plate">
          <span>plate 01 · the foyer</span>
          <span>still warm</span>
        </div>
      </div>
    </section>);

}

function LightWelcome() {
  return (
    <section className="lwelcome" data-screen-label="02 Welcome">
      <div className="lwelcome-inner">
        <div className="section-eyebrow">A welcome</div>
        <h2 className="l-h2" style={{ fontFamily: "Italiana" }}>
          Everything here i made<br />
          <em>with care and quiet intention.</em>
        </h2>
        <div className="divider-row">
          <div className="ln"></div>
          <div className="mark">✦</div>
          <div className="ln"></div>
        </div>
        <p className="l-body">The work is soft. The intention is pure. Take your time. There is no rush, no judgment. The door is always open — for now.



        </p>
      </div>
    </section>);

}

function LightGallery() {
  return (
    <section className="lgallery" data-screen-label="03 Light Gallery">
      <div className="lgallery-inner">
        <div style={{ textAlign: "center" }}>
          <div className="section-eyebrow">The quiet wing</div>
          <h2 className="l-h2">
            Soft works.<br />
            <em>For the rooms that hold you.</em>
          </h2>
          <p className="l-body" style={{ marginTop: "24px" }}>
            Interior paintings — still lifes, gentle figures, hours of soft light.
            They are happy to live where they are needed.
          </p>
        </div>

        <div className="lg-grid">
          {window.LIGHT_WORKS.map((w, i) =>
          <article key={w.id} className={`lg-card ${w.placeholder ? "empty" : ""} lg-${w.span || 6}`}>
              <div className="frame">
                <div className="img-wrap">
                  {w.placeholder ?
                <image-slot
                  id={`light-${w.id}`}
                  placeholder={w.placeholder}
                  shape="rect"
                  style={{ width: "100%", height: "100%" }}>
                </image-slot> :

                <img src={w.src} alt={w.title} loading="lazy" />
                }
                </div>
                <div className="plaque">
                  <div className="meta">№ {String(i + 1).padStart(2, "0")} · {w.year} · {w.size}</div>
                  <div className="ttl">{w.title}</div>
                  <div className="medium">{w.medium}</div>
                  {w.note && <div className="medium" style={{ opacity: .7, fontSize: 13 }}>— {w.note}</div>}
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>);

}

const PROMISES = [
{ t: ["This is a place for ", { em: "quiet hearts." }] },
{ t: ["Beauty lives here, ", { em: "undisturbed." }] },
{ t: ["Softness is welcome. ", { em: "You are welcome." }] },
{ t: ["Everything here is ", { em: "gentle and good." }] },
{ t: ["There is ", { em: "nothing to be afraid of." }] }];


function LightPromises() {
  return (
    <section className="lpromises" data-screen-label="04 Promises">
      <div className="lp-inner">
        {PROMISES.map((p, i) =>
        <div key={i} className="lp-item">
            <div className="lp-num">№ {String(i + 1).padStart(2, "0")}</div>
            <div className="lp-txt">{window.renderMixed(p.t)}</div>
          </div>
        )}
      </div>
    </section>);

}

function FearSection({ onDare, locked }) {
  const [fear, setFear] = useState("");
  const [striking, setStriking] = useState(false);
  const handleSubmit = async () => {
    const t = fear.trim();
    if (!t || locked) return;
    setStriking(true);
    await new Promise((r) => setTimeout(r, 900));
    onDare(t);
  };
  return (
    <section className="fear-sec" data-screen-label="05 Fear">
      <div className="fear-inner">
        <div className="fear-orn">― before you go further ―</div>
        <h2 className="fear-q">What are you<br /><em>afraid of?</em></h2>
        <p className="fear-sub">You can say it here. It will not be held against you.</p>

        {!striking ?
        <textarea
          className="fear-ta"
          rows={3}
          placeholder="I am afraid of…"
          value={fear}
          onChange={(e) => setFear(e.target.value)}
          disabled={locked}
          autoFocus={false} /> :


        <div className="fear-strike">{fear}</div>
        }

        <div>
          <button
            className="dare-btn"
            onClick={handleSubmit}
            disabled={!fear.trim() || locked || striking}>
            
            <span>{striking ? "crossing it out…" : "Come if you dare  →"}</span>
          </button>
        </div>
        <div className="dare-note">
          {striking ?
          "Hold on. Red ink is being mixed." :
          fear.trim() ?
          "It will be crossed out, in red." :
          "Write your fear. Then step through."}
        </div>
      </div>
    </section>);

}

Object.assign(window, {
  Playbill, LightHero, LightWelcome, LightGallery, LightPromises, FearSection
});