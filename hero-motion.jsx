/* global React */
/* Generative "brand film" backgrounds for the homepage hero.
   Auto-playing, looping motion studies drawn in brand colors:
   - Markets: slow-evolving price paths
   - Flow:    streams of capital drifting through a field
   - Rings:   long-horizon clockwork (rotating dashed rings)
   All variants respect prefers-reduced-motion (render a still frame). */

function hexA(hex, a) {
  const h = (hex || '#9a6a2f').replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(f, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function HeroMotion({ variant, accent: accentProp, ink: inkProp }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !variant || variant === 'Off') return;
    const ctx = canvas.getContext('2d');
    const site = canvas.closest('.site');
    const cs = site ? getComputedStyle(site) : null;
    const accent = accentProp || (cs && cs.getPropertyValue('--accent').trim()) || '#9a6a2f';
    const ink = inkProp || (cs && cs.getPropertyValue('--text').trim()) || '#1c1815';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, raf = 0, running = true, particles = null;

    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* ---- Markets: drifting price paths ---- */
    const lines = [...Array(6)].map((_, i) => ({
      p1: Math.random() * 7, p2: Math.random() * 7, p3: Math.random() * 7,
      s1: 0.05 + Math.random() * 0.05, s2: 0.04 + Math.random() * 0.05, s3: 0.06 + Math.random() * 0.06,
      off: -0.28 + i * 0.115,
      amp: 0.7 + Math.random() * 0.6,
    }));
    function drawMarkets(t) {
      ctx.clearRect(0, 0, W, H);
      lines.forEach((L, i) => {
        const gold = i === lines.length - 2;
        ctx.strokeStyle = gold ? hexA(accent, 0.55) : hexA(ink, 0.10);
        ctx.lineWidth = gold ? 1.4 : 1;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 6) {
          const u = x / W;
          const y = H * 0.52 + L.off * H
            + Math.sin(u * 3.8 + t * L.s1 + L.p1) * H * 0.085 * L.amp
            + Math.sin(u * 9.3 - t * L.s2 + L.p2) * H * 0.04 * L.amp
            + Math.sin(u * 21 + t * L.s3 + L.p3) * H * 0.014 * L.amp;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    }

    /* ---- Flow: streams of capital ---- */
    function initParticles() {
      particles = [...Array(110)].map(() => ({
        x: Math.random() * W, y: Math.random() * H,
        v: 0.3 + Math.random() * 0.7, gold: Math.random() < 0.3,
        hist: [],
      }));
    }
    function field(x, y, t) {
      return Math.sin(y * 0.004 + t * 0.18) * 0.7 + Math.sin((x * 0.002 - y * 0.003) + t * 0.12) * 0.5;
    }
    function drawFlow(t) {
      ctx.clearRect(0, 0, W, H);
      if (!particles) initParticles();
      particles.forEach((p) => {
        const a = field(p.x, p.y, t);
        p.x += Math.cos(a) * p.v * 1.2 + 0.5;
        p.y += Math.sin(a) * p.v * 0.8;
        if (p.x > W + 20 || p.y < -20 || p.y > H + 20) {
          p.x = -10; p.y = Math.random() * H; p.hist = [];
        }
        p.hist.push([p.x, p.y]);
        if (p.hist.length > 14) p.hist.shift();
        if (p.hist.length < 2) return;
        ctx.strokeStyle = p.gold ? hexA(accent, 0.5) : hexA(ink, 0.14);
        ctx.lineWidth = p.gold ? 1.2 : 1;
        ctx.beginPath();
        p.hist.forEach(([hx, hy], i) => { if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy); });
        ctx.stroke();
      });
    }

    /* ---- Rings: long-horizon clockwork ---- */
    function drawRings(t) {
      ctx.clearRect(0, 0, W, H);
      const cx = W * 0.8, cy = H * 0.5;
      for (let i = 0; i < 10; i++) {
        const r = 50 + i * 54;
        const gold = i === 4;
        ctx.strokeStyle = gold ? hexA(accent, 0.5) : hexA(ink, 0.10);
        ctx.lineWidth = gold ? 1.3 : 1;
        ctx.setLineDash(i % 2 ? [2, 7] : [40, 14]);
        ctx.lineDashOffset = t * (6 + i * 2.4) * (i % 2 ? -1 : 1);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    /* ---- Film: ambient cut of the brand film (1971 numeral + breakout line) ---- */
    const UB = 0.45;
    const flatY = (u) => H * 0.58 + Math.sin(u * 18 + 0.7) * H * 0.006;
    function breakY(u, slope, volMul) {
      let y = flatY(u);
      if (u > UB) {
        const d = u - UB;
        y -= d * H * slope;
        y += (Math.sin(d * 55 + 4.3) * H * 0.016 * Math.min(1, d * 6)
            + Math.sin(d * 23 + 1.3) * H * 0.026 * Math.min(1, d * 4)) * volMul;
      }
      return y;
    }
    function strokeBreak(u0, u1, slope, volMul) {
      if (u1 <= u0) return;
      ctx.beginPath();
      for (let u = u0; u <= u1; u += 0.004) {
        const x = u * W, y = breakY(u, slope, volMul);
        if (u === u0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    function drawFilm(t) {
      ctx.clearRect(0, 0, W, H);
      const cyc = 26, ct = (((t - 40) % cyc) + cyc) % cyc; /* cycle starts at load */
      const env = Math.min(1, ct / 2.5) * (ct > cyc - 3 ? Math.max(0, (cyc - ct) / 3) : 1);
      if (env <= 0) return;
      /* ghost numeral */
      ctx.font = `500 ${Math.round(H * 0.92)}px Spectral, Georgia, serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = hexA(ink, 0.05 * env);
      ctx.fillText('1971', W * 0.62, H * 0.8);
      /* breakout line: flat -> break upward at the 1971 tick */
      const r = ct < 1.2 ? 0 : Math.min(1, (ct - 1.2) / 10);
      /* fan lines after the break */
      [0.26, 0.38, 0.16].forEach((slope, i) => {
        const rf = Math.max(UB, Math.min(1, UB + (ct - 9 - i * 0.7) / 6));
        ctx.strokeStyle = hexA(ink, 0.09 * env);
        ctx.lineWidth = 1;
        strokeBreak(UB, rf, slope, 0.8);
      });
      /* tick + label */
      if (r > UB) {
        const xb = UB * W;
        ctx.strokeStyle = hexA(ink, 0.22 * env);
        ctx.setLineDash([2, 6]);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(xb, H * 0.78); ctx.lineTo(xb, flatY(UB) + 10); ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = '500 12px "IBM Plex Mono", ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = hexA(accent, 0.75 * env);
        ctx.fillText('1971', xb, H * 0.83);
      }
      ctx.strokeStyle = hexA(accent, 0.55 * env);
      ctx.lineWidth = 1.6;
      strokeBreak(0, r, 0.5, 1);
    }

    /* ---- Contour: organic topographic rings, slowly breathing ---- */
    function drawContour(t) {
      ctx.clearRect(0, 0, W, H);
      const cx = W * 0.78, cy = H * 0.52;
      for (let i = 1; i <= 11; i++) {
        const base = i * 46;
        const gold = i === 5;
        ctx.strokeStyle = gold ? hexA(accent, 0.45) : hexA(ink, 0.09);
        ctx.lineWidth = gold ? 1.3 : 1;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.045) {
          const r = base
            + Math.sin(a * 3 + t * 0.07 + i * 1.7) * base * 0.06
            + Math.sin(a * 5 - t * 0.05 + i * 0.9) * base * 0.04
            + Math.sin(a * 2 + t * 0.04 + i * 2.3) * base * 0.05;
          const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.92;
          if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    /* ---- Orb: a gold eclipse rising on the horizon ---- */
    function drawOrb(t) {
      ctx.clearRect(0, 0, W, H);
      const cx = W * 0.74, cy = H * 0.54 + Math.sin(t * 0.1) * 9;
      const R = Math.min(W, H) * 0.5 * (1 + Math.sin(t * 0.07) * 0.015);
      const g = ctx.createRadialGradient(cx, cy, R * 0.08, cx, cy, R);
      g.addColorStop(0, hexA(accent, 0.32));
      g.addColorStop(0.55, hexA(accent, 0.14));
      g.addColorStop(1, hexA(accent, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = hexA(accent, 0.28);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.52, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = hexA(ink, 0.12);
      ctx.beginPath(); ctx.moveTo(0, cy + R * 0.2); ctx.lineTo(W, cy + R * 0.2); ctx.stroke();
    }

    /* ---- Decades: a long-horizon timeline drifting past, anchored at 1971 ---- */
    function drawDecades(t) {
      ctx.clearRect(0, 0, W, H);
      const y = H * 0.62;
      const ppy = 30; /* px per year */
      const drift = t * 5;
      ctx.lineWidth = 1;
      ctx.strokeStyle = hexA(ink, 0.16);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      ctx.font = '500 12px "IBM Plex Mono", ui-monospace, monospace';
      ctx.textAlign = 'center';
      const yrFrom = 1971 + Math.floor((drift - 60) / ppy);
      const yrTo = 1971 + Math.ceil((drift + W + 60) / ppy);
      for (let yr = Math.max(1971, yrFrom); yr <= yrTo; yr++) {
        const x = (yr - 1971) * ppy - drift;
        if (x < -60 || x > W + 60) continue;
        const major = yr % 10 === 1;
        const is71 = yr === 1971;
        ctx.strokeStyle = is71 ? hexA(accent, 0.85) : hexA(ink, major ? 0.3 : 0.12);
        ctx.lineWidth = is71 ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(x, y - (major ? 17 : 7));
        ctx.lineTo(x, y + (major ? 17 : 7));
        ctx.stroke();
        if (major) {
          ctx.fillStyle = is71 ? hexA(accent, 0.95) : hexA(ink, 0.34);
          ctx.fillText(String(yr), x, y + 40);
        }
      }
    }

    const draw = variant === 'Flow' ? drawFlow
      : variant === 'Rings' ? drawRings
      : variant === 'Film' ? drawFilm
      : variant === 'Contour' ? drawContour
      : variant === 'Orb' ? drawOrb
      : variant === 'Decades' ? drawDecades
      : drawMarkets;
    resize();
    window.addEventListener('resize', resize);
    const t0 = performance.now();
    const tick = (now) => {
      if (!running) return;
      draw((now - t0) / 1000 + 40);
      raf = requestAnimationFrame(tick);
    };
    if (reduced) {
      if (variant === 'Flow') { initParticles(); for (let k = 0; k < 240; k++) drawFlow(40 + k * 0.016); }
      else if (variant === 'Film') draw(52);
      else draw(40);
    } else {
      raf = requestAnimationFrame(tick);
    }
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [variant, accentProp, inkProp]);

  if (!variant || variant === 'Off') return null;
  return <canvas ref={ref} aria-hidden="true"></canvas>;
}

Object.assign(window, { HeroMotion });
