// Vanilla JS port of the React Bits Folder component (JS + CSS variant).
(function () {
  function darkenColor(hex, percent) {
    let color = hex.startsWith('#') ? hex.slice(1) : hex;
    if (color.length === 3) color = color.split('').map((c) => c + c).join('');
    const num = parseInt(color.slice(0, 6), 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;
    r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
    g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
    b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  }

  function mount(container, options) {
    const opts = Object.assign({ color: '#5227FF', size: 1, onToggle: null }, options);

    const folderBackColor = darkenColor(opts.color, 0.08);
    const paper1 = darkenColor('#ffffff', 0.1);
    const paper2 = darkenColor('#ffffff', 0.05);
    const paper3 = '#ffffff';

    const scale = document.createElement('div');
    scale.style.transform = `scale(${opts.size})`;

    const folder = document.createElement('div');
    folder.className = 'folder';
    folder.tabIndex = 0;
    folder.setAttribute('role', 'button');
    folder.setAttribute('aria-expanded', 'false');
    folder.setAttribute('aria-label', 'Open folder');
    folder.style.setProperty('--folder-color', opts.color);
    folder.style.setProperty('--folder-back-color', folderBackColor);
    folder.style.setProperty('--paper-1', paper1);
    folder.style.setProperty('--paper-2', paper2);
    folder.style.setProperty('--paper-3', paper3);

    const back = document.createElement('div');
    back.className = 'folder__back';

    const papers = [];
    for (let i = 0; i < 3; i++) {
      const p = document.createElement('div');
      p.className = `paper paper-${i + 1}`;
      back.appendChild(p);
      papers.push(p);
    }
    const front = document.createElement('div');
    front.className = 'folder__front';
    const right = document.createElement('div');
    right.className = 'folder__front right';
    back.appendChild(front);
    back.appendChild(right);
    folder.appendChild(back);
    scale.appendChild(folder);
    container.appendChild(scale);

    let open = false;

    function setOpen(next) {
      open = next;
      folder.classList.toggle('open', open);
      folder.setAttribute('aria-expanded', String(open));
      folder.setAttribute('aria-label', open ? 'Close folder' : 'Open folder');
      if (!open) {
        papers.forEach((p) => {
          p.style.removeProperty('--magnet-x');
          p.style.removeProperty('--magnet-y');
        });
      }
      if (opts.onToggle) opts.onToggle(open);
    }

    folder.addEventListener('click', () => setOpen(!open));
    folder.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(!open);
      }
    });

    papers.forEach((p) => {
      p.addEventListener('mousemove', (e) => {
        if (!open) return;
        const rect = p.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const ox = (e.clientX - cx) * 0.15;
        const oy = (e.clientY - cy) * 0.15;
        p.style.setProperty('--magnet-x', `${ox}px`);
        p.style.setProperty('--magnet-y', `${oy}px`);
      });
      p.addEventListener('mouseleave', () => {
        p.style.setProperty('--magnet-x', '0px');
        p.style.setProperty('--magnet-y', '0px');
      });
    });

    return {
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen(!open),
      isOpen: () => open
    };
  }

  window.FolderComponent = { mount };
})();
