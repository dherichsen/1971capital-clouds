/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakColor, TweakText, TweakToggle,
   Nav, Hero, FocusStrip, BackgroundMotion, Thesis, ThesisScroll, ThesisIntro, ThesisCinematic, ThesisScrollUp, Founder, Research, Media, Signup, Footer, CityFloor */
const { useEffect } = React;

const THESIS_VIDEOS = {
  'Smelting': 'thesis.mp4',
  'Gold Bars': 'Gold Bars (compressed).mp4',
  'Pistons': 'Gold-Pistons.mp4',
  'Gray texture': 'gray texture.mp4',
};

/* ---------------- themes ---------------- */
const THEMES = {
  Institutional: {
    label: 'Institutional',
    accent: '#4f6d88',
    vars: {
      '--font-display': "'Spectral', Georgia, serif",
      '--font-body': "'Spectral', Georgia, serif",
      '--font-mono': "'IBM Plex Mono', ui-monospace, monospace",
      '--display-weight': '500',
      '--bg': '#f4f4f1', '--surface': '#f9f9f5', '--text': '#1c1815', '--muted': '#76716a',
      '--line': '#e1dfd7', '--inverse-bg': '#1c1815', '--inverse-text': '#f3efe6',
    },
  },
  Macro: {
    label: 'Macro Modern',
    accent: '#5b8cff',
    vars: {
      '--font-display': "'Helvetica Neue', Helvetica, Arial, sans-serif",
      '--font-body': "'Helvetica Neue', Helvetica, Arial, sans-serif",
      '--font-mono': "'IBM Plex Mono', ui-monospace, monospace",
      '--display-weight': '700',
      '--bg': '#0b1220', '--surface': '#111a2b', '--text': '#eaf0f8', '--muted': '#8694aa',
      '--line': '#1e2a3e', '--inverse-bg': '#eaf0f8', '--inverse-text': '#0b1220',
    },
  },
  Journal: {
    label: 'Research Journal',
    accent: '#b23a1e',
    vars: {
      '--font-display': "'Newsreader', Georgia, serif",
      '--font-body': "'Helvetica Neue', Helvetica, Arial, sans-serif",
      '--font-mono': "'IBM Plex Mono', ui-monospace, monospace",
      '--display-weight': '500',
      '--bg': '#faf7f1', '--surface': '#ffffff', '--text': '#17140f', '--muted': '#6f6657',
      '--line': '#e7e0d2', '--inverse-bg': '#17140f', '--inverse-text': '#faf7f1',
    },
  },
};

const HEADLINES = {
  Institutional: 'We invest for the next *decade*, not the next quarter.',
  Macro: 'Conviction across *thematic macro* and global markets.',
  Journal: 'A discretionary firm built on *research* and patience.',
};

const ACCENTS = ['#4f6d88', '#9a6a2f', '#b8891a', '#c79a1e', '#b23a1e', '#1f8a5b', '#23425f'];

/* Curated backgrounds — each option carries its own surface + hairline colors.
   '#f3efe6' (Tan) is the original; '#16140f' (Ink) is a full dark direction. */
const BG_OPTIONS = ['#f4f4f1', '#f3efe6', '#faf7ef', '#ece7da', '#16140f'];
const BACKGROUNDS = {
  '#f4f4f1': {}, /* Porcelain — locked-in default */
  '#f3efe6': { '--bg': '#f3efe6', '--surface': '#fbf9f3', '--line': '#e2d9c8', '--muted': '#7a6f60' },  /* Tan — original */
  '#faf7ef': { '--bg': '#faf7ef', '--surface': '#ffffff', '--line': '#e9e1cf', '--muted': '#7a6f60' },  /* Ivory — lighter, airier */
  '#ece7da': { '--bg': '#ece7da', '--surface': '#f7f3e9', '--line': '#d9d1bd', '--muted': '#7a6f60' },  /* Parchment — deeper, warmer */
  '#16140f': { '--bg': '#16140f', '--surface': '#1f1b14', '--line': '#302a1f', '--text': '#f1ecdd', '--muted': '#a69b86', '--inverse-bg': '#f3efe6', '--inverse-text': '#1c1815' }, /* Ink — dark */
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "Institutional",
  "accent": "#4f6d88",
  "bg": "#f4f4f1",
  "grain": false,
  "heroMotion": "Off",
  "backdrop": "None",
  "heroBg": "Gradient",
  "heroPhoto": "City",
  "thesisMotion": false,
  "thesisStyle": "Cinematic",
  "thesisScreen": "Ink",
  "thesisTone": "Light",
  "thesisIntro": true,
  "thesisMode": "Scroll up",
  "thesisVideo": "Gray texture",
  "thesisMark": "1971",
  "bgMotion": "None",
  "headline": "",
  "sub": "1971 Capital is an asset management firm dedicated to *growing and protecting* capital for our investors."
}/*EDITMODE-END*/;

