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
