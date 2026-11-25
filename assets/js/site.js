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
      if (open) each(b.parentNode.querySelectorAll('button[aria-expanded="true"]'), function (o) {
        o.setAttribute('aria-expanded', 'false');
        document.getElementById(o.getAttribute('aria-controls')).hidden = true;
      });
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

  // Publication filter: topic chips and the theme cloud share one filter.
  var chips = document.querySelectorAll('.chip');
  var words = document.querySelectorAll('.word');
  var cloud = document.querySelector('.cloud');
  var fig = document.querySelector('.focus');
  var status = document.querySelector('.focus-status');
  var filterPubs = function (test) {
    var total = 0;
    each(document.querySelectorAll('.pubs ol'), function (ol) {
      var shown = 0;
      each(ol.querySelectorAll('li.pub'), function (li) {
        var ok = test(li);
        li.hidden = !ok; if (ok) shown++;
      });
      ol.hidden = !shown; ol.previousElementSibling.hidden = !shown;
      total += shown;
    });
    return total;
  };
  var setChip = function (c) {
    each(chips, function (x) { x.classList.toggle('active', x === c); x.setAttribute('aria-pressed', x === c); });
  };
  var setWord = function (w) {
    each(words, function (x) { x.setAttribute('aria-pressed', x === w); });
    if (cloud) cloud.classList.toggle('picked', !!w);
  };
  var showAll = function () {
    setWord(null); setChip(document.querySelector('.chip[data-filter="all"]'));
    filterPubs(function () { return true; });
    if (status) status.hidden = true;
  };
  each(chips, function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-filter');
      setChip(c); setWord(null);
      if (status) status.hidden = true;
      filterPubs(function (li) { return f === 'all' || li.getAttribute('data-topic') === f; });
    });
  });
  each(words, function (w) {
    w.addEventListener('click', function () {
      if (w.getAttribute('aria-pressed') === 'true') { showAll(); return; }
      var id = ' ' + w.getAttribute('data-focus') + ' ';
      setWord(w); setChip(null);
      var n = filterPubs(function (li) { return (li.getAttribute('data-focus') || '').indexOf(id) !== -1; });
      if (status && fig) {
        var unit = n === 1 ? fig.getAttribute('data-paper') : fig.getAttribute('data-papers');
        status.querySelector('span').textContent = fig.getAttribute('data-showing')
          .replace('%n', n + ' ' + unit).replace('%t', w.getAttribute('data-label'));
        status.hidden = false;
        var top = status.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight * 0.6) {
          var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          status.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' });
        }
      }
    });
  });
  if (status) status.querySelector('button').addEventListener('click', showAll);

  // Hovering a theme lights up the themes that share papers with it.
  if (cloud) {
    var related = {};
    each(document.querySelectorAll('.pubs li.pub'), function (li) {
      var ids = (li.getAttribute('data-focus') || '').trim().split(/\s+/);
      ids.forEach(function (a) { if (!a) return; related[a] = related[a] || {}; ids.forEach(function (b) { related[a][b] = true; }); });
    });
    var light = function (w) {
      var rel = related[w.getAttribute('data-focus')] || {};
      each(words, function (x) { x.classList.toggle('rel', !!rel[x.getAttribute('data-focus')]); });
      cloud.classList.add('hovering');
    };
    var unlight = function () { cloud.classList.remove('hovering'); each(words, function (x) { x.classList.remove('rel'); }); };
    each(words, function (w) {
      w.addEventListener('mouseenter', function () { light(w); });
      w.addEventListener('focus', function () { light(w); });
      w.addEventListener('mouseleave', unlight);
      w.addEventListener('blur', unlight);
    });
  }

  // Chart tooltips (bars carry data-label).
  each(document.querySelectorAll('.bars'), function (chart) {
    var tip = chart.querySelector('.tip');
    if (!tip) return;
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
    // Small elements only: animating large blocks (tables, long text) makes scrolling stutter.
    'main .section h2, main .section .section-intro, .card, .theme, .pub, .news li, .talks li, .timeline > li, ' +
    '.theses-list li'
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
  each(document.querySelectorAll('.cloud'), function (el) { el.classList.add('anim'); });
  each(document.querySelectorAll('.reveal, .bars, .bars-h, .cloud'), function (el) { io.observe(el); });

  // Count the key figures up when they appear.
  var counters = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      counters.unobserve(e.target);
      var el = e.target, end = parseInt(el.getAttribute('data-count'), 10), t0 = null, dur = 1100;
      var step = function (ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased) + (el.getAttribute('data-suffix') || '');
        if (p < 1) requestAnimationFrame(step);
      };
      el.textContent = '0';
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  each(document.querySelectorAll('[data-count]'), function (el) { counters.observe(el); });
})();


