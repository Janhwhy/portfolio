// Vanilla JS port of the React Bits BlurText component (JS + CSS variant).
// Splits text into words/letters, then blur+fade+slide each one in on scroll into view.
(function () {
  function mount(el, options) {
    const opts = Object.assign(
      {
        text: null,
        delay: 200,
        animateBy: 'words',
        direction: 'top',
        threshold: 0.1,
        rootMargin: '0px',
        stepDuration: 0.35
      },
      options
    );

    const text = opts.text != null ? opts.text : el.textContent;
    const segments = opts.animateBy === 'letters' ? text.split('') : text.split(' ');

    el.textContent = '';
    el.classList.add('blur-text');
    el.style.setProperty('--bt-duration', `${opts.stepDuration * 2}s`);

    const yFrom = opts.direction === 'top' ? '-50px' : '50px';
    const yMid = opts.direction === 'top' ? '5px' : '-5px';

    segments.forEach((seg, i) => {
      const span = document.createElement('span');
      span.className = 'bt-seg';
      const isSpace = seg === '' || seg === ' ';
      let content = isSpace ? ' ' : seg;
      if (opts.animateBy !== 'letters' && i < segments.length - 1) content += ' ';
      if (opts.animateBy === 'letters' && isSpace) span.style.marginRight = '0.28em';
      span.textContent = content;
      span.style.setProperty('--bt-y-from', yFrom);
      span.style.setProperty('--bt-y-mid', yMid);
      span.style.animationDelay = `${(i * opts.delay) / 1000}s`;
      el.appendChild(span);
    });

    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add('in-view');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          observer.unobserve(el);
        }
      },
      { threshold: opts.threshold, rootMargin: opts.rootMargin }
    );
    observer.observe(el);
  }

  window.BlurText = { mount };
})();