function App() {
  // Optional solid-background preview override, driven by a ?palette= URL param.
  // Used by the "Background studies" canvas to render this page in a solid color
  // with conforming text/line colors and the hero gradient turned off.
  const OVERRIDE = React.useMemo(() => {
    try {
      const raw = new URLSearchParams(location.search).get('palette');
      return raw ? JSON.parse(decodeURIComponent(raw)) : null;
    } catch (e) { return null; }
  }, []);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = THEMES[t.direction] || THEMES.Institutional;

  // When the direction changes, sync accent + headline to that theme's defaults
  // (only if the user hasn't typed a custom headline).
  const onDirection = (dir) => {
    setTweak({ direction: dir, accent: THEMES[dir].accent, headline: '', bg: THEMES[dir].vars['--bg'] });
  };

  const headline = (t.headline && t.headline.trim()) ? t.headline : HEADLINES[t.direction] || HEADLINES.Institutional;
  const bgVars = BACKGROUNDS[t.bg] || {};
  let styleVars = { ...theme.vars, ...bgVars, '--accent': t.accent || theme.accent };
  if (OVERRIDE && OVERRIDE.vars) styleVars = { ...styleVars, ...OVERRIDE.vars };
  const backdrop = OVERRIDE ? 'None' : t.backdrop;      // solid — no hero gradient
  const heroMotion = OVERRIDE ? 'Off' : t.heroMotion;
  // alternate landing backgrounds behind the hero (flag or tweak)
  const heroVideo = (typeof window !== 'undefined' && window.__HERO_VIDEO === true) || t.heroBg === 'Video';
  const heroPhoto = t.heroBg === 'Photo';
  const heroImg = t.heroPhoto === 'Dubai' ? 'assets/hero-dubai.jpg' : 'assets/hero-city-band.jpg';

  useEffect(() => {
    document.body.style.background = styleVars['--bg'];
  }, [t.direction, t.bg, OVERRIDE]);

  return (
    <React.Fragment>
      {t.bgMotion && t.bgMotion !== 'None' && <BackgroundMotion variant={t.bgMotion} />}
    <div className={`site ${t.grain ? 'grain' : ''}`} data-theme={t.direction} data-herovideo={(heroVideo || heroPhoto) ? '' : undefined}
      data-motion={t.bgMotion && t.bgMotion !== 'None' ? 'on' : 'off'} style={styleVars}>
      <Nav />
      <Hero headline={headline} sub={t.sub} motion={heroMotion} accent={t.accent || theme.accent} backdrop={(heroVideo || heroPhoto) ? 'None' : backdrop} heroVideo={heroVideo} heroPhoto={heroPhoto} heroImg={heroImg} />
      <FocusStrip />
      {t.thesisIntro
        ? (t.thesisMode === 'Scroll up'
            ? <ThesisScrollUp video={THESIS_VIDEOS[t.thesisVideo] || THESIS_VIDEOS['Gold Bars']} />
            : <ThesisCinematic video={THESIS_VIDEOS[t.thesisVideo] || THESIS_VIDEOS['Gold Bars']} mark={t.thesisMark} />)
        : <Thesis tone="Light" video={THESIS_VIDEOS[t.thesisVideo] || THESIS_VIDEOS['Gold Bars']} />}
      <Founder />
      <Research limit={3} showMore />
      <Media limit={3} showMore />
      <Signup />
      <Footer />
      <CityFloor img="assets/hero-city-band.jpg" />

      <TweaksPanel>
        <TweakSection label="Direction" />
        <TweakRadio
          label="Style"
          value={t.direction}
          options={['Institutional', 'Macro', 'Journal']}
          onChange={onDirection} />
        <TweakSection label="Accent" />
        <TweakColor
          label="Color"
          value={t.accent}
          options={ACCENTS}
          onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Background" />
        <TweakColor
          label="Color"
          value={t.bg}
          options={BG_OPTIONS}
          onChange={(v) => setTweak('bg', v)} />
        <TweakToggle
          label="Paper grain"
          value={!!t.grain}
          onChange={(v) => setTweak('grain', v)} />
        <TweakSection label="Thesis" />
        <TweakRadio
          label="Video"
          value={t.thesisVideo}
          options={['Smelting', 'Gold Bars', 'Pistons', 'Gray texture']}
          onChange={(v) => setTweak('thesisVideo', v)} />
        <TweakRadio
          label="Mark"
          value={t.thesisMark}
          options={['1971', '71 icon']}
          onChange={(v) => setTweak('thesisMark', v)} />
        <TweakToggle
          label="1971 intro"
          value={!!t.thesisIntro}
          onChange={(v) => setTweak('thesisIntro', v)} />
        <TweakRadio
          label="Motion"
          value={t.thesisMode}
          options={['Explode', 'Scroll up']}
          onChange={(v) => setTweak('thesisMode', v)} />
        <TweakSection label="Background motion" />
        <TweakRadio
          label="Style"
          value={t.bgMotion}
          options={['None', 'Ribbons', 'Halftone']}
          onChange={(v) => setTweak('bgMotion', v)} />
        <TweakSection label="Hero backdrop" />
        <TweakRadio
          label="Background"
          value={t.heroBg}
          options={['Gradient', 'Photo', 'Video']}
          onChange={(v) => setTweak('heroBg', v)} />
        <TweakRadio
          label="Photo"
          value={t.heroPhoto}
          options={['City', 'Dubai']}
          onChange={(v) => setTweak('heroPhoto', v)} />
        <TweakSelect
          label="Style"
          value={t.backdrop}
          options={['None', 'Orb', 'Dawn', 'Halo', 'Veil', 'Vignette', 'Aurum', 'Silk', 'Horizon', 'Meridian']}
          onChange={(v) => setTweak('backdrop', v)} />
        <TweakSection label="Copy" />
        <TweakText
          label="Headline"
          value={t.headline}
          placeholder={HEADLINES[t.direction]}
          onChange={(v) => setTweak('headline', v)} />
        <TweakText
          label="Sub-headline"
          value={t.sub}
          onChange={(v) => setTweak('sub', v)} />
      </TweaksPanel>
    </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
