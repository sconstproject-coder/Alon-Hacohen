(() => {
  const root = document.documentElement;

  /* ---------- Floating call button + mobile menu ---------- */
  const fab = document.querySelector('.fab');
  const onScroll = () => {
    if (fab) fab.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
  };
  toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  mobileNav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Active nav link by section ---------- */
  const links = [...document.querySelectorAll('.nav__link')];
  // Only in-page links ("#id") take part: "#top" maps to the hero, and the link whose section crosses 45% of
  // the viewport is current. Links to other pages (about.html, index.html#…) keep the state set in the HTML.
  const targets = links.map((a) => {
    const href = a.getAttribute('href');
    if (!href.startsWith('#')) return null;
    return href === '#top' ? document.querySelector('.hero') : document.querySelector(href);
  });
  if (targets.some(Boolean)) {
    let spyTick = false;
    const spy = () => {
      spyTick = false;
      const line = window.innerHeight * 0.45;
      const i = targets.findIndex((el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      });
      links.forEach((a, n) => {
        if (!targets[n]) return;
        if (n === i) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
    };
    spy();
    window.addEventListener('scroll', () => { if (!spyTick) { spyTick = true; requestAnimationFrame(spy); } }, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); reveal.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

  /* ---------- Testimonials slider ---------- */
  const slider = document.querySelector('[data-slider]');
  if (slider) {
    const tabs = [...slider.querySelectorAll('.person')];
    const slides = [...slider.querySelectorAll('.review')];
    let idx = 0;
    const go = (i) => {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('is-active', n === idx));
      tabs.forEach((t, n) => t.setAttribute('aria-selected', String(n === idx)));
    };
    tabs.forEach((t, n) => t.addEventListener('click', () => go(n)));
    slider.querySelector('.prev').addEventListener('click', () => go(idx - 1));
    slider.querySelector('.next').addEventListener('click', () => go(idx + 1));
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
