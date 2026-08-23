// Vanilla JS port of the React Bits TiltedCard component (JS + CSS variant).
// Pointer-driven 3D tilt via CSS transitions instead of framer-motion springs.
(function () {
  function mount(container, options) {
    const opts = Object.assign(
      {
        imageSrc: '',
        altText: 'Tilted card image',
        captionText: '',
        scaleOnHover: 1.08,
        rotateAmplitude: 12,
        showTooltip: true
      },
      options
    );

    container.classList.add('tilted-card-figure');
    container.innerHTML = '';

    const inner = document.createElement('div');
    inner.className = 'tilted-card-inner';

    const img = document.createElement('img');
    img.className = 'tilted-card-img';
    img.src = opts.imageSrc;
    img.alt = opts.altText;
    inner.appendChild(img);
    container.appendChild(inner);

    let caption = null;
    if (opts.showTooltip && opts.captionText) {
      caption = document.createElement('div');
      caption.className = 'tilted-card-caption';
      caption.textContent = opts.captionText;
      container.appendChild(caption);
    }

    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function handleMove(e) {
      if (prefersReduced) return;
      const rect = container.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;
      const rotationX = (offsetY / (rect.height / 2)) * -opts.rotateAmplitude;
      const rotationY = (offsetX / (rect.width / 2)) * opts.rotateAmplitude;

      inner.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${opts.scaleOnHover})`;

      if (caption) {
        caption.style.left = `${e.clientX - rect.left}px`;
        caption.style.top = `${e.clientY - rect.top}px`;
      }
    }

    function handleEnter() {
      if (caption) caption.style.opacity = '1';
    }

    function handleLeave() {
      inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      if (caption) caption.style.opacity = '0';
    }

    container.addEventListener('pointermove', handleMove);
    container.addEventListener('pointerenter', handleEnter);
    container.addEventListener('pointerleave', handleLeave);
  }

  window.TiltedCard = { mount };
})();
