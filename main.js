(function () {
  document.documentElement.classList.add('js');

  // Border under the nav once the page is scrolled.
  var nav = document.querySelector('.nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Fade sections in as they scroll into view.
  var revealTargets = document.querySelectorAll('.light-table, .split, .tools-sec, .achieve, .contact, .facts');

  // Type out the about_me.py card, then "run" it. Replays from the ▶ run button.
  (function typeCode() {
    var code = document.getElementById('code-src');
    if (!code) return;
    var pre = code.parentNode;
    var caret = pre.querySelector('.caret');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Every text node, with its full text and whether it should appear instantly (line numbers).
    var nodes = [];
    var walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      var n = walker.currentNode;
      var parent = n.parentNode;
      nodes.push({ node: n, text: n.nodeValue, instant: parent.classList && parent.classList.contains('ln'), output: parent.classList && parent.classList.contains('out') });
    }
    var run = 0;
    var outEl = code.querySelector('.out');
    function endCaret() { (outEl || pre).appendChild(caret); }

    function showAll() {
      nodes.forEach(function (it) { it.node.nodeValue = it.text; });
      endCaret();
    }
    function play() {
      var my = ++run;
      pre.style.minHeight = pre.offsetHeight + 'px';
      nodes.forEach(function (it) { it.node.nodeValue = ''; });
      pre.classList.add('typing');
      var i = 0, c = 0;
      function step() {
        if (my !== run) return;
        if (i >= nodes.length) { pre.classList.remove('typing'); endCaret(); return; }
        var it = nodes[i];
        // Keep the caret right after the text being typed.
        if (c === 0) it.node.parentNode.insertBefore(caret, it.node.nextSibling);
        if (it.instant) { it.node.nodeValue = it.text; i++; return setTimeout(step, 0); }
        if (it.output && c < it.text.length) {
          // The printed answer types out at a slightly slower, even pace so it can be read.
          c++;
          it.node.nodeValue = it.text.slice(0, c);
          return setTimeout(step, 55);
        }
        if (c < it.text.length) {
          var ch = it.text.charAt(c);
          // Steady rhythm, one character at a time. Leading indentation appears at once,
          // like an editor auto-indenting; line ends and the >>> prompt get a short pause.
          var lineStart = c === 0 || it.text.charAt(c - 1) === '\n';
          if (ch === ' ' && lineStart) { while (c < it.text.length && it.text.charAt(c) === ' ') c++; }
          else c++;
          it.node.nodeValue = it.text.slice(0, c);
          var delay = ch === '\n' ? 220 : 38;
          if (it.text === '>>>' && c === it.text.length) delay = 400;
          return setTimeout(step, delay);
        }
        // Pause before printing the output line, like a REPL running the call.
        var next = nodes[i + 1];
        i++; c = 0;
        setTimeout(step, next && next.output ? 700 : 0);
      }
      step();
    }

    if (reduce) { showAll(); }
    else {
      var started = false;
      var start = function () { if (!started) { started = true; setTimeout(play, 350); } };
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { start(); io.disconnect(); } }, { threshold: 0.3 });
        io.observe(pre);
      } else { start(); }
    }
    var btn = document.getElementById('run-code');
    if (btn) btn.addEventListener('click', function () { if (reduce) showAll(); else play(); });
  })();
  if ('IntersectionObserver' in window) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); revealer.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    revealTargets.forEach(function (el) { revealer.observe(el); });

    // Underline the nav link for the section in view.
    var links = {};
    document.querySelectorAll('.nav-links a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.toggle('active', k === entry.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  // Copy the email address: works for everyone, unlike mailto links that need a desktop mail app.
  var copyBtn = document.getElementById('copy-email');
  var status = document.getElementById('copy-status');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email');
      var label = copyBtn.querySelector('span');
      function done(ok) {
        label.textContent = ok ? 'Copied!' : 'Copy email';
        status.textContent = ok ? 'Email copied to your clipboard.' : 'Select the address above to copy it.';
        setTimeout(function () { label.textContent = 'Copy email'; status.textContent = ''; }, 2500);
      }
      function fallback() {
        // Older browsers or non-secure pages: copy through a temporary text field.
        var t = document.createElement('textarea');
        t.value = email; t.setAttribute('readonly', ''); t.style.position = 'absolute'; t.style.left = '-9999px';
        document.body.appendChild(t); t.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(t);
        done(ok);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () { done(true); }, fallback);
      } else {
        fallback();
      }
    });
  }
})();
