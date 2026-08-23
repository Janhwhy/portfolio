// Vanilla JS port of the React Bits PillNav component (JS + CSS variant).
// Hover fill/label swap runs on pure CSS transitions; this just sizes each
// pill's hover circle geometrically and drives the scroll-spy active state.
(function () {
  function layoutCircles() {
    document.querySelectorAll('.pill').forEach((pill) => {
      const circle = pill.querySelector('.hover-circle');
      if (!circle) return;
      const rect = pill.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (!w || !h) return;
      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;
    });
  }

  function initScrollSpy() {
    const pills = document.querySelectorAll('.pill[data-section]');
    if (!pills.length) return;

    const setActive = (id) => {
      pills.forEach((p) => {
        p.classList.toggle('is-active', p.getAttribute('data-section') === id);
      });
    };

    const sections = [];
    pills.forEach((p) => {
      const el = document.getElementById(p.getAttribute('data-section'));
      if (el) sections.push(el);
    });
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  function init() {
    layoutCircles();
    initScrollSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('resize', layoutCircles);
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(layoutCircles).catch(() => {});
  }
})();
