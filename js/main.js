/* Elite Softwares – interações (JavaScript puro): WhatsApp aleatório, título digitado, chuva de código */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= WHATSAPP: sorteia um dos dois números ao clicar ================= */
  var NUMBERS = ['5511953500101', '5511983971489'];   // 55 + DDD + número
  var MESSAGE = 'Olá! Vim pelo site da Elite Softwares e quero conversar sobre a minha operação.';
  function pick() { return NUMBERS[Math.floor(Math.random() * NUMBERS.length)]; }
  function setHref(a) { a.href = 'https://wa.me/' + pick() + '?text=' + encodeURIComponent(MESSAGE); }
  document.querySelectorAll('a[data-wa]').forEach(function (a) {
    a.target = '_blank'; a.rel = 'noopener';
    setHref(a);
    a.addEventListener('click', function () { setHref(a); });      // novo sorteio a cada clique
    a.addEventListener('auxclick', function () { setHref(a); });
  });

  /* ================= Ícones ================= */
  var STROKE = {
    menu: 'M4 6h16M4 12h16M4 18h16',
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

  /* ================= Header com blur ao rolar + menu mobile ================= */
  var top = document.getElementById('top');
  function onScroll() { top.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var burger = document.getElementById('burger'), menu = document.getElementById('mmenu');
  function setMenu(open) {
    menu.classList.toggle('hidden', !open);
    burger.setAttribute('aria-expanded', String(open));
    top.classList.toggle('scrolled', open || window.scrollY > 24);
  }
  burger.addEventListener('click', function () { setMenu(menu.classList.contains('hidden')); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* ================= FAQ: um item aberto por vez ================= */
  var items = document.querySelectorAll('details.faq');
  items.forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) items.forEach(function (o) { if (o !== d) o.open = false; }); });
  });
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ================= Chuva de código verde (hero) ================= */
  var cv = document.getElementById('rain');
  if (cv && !reduce) {
    var ctx = cv.getContext('2d'), CH = '01{}<>/;=+*$#ABCDEF</>()[]'.split(''), SZ = 16, cols = 0, drops = [], timer = null;
    function size() {
      var r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = r.width * d; cv.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      cols = Math.ceil(r.width / SZ);
      drops = []; for (var i = 0; i < cols; i++) drops.push(Math.random() * -60);
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, r.width, r.height);
    }
    function draw() {
      var w = cv.clientWidth, h = cv.clientHeight;
      ctx.fillStyle = 'rgba(10,10,10,.13)'; ctx.fillRect(0, 0, w, h);
      ctx.font = '14px "JetBrains Mono", monospace';
      for (var i = 0; i < cols; i++) {
        var y = drops[i] * SZ;
        if (y > 0) {
          ctx.fillStyle = '#2BE37A'; ctx.fillText(CH[Math.floor(Math.random() * CH.length)], i * SZ, y);
          ctx.fillStyle = '#C8FFE0'; ctx.fillText(CH[Math.floor(Math.random() * CH.length)], i * SZ, y + 0.01);
        }
        if (y > h && Math.random() > 0.975) drops[i] = Math.random() * -20;
        drops[i] += 0.55;
      }
    }
    function run() { if (!timer) timer = setInterval(draw, 55); }
    function halt() { clearInterval(timer); timer = null; }
    size(); window.addEventListener('resize', size);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { e[0].isIntersecting ? run() : halt(); }).observe(cv);
    } else run();
    document.addEventListener('visibilitychange', function () { document.hidden ? halt() : run(); });
  }

  /* ================= Título digitado ao abrir a página ================= */
  var typed = document.getElementById('typed'), sub = document.getElementById('heroSub');
  var TITLE = 'Seu time não deveria passar o dia copiando dados.';
  if (reduce) {
    typed.textContent = TITLE;
  } else {
    sub.style.opacity = '0'; sub.style.transform = 'translateY(10px)';   // aparece depois do título
    var n = 0;
    setTimeout(function step() {
      typed.textContent = TITLE.slice(0, ++n);
      if (n < TITLE.length) {
        setTimeout(step, 45 + Math.random() * 60);
      } else {
        setTimeout(function () { sub.style.opacity = '1'; sub.style.transform = 'none'; }, 350);
      }
    }, 500);
  }
})();