// Hero background: the chaotic attractor of a Van der Pol–Duffing oscillator,
//   x' = -k (x^3 - a x - y),  y' = x - y - z,  z' = b y   (k = 100, a = 0.35, b = 300),
// integrated live (RK4) and drawn as a slowly fading trace.
(function () {
  var cv = document.querySelector('.hero-bg');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var K = 100, A = 0.35, B = 300, DT = 0.0005;
  var s = [0.1, 0, 0], w, h, dpr, cx, cy, sx, sy, colA, colB, running = false, visible = true, angle = 0.5;

  function f(x, y, z) { return [-K * (x * x * x - A * x - y), x - y - z, B * y]; }
  function step() {
    var x = s[0], y = s[1], z = s[2], d = DT;
    var a = f(x, y, z);
    var b = f(x + d / 2 * a[0], y + d / 2 * a[1], z + d / 2 * a[2]);
    var c = f(x + d / 2 * b[0], y + d / 2 * b[1], z + d / 2 * b[2]);
    var e = f(x + d * c[0], y + d * c[1], z + d * c[2]);
    s = [x + d / 6 * (a[0] + 2 * b[0] + 2 * c[0] + e[0]),
         y + d / 6 * (a[1] + 2 * b[1] + 2 * c[1] + e[1]),
         z + d / 6 * (a[2] + 2 * b[2] + 2 * c[2] + e[2])];
  }
  // Normalised 3-D point, turned slowly about the vertical axis, then projected.
  function project() {
    var X = s[0] / 0.73, Y = s[1] / 0.134, Z = s[2] / 2.86;
    var ca = Math.cos(angle), sa = Math.sin(angle);
    return [cx + (X * ca + Y * 0.35 * sa) * sx, cy - Z * sy];
  }
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var wide = w > 760;
    cx = wide ? w * 0.77 : w * 0.5; cy = wide ? h * 0.235 : h * 0.55;
    sx = wide ? Math.min(w * 0.15, 260) : w * 0.4; sy = wide ? h * 0.15 : h * 0.33;
    var cs = getComputedStyle(document.documentElement);
    colA = cs.getPropertyValue('--accent').trim() || '#1d5c8c';
    colB = cs.getPropertyValue('--copper').trim() || '#9c5426';
    ctx.lineWidth = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  }
  // Draw n integration steps as short segments, coloured by which lobe the orbit is on.
  function draw(n, alpha) {
    var p = project(), side = s[0] > 0;
    ctx.globalAlpha = alpha;
    ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.strokeStyle = side ? colA : colB;
    for (var i = 0; i < n; i++) {
      step(); var q = project(), now = s[0] > 0;
      ctx.lineTo(q[0], q[1]);
      if (now !== side) { ctx.stroke(); ctx.beginPath(); ctx.moveTo(q[0], q[1]); side = now; ctx.strokeStyle = side ? colA : colB; }
    }
    ctx.stroke();
  }
  function fade(a) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = a; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
  }
  function frame() {
    if (!visible || document.hidden) { running = false; return; }
    fade(0.008);
    angle += 0.0008;
    draw(40, 0.7);
    requestAnimationFrame(frame);
  }
  function start() { if (!running && !reduce) { running = true; requestAnimationFrame(frame); } }
  function still() { ctx.clearRect(0, 0, w, h); for (var i = 0; i < 2000; i++) step(); draw(60000, 0.35); }

  size();
  for (var i = 0; i < 4000; i++) step();   // settle onto the attractor first
  if (reduce) { still(); window.addEventListener('resize', function () { size(); still(); }); return; }
  draw(6000, 0.4);                         // start with a faint sketch, not a blank sky
  window.addEventListener('resize', size);
  document.addEventListener('visibilitychange', start);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); }).observe(cv);
  }
  start();
})();
