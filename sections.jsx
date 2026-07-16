/* global React */
const { useState, useEffect, useRef } = React;

/* ---------- reveal-on-scroll wrapper ---------- */
function Reveal({ children, as = 'div', className = '', delay = 0, ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Immediate check: anything already within (or near) the viewport reveals at once.
    const reveal = () => setSeen(true);
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || 800) * 0.96 && r.bottom > 0;
    };
    if (inView()) { reveal(); return; }
    let io;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { reveal(); io.disconnect(); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      io.observe(el);
    }
    // Failsafe: never leave content hidden if the observer never fires.
    const onScroll = () => { if (inView()) { reveal(); cleanup(); } };
    const timer = setTimeout(reveal, 1600);
    window.addEventListener('scroll', onScroll, { passive: true });
    function cleanup() {
      if (io) io.disconnect();
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    }
    return cleanup;
  }, []);
  const Tag = as;
  return (
    <Tag ref={ref} className={`r71reveal ${seen ? 'r71in' : ''} ${className}`} style={{ animationDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

function Placeholder({ label, className = '', style }) {
  return (
    <div className={`ph ${className}`} style={style}>
      <span>{label}</span>
    </div>
  );
}

function Arrow() { return <span className="arw">→</span>; }

/* ---------- shared nav config ---------- */
const IR_EMAIL = 'mailto:investor.relations@1971capital.com';
const navItems = (base) => [
  { label: 'About', href: base + '#about' },
  { label: 'Research', href: 'Research.html' },
  { label: 'Media', href: 'Media.html' },
];

/* ---------- nav ---------- */
function Nav({ base = '' }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  // Close the mobile menu if the viewport grows back to desktop.
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 940) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const close = () => setOpen(false);
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''} ${open ? 'open' : ''}`}>
      <div className="wrap nav-inner">
        <a className="brand" href={base || '#top'} onClick={(e) => { close(); if (!base) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); if (history.replaceState) history.replaceState(null, '', location.pathname + location.search); } }}>
          <span className="brandmark" aria-hidden="true"></span>
          <span className="mark"><b>1971</b> Capital</span>
        </a>
        <button
          className="nav-toggle" type="button" aria-label="Menu"
          aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span></span><span></span><span></span>
        </button>
        <div className="nav-links">
          {navItems(base).map((l) => <a key={l.label} href={l.href} onClick={close}>{l.label}</a>)}
          <a className="navcta" href={IR_EMAIL} onClick={close}>Investor Relations</a>
        </div>
      </div>
    </nav>
  );
}

/* ---------- hero ---------- */
function Hero({ headline, sub, motion, accent, backdrop, heroVideo, heroPhoto, heroImg }) {
  // headline may contain *italic* segment marked with asterisks
  const parts = headline.split(/(\*[^*]+\*)/g).filter(Boolean);
  const Motion = window.HeroMotion;
  return (
    <header className={`hero ${heroVideo ? 'hero--video' : ''} ${heroPhoto ? 'hero--photo' : ''}`} id="top">
      {heroPhoto && (
        <img className="hero-photo" src={heroImg || 'assets/hero-city-v13.jpg'} alt="" aria-hidden="true" />
      )}
      {heroVideo && (
        <video className="hero-video" src="uploads/gray%20texture.mp4" poster="assets/poster-gray.jpg"
               autoPlay loop muted playsInline preload="auto" aria-hidden="true"></video>
      )}
      {!heroVideo && !heroPhoto && Motion && motion && motion !== 'Off' && (
        <div className="hero-motion" aria-hidden="true"><Motion variant={motion} accent={accent} /></div>
      )}
      {!heroVideo && !heroPhoto && backdrop && backdrop !== 'None' && (
        <div className="hero-backdrop" data-v={backdrop} aria-hidden="true"></div>
      )}
      <div className="wrap">
        <Reveal as="h1" delay={60}>
          {parts.map((p, i) => p.startsWith('*')
            ? <em key={i}>{p.slice(1, -1)}</em>
            : <React.Fragment key={i}>{p}</React.Fragment>)}
        </Reveal>
        <Reveal className="hero-sub" delay={140}>{
          sub.split(/(\*[^*]+\*)/g).filter(Boolean).map((p, i) => p.startsWith('*')
            ? <span className="hero-sub-gold" key={i}>{p.slice(1, -1)}</span>
            : <React.Fragment key={i}>{p}</React.Fragment>)
        }</Reveal>
        <Reveal className="hero-actions" delay={200}>
          <a className="btn btn-primary" href="#research">Read our research <Arrow /></a>
          <a className="btn btn-ghost" href={IR_EMAIL}>Contact investor relations</a>
        </Reveal>
      </div>
    </header>
  );
}

/* ---------- focus strip ---------- */
const FOCUS = [
  { n: '01', t: 'Cross-Asset', d: 'High conviction themes expressed across every asset class.' },
  { n: '02', t: 'Risk Protection', d: 'Downside protection that generates portfolio income.' },
  { n: '03', t: 'Liquid', d: 'Exposure taken exclusively in liquid public markets so capital is never locked up.' },
];
function FocusStrip() {
  return (
    <section className="focus" id="about">
      <div className="wrap focus-grid">
        {FOCUS.map((f) => (
          <div className="focus-item" key={f.n}>
            <div className="n mono">{f.n}</div>
            <h3>{f.t}</h3>
            <p>{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- site background motion (fixed, behind content) ---------- */
function BackgroundMotion({ variant }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const TAU = Math.PI * 2;
    const h = (x, y) => { const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); };
    const vn = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      const tl = h(xi, yi), tr = h(xi + 1, yi), bl = h(xi, yi + 1), br = h(xi + 1, yi + 1);
      const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      return (tl * (1 - u) + tr * u) * (1 - v) + (bl * (1 - u) + br * u) * v;
    };
    const fbm = (x, y) => vn(x, y) * 0.6 + vn(x * 2.03, y * 2.03) * 0.3 + vn(x * 4.01, y * 4.01) * 0.1;
    let W = 0, H = 0, raf = 0, dead = false, t = 0;
    const size = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr | 0; canvas.height = H * dpr | 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const bands = [
      { y: 0.24, amp: 70, w: 200, spd: 0.6, col: [201, 162, 90], a: 0.20 },
      { y: 0.50, amp: 95, w: 250, spd: -0.45, col: [216, 184, 120], a: 0.18 },
      { y: 0.74, amp: 82, w: 210, spd: 0.35, col: [154, 106, 47], a: 0.15 },
    ];
    const ribbons = () => {
      t += 0.004; ctx.clearRect(0, 0, W, H);
      for (const b of bands) {
        const cy = b.y * H;
        const curve = (x) => cy + Math.sin(x * 0.0045 + t * b.spd * 6) * b.amp + Math.sin(x * 0.011 + t * b.spd * 9) * b.amp * 0.4;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 10) { const y = curve(x); if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
        for (let x = W; x >= 0; x -= 10) ctx.lineTo(x, curve(x) + b.w);
        ctx.closePath();
        const g = ctx.createLinearGradient(0, cy - b.amp, 0, cy + b.w + b.amp);
        g.addColorStop(0, `rgba(${b.col.join(',')},0)`); g.addColorStop(0.5, `rgba(${b.col.join(',')},${b.a})`); g.addColorStop(1, `rgba(${b.col.join(',')},0)`);
        ctx.fillStyle = g; ctx.fill();
      }
      if (!reduce && !dead) raf = requestAnimationFrame(ribbons);
    };
    const halftone = () => {
      t += 0.01; ctx.clearRect(0, 0, W, H);
      const gap = 24;
      for (let y = gap / 2; y < H; y += gap) for (let x = gap / 2; x < W; x += gap) {
        const n = fbm(x * 0.005 + t, y * 0.005 - t * 0.5);
        const r = Math.max(0, n - 0.34) * gap * 1.1;
        if (r < 0.3) continue;
        ctx.globalAlpha = 0.05 + n * 0.12;
        ctx.fillStyle = n > 0.72 ? '#c9a25a' : '#dcc596';
        ctx.beginPath(); ctx.arc(x, y, Math.min(r, gap * 0.42), 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduce && !dead) raf = requestAnimationFrame(halftone);
    };
    const onResize = () => { size(); };
    size();
    window.addEventListener('resize', onResize);
    (variant === 'Halftone' ? halftone : ribbons)();
    return () => { dead = true; if (raf) cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, [variant]);
  return <div className="bg-motion" aria-hidden="true"><canvas ref={ref}></canvas></div>;
}

/* ---------- thesis (cinematic video) ---------- */
const THESIS_SCENES = [
  ["In 1971, the U.S. unlinked", "the dollar from <em>gold</em>."],
  ["Eliminating this constraint", "<em>did not</em> set off hyperinflation", "or a financial crisis."],
  ["Instead, the era of <em>fiat&nbsp;currency</em>&nbsp;unleashed", "unconstrained human progress", "and <em>wealth&nbsp;creation</em>."],
  ["We help investors navigate", "this <em>unfolding future</em>."],
];

/* Same thesis language, tokenised for the word-by-word scroll reveal.
   Each inner array is a display line; `em` words illuminate in gold.
   `br` marks a line that closes a sentence (adds breathing room after). */
const THESIS_PARA = [
  [[{ t: 'In' }, { t: '1971,' }, { t: 'the' }, { t: 'U.S.' }, { t: 'unlinked' }]],
  [[{ t: 'the' }, { t: 'dollar' }, { t: 'from' }, { t: 'gold.', em: true }], { br: true }],
  [[{ t: 'Eliminating' }, { t: 'this' }, { t: 'constraint' }, { t: 'did' }, { t: 'not' }]],
  [[{ t: 'set' }, { t: 'off' }, { t: 'hyperinflation' }, { t: 'or' }, { t: 'a' }, { t: 'financial' }, { t: 'crisis.' }], { br: true }],
  [[{ t: 'Instead,' }, { t: 'the' }, { t: 'era' }, { t: 'of' }, { t: 'fiat', em: true }, { t: 'currency', em: true }, { t: 'unleashed' }]],
  [[{ t: 'unconstrained' }, { t: 'human' }, { t: 'progress' }, { t: 'and' }, { t: 'wealth', em: true }, { t: 'creation.', em: true }], { br: true }],
  [[{ t: 'We' }, { t: 'help' }, { t: 'investors' }, { t: 'navigate' }]],
  [[{ t: 'this' }, { t: 'unfolding', em: true }, { t: 'future.', em: true }]],
];

function Thesis({ video, tone = 'Dark', intro = false }) {
  const stageRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const sectionRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const src = video || 'Gold-Pistons.mp4';
  const isCity = src === 'City-Train.mp4';

  React.useEffect(() => {
    const STAGGER = 150, HOLD = 1850;
    const stage = stageRef.current;
    const vid = videoRef.current;
    const sec = sectionRef.current;
    if (!stage || !sec) return;
    let si = 0, timers = [], dead = false, running = false;
    const wait = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); };
    function show() {
      if (dead || !running) return;
      stage.classList.remove('leaving');
      stage.innerHTML = '';
      const lines = [];
      THESIS_SCENES[si].forEach(txt => {
        const d = document.createElement('div');
        d.className = 'tv-line';
        d.innerHTML = txt;
        stage.appendChild(d);
        lines.push(d);
      });
      requestAnimationFrame(() => {
        lines.forEach((u, i) => { u.style.transitionDelay = (i * STAGGER) + 'ms'; u.classList.add('in'); });
      });
      const inTime = lines.length * STAGGER + 850;
      const hold = HOLD + Math.max(0, lines.length - 2) * 1100;
      wait(() => {
        stage.classList.add('leaving');
        wait(() => {
          const next = (si + 1) % THESIS_SCENES.length;
          if (next === 0 && isCity && vid) {
            try { vid.currentTime = 0; } catch (e) {}
            vid.play && vid.play().catch(() => {});
          }
          si = next; show();
        }, 520);
      }, inTime + hold);
    }
    function stopSequence() {
      timers.forEach(clearTimeout); timers = [];
      running = false;
    }
    function startSequence() {
      if (running) return;
      running = true;
      if (vid) {
        vid.playbackRate = isCity ? 0.62 : 1;
        vid.loop = !isCity;
        try { vid.currentTime = 0; } catch (err) {}
        vid.play && vid.play().catch(() => {});
      }
      si = 0; show();
    }

    /* ---- INTRO MODE: gold "1971" particle burst, in this same section ---- */
    if (intro) {
      const canvas = canvasRef.current;
      const ctx = canvas && canvas.getContext('2d');
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let dots = [], W = 0, H = 0, gold = '#9a6a2f', raf = 0;
      const easeIn = (t) => t * t;
      const EXPLODE_MS = 1450;              // slower so the dots clearly read as dissipating
      const REFORM_MS = 950;                // dots fly back in to re-form the numerals

      const build = () => {
        if (!canvas || !ctx) return;
        const host = document.querySelector('.site') || document.body;
        gold = (getComputedStyle(host).getPropertyValue('--accent').trim()) || '#9a6a2f';
        const rect = canvas.getBoundingClientRect();
        W = Math.max(1, rect.width); H = Math.max(1, rect.height);
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const off = document.createElement('canvas');
        off.width = Math.round(W); off.height = Math.round(H);
        const octx = off.getContext('2d');
        const fs = Math.min(W / 2.9, H * 0.66);
        octx.fillStyle = '#000';
        octx.font = `700 ${fs}px 'Spectral', Georgia, serif`;
        octx.textAlign = 'center'; octx.textBaseline = 'alphabetic';
        const tm = octx.measureText('1971');
        const asc = tm.actualBoundingBoxAscent || fs * 0.7;
        const desc = tm.actualBoundingBoxDescent || fs * 0.02;
        const baseY = H / 2 + (asc - desc) / 2;   // centre the real glyph box
        octx.fillText('1971', W / 2, baseY);
        const data = octx.getImageData(0, 0, Math.round(W), Math.round(H)).data;
        const IW = Math.round(W);
        const step = Math.max(3, Math.round(W / 340));
        dots = [];
        for (let y = 0; y < H; y += step) {
          for (let x = 0; x < W; x += step) {
            if (data[(y * IW + x) * 4 + 3] > 130) {
              const ang = Math.random() * Math.PI * 2;
              const spd = 0.5 + Math.random() * 0.95;
              dots.push({
                x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 0.14,
                r: step * 0.3 * (0.6 + Math.random() * 0.5), delay: Math.random() * 0.16,
              });
            }
          }
        }
      };
      const drawBurst = (eProg) => {
        if (!ctx) return;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = gold;
        const maxD = Math.max(W, H) * 0.95;
        for (let i = 0; i < dots.length; i++) {
          const d = dots[i];
          const local = Math.max(0, (eProg - d.delay) / (1 - d.delay));
          const e = easeIn(Math.min(local, 1));
          const alpha = 1 - Math.min(local, 1);
          if (alpha <= 0.012) continue;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(d.x + d.vx * maxD * e, d.y + d.vy * maxD * e, d.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      };

      const vidTarget = tone === 'Light' ? '0.3' : '1';
      if (vid) { vid.loop = true; vid.muted = true; vid.playbackRate = 1; vid.style.opacity = '0'; }

      // ---- state machine: formed -> exploding -> captions(once) -> formed ----
      let state = 'formed', inView = false, armed = false, autoUsed = false, graceT = 0, capT = [];
      const showFormed = () => { drawBurst(0); if (canvas) canvas.style.opacity = '1'; };
      const clearCaps = () => { capT.forEach(clearTimeout); capT = []; };
      const capWait = (fn, ms) => { const id = setTimeout(fn, ms); capT.push(id); };

      let capIdx = 0;
      const nextScene = () => {
        if (dead || state !== 'captions') return;
        stage.classList.remove('leaving');
        stage.innerHTML = '';
        const lines = [];
        THESIS_SCENES[capIdx].forEach((txt) => {
          const d = document.createElement('div');
          d.className = 'tv-line'; d.innerHTML = txt;
          stage.appendChild(d); lines.push(d);
        });
        requestAnimationFrame(() => lines.forEach((u, i) => { u.style.transitionDelay = (i * 150) + 'ms'; u.classList.add('in'); }));
        const inTime = lines.length * 150 + 850;
        const hold = 1850 + Math.max(0, lines.length - 2) * 1100;
        capWait(() => {
          stage.classList.add('leaving');
          capWait(() => {
            capIdx += 1;
            if (capIdx >= THESIS_SCENES.length) finishCaptions();
            else nextScene();
          }, 520);
        }, inTime + hold);
      };
      function finishCaptions() {
        stage.classList.remove('leaving');
        stage.innerHTML = '';
        stage.style.opacity = '0';
        startReform();                      // dots fly back into "1971"
      }

      let explodeStart = 0, exploding = false, capsStarted = false;
      let reformStart = 0, reforming = false;
      const animReform = () => {
        if (dead || !reforming) return;
        const el = Math.min((performance.now() - reformStart) / REFORM_MS, 1);
        drawBurst(1 - el);                  // t: 1 (scattered) -> 0 (formed)
        if (canvas) canvas.style.opacity = '1';
        if (el < 1) { raf = requestAnimationFrame(animReform); }
        else {
          reforming = false; drawBurst(0);
          state = 'formed';
          clearTimeout(graceT); armed = false;
          graceT = setTimeout(() => { armed = inView; }, 400);
        }
      };
      const startReform = () => {
        state = 'reforming'; armed = false; reforming = true;
        if (canvas) canvas.style.opacity = '1';
        if (vid) vid.style.opacity = '0';   // video recedes; solid light bg returns behind "1971"
        reformStart = performance.now();
        raf = requestAnimationFrame(animReform);
      };
      const CAP_AT = 0.3;                    // start the words early, mid-burst
      const animExplode = () => {
        if (dead || !exploding) return;
        const t = Math.min((performance.now() - explodeStart) / EXPLODE_MS, 1);
        drawBurst(t);
        if (canvas) canvas.style.opacity = String(1 - Math.max(0, (t - 0.55) / 0.45));
        // the gold-bars video rises in AS the dots burst — they burst into the video
        if (vid) vid.style.opacity = String((tone === 'Light' ? 0.3 : 1) * Math.min(t / 0.8, 1));
        if (t >= CAP_AT && !capsStarted) {
          capsStarted = true;
          state = 'captions'; capIdx = 0;
          stage.style.opacity = '1';
          nextScene();
        }
        if (t < 1) { raf = requestAnimationFrame(animExplode); }
        else { exploding = false; if (canvas) canvas.style.opacity = '0'; }
      };
      const startExplode = () => {
        if (state !== 'formed') return;
        state = 'exploding'; armed = false; exploding = true; capsStarted = false;
        if (canvas) canvas.style.opacity = '1';
        stage.style.opacity = '0';
        if (vid) { try { vid.currentTime = 0; } catch (e) {} vid.play && vid.play().catch(() => {}); }
        explodeStart = performance.now();
        raf = requestAnimationFrame(animExplode);
      };

      const reset = () => {
        clearCaps(); if (raf) { cancelAnimationFrame(raf); raf = 0; }
        exploding = false; reforming = false;
        state = 'formed'; armed = false;
        stage.innerHTML = ''; stage.style.opacity = '0';
        if (vid) vid.style.opacity = '0';
        showFormed();
      };

      const io = new IntersectionObserver((es) => {
        const e = es[0];
        const ratio = e.intersectionRatio;
        inView = e.isIntersecting && ratio >= 0.5;
        if (inView) {
          if (vid) vid.play && vid.play().catch(() => {});
          if (state === 'formed') {
            showFormed();
            maybeBurst();      // in case it's already parked mid-screen
          }
        } else {
          if (vid) vid.pause && vid.pause();
          autoUsed = false;      // re-arm auto-burst on next entry
          reset();
        }
      }, { threshold: [0, 0.5, 0.6] });
      io.observe(sec);

      // Fire once the "1971" numeral scrolls into the middle of the viewport.
      const midScreen = () => {
        const el = canvas || sec;
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const c = r.top + r.height / 2;
        const vh = window.innerHeight || document.documentElement.clientHeight;
        return c > vh * 0.38 && c < vh * 0.62;
      };
      const maybeBurst = () => {
        if (state === 'formed' && inView && !autoUsed && midScreen()) {
          autoUsed = true;
          startExplode();
        }
      };
      const onScroll = () => { maybeBurst(); };

      build();
      showFormed();
      if (reduce) {
        // No motion: skip the burst, just reveal the words once.
        if (canvas) canvas.style.opacity = '0';
        stage.style.opacity = '1';
        state = 'captions'; capIdx = 0;
        if (vid) { vid.style.opacity = vidTarget; vid.play && vid.play().catch(() => {}); }
        nextScene();
        return () => { dead = true; clearCaps(); io.disconnect(); clearTimeout(graceT); };
      }
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { build(); showFormed(); }).catch(() => {});
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', () => { build(); if (state === 'formed') showFormed(); });
      return () => {
        dead = true; clearCaps(); io.disconnect();
        window.removeEventListener('scroll', onScroll);
        if (raf) cancelAnimationFrame(raf);
        clearTimeout(graceT);
      };
    }

    /* ---- STANDARD MODE: captions auto-play when the band is on screen ---- */
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (!vid) return;
      if (e.isIntersecting && e.intersectionRatio >= 0.6) {
        if (!running) { startSequence(); }
        vid.play && vid.play().catch(() => {});
      } else {
        stopSequence();
        vid.pause && vid.pause();
      }
    }, { threshold: [0, 0.6] });
    io.observe(sec);
    return () => { dead = true; timers.forEach(clearTimeout); io.disconnect(); };
  }, [src, isCity, intro, tone]);

  const media = (
    <video ref={videoRef} className="tv-media" src={`uploads/${encodeURIComponent(src)}`}
           muted playsInline preload="metadata" aria-hidden="true"></video>
  );
  const tag = <div className="tv-tag mono"><i></i>The Thesis <span>·</span> 1971</div>;

  return (
    <section ref={sectionRef} data-tone={tone}
      className={`thesis thesis-video ${isCity ? 'site-gold' : ''} ${intro ? 'with1971' : ''}`}>
      {media}
      <div className="tv-ov" aria-hidden="true"></div>
      {!intro && tag}
      {intro && <canvas ref={canvasRef} className="tv-1971" aria-label="1971"></canvas>}
      <div ref={stageRef} className="tv-stage"></div>
    </section>
  );
}

/* ---------- thesis: scroll-driven, solid screen ---------- */
function ThesisScroll({ screen = 'Ink' }) {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  const reduce = typeof window !== 'undefined'
    && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    if (reduce) { setP(1); return; }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const total = r.height - vh;
      const scrolled = Math.min(Math.max(-r.top, 0), total);
      setP(total > 0 ? scrolled / total : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  const total = THESIS_PARA.reduce((a, l) => a + l[0].length, 0);
  const SPAN = 0.8;                       // words finish lighting by 80% of the scroll
  const OUT = 0.9;                        // whole paragraph fades out over the last 10%
  const head = reduce ? total : (p / SPAN) * total;
  const fillRules = reduce ? 1 : Math.min(p / SPAN, 1);
  const blockOpacity = reduce ? 1 : (p > OUT ? Math.max(0, 1 - (p - OUT) / (1 - OUT)) : 1);
  let idx = 0;
  return (
    <section ref={ref} className="thesis-scroll" data-screen={screen}>
      <div className="ts-sticky">
        <div className="ts-glow" aria-hidden="true"></div>
        <div className="ts-tag mono"><i></i>The Thesis <span>·</span> 1971</div>
        <div className="ts-stage" style={{ opacity: blockOpacity }}>
          <span className="ts-rule ts-rule-top" style={{ '--o': fillRules }} aria-hidden="true"></span>
          <div className="ts-para" aria-label="In 1971, the U.S. unlinked the dollar from gold. Eliminating this constraint did not set off hyperinflation or a financial crisis. Instead, the era of fiat currency unleashed unconstrained human progress and wealth creation. We help investors navigate this unfolding future.">
            {THESIS_PARA.map(([line, meta], li) => (
              <div className={`ts-pline ${meta && meta.br ? 'ts-pline-end' : ''}`} key={li} aria-hidden="true">
                {line.map((w, wi) => {
                  const lit = reduce ? 1 : Math.min(Math.max(head - idx, 0), 1);
                  idx += 1;
                  return (
                    <span className={`ts-w ${w.em ? 'em' : ''}`} style={{ '--lit': lit }} key={wi}>{w.t} </span>
                  );
                })}
              </div>
            ))}
          </div>
          <span className="ts-rule ts-rule-bot" style={{ '--o': fillRules }} aria-hidden="true"></span>
        </div>
        <div className="ts-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${reduce ? 1 : p})` }}></span>
        </div>
      </div>
    </section>
  );
}

