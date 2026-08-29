// Horizontal accordion gallery: hover/click a panel to expand it, others
// collapse to a thin labeled strip. Pure CSS transition (flex-basis/
// flex-grow). Below the mobile breakpoint it becomes a tall vertical stack
// and an IntersectionObserver expands whichever panel scrolls to center.
(function () {
  function mount(container, options) {
    var opts = Object.assign({ items: [], startIndex: 0 }, options || {});

    container.innerHTML = '';
    container.classList.add('acc-gallery');
    container.setAttribute('role', 'tablist');

    var panels = opts.items.map(function (item, i) {
      var panel;
      if (item.link) {
        panel = document.createElement('a');
        panel.href = item.link;
        panel.target = '_blank';
        panel.rel = 'noopener';
      } else {
        panel = document.createElement('button');
        panel.type = 'button';
      }
      panel.className = 'acc-panel';
      panel.setAttribute('role', 'tab');
      panel.setAttribute('aria-expanded', 'false');

      var img = document.createElement('img');
      img.className = 'acc-panel-img';
      img.src = item.image;
      img.alt = item.alt || item.title || '';
      img.loading = 'lazy';
      panel.appendChild(img);

      var scrim = document.createElement('div');
      scrim.className = 'acc-panel-scrim';
      panel.appendChild(scrim);

      var label = document.createElement('div');
      label.className = 'acc-panel-label';

      if (item.kicker) {
        var kicker = document.createElement('span');
        kicker.className = 'acc-panel-kicker';
        kicker.textContent = item.kicker;
        label.appendChild(kicker);
      }

      var title = document.createElement('span');
      title.className = 'acc-panel-title';
      title.textContent = item.title || '';
      label.appendChild(title);

      if (item.subtitle) {
        var subtitle = document.createElement('span');
        subtitle.className = 'acc-panel-subtitle';
        subtitle.textContent = item.subtitle;
        label.appendChild(subtitle);
      }

      panel.appendChild(label);

      // Hover expands the panel in place as a preview. Click opens the live
      // interactive Tableau viz in a new tab (native <a> behavior below);
      // it also expands the panel so touch devices, where hover never
      // fires, still get the preview state as they navigate away.
      panel.addEventListener('mouseenter', function () {
        setExpanded(i);
      });
      panel.addEventListener('click', function () {
        setExpanded(i);
      });

      container.appendChild(panel);
      return panel;
    });

    function setExpanded(index) {
      panels.forEach(function (panel, i) {
        var expanded = i === index;
        panel.classList.toggle('is-expanded', expanded);
        panel.setAttribute('aria-expanded', String(expanded));
      });
    }

    if (panels.length) {
      setExpanded(Math.min(opts.startIndex, panels.length - 1));
    }

    // Below the mobile breakpoint the gallery stacks into a tall vertical
    // list (see accordion-gallery.css), and there's no hover to drive
    // expansion — so instead expand whichever panel is nearest the center
    // of the viewport as the page scrolls.
    var mobileQuery = window.matchMedia('(max-width: 720px)');
    var scrollObserver = null;

    function syncScrollExpand() {
      if (scrollObserver) {
        scrollObserver.disconnect();
        scrollObserver = null;
      }
      if (!mobileQuery.matches) return;
      scrollObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var index = panels.indexOf(entry.target);
          if (index !== -1) setExpanded(index);
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      panels.forEach(function (panel) { scrollObserver.observe(panel); });
    }

    mobileQuery.addEventListener('change', syncScrollExpand);
    syncScrollExpand();

    return {
      setExpanded: setExpanded,
      destroy: function () {
        mobileQuery.removeEventListener('change', syncScrollExpand);
        if (scrollObserver) scrollObserver.disconnect();
      }
    };
  }

  window.AccordionGallery = { mount: mount };
})();
