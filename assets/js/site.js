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


// Hero background: the phase portrait of a Van der Pol oscillator,
//   x' = y,  y' = mu (1 - x^2) y - x   (mu = 1),
// the self-sustained oscillator of his laser papers. Particles drift along the
// flow and every one of them winds onto the same closed orbit, the limit cycle.
// Trails are redrawn from scratch each frame, so nothing builds up over time.
(function () {
  var cv = document.querySelector('.hero-bg');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MU = 1, SPEED = 0.9, TRAIL = 46, H = 0.02;
  var ps = [], w, h, dpr, cx, cy, ux, uy, colA, colB, running = false, visible = true, last = 0;

  function f(x, y) { return [y, MU * (1 - x * x) * y - x]; }
  function rk4(x, y, d) {
    var a = f(x, y), b = f(x + d / 2 * a[0], y + d / 2 * a[1]),
        c = f(x + d / 2 * b[0], y + d / 2 * b[1]), e = f(x + d * c[0], y + d * c[1]);
    return [x + d / 6 * (a[0] + 2 * b[0] + 2 * c[0] + e[0]), y + d / 6 * (a[1] + 2 * b[1] + 2 * c[1] + e[1])];
  }
  function spawn(p, age) {
    // Start anywhere in the plane, inside or outside the cycle.
    var r = 0.2 + Math.random() * 4.2, t = Math.random() * 6.283;
    p.x = r * Math.cos(t); p.y = 1.3 * r * Math.sin(t);
    p.life = 5 + Math.random() * 7; p.age = age || 0;
    p.tr = []; p.c = Math.random() < 0.25;
  }
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var wide = w > 760;
    cx = wide ? w * 0.77 : w * 0.5; cy = wide ? h * 0.27 : h * 0.45;
    ux = wide ? Math.min(w * 0.065, 105) : w * 0.15; uy = wide ? h * 0.062 : Math.min(h * 0.08, ux * 0.9);
    var cs = getComputedStyle(document.documentElement);
    colA = cs.getPropertyValue('--accent').trim() || '#1d5c8c';
    colB = cs.getPropertyValue('--copper').trim() || '#9c5426';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    var n = wide ? 120 : 55;
    while (ps.length < n) { var p = {}; spawn(p, Math.random() * 12); ps.push(p); }
    ps.length = n;
  }
  function advance(dt) {
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i], t = dt * SPEED;
      p.age += dt;
      if (p.age > p.life) { spawn(p); continue; }
      while (t > 0) { var d = Math.min(H, t), q = rk4(p.x, p.y, d); p.x = q[0]; p.y = q[1]; t -= d; }
      p.tr.push(cx + p.x * ux, cy - p.y * uy);
      if (p.tr.length > TRAIL * 2) p.tr.splice(0, 2);
    }
  }
  function draw(boost) {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i], tr = p.tr, n = tr.length / 2;
      if (n < 2) continue;
      // Fade in at birth and out before respawning.
      var life = Math.min(1, p.age / 1.5, (p.life - p.age) / 1.5);
      ctx.strokeStyle = p.c ? colB : colA;
      // Tail to head in four bands of rising opacity and width.
      for (var k = 0; k < 4; k++) {
        var i0 = Math.floor(k * (n - 1) / 4), i1 = Math.floor((k + 1) * (n - 1) / 4);
        if (i1 <= i0) continue;
        ctx.globalAlpha = life * (boost || 1) * (0.12 + 0.22 * k);
        ctx.lineWidth = 0.8 + 0.35 * k;
        ctx.beginPath(); ctx.moveTo(tr[2 * i0], tr[2 * i0 + 1]);
        for (var j = i0 + 1; j <= i1; j++) ctx.lineTo(tr[2 * j], tr[2 * j + 1]);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }
  function frame(now) {
    if (!visible || document.hidden) { running = false; return; }
    var dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016; last = now;
    advance(dt); draw();
    requestAnimationFrame(frame);
  }
  function start() { if (!running && !reduce) { running = true; last = 0; requestAnimationFrame(frame); } }
  function still() {
    // A single drawing: long trails converging on the cycle.
    TRAIL = 140; for (var i = 0; i < 160; i++) advance(1 / 30); draw(0.8);
  }

  size();
  for (var i = 0; i < TRAIL; i++) advance(1 / 60);   // start with trails, not dots
  if (reduce) { still(); window.addEventListener('resize', function () { size(); draw(0.8); }); return; }
  window.addEventListener('resize', function () { size(); ps.forEach(function (p) { p.tr = []; }); });
  document.addEventListener('visibilitychange', start);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); }).observe(cv);
  }
  start();
})();


// "Made in UdM" carousel: arrows, dots, swipe (scroll-snap), gentle autoplay.
(function () {
  var box = document.getElementById('costs');
  if (!box) return;
  var track = box.querySelector('.cost-track'), slides = track.children;
  var dots = box.querySelectorAll('.car-dots span'), num = box.querySelector('.car-i');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var k = 0, paused = false, touched = false;
  function mark(i) {
    k = i;
    for (var j = 0; j < slides.length; j++) {
      slides[j].classList.toggle('on', j === i);
      if (j === i) slides[j].classList.add('seen');
      if (dots[j]) dots[j].classList.toggle('on', j === i);
    }
    if (num) num.textContent = i + 1;
  }
  function go(i) {
    i = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
    mark(i);
  }
  box.querySelector('.prev').addEventListener('click', function () { touched = true; go(k - 1); });
  box.querySelector('.next').addEventListener('click', function () { touched = true; go(k + 1); });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); touched = true; go(k + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); touched = true; go(k - 1); }
  });
  var t;
  track.addEventListener('scroll', function () {
    clearTimeout(t);
    t = setTimeout(function () {
      var x = track.scrollLeft, best = 0;
      for (var j = 1; j < slides.length; j++) if (Math.abs(slides[j].offsetLeft - track.offsetLeft - x) < Math.abs(slides[best].offsetLeft - track.offsetLeft - x)) best = j;
      if (best !== k) mark(best);
    }, 80);
  });
  track.addEventListener('pointerdown', function () { touched = true; });
  box.addEventListener('mouseenter', function () { paused = true; });
  box.addEventListener('mouseleave', function () { paused = false; });
  box.addEventListener('focusin', function () { paused = true; });
  box.addEventListener('focusout', function () { paused = false; });
  mark(0);
  if (!reduce) setInterval(function () {
    var r = track.getBoundingClientRect();
    var inView = r.top < innerHeight && r.bottom > 0;
    if (!paused && !touched && inView && !document.hidden) go(k + 1);
  }, 5000);
})();