/* ---------- thesis intro: "1971" particle burst on scroll ---------- */
function ThesisIntro({ tone = 'Light', video }) {
  const secRef = useRef(null);
  const canvasRef = useRef(null);
  const src = video || 'Gold-Pistons.mp4';
  useEffect(() => {
    const sec = secRef.current;
    const canvas = canvasRef.current;
    if (!sec || !canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let dots = [], W = 0, H = 0, p = 0, ink = '#1c1815', gold = '#9a6a2f';

    const readColors = () => {
      const host = document.querySelector('.site') || document.body;
      const cs = getComputedStyle(host);
      ink = (cs.getPropertyValue('--text').trim()) || '#1c1815';
      gold = (cs.getPropertyValue('--accent').trim()) || '#9a6a2f';
    };
    const easeIn = (t) => t * t;

    function build() {
      readColors();
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, rect.width); H = Math.max(1, rect.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Sample "1971" from an offscreen canvas to get particle targets.
      const off = document.createElement('canvas');
      off.width = Math.round(W); off.height = Math.round(H);
      const octx = off.getContext('2d');
      const fs = Math.min(W / 2.9, H * 0.66);
      octx.fillStyle = '#000';
      octx.font = `700 ${fs}px 'Spectral', Georgia, serif`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillText('1971', W / 2, H / 2);
      const data = octx.getImageData(0, 0, Math.round(W), Math.round(H)).data;
      const IW = Math.round(W);
      const step = Math.max(4, Math.round(W / 260));
      dots = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const a = data[(y * IW + x) * 4 + 3];
          if (a > 130) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 0.5 + Math.random() * 0.95;
            dots.push({
              x, y,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd - 0.14,
              r: step * 0.36 * (0.72 + Math.random() * 0.6),
              delay: Math.random() * 0.16,
              c: Math.random() < 0.24 ? gold : ink,
            });
          }
        }
      }
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const maxD = Math.max(W, H) * 0.95;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const local = d.delay >= 1 ? 0 : Math.max(0, (p - d.delay) / (1 - d.delay));
        const e = easeIn(Math.min(local, 1));
        const alpha = 1 - Math.min(local, 1);
        if (alpha <= 0.012) continue;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = d.c;
        ctx.beginPath();
        ctx.arc(d.x + d.vx * maxD * e, d.y + d.vy * maxD * e, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const total = r.height - vh;
      const scrolled = Math.min(Math.max(-r.top, 0), total);
      // explosion completes within the first ~72% of the scroll, then holds clear
      const raw = total > 0 ? scrolled / total : 0;
      p = reduce ? 0 : Math.min(raw / 0.72, 1);
      draw();
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };

    build();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build).catch(() => {});
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', build);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', build);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [src]);

  return (
    <section ref={secRef} className="thesis-intro" data-tone={tone} aria-label="1971">
      <div className="ti-sticky">
        {tone === 'Light' && (
          <video className="ti-media" src={`uploads/${encodeURIComponent(src)}`}
                 muted playsInline autoPlay loop preload="metadata" aria-hidden="true"></video>
        )}
        <div className="ti-ov" aria-hidden="true"></div>
        <canvas ref={canvasRef} className="ti-canvas" aria-hidden="true"></canvas>
      </div>
    </section>
  );
}

