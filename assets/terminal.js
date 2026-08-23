// Vanilla port of the React Bits TextType typewriter, wrapped in a mac-style
// terminal window and driven by a fixed command/output script.
(function () {
  function prefersReducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function typeInto(el, text, speed) {
    return new Promise((resolve) => {
      if (prefersReducedMotion()) {
        el.textContent = text;
        resolve();
        return;
      }
      let i = 0;
      (function step() {
        el.textContent = text.slice(0, i);
        i += 1;
        if (i <= text.length) {
          setTimeout(step, speed);
        } else {
          resolve();
        }
      })();
    });
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, prefersReducedMotion() ? 0 : ms));
  }

  async function runScript(body, commands, opts) {
    for (const cmd of commands) {
      const block = document.createElement('div');
      block.className = 'pf-terminal-block';

      const line = document.createElement('div');
      line.className = 'pf-terminal-line';
      const prompt = document.createElement('span');
      prompt.className = 'pf-terminal-prompt';
      prompt.textContent = opts.promptText;
      const cmdSpan = document.createElement('span');
      line.appendChild(prompt);
      line.appendChild(cmdSpan);
      block.appendChild(line);
      body.appendChild(block);

      await typeInto(cmdSpan, cmd.command, opts.typingSpeed);
      await wait(opts.pauseAfterCommand);

      if (cmd.output) {
        const out = document.createElement('div');
        out.className = cmd.highlight ? 'pf-terminal-output pf-terminal-output--highlight' : 'pf-terminal-output';
        out.textContent = cmd.output;
        block.appendChild(out);
      }
      await wait(opts.pauseAfterOutput);
    }

    const idle = document.createElement('div');
    idle.className = 'pf-terminal-line';
    const prompt = document.createElement('span');
    prompt.className = 'pf-terminal-prompt';
    prompt.textContent = opts.promptText;
    const cursor = document.createElement('span');
    cursor.className = 'pf-terminal-cursor';
    idle.appendChild(prompt);
    idle.appendChild(cursor);
    body.appendChild(idle);
  }

  function mount(container, options) {
    const opts = Object.assign(
      {
        title: 'terminal',
        promptText: '$ ',
        commands: [],
        typingSpeed: 38,
        pauseAfterCommand: 250,
        pauseAfterOutput: 550,
        startOnVisible: true
      },
      options
    );

    container.classList.add('pf-terminal');
    container.innerHTML = '';

    const titlebar = document.createElement('div');
    titlebar.className = 'pf-terminal-titlebar';
    titlebar.innerHTML = `
      <span class="pf-terminal-dot pf-terminal-dot-red"></span>
      <span class="pf-terminal-dot pf-terminal-dot-yellow"></span>
      <span class="pf-terminal-dot pf-terminal-dot-green"></span>
      <div class="pf-terminal-title"></div>
    `;
    titlebar.querySelector('.pf-terminal-title').textContent = opts.title;

    const body = document.createElement('div');
    body.className = 'pf-terminal-body';

    container.appendChild(titlebar);
    container.appendChild(body);

    const start = () => runScript(body, opts.commands, opts);

    if (opts.startOnVisible && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start();
            observer.disconnect();
          }
        });
      }, { threshold: 0.2 });
      observer.observe(container);
    } else {
      start();
    }
  }

  window.PortfolioTerminal = { mount };
})();
