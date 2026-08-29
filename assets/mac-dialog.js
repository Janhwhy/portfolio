// Minimal macOS-style dialog box for showing project details.
(function () {
  let overlay = null;
  let dialog = null;
  let onCloseCallback = null;

  function ensureDom() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'mac-dialog-overlay';

    dialog = document.createElement('div');
    dialog.className = 'mac-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');

    dialog.innerHTML = `
      <div class="mac-dialog-titlebar">
        <div class="mac-dialog-dots">
          <button type="button" class="mac-dot mac-dot-red" aria-label="Close"></button>
          <span class="mac-dot mac-dot-yellow" aria-hidden="true"></span>
          <span class="mac-dot mac-dot-green" aria-hidden="true"></span>
        </div>
        <div class="mac-dialog-title"></div>
      </div>
      <div class="mac-dialog-thumb"></div>
      <div class="mac-dialog-body">
        <div class="mac-dialog-kicker"></div>
        <h3 class="mac-dialog-name"></h3>
        <p class="mac-dialog-summary"></p>
        <div class="mac-dialog-tools"></div>
        <div class="mac-dialog-actions"></div>
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    overlay.querySelector('.mac-dot-red').addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('open');
    if (onCloseCallback) {
      const cb = onCloseCallback;
      onCloseCallback = null;
      cb();
    }
  }

  function open(project, onClose) {
    ensureDom();
    onCloseCallback = onClose || null;

    dialog.querySelector('.mac-dialog-title').textContent = project.name;

    const thumb = dialog.querySelector('.mac-dialog-thumb');
    thumb.style.background = `linear-gradient(135deg, ${project.color || 'var(--color-accent)'}, ${project.colorDark || 'var(--color-accent-700)'})`;
    thumb.textContent = project.initial || project.name.charAt(0);

    dialog.querySelector('.mac-dialog-kicker').textContent = project.kicker || '';
    dialog.querySelector('.mac-dialog-name').textContent = project.name;
    dialog.querySelector('.mac-dialog-summary').textContent = project.summary;

    const toolsEl = dialog.querySelector('.mac-dialog-tools');
    toolsEl.innerHTML = '';
    (project.tools || []).forEach((tool) => {
      const span = document.createElement('span');
      span.className = 'tag tag-outline';
      span.textContent = tool;
      toolsEl.appendChild(span);
    });

    const actionsEl = dialog.querySelector('.mac-dialog-actions');
    actionsEl.innerHTML = '';
    if (project.live) {
      const a = document.createElement('a');
      a.className = 'btn btn-primary';
      a.href = project.live;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Live →';
      actionsEl.appendChild(a);
    }
    if (project.code) {
      const a = document.createElement('a');
      a.className = 'btn btn-ghost';
      a.href = project.code;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Code →';
      actionsEl.appendChild(a);
    }

    overlay.classList.add('open');
  }

  window.MacDialog = { open, close };
})();