function ThesisOld({ motion }) {
  const Motion = window.HeroMotion;
  return (
    <section className="thesis">
      {Motion && motion && (
        <div className="thesis-motion" aria-hidden="true"><Motion variant="Markets" ink="#f3efe6" /></div>
      )}
      <div className="wrap thesis-grid">
        <Reveal className="thesis-yearcol">
          <div className="thesis-mark" role="img" aria-label="1971 Capital"></div>
          <div className="thesis-yearsub">
            <div className="thesis-label mono">The Thesis <span>·</span> Why 1971</div>
            <div className="thesis-tick" aria-hidden="true"></div>
          </div>
        </Reveal>
        <Reveal delay={120} className="thesis-copy">
          <h2>The year the monetary constraint <em>fell away</em>.</h2>
          <p>In 1971, the U.S. unlinked the dollar from gold. Eliminating this constraint did not set off hyperinflation or a financial crisis. Instead, the era of fiat currency unleashed unconstrained human progress, productivity growth, and wealth creation.</p>
          <p className="thesis-close">We help investors navigate this unfolding future.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- founder ---------- */
function Founder() {
  const creds = ['Founder & CIO', '20 years in finance', 'Institutional Risk Management'];
  return (
    <section className="founder">
      <div className="wrap founder-grid">
        <Reveal className="founder-head">
          <div className="founder-kicker mono">Leadership</div>
          <h2>Brian Russ</h2>
          <div className="role">Founder &amp; Chief Investment Officer</div>
        </Reveal>
        <Reveal className="founder-photo-wrap" delay={80}>
          <img className="founder-photo" src="data:image/jpeg;base64,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" alt="Brian Russ, Founder & CIO" />
        </Reveal>
        <Reveal className="founder-detail" delay={140}>
          <p>Brian founded 1971 Capital to help investors position around the dynamic forces reshaping global markets. He brings two decades of experience across institutional finance and investment management.</p>
          <div className="creds">
            {creds.map((c) => <span className="cred" key={c}>{c}</span>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- research + media cards ---------- */
const CONTENT = window.SITE_CONTENT || { posts: [], media: [] };
const POSTS = CONTENT.posts || [];
const MEDIA = CONTENT.media || [];
const actionLabel = (type) => type === 'Podcast' ? 'Listen' : (type === 'Video' ? 'Watch' : 'Read');

/* Live research: pull the latest essays straight from the Substack RSS feed
   (served as JSON by the Cloudflare function at /api/research). Falls back to
   the built-in list in content.js when the endpoint isn't available — e.g. in
   local preview, or if the feed is ever unreachable. */
function useResearch() {
  const [posts, setPosts] = useState(POSTS);
  useEffect(() => {
    let alive = true;
    fetch('/api/research', { headers: { accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d && d.ok && Array.isArray(d.posts) && d.posts.length) {
          setPosts(d.posts);
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return posts;
}

function CoverTile({ item, kind }) {
  const kicker = kind === 'media' ? (item.action || 'Media') : 'Research';
  return (
    <div className="cover-tile">
      <span className="ct-mark" aria-hidden="true"></span>
      <span className="ct-body">
        <span className="ct-kicker mono">{kicker}</span>
        <span className="ct-title">{item.title}</span>
      </span>
    </div>
  );
}

function Card({ item, kind, delay }) {
  const isPh = !!item.placeholder;
  const href = isPh ? undefined : (item.url || '#');
  const action = item.action || (kind === 'media' ? 'Watch' : 'Read');
  return (
    <Reveal as={isPh ? 'div' : 'a'} className={`card ${isPh ? 'is-placeholder' : ''}`} delay={delay}
      href={href} target={isPh ? undefined : '_blank'} rel={isPh ? undefined : 'noreferrer'}>
      <div className="card-cover">
        {item.image
          ? <img src={item.image} alt="" loading="lazy" />
          : (isPh
            ? <div className="cover-add"><span className="mono">＋ Add cover</span></div>
            : <CoverTile item={item} kind={kind} />)}
      </div>
      <div className="card-body">
        <div className="card-date mono">{item.date || ''}</div>
        <div className="card-title">{item.title}</div>
        {(item.desc || item.note) && <div className="card-desc">{isPh ? item.note : item.desc}</div>}
        {!isPh && <span className="card-go mono">{action} <span className="arw">→</span></span>}
      </div>
    </Reveal>
  );
}

function CardGrid({ items, kind }) {
  return (
    <div className="card-grid">
      {items.map((it, i) => <Card key={(it.title || '') + i} item={it} kind={kind} delay={i * 70} />)}
    </div>
  );
}

function Research({ limit, showMore = false }) {
  const all = useResearch();
  const items = limit ? all.slice(0, limit) : all;
  return (
    <section className="research collection" id="research">
      <div className="wrap">
        <Reveal className="section-head"><h2>Research</h2></Reveal>
        <CardGrid items={items} kind="research" />
        {showMore && (
          <Reveal className="more-row">
            <a className="more-link mono" href="Research.html">All research <span className="arw">→</span></a>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Media({ limit, showMore = false }) {
  if (!MEDIA.length) return null;
  const items = limit ? MEDIA.slice(0, limit) : MEDIA;
  return (
    <section className="media collection" id="media">
      <div className="wrap">
        <Reveal className="section-head"><h2>Media</h2></Reveal>
        <CardGrid items={items} kind="media" />
        {showMore && (
          <Reveal className="more-row">
            <a className="more-link mono" href="Media.html">All media <span className="arw">→</span></a>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ---------- signup ---------- */
function Signup() {
  const [val, setVal] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!/.+@.+\..+/.test(val) || busy || done) return;
    setBusy(true);
    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: val }),
    })
      .then((r) => r.json())
      .catch(() => ({ ok: false }))
      .then((d) => {
        setBusy(false);
        setDone(true);
        if (!d || !d.ok) {
          window.open('https://1971capital.substack.com/subscribe', '_blank', 'noopener');
        }
      });
  };
  return (
    <section className="signup" id="contact">
      <div className="wrap signup-grid">
        <Reveal>
          <h2>Subscribe to our research.</h2>
          <p className="lede">New essays. Delivered to your inbox. No noise.</p>
        </Reveal>
        <Reveal delay={100}>
          <form className="form" onSubmit={submit}>
            <input
              type="email" placeholder="you@firm.com" value={val}
              onChange={(e) => setVal(e.target.value)} aria-label="Email address" />
            <button className="btn btn-primary" type="submit" disabled={busy}>{done ? 'Subscribed' : (busy ? 'Subscribing…' : 'Subscribe')} <Arrow /></button>
            <div className={`note ${done ? 'ok' : ''}`}>
              {done ? '✓ Thank you — confirm via the email in your inbox.' : 'Delivered through Substack · unsubscribe anytime'}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- footer ---------- */
function Footer({ base = '' }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <a href={base || '#top'} className="footer-mark" aria-label="1971 Capital home" onClick={(e) => { if (!base) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); if (history.replaceState) history.replaceState(null, '', location.pathname + location.search); } }}></a>
            <div className="mark"><b>1971</b> Capital</div>
            <p>Investment Management</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Firm</h4>
              {navItems(base).map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <a href={IR_EMAIL}>Investor Relations</a>
              <a href="https://1971capital.substack.com" target="_blank" rel="noreferrer">Substack</a>
              <a href="https://x.com/russ_brian" target="_blank" rel="noreferrer">X / Twitter</a>
            </div>
          </div>
        </div>
        <p className="disclaimer">
          The content presented herein is for informational purposes only and does not constitute investment advice or an offer to sell securities. Investment and advisory services are offered only to qualified clients and prospective clients where 1971 Capital and its representatives are properly licensed or exempt from licensure.
        </p>
        <div className="footer-bottom">
          <span>© 2026 1971 Capital Management, LLC. All rights reserved.</span>
          <span className="legal">
            <a href="Privacy.html">Privacy Policy</a>
            <a href="Terms.html">Terms of Use</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- archive page header ---------- */
function ArchiveHeader({ kicker, title, lede }) {
  return (
    <header className="archive-head">
      <div className="wrap">
        <Reveal className="archive-kicker mono">{kicker}</Reveal>
        <Reveal as="h1" delay={60}>{title}</Reveal>
        {lede && <Reveal className="archive-lede" delay={120}>{lede}</Reveal>}
      </div>
    </header>
  );
}

/* ---------- thesis cinematic ----------
   One tall scroll section over the gold-smelting video. As the viewer scrolls:
   (1) the "1971" dots implode into the numeral, (2) hold, (3) explode outward —
   using the gold dot size + colour from the hero intro; then (4) the full thesis
   copy fades in over the lower third of the same smelting footage. */
function ThesisCinematic({ video, mark = '1971' }) {
  const secRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const thesisRef = useRef(null);
  const bgRef = useRef(null);
  const cueRef = useRef(null);
  const src = video || 'thesis.mp4';
  const useIcon = mark === '71 icon';

  useEffect(() => {
    const sec = secRef.current, canvas = canvasRef.current, vid = videoRef.current, thesis = thesisRef.current, bg = bgRef.current;
    if (!sec || !canvas) return;
    const cue = cueRef.current;
    const screens = ['s1', 's2', 's3', 's4', 's5'].map((r) => thesis && thesis.querySelector(`[data-role="${r}"]`));
    const setScreen = (el, o) => {
      if (!el) return;
      el.style.opacity = String(o);
      el.style.transform = `translate(-50%, calc(-50% + ${(1 - o) * 22}px))`;
      el.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
    };
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let dots = [], W = 0, H = 0, gold = '#9a6a2f', p = 0, icon = null;
    const easeIn = (t) => t * t;
    const easeOut = (t) => 1 - (1 - t) * (1 - t);
    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const isMobile = !!(window.matchMedia && window.matchMedia('(max-width: 720px)').matches);
    const dotScale = isMobile ? 0.30 : 0.42;
    // fully scroll-driven: progress is tied 1:1 to how far the viewer has scrolled
    // through the tall section — no timers, no auto-advance.
    let scrollP = 0;

    function build() {
      const host = document.querySelector('.site') || document.body;
      gold = getComputedStyle(host).getPropertyValue('--accent').trim() || '#9a6a2f';
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, rect.width); H = Math.max(1, rect.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const off = document.createElement('canvas');
      off.width = Math.round(W); off.height = Math.round(H);
      const octx = off.getContext('2d');
      const IW = Math.round(W);
      let sampleIcon = false;
      if (useIcon) {
        // wait until the 71 mark image is decoded; until then draw nothing
        if (!icon || !icon.complete || !icon.naturalWidth) { dots = []; render(); return; }
        const size = Math.min(W * 0.34, H * 0.62);
        const ar = icon.naturalWidth / icon.naturalHeight;
        let dw = size, dh = size;
        if (ar >= 1) dh = size / ar; else dw = size * ar;
        octx.drawImage(icon, (W - dw) / 2, (H - dh) / 2, dw, dh);
        sampleIcon = true;
      } else {
        const fs = Math.min(W / 2.4, H * 0.5);
        octx.fillStyle = '#000';
        octx.font = `700 ${fs}px 'Spectral', Georgia, serif`;
        octx.textAlign = 'center'; octx.textBaseline = 'alphabetic';
        const tm = octx.measureText('1971');
        const asc = tm.actualBoundingBoxAscent || fs * 0.7;
        const desc = tm.actualBoundingBoxDescent || fs * 0.02;
        const cy = H * 0.5;                         // centre of the window
        const baseY = cy + (asc - desc) / 2;
        octx.fillText('1971', W / 2, baseY);
      }
      const data = octx.getImageData(0, 0, IW, Math.round(H)).data;
      const step = Math.max(isMobile ? 3 : 4, Math.round(W / (isMobile ? 360 : 300)));
      dots = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const idx = (y * IW + x) * 4;
          const a = data[idx + 3];
          // icon sheet is a dark glyph on white -> keep dark opaque pixels; text is alpha-only
          const hit = sampleIcon
            ? (a > 140 && (data[idx] + data[idx + 1] + data[idx + 2]) / 3 < 130)
            : (a > 130);
          if (hit) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 0.55 + Math.random() * 1.05;
            dots.push({
              x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 0.16,
              r: step * dotScale * (0.66 + Math.random() * 0.5), delay: Math.random() * 0.16,
            });
          }
        }
      }
      render();
    }

    // spread: 0 = formed "1971", 1 = fully scattered.  alpha: overall opacity.
    function drawState(spread, alpha) {
      ctx.clearRect(0, 0, W, H);
      if (alpha <= 0.01) return;
      ctx.fillStyle = gold;
      ctx.globalAlpha = alpha;
      const maxD = Math.max(W, H) * 1.05;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const s = Math.min(Math.max((spread - d.delay) / (1 - d.delay), 0), 1);
        const e = easeIn(s);
        ctx.beginPath();
        ctx.arc(d.x + d.vx * maxD * e, d.y + d.vy * maxD * e, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // scroll-progress phase map — five beats the viewer scrolls through in order:
    //  DOTS      hold the formed "1971" dots
    //  DISSOLVE  dots drift apart slowly; the motion window fades in behind
    //  TITLE     "The year the monetary constraint fell away."
    //  PARA      "In 1971, the U.S. unlinked…"  (vibrant)
    //  CLOSE     "We help investors navigate this unfolding future."
    //  IMPLODE   dots stream back in and re-form "1971"; motion fades away
    const HOLD_END = 0.05;   // dots held before exploding
    const DISSOLVE = 0.26;   // dots fully scattered by here (explode happens on WHITE)
    const BG_IN    = 0.185;  // gold-bars image + title fade in together at the TAIL of the explode
    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    // five text screens, each [fadeInStart, holdStart, holdEnd, fadeOutEnd]
    // screen 1 fades in together with the gold bars (BG_IN)
    const BANDS = [
      [0.185, 0.260, 0.315, 0.350],   // 1 — "The year the monetary constraint fell away." (enters with the bars)
      [0.365, 0.405, 0.460, 0.490],   // 2 — "In 1971, the U.S. unlinked the dollar from gold."
      [0.500, 0.540, 0.595, 0.625],   // 3 — "Eliminating this constraint…"
      [0.635, 0.675, 0.730, 0.760],   // 4 — "Instead, the era of fiat currency…"
      [0.770, 0.810, 0.865, 0.895],   // 5 — "We help investors navigate…"
    ];
    const IMPLODE = 0.90;    // dots begin streaming back
    const RETURN  = 0.98;    // dots fully re-formed into "1971"
    const bandA = (q, [a, b, c, d]) => {
      if (q <= a || q >= d) return 0;
      if (q < b) return easeOut((q - a) / (b - a));
      if (q <= c) return 1;
      return 1 - easeIn((q - c) / (d - c));
    };
    function render() {
      let spread = 0, dotA = 0, bgA = 0;
      if (p <= HOLD_END) {                                    // formed "1971" on the near-white bg
        spread = 0; dotA = 1; bgA = 0;
      } else if (p <= DISSOLVE) {                             // dots explode outward on WHITE; gold bars fade in only at the tail
        const k = (p - HOLD_END) / (DISSOLVE - HOLD_END);
        spread = easeIn(k); dotA = 1 - easeIn(k);
        bgA = easeOut(clamp01((p - BG_IN) / (DISSOLVE - BG_IN)));
      } else if (p <= IMPLODE) {                              // text screens play over the motion
        spread = 1; dotA = 0; bgA = 1;
      } else if (p <= RETURN) {                               // dots stream back and re-form "1971"
        const k = (p - IMPLODE) / (RETURN - IMPLODE);
        spread = 1 - easeInOut(k); dotA = 1; bgA = 1 - easeOut(k);
      } else {                                                // held "1971" before the next section
        spread = 0; dotA = 1; bgA = 0;
      }
      drawState(spread, dotA);
      if (bg) bg.style.opacity = String(bgA);
      // scroll cue fades out as the sequence ends and drops to the next section
      if (cue) cue.style.opacity = String(p < 0.88 ? 1 : Math.max(0, 1 - (p - 0.88) / 0.08));
      screens.forEach((el, i) => setScreen(el, bandA(p, BANDS[i])));
    }

    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const total = r.height - vh;
      const scrolled = Math.min(Math.max(-r.top, 0), total);
      scrollP = total > 0 ? scrolled / total : 0;
      if (reduce) {
        canvas.style.opacity = '0';
        if (bg) bg.style.opacity = '1';
        sec.classList.add('tc-reduced');
        return;
      }
      p = scrollP;
      render();
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };

    const io = new IntersectionObserver((es) => {
      const vis = es[0].isIntersecting;
      if (vid) { if (vis) { vid.play && vid.play().catch(() => {}); } else { vid.pause && vid.pause(); } }
    }, { threshold: 0 });
    io.observe(sec);

    build();
    if (useIcon) {
      icon = new Image();
      icon.onload = () => { build(); };
      icon.src = 'assets/favicon-71.png';
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build).catch(() => {});
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', build);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', build);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [src, useIcon]);

  return (
    <section ref={secRef} className="thesis-cine" aria-label="The thesis — 1971">
      <div className="tc-sticky">
        <div className="tc-window">
          <div ref={bgRef} className="tc-bg">
            <video ref={videoRef} className="tc-media" src={`uploads/${encodeURIComponent(src)}`}
                   muted playsInline autoPlay loop preload="metadata" aria-hidden="true"></video>
            <div className="tc-ov" aria-hidden="true"></div>
          </div>
          <canvas ref={canvasRef} className="tc-1971" aria-hidden="true"></canvas>
          <div ref={thesisRef} className="tc-thesis">
            <div className="tc-screen" data-role="s1">
              <hr className="tc-rule top" aria-hidden="true" />
              <h2>The year the monetary constraint <em>fell away</em>.</h2>
            </div>
            <div className="tc-screen" data-role="s2">
              <p className="tc-line">In 1971, the U.S. unlinked the dollar from <em>gold</em>.</p>
            </div>
            <div className="tc-screen" data-role="s3">
              <p className="tc-line">Eliminating this constraint <em>did not</em> set off hyperinflation or a financial crisis.</p>
            </div>
            <div className="tc-screen" data-role="s4">
              <p className="tc-line">Instead, the era of fiat currency unleashed unconstrained human progress, productivity growth, and <em>wealth creation</em>.</p>
            </div>
            <div className="tc-screen" data-role="s5">
              <p className="tc-line tc-close">We help investors navigate this <em>unfolding future</em>.</p>
              <hr className="tc-rule bot" aria-hidden="true" />
            </div>
          </div>
          <div ref={cueRef} className="tc-scroll" aria-hidden="true">
            <span className="tc-scroll-label mono">Scroll</span>
            <span className="tc-scroll-line"></span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- thesis: lines rise from the bottom, fade at centre ----------
   A tall sticky section. As the viewer scrolls, each line rises up from the
   lower edge, brightens through the lower half, and fades out as it reaches the
   centre — while the next line is already climbing in beneath it, so the screen
   is never blank of words. The final line lingers upward as the next section
   rises in behind it. */
const SCROLLUP_LINES = [
  <React.Fragment>The year the monetary constraint <em>fell away</em>.</React.Fragment>,
  <React.Fragment>In 1971, the U.S. unlinked the dollar from <em>gold</em>.</React.Fragment>,
  <React.Fragment>Eliminating this constraint <em>did not</em> set off hyperinflation or a financial crisis.</React.Fragment>,
  <React.Fragment>Instead, the era of <em>fiat&nbsp;currency</em> unleashed unconstrained human progress, productivity growth, and <em>wealth creation</em>.</React.Fragment>,
  <React.Fragment>We help investors navigate this <em>unfolding future</em>.</React.Fragment>,
];
function ThesisScrollUp({ video }) {
  const secRef = useRef(null);
  const linesRef = useRef(null);
  const bgRef = useRef(null);
  const videoRef = useRef(null);
  const cueRef = useRef(null);
  const canvasRef = useRef(null);
  const src = video || 'thesis.mp4';

  useEffect(() => {
    const sec = secRef.current, host = linesRef.current, bg = bgRef.current, cue = cueRef.current, vid = videoRef.current, canvas = canvasRef.current;
    if (!sec || !host || !canvas) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lines = Array.from(host.querySelectorAll('.tu-line'));
    const N = lines.length;
    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const easeIn = (t) => t * t;
    const easeOut = (t) => 1 - (1 - t) * (1 - t);
    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const isMobile = !!(window.matchMedia && window.matchMedia('(max-width: 720px)').matches);
    const dotScale = isMobile ? 0.30 : 0.42;
    let dots = [], W = 0, H = 0, gold = '#9a6a2f', p = 0, raf = 0;

    // ---- "1971" dot field (bookend explode / implode) ----
    function build() {
      const site = document.querySelector('.site') || document.body;
      gold = getComputedStyle(site).getPropertyValue('--accent').trim() || '#9a6a2f';
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, rect.width); H = Math.max(1, rect.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const off = document.createElement('canvas');
      off.width = Math.round(W); off.height = Math.round(H);
      const octx = off.getContext('2d');
      const IW = Math.round(W);
      const fs = Math.min(W / 2.8, H * 0.44);   // "1971" size (slightly smaller)
      octx.fillStyle = '#000';
      octx.font = `700 ${fs}px 'Spectral', Georgia, serif`;
      octx.textAlign = 'center'; octx.textBaseline = 'alphabetic';
      const tm = octx.measureText('1971');
      const asc = tm.actualBoundingBoxAscent || fs * 0.7;
      const desc = tm.actualBoundingBoxDescent || fs * 0.02;
      const baseY = H * 0.5 + (asc - desc) / 2;
      octx.fillText('1971', W / 2, baseY);
      const data = octx.getImageData(0, 0, IW, Math.round(H)).data;
      const step = Math.max(isMobile ? 3 : 4, Math.round(W / (isMobile ? 360 : 300)));
      dots = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const a = data[(y * IW + x) * 4 + 3];
          if (a > 130) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 0.55 + Math.random() * 1.05;
            dots.push({ x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 0.16,
              r: step * dotScale * (0.66 + Math.random() * 0.5), delay: Math.random() * 0.16 });
          }
        }
      }
      render();
    }
    function drawState(spread, alpha) {
      ctx.clearRect(0, 0, W, H);
      if (alpha <= 0.01) return;
      ctx.fillStyle = gold;
      ctx.globalAlpha = alpha;
      const maxD = Math.max(W, H) * 1.05;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const s = Math.min(Math.max((spread - d.delay) / (1 - d.delay), 0), 1);
        const e = easeIn(s);
        ctx.beginPath();
        ctx.arc(d.x + d.vx * maxD * e, d.y + d.vy * maxD * e, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // scroll timeline: "1971" bookends the rising-lines sequence
    //  0 .. FRONT_END   dots hold, then explode outward; gold-bars motion fades in
    //  FRONT_END .. LINES_END   the lines rise from the bottom, fade at centre
    //  IMPLODE_START .. IMPLODE_END  dots stream back and re-form "1971" (starts as the last line tops out)
    const HOLD_END = 0.035, FRONT_END = 0.16, BG_IN = 0.10;
    const LINES_END = 0.86;                            // the rising-line sequence finishes here
    const IMPLODE_START = 0.80, IMPLODE_END = 0.95;    // dots begin re-forming AFTER the last line has fully cleared the top

    function render() {
      const vh = window.innerHeight || 800;
      const seg = 1 / (N + 1);             // vertical spacing between successive lines (tighter → last line finishes rising before the implode)
      const RISE = 0.66 * vh;              // travel distance from centre to bottom edge

      // dot field — explode on the way in, implode on the way out
      let spread, dotA;
      if (p <= HOLD_END) { spread = 0; dotA = 1; }
      else if (p <= FRONT_END) { const k = (p - HOLD_END) / (FRONT_END - HOLD_END); spread = easeIn(k); dotA = 1 - easeIn(k); }
      else if (p < IMPLODE_START) { spread = 1; dotA = 0; }
      else if (p <= IMPLODE_END) { const k = (p - IMPLODE_START) / (IMPLODE_END - IMPLODE_START); spread = 1 - easeInOut(k); dotA = 1; }
      else { spread = 0; dotA = 1; }
      drawState(spread, dotA);

      // gold-bars motion fades in behind the dots on explode, out on implode
      let bgA;
      if (p <= FRONT_END) bgA = easeOut(clamp01((p - BG_IN) / (FRONT_END - BG_IN)));
      else if (p >= IMPLODE_START) bgA = 1 - easeOut(clamp01((p - IMPLODE_START) / (IMPLODE_END - IMPLODE_START)));
      else bgA = 1;
      if (bg) bg.style.opacity = String(bgA);
      // the scroll cue shows ONLY while the section is actively pinned AND scrolling DOWN
      // through the "1971" dots; hidden when scrolling up or once the section is passed
      if (cue) { cue.style.opacity = (wasActive && !fromBottom) ? dotA.toFixed(3) : '0'; cue.style.pointerEvents = 'none'; cue.classList.toggle('tc-scroll--up', false); }

      // lines rise through the middle band only; the layer fades in as the
      // explosion settles and out as the sequence completes (slight overlap, never blank)
      const lp = clamp01((p - FRONT_END) / (LINES_END - FRONT_END));
      // the opening line holds centred for a couple of scrolls; the rest of the
      // sequence begins only after this hold (mlp = post-hold "moving" progress)
      const HOLD = 0.16;
      const mlp = clamp01((lp - HOLD) / (1 - HOLD));
      const layer = clamp01((p - (FRONT_END - 0.02)) / 0.04) * (1 - clamp01((p - (LINES_END - 0.04)) / 0.04));
      lines.forEach((el, i) => {
        const isFirst = i === 0;
        let rel;
        if (isFirst) {
          // holds centred through the hold, then rises on the same cadence as the rest
          rel = mlp / seg;
        } else {
          const centreP = i * seg;           // even spacing so each line rises in as the prior one leaves
          rel = (mlp - centreP) / seg;        // <0 below centre (rising), 0 centre, >0 above centre
        }
        // opacity: fade IN while rising from below, hold full through the middle band,
        // then fade OUT only as the line nears the TOP of the screen (gone by rel≈1).
        // Uniform for every line, including the first and the last.
        // travel: words rise on a top-down scroll (mirror when entering from the bottom)
        const y = (fromBottom ? 1 : -1) * rel * RISE;
        // The words stay hidden behind the skyline: each one only fades in once it
        // has risen ABOVE the cloud line, then dissolves again as it nears the top.
        const yFrac = 0.5 + y / vh;            // line centre as a fraction of the viewport
        const CLOUD = 0.60, IN = 0.10, TOP = 0.10, OUT = 0.34;
        const o = Math.min(
          clamp01((CLOUD - yFrac) / IN),       // emerge above the clouds
          clamp01((yFrac - TOP) / OUT)         // then fade out gradually as the line rises up
        );
        el.style.transform = `translate(-50%, calc(-50% + ${y.toFixed(1)}px))`;
        el.style.opacity = (o * layer).toFixed(3);
      });
    }

    // entry-direction aware progress: the sequence always plays FORWARD (explode →
    // "The year…" → … → implode) whether you scroll into the section from the top or
    // back up into it from the bottom. Progress is measured from the edge you entered.
    let fromBottom = false, wasActive = false, lastY = window.scrollY || window.pageYOffset || 0;

    const measure = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const total = r.height - vh;
      const y = window.scrollY || window.pageYOffset || 0;
      const f = total > 0 ? Math.min(Math.max(-r.top, 0), total) / total : 0;   // 0 at top edge, 1 at bottom edge
      const activeNow = r.top <= 0 && r.bottom >= vh;                            // sticky inner is pinned
      if (activeNow && !wasActive) fromBottom = y < lastY;                       // entered while scrolling up = from the bottom
      wasActive = activeNow;
      lastY = y;
      if (reduce) {
        canvas.style.opacity = '0';
        if (bg) bg.style.opacity = '1';
        lines.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'translate(-50%,-50%)'; });
        sec.classList.add('tu-reduced');
        return;
      }
      if (!activeNow) {
        // out of the pinned range: clean first frame when above, finished "1971" when below
        p = r.top > 0 ? 0 : 1;
      } else {
        p = fromBottom ? (1 - f) : f;   // play forward from whichever edge we came in
      }
      render();
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };

    const io = new IntersectionObserver((es) => {
      const vis = es[0].isIntersecting;
      if (vid) { if (vis) { vid.play && vid.play().catch(() => {}); } else { vid.pause && vid.pause(); } }
    }, { threshold: 0 });
    io.observe(sec);

    build();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build).catch(() => {});
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', build);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', build);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [src]);

  return (
    <section ref={secRef} className="thesis-up" aria-label="The thesis — 1971">
      <div className="tu-sticky">
        <div ref={bgRef} className="tu-bg">
          <img className="tu-media" src="assets/dubai-clouds.gif" alt="" aria-hidden="true" />
          <div className="tu-ov" aria-hidden="true"></div>
        </div>
        <canvas ref={canvasRef} className="tu-1971" aria-hidden="true"></canvas>
        <div ref={linesRef} className="tu-lines">
          {SCROLLUP_LINES.map((l, i) => (
            <p className="tu-line" key={i}>{l}</p>
          ))}
        </div>
        <div ref={cueRef} className="tc-scroll" aria-hidden="true">
          <span className="tc-scroll-label mono">Scroll</span>
          <span className="tc-scroll-line"></span>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  Reveal, Placeholder, Nav, Hero, FocusStrip, BackgroundMotion, Thesis, ThesisScroll, ThesisIntro, ThesisCinematic, ThesisScrollUp, Founder,
  Card, CardGrid, Research, Media, ArchiveHeader, Signup, Footer,
  useResearch,
});
