(function () {
  'use strict';
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }
  };

  // Name-change banner
  var banner = document.querySelector('[data-banner]');
  if (banner) {
    if (store.get('syrcular:banner') === 'off') banner.remove();
    var close = document.querySelector('[data-banner-close]');
    if (close) close.addEventListener('click', function () {
      store.set('syrcular:banner', 'off');
      if (banner) banner.remove();
    });
  }

  // Logo replay on hover
  document.querySelectorAll('[data-logo-replay]').forEach(function (logo) {
    logo.addEventListener('mouseenter', function () {
      if (logo.classList.contains('syrA')) { logo.classList.remove('syrA'); logo.classList.add('syrB'); }
      else { logo.classList.remove('syrB'); logo.classList.add('syrA'); }
    });
  });

  // Mobile menu
  var menu = document.querySelector('[data-menu]');
  var openBtn = document.querySelector('.mnav-btn');
  function setMenu(open) {
    if (!menu) return;
    menu.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var f = menu.querySelector('button, a'); if (f) f.focus(); }
    else if (openBtn) openBtn.focus();
  }
  document.querySelectorAll('[data-menu-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { setMenu(menu && menu.hidden); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && !menu.hidden) setMenu(false);
  });

  // Background video pause / play
  var vbtn = document.querySelector('[data-video-toggle]');
  var video = document.querySelector('[data-hero-video]');
  if (vbtn && video) {
    var icoPause = vbtn.querySelector('[data-ico="pause"]');
    var icoPlay = vbtn.querySelector('[data-ico="play"]');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function sync() {
      var paused = video.paused;
      icoPause.hidden = paused; icoPlay.hidden = !paused;
      vbtn.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
    }
    if (reduce) { video.removeAttribute('autoplay'); video.pause(); }
    vbtn.addEventListener('click', function () { if (video.paused) video.play(); else video.pause(); });
    video.addEventListener('play', sync); video.addEventListener('pause', sync);
    sync();
  }

  // Contact: interest chips
  var chips = document.querySelectorAll('[data-chip]');
  var interest = document.querySelector('input[name="interest"]');
  function paint() {
    chips.forEach(function (c) {
      var on = c.getAttribute('aria-pressed') === 'true';
      c.style.background = on ? '#141E1A' : '#FFFFFF';
      c.style.color = on ? '#FFFFFF' : '#141E1A';
      c.style.borderColor = on ? '#141E1A' : '#A9B5AE';
    });
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      c.setAttribute('aria-pressed', 'true');
      if (interest) interest.value = c.textContent.trim();
      paint();
    });
  });
  paint();

  // Contact form via Formspree
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var status = form.querySelector('[data-form-status]');
    var submit = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      submit.disabled = true;
      status.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('bad');
          form.reset(); paint();
          status.textContent = 'Thank you. Your message has been sent and we will get back to you.';
        })
        .catch(function () {
          status.textContent = 'Something went wrong. Please try again or email info@syrcular.com.';
        })
        .then(function () { submit.disabled = false; });
    });
  }
})();
