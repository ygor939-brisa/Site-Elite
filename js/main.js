/* Elite Softwares – interações (JavaScript puro) */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };

  /* ================= WHATSAPP: sorteia um dos dois números a cada clique ================= */
  var NUMBERS = ['5511953500101', '5511983971489'];   // 55 + DDD + número
  var MESSAGE = 'Olá! Vim pelo site da Elite Softwares e quero conversar sobre a minha operação.';
  function pick() { return NUMBERS[Math.floor(Math.random() * NUMBERS.length)]; }
  function setHref(a) { a.href = 'https://wa.me/' + pick() + '?text=' + encodeURIComponent(MESSAGE); }
  document.querySelectorAll('a[data-wa]').forEach(function (a) {
    a.target = '_blank'; a.rel = 'noopener';
    setHref(a);
    a.addEventListener('click', function () { setHref(a); });
    a.addEventListener('auxclick', function () { setHref(a); });
  });

  /* ================= Ícones ================= */
  var STROKE = {
    plus: 'M12 5v14M5 12h14',
    ig: 'M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5ZM16 11.4a4 4 0 1 1-7.9 1.2 4 4 0 0 1 7.9-1.2ZM17.5 6.5h.01'
  };
  var FILL = {
    wa: 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.9 13.3c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1a12 12 0 0 1-5-4.1c-.6-.9-1-1.8-1-2.8 0-.9.4-1.3.6-1.5.2-.2.4-.2.5-.2h.4c.1 0 .3 0 .4.4l.6 1.5c.1.1.1.3 0 .4l-.3.4-.3.4c-.1.1-.2.3-.1.4.4.7.9 1.3 1.6 1.7.6.4 1.1.6 1.4.7.2.1.3 0 .4-.1l.6-.8c.1-.2.3-.2.4-.1l1.5.7c.2.1.3.2.4.3.1.2.1.7-.1 1.2Z'
  };
  document.querySelectorAll('i[data-i]').forEach(function (el) {
    var n = el.getAttribute('data-i');
    el.innerHTML = FILL[n]
      ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="width:100%;height:100%"><path d="' + FILL[n] + '"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:100%;height:100%"><path d="' + (STROKE[n] || '') + '"/></svg>';
    el.style.display = 'inline-block'; el.style.flex = 'none';
  });

  /* ================= Menu mobile ================= */
  var burger = $('burger'), sheet = $('sheet'), overlay = $('overlay');
  function setMenu(open) {
    sheet.hidden = !open; overlay.hidden = !open;
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
  }
  burger.addEventListener('click', function () { setMenu(sheet.hidden); });
  overlay.addEventListener('click', function () { setMenu(false); });
  sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 720) setMenu(false); });

  /* ================= Item ativo do menu conforme a rolagem ================= */
  var links = document.querySelectorAll('.nav-pill a, .sheet a[href^="#"]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'solucoes', 'como', 'quem'].forEach(function (id) { var s = $(id); if (s) io.observe(s); });
  }

  /* ================= FAQ: um item aberto por vez ================= */
  var items = document.querySelectorAll('details.faq');
  items.forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) items.forEach(function (o) { if (o !== d) o.open = false; }); });
  });
  var yr = $('yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ================= Chuva de números binários (0 e 1) ================= */
  var cv = $('rain');
  if (cv && !reduce) {
    var ctx = cv.getContext('2d'), SZ = 18, FONT = '700 15px Doto, ui-monospace, monospace';
    var cols = 0, drops = [], on = [], timer = null;
    function size() {
      var r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = r.width * d; cv.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      cols = Math.ceil(r.width / SZ); drops = []; on = [];
      for (var i = 0; i < cols; i++) { drops.push(Math.random() * -50); on.push(Math.random() < 0.6); }
      ctx.clearRect(0, 0, r.width, r.height);
    }
    function draw() {
      var w = cv.clientWidth, h = cv.clientHeight;
      ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,.09)'; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over'; ctx.font = FONT; ctx.fillStyle = 'rgba(255,255,255,.92)';
      for (var i = 0; i < cols; i++) {
        if (!on[i]) continue;
        var y = drops[i] * SZ;
        if (y > 0) ctx.fillText(Math.random() < 0.5 ? '0' : '1', i * SZ, y);
        if (y > h && Math.random() > 0.97) { drops[i] = Math.random() * -20; on[i] = Math.random() < 0.7; }
        drops[i] += 0.5;
      }
      // colunas apagadas acordam de vez em quando
      if (Math.random() < 0.08) { var k = Math.floor(Math.random() * cols); on[k] = true; }
    }
    function run() { if (!timer) timer = setInterval(draw, 55); }
    function halt() { clearInterval(timer); timer = null; }
    var started = false;
    function init() {
      if (started) return; started = true;
      size(); window.addEventListener('resize', size);
      if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { e[0].isIntersecting ? run() : halt(); }).observe(cv); else run();
      document.addEventListener('visibilitychange', function () { document.hidden ? halt() : run(); });
    }
    var ready = (document.fonts && document.fonts.load) ? document.fonts.load(FONT).catch(function () {}) : Promise.resolve();
    ready.then(init); setTimeout(init, 1500);
  }

  /* ================= Título digitado ao abrir a página ================= */
  var LINES = ['Seu time não deveria', 'passar o dia', 'copiando dados.'];
  var els = [$('l1'), $('l2'), $('l3')], page = $('inicio');
  function reveal() { page.classList.add('go'); }
  if (reduce) {
    els.forEach(function (el, i) { el.textContent = LINES[i]; }); reveal();
  } else {
    var caret = document.createElement('span'); caret.className = 'caret'; caret.setAttribute('aria-hidden', 'true');
    var nodes = els.map(function (el) { var t = document.createTextNode(''); el.appendChild(t); return t; });
    var li = 0, ci = 0;
    els[0].appendChild(caret);
    setTimeout(function step() {
      ci++; nodes[li].nodeValue = LINES[li].slice(0, ci);
      if (ci >= LINES[li].length) {
        li++; ci = 0;
        if (li >= LINES.length) { setTimeout(reveal, 350); return; }
        els[li].appendChild(caret);                      // cursor desce para a próxima linha
        setTimeout(step, 260); return;
      }
      setTimeout(step, 48 + Math.random() * 55);
    }, 800);
  }

  /* ================= Números: contagem animada ================= */
  var vals = document.querySelectorAll('.s-val');
  function ease(t) { return 1 - Math.pow(1 - t, 3); }          // easeOutCubic
  function fmt(v, dec, suf) { return v.toFixed(dec) + suf; }
  function count(el, i) {
    var target = parseFloat(el.dataset.target), dec = parseInt(el.dataset.dec || '0', 10), suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = fmt(target, dec, suf); return; }
    var dur = 1500 + i * 80, t0 = null;
    setTimeout(function () {
      requestAnimationFrame(function tick(now) {
        if (t0 === null) t0 = now;
        var p = Math.min((now - t0) / dur, 1);
        el.textContent = fmt(target * ease(p), dec, suf);
        if (p < 1) requestAnimationFrame(tick);
      });
    }, 480 + i * 90);
  }
  var statsBox = document.querySelector('.stats'), counted = false;
  function startCounts() { if (counted) return; counted = true; vals.forEach(count); }
  if ('IntersectionObserver' in window && statsBox) {
    new IntersectionObserver(function (e, obs) { if (e[0].isIntersecting) { startCounts(); obs.disconnect(); } }, { threshold: 0.25 }).observe(statsBox);
  } else startCounts();
})();
