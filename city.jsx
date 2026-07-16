/* global React */
/* ---------------------------------------------------------------------------
   The city floor.

   One photographic skyline, fixed to the bottom of the viewport — but it only
   belongs to the OPENING (hero) and the CLOSING (footer). Everywhere in
   between — leadership, research, media, subscribe — it fades away, so the
   skyline reads as a bookend rather than a permanent floor. The thesis section
   runs its own separate skyline for the rising words.

   The controller below simply drives the layer's opacity from scroll position:
   full while the hero owns the screen, full again as the footer arrives, zero
   through the middle.
   --------------------------------------------------------------------------- */

function CityFloor({ img }) {
  // Desktop (>720px) uses the band1 crop — skyline weighted to the right, open
  // fog on the left — which the asymmetric hero mask leans into. Mobile keeps
  // the original centred crop. The browser loads only the matching source.
  return (
    <div className="cityfloor" aria-hidden="true">
      <picture>
        <source media="(min-width: 721px)" srcSet="assets/hero-city-band1.jpg" />
        <img className="cityfloor-img" src={img || 'assets/hero-city-band.jpg'} alt="" />
      </picture>
    </div>
  );
}

(function () {
  if (typeof window === 'undefined' || window.__cityFloor) return;
  window.__cityFloor = true;

  var raf = 0;
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function update() {
    raf = 0;
    var el = document.querySelector('.cityfloor');
    if (!el) return false;
    var vh = window.innerHeight || 800;
    var op = 0, footMode = false;

    // OPENING — full while the hero fills the screen, gone once it has scrolled up.
    var hero = document.querySelector('.hero');
    if (hero) {
      var hb = hero.getBoundingClientRect().bottom;
      op = clamp01((hb - vh * 0.28) / (vh * 0.42));
    }
    // CLOSING — fades back in as the footer rises into the lower viewport.
    var foot = document.querySelector('.footer');
    if (foot) {
      var ft = foot.getBoundingClientRect().top;
      var fo = clamp01((vh - ft) / (vh * 0.52));
      if (fo >= op) { op = fo; footMode = fo > 0.02; }
    }

    el.style.opacity = op.toFixed(3);
    el.classList.toggle('cityfloor--foot', footMode);
    el.style.visibility = op < 0.005 ? 'hidden' : 'visible';   // spare the compositor mid-page
    return true;
  }

  function onScroll() { if (!raf) raf = requestAnimationFrame(update); }

  document.documentElement.classList.add('fog-on');
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(onScroll).catch(function () {});

  // The floor is mounted by React after this script runs — retry until it exists,
  // then hand off to the scroll/resize listeners.
  (function boot() { if (!update()) requestAnimationFrame(boot); })();
})();
