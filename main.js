(function () {
  document.documentElement.classList.add('js');

  // Border under the nav once the page is scrolled.
  var nav = document.querySelector('.nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Fade sections in as they scroll into view.
  var revealTargets = document.querySelectorAll('.project, .split, .achieve, .contact, .facts');
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
