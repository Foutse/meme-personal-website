(function () {
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  // Remember the language chosen with the switch.
  var sw = document.querySelector('.lang-toggle');
  if (sw) sw.addEventListener('click', function () {
    try { localStorage.setItem('lang', sw.getAttribute('data-lang')); } catch (e) {}
  });

  // Mobile menu.
  var t = document.querySelector('.nav-toggle'), n = document.getElementById('nav');
  if (t && n) {
    t.addEventListener('click', function () {
      var open = n.classList.toggle('open');
      t.setAttribute('aria-expanded', open);
    });
    n.addEventListener('click', function (e) {
      if (e.target.closest('a')) { n.classList.remove('open'); t.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Abstract / Cite toggles.
  each(document.querySelectorAll('.pub .meta button[aria-controls]'), function (b) {
    b.addEventListener('click', function () {
      var panel = document.getElementById(b.getAttribute('aria-controls'));
      var open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', open);
      panel.hidden = !open;
    });
  });

  // Copy BibTeX.
  each(document.querySelectorAll('.panel-bib .copy'), function (b) {
    var label = b.textContent;
    b.addEventListener('click', function () {
      var text = b.parentNode.querySelector('code').textContent;
      var done = function () { b.textContent = b.getAttribute('data-copied'); setTimeout(function () { b.textContent = label; }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
      else { var r = document.createRange(); r.selectNodeContents(b.parentNode.querySelector('code')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); try { document.execCommand('copy'); done(); } catch (e) {} }
    });
  });

  // Publication filter.
  var chips = document.querySelectorAll('.chip');
  each(chips, function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-filter');
      each(chips, function (x) { x.classList.toggle('active', x === c); x.setAttribute('aria-pressed', x === c); });
      each(document.querySelectorAll('.pubs ol'), function (ol) {
        var shown = 0;
        each(ol.querySelectorAll('li.pub'), function (li) {
          var ok = f === 'all' || li.getAttribute('data-topic') === f;
          li.hidden = !ok; if (ok) shown++;
        });
        ol.hidden = !shown; ol.previousElementSibling.hidden = !shown;
      });
    });
  });

  // Chart tooltips (bars carry data-label).
  each(document.querySelectorAll('.bars'), function (chart) {
    var tip = chart.querySelector('.tip');
    var bars = chart.querySelectorAll('.bar');
    var show = function (bar) {
      each(bars, function (x) { x.classList.toggle('dim', x !== bar); });
      tip.textContent = bar.getAttribute('data-label');
      tip.hidden = false;
      var cr = chart.getBoundingClientRect(), br = bar.getBoundingClientRect();
      var left = br.left - cr.left + br.width / 2;
      left = Math.max(tip.offsetWidth / 2, Math.min(cr.width - tip.offsetWidth / 2, left));
      tip.style.left = left + 'px';
    };
    var hide = function () { tip.hidden = true; each(bars, function (x) { x.classList.remove('dim'); }); };
    each(bars, function (bar) {
      bar.addEventListener('mouseenter', function () { show(bar); });
      bar.addEventListener('focus', function () { show(bar); });
      bar.addEventListener('blur', hide);
    });
    chart.addEventListener('mouseleave', hide);
  });
})();

/* ---------- Motion ---------- */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  // Header shadow once the page scrolls.
  var header = document.querySelector('.site-header');
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Device spotlight: cycle through projects, pause on hover/focus or when the tab is hidden.
  var spot = document.querySelector('.spotlight');
  if (spot) {
    var items = spot.querySelectorAll('.spot'), dots = spot.querySelectorAll('.spot-dots span'), k = 0, paused = false;
    var go = function (n) {
      items[k].classList.remove('on'); dots[k].classList.remove('on');
      k = (n + items.length) % items.length;
      items[k].classList.add('on'); dots[k].classList.add('on');
    };
    spot.addEventListener('mouseenter', function () { paused = true; });
    spot.addEventListener('mouseleave', function () { paused = false; });
    spot.addEventListener('focusin', function () { paused = true; });
    spot.addEventListener('focusout', function () { paused = false; });
    if (!reduce) setInterval(function () { if (!paused && !document.hidden) go(k + 1); }, 3200);
  }

  if (reduce || !('IntersectionObserver' in window)) return;

  // Reveal blocks as they scroll into view.
  var targets = document.querySelectorAll(
    'main .section h2, main .section .section-intro, .card, .theme, .pub, .news li, .talks li, .timeline > li, ' +
    '.band-inner, .chart, .table-scroll, .prose, .theses-list li, .page-head .lead, .stats-inline'
  );
  var groups = new Map();
  each(targets, function (el) {
    if (el.closest('.hero')) return;
    var parent = el.parentNode, n = groups.get(parent) || 0;
    groups.set(parent, n + 1);
    el.style.setProperty('--d', Math.min(n, 6));
    el.classList.add('reveal');
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  each(document.querySelectorAll('.reveal, .bars'), function (el) { io.observe(el); });

  // Count the key figures up when they appear.
  var counters = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      counters.unobserve(e.target);
      var el = e.target, end = parseInt(el.getAttribute('data-count'), 10), t0 = null, dur = 1100;
      var step = function (ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      el.textContent = '0';
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  each(document.querySelectorAll('[data-count]'), function (el) { counters.observe(el); });
})();
