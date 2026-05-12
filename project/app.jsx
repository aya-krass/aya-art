// ═══════════════════════════════════════════════════════
//  AYA WORLD · APP — orchestrates worlds + ink transition
// ═══════════════════════════════════════════════════════

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "bloodColor": "#c41a2a",
  "grain": 16,
  "ambient": false,
  "startInDark": false
}/*EDITMODE-END*/;

function InkVeil({ phase }) {
  // phases: idle | armed | flooding | flooded | fade
  return (
    <div className={`ink-veil ${phase}`}>
      <div className="ink-blot"></div>
      <div className="ink-text">
        <div className="lbl">― crossing the threshold ―</div>
        <div className="typ">"…and the soft door<br/>closed behind her."</div>
      </div>
    </div>
  );
}

function Heartbeat({ on }) { return <div className={`heartbeat-overlay${on ? " on" : ""}`}></div>; }

function AyaApp() {
  const { useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle, TweakColor } = window;
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [world, setWorld] = useState(t.startInDark ? "dark" : "light");
  const [fear, setFear] = useState("");
  const [power, setPower] = useState("");
  const [powerLoading, setPowerLoading] = useState(false);
  const [inkPhase, setInkPhase] = useState("idle");
  const [hb, setHb] = useState(false);
  const [locked, setLocked] = useState(false);
  const audioRef = useRef(null);

  // expose grain & blood color as CSS vars
  useEffect(() => {
    document.documentElement.style.setProperty("--grain", (t.grain / 100).toFixed(2));
    document.documentElement.style.setProperty("--rouge",     t.bloodColor);
    document.documentElement.style.setProperty("--lipstick",  t.bloodColor);
  }, [t.grain, t.bloodColor]);

  // ambient hum
  useEffect(() => {
    if (!t.ambient) { if (audioRef.current) audioRef.current.pause(); return; }
    if (!audioRef.current) {
      // synthesised hum via WebAudio so no asset needed
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator(); o.frequency.value = 55;
        const g = ctx.createGain(); g.gain.value = 0.018;
        const lfo = ctx.createOscillator(); lfo.frequency.value = 0.12;
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.014;
        lfo.connect(lfoGain); lfoGain.connect(g.gain);
        o.connect(g).connect(ctx.destination);
        o.start(); lfo.start();
        audioRef.current = { pause: () => { try { o.stop(); lfo.stop(); ctx.close(); } catch (e) {} } };
      } catch (e) {}
    }
    return () => {};
  }, [t.ambient]);

  // dare ritual
  const handleDare = async (fearText) => {
    if (locked) return;
    setLocked(true);
    setFear(fearText);
    setPower("");
    setPowerLoading(true);

    // 1. heartbeat (3 beats)
    setHb(true);
    await new Promise(r => setTimeout(r, 700));

    // 2. arm + flood ink
    setInkPhase("armed");
    await new Promise(r => setTimeout(r, 80));
    setInkPhase("flooding");

    // start power fetch in parallel
    const powerPromise = window.transformFear(fearText);

    await new Promise(r => setTimeout(r, 1700));
    setInkPhase("flooded");
    await new Promise(r => setTimeout(r, 1400));

    // 3. switch world under cover of ink
    setWorld("dark");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    await new Promise(r => setTimeout(r, 80));

    // 4. fade ink away
    setInkPhase("fade");
    setHb(false);

    // 5. resolve power text & display
    const txt = await powerPromise;
    await new Promise(r => setTimeout(r, 600));
    setPower(txt);
    setPowerLoading(false);
    setLocked(false);

    // reset ink fully after fade
    setTimeout(() => setInkPhase("idle"), 1400);
  };

  // skip intro from playbill area
  const skipToDark = () => {
    setFear("(you skipped the threshold)");
    setPower("You walked in already on fire.\nNo question, no incantation, no permission.\nGood.\nKeep walking.");
    setPowerLoading(false);
    setWorld("dark");
    window.scrollTo({ top: 0 });
  };

  // skip back to light (for review)
  const backToLight = () => {
    setWorld("light");
    setFear(""); setPower("");
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <Playbill />

      {world === "light" && (
        <button className="skip-intro" onClick={skipToDark}>skip the threshold →</button>
      )}
      {world === "dark" && (
        <button className="skip-intro" onClick={backToLight} style={{ color: "var(--gold)" }}>
          ← back to the foyer
        </button>
      )}

      <InkVeil phase={inkPhase} />
      <Heartbeat on={hb} />

      {world === "light" && (
        <div className="lw">
          <LightHero />
          <LightWelcome />
          <LightGallery />
          <LightPromises />
          <FearSection onDare={handleDare} locked={locked} />
        </div>
      )}

      {world === "dark" && (
        <div className="dw">
          <PowerReveal fear={fear || "(unspoken)"} power={power} loading={powerLoading} />
          <DarkGallery />
          <DarkManifesto />
          <DarkCardDraw />
          <DarkSignature />
        </div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection title="Atmosphere">
          <TweakColor
            label="Blood / accent"
            value={t.bloodColor}
            onChange={v => setTweak("bloodColor", v)}
            options={["#c41a2a", "#e62538", "#7c0a14", "#a4002b", "#d23f4a"]}
          />
          <TweakSlider
            label="Film grain"
            value={t.grain}
            onChange={v => setTweak("grain", v)}
            min={0} max={40} step={1}
            format={v => `${v}%`}
          />
          <TweakToggle
            label="Ambient hum"
            value={t.ambient}
            onChange={v => setTweak("ambient", v)}
            hint="Low drone, like a curtain breathing."
          />
        </TweakSection>
        <TweakSection title="Stage">
          <TweakToggle
            label="Open in dark world"
            value={t.startInDark}
            onChange={v => setTweak("startInDark", v)}
            hint="Skip the threshold on next reload."
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AyaApp />);
