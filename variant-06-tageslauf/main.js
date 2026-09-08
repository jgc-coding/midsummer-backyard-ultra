/* ==========================================================================
   Variante 06 — „Tageslauf"
   Scroll-Engine. Alles Bewegte leitet sich aus genau einer Zahl ab: der
   Scroll-Position. render(y) ist die einzige Stelle, die schreibt, und sie ist
   über window.__tageslauf.render(y) von Hand aufrufbar (Verifikation).
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Schmale Bildschirme bekommen dieselben Bewegungen, nur mit kleinerem
     Ausschlag. Abgeschaltet wird nichts — sonst bleibt auf dem Handy von der
     Seite nur ein Einblenden übrig. */
  var isNarrow = function () { return window.innerWidth < 980; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ======================================================================
     Lichtreise: die Seite wandert beim Scrollen durch die 24 Stunden
     des Rennens. Reihenfolge = Rennverlauf, t = Scroll-Fortschritt 0..1.
     ====================================================================== */
  var SKY = [
    { t: 0.00, ground: '#0d0906', ground2: '#151009', glow: '#e5722a', a: '#0b0508', b: '#a24a15' }, /* Sonnenaufgang, Start 06:00 */
    { t: 0.16, ground: '#110c07', ground2: '#191309', glow: '#f2a03a', a: '#120a07', b: '#b8651b' }, /* Vormittag */
    { t: 0.34, ground: '#131009', ground2: '#1c1710', glow: '#f7c24b', a: '#171208', b: '#c08a2a' }, /* Mittag */
    { t: 0.52, ground: '#100b07', ground2: '#181009', glow: '#e5722a', a: '#120a06', b: '#8a3d16' }, /* Abend */
    { t: 0.68, ground: '#0b0810', ground2: '#111019', glow: '#b8632f', a: '#0a0710', b: '#4a2418' }, /* Dämmerung */
    { t: 0.84, ground: '#07080f', ground2: '#0c0d16', glow: '#4a6aa8', a: '#04050b', b: '#141c34' }, /* Nacht */
    /* Zwischenstufe, damit Blau nicht direkt nach Orange laeuft: die Mischung
       zweier Gegenfarben geht sonst durch Grau, und der zweite Morgen faengt
       mit einem schmutzigen Ton an. Ueber ein erstes Rot bleibt er warm. */
    { t: 0.93, ground: '#0a080d', ground2: '#120f15', glow: '#9a5a6a', a: '#07060c', b: '#4a2430' }, /* erstes Licht */
    { t: 1.00, ground: '#0f0b0b', ground2: '#171112', glow: '#f2a03a', a: '#0d0809', b: '#93481c' }  /* Sonnenaufgang, Tag 2 */
  ];

  function hex(c) { return [parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)]; }
  function mixHex(c1, c2, k) {
    var a = hex(c1), b = hex(c2), o = '#';
    for (var i = 0; i < 3; i++) {
      var v = Math.round(a[i] + (b[i] - a[i]) * k).toString(16);
      o += v.length < 2 ? '0' + v : v;
    }
    return o;
  }

  var root = document.documentElement;
  var lastSkyStep = -1;
  function applySky(p) {
    /* In 200 Stufen quantisiert: ein Schreibvorgang auf :root macht die
       Stilangaben des ganzen Dokuments ungültig — das darf nicht jeden Frame
       passieren, und es muss ans Ende von render(). */
    var step = Math.round(p * 200);
    if (step === lastSkyStep) return;
    lastSkyStep = step;
    var t = step / 200, i = 0;
    while (i < SKY.length - 2 && t > SKY[i + 1].t) i++;
    var from = SKY[i], to = SKY[i + 1];
    var k = clamp((t - from.t) / (to.t - from.t || 1), 0, 1);
    root.style.setProperty('--ground', mixHex(from.ground, to.ground, k));
    root.style.setProperty('--ground-2', mixHex(from.ground2, to.ground2, k));
    root.style.setProperty('--glow', mixHex(from.glow, to.glow, k));
    root.style.setProperty('--sky-a', mixHex(from.a, to.a, k));
    root.style.setProperty('--sky-b', mixHex(from.b, to.b, k));
  }

  /* ======================================================================
     Weiches Scrollen
     ====================================================================== */
  var lenis = null;
  if (window.Lenis && !REDUCED) {
    lenis = new window.Lenis({ lerp: 0.13, wheelMultiplier: 1, smoothWheel: true });
    var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    lenis.on('scroll', function (e) { onScroll(e.scroll); });
  }
  window.addEventListener('scroll', function () { if (!lenis) onScroll(window.scrollY); }, { passive: true });

  /* Auf dem Handy scrollt der Browser selbst und meldet das häufiger als ein
     Bild gezeichnet wird. Dort werden die Meldungen auf einen Frame gebündelt;
     am Rechner führt Lenis den Takt bereits im Bildtakt. */
  var queued = null, rafId = 0;
  function onScroll(y) {
    if (!isNarrow()) { render(y); return; }
    queued = y;
    if (!rafId) rafId = requestAnimationFrame(function () { rafId = 0; render(queued); });
  }

  /* ======================================================================
     Elemente einsammeln
     ====================================================================== */
  var hero = $('.hero');
  /* rate = breiter Bildschirm, rateS = schmaler. Auf dem Handy ist der Hero
     kürzer, deshalb muss der Ausschlag kleiner sein, sonst schieben sich die
     Bergketten übereinander. */
  var layers = $$('.hero .layer').map(function (el) {
    return {
      el: el,
      rate: parseFloat(el.dataset.rate || '0'),
      rateS: parseFloat(el.dataset.rateS || el.dataset.rate || '0')
    };
  });
  var panel = $('.hero__panel');
  var panelRate = panel ? parseFloat(panel.dataset.rate || '0.13') : 0;
  var nav = $('#nav');
  var progress = $('.progress');
  var bar = $('[data-progress]');
  var head = $('[data-progress-head]');
  var decks = $$('[data-deck]');
  var stack = $('[data-stack]');

  var heroH = 0, docH = 1;
  function measure() {
    heroH = hero ? hero.offsetHeight : 0;
    docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  var measureId = 0;
  function measureSoon() {
    if (measureId) return;
    measureId = requestAnimationFrame(function () { measureId = 0; measure(); });
  }
  if ('ResizeObserver' in window) new ResizeObserver(measureSoon).observe(document.body);

  /* Rechenarbeit nur, solange der Abschnitt in der Nähe des Sichtfensters ist. */
  var decksNear = true;
  function observeNear(el, set, margin) {
    if (!el || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (e) { set(e[0].isIntersecting); }, { rootMargin: margin || '100% 0px' }).observe(el);
  }
  observeNear(stack, function (n) { decksNear = n; if (stack) stack.classList.toggle('is-near', n); });

  /* ======================================================================
     Der einzige Schreibvorgang pro Frame
     ====================================================================== */
  function render(y) {
    var p = clamp(y / docH, 0, 1);
    var vw = window.innerWidth;
    var narrow = vw < 980;

    /* --- Lesephase, und zwar als ALLERERSTES. Jeder Schreibvorgang macht die
           Stilangaben ungültig; eine Messung danach erzwingt eine komplette
           Neuberechnung. Gemessen kostet 0,05 ms, gemessen nach einem
           Schreibvorgang 6,5 ms — derselbe Fehler wie beim :root-Schreiben,
           nur eine Ebene höher. Deshalb steht hier oben nichts Schreibendes. --- */
    var deckRects = (!REDUCED && decksNear && decks.length)
      ? decks.map(function (el) { return el.getBoundingClientRect(); })
      : null;

    /* --- Schreibphase --- */
    if (nav) nav.classList.toggle('is-scrolled', y > 40);
    if (bar) bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    if (head) head.style.transform = 'translateX(' + (p * vw).toFixed(1) + 'px)';
    if (progress) progress.classList.toggle('is-on', y > 8);
    if (REDUCED) { applySky(p); return; }

    if (hero && y < heroH + 300) {
      for (var i = 0; i < layers.length; i++) {
        var rate = narrow ? layers[i].rateS : layers[i].rate;
        layers[i].el.style.transform = 'translate(-50%, ' + (y * rate).toFixed(1) + 'px)';
      }
      /* Das Panel steht auf dem Handy im Textfluss und darf dort nicht wandern. */
      if (panel && !narrow) panel.style.transform = 'translateY(' + (y * panelRate).toFixed(1) + 'px)';
    }

    /* Die untere Karte tritt zurück, während die nächste darüberklettert. */
    if (deckRects) {
      for (var k = 0; k < decks.length; k++) {
        var el = decks[k];
        if (!decks[k + 1]) { el.style.transform = ''; el.style.setProperty('--dim', '0'); continue; }
        var cur = deckRects[k], next = deckRects[k + 1];
        var pr = clamp((cur.bottom - next.top) / cur.height, 0, 1);
        el.style.transform = 'scale(' + (1 - pr * 0.05).toFixed(4) + ')';
        el.style.setProperty('--dim', (pr * 0.62).toFixed(3));
      }
    }

    /* Ganz zum Schluss, damit die Messungen oben auf einem gültigen Layout
       arbeiten und nicht jede einzelne eine Neuberechnung erzwingt. */
    applySky(p);
  }

  /* ======================================================================
     Einblenden beim Eintreten
     ====================================================================== */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !REDUCED) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(function () { el.classList.add('is-in'); }, delay);
        rio.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { rio.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ======================================================================
     Überschriften zeichenweise aufblenden
     ====================================================================== */
  function splitChars(el) {
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (word) {
            if (!word) return;
            if (/^\s+$/.test(word)) { frag.appendChild(document.createTextNode(' ')); return; }
            var ws = document.createElement('span');
            ws.className = 'w';
            Array.prototype.forEach.call(word, function (chr) {
              var s = document.createElement('span');
              s.className = 'ch';
              s.textContent = chr;
              ws.appendChild(s);
            });
            frag.appendChild(ws);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    })(el);
    $$('.ch', el).forEach(function (s, i) { s.style.transitionDelay = Math.min(i * 22, 1400) + 'ms'; });
  }

  var typed = $$('[data-type]');
  if (!REDUCED && 'IntersectionObserver' in window) {
    typed.forEach(splitChars);
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-typed'); tio.unobserve(e.target); } });
    }, { threshold: 0.4 });
    typed.forEach(function (el) { tio.observe(el); });
  } else {
    typed.forEach(function (el) { el.classList.add('is-typed'); });
  }

  /* ======================================================================
     Fotos: fehlt eine Datei, bleibt der beschriftete Platzhalter stehen.
     ====================================================================== */
  $$('img[data-optional]').forEach(function (img) {
    var shot = img.closest('.shot');
    var ok = function () { if (shot) shot.classList.add('has-photo'); };
    var fail = function () { img.remove(); };
    if (img.complete) { if (img.naturalWidth > 0) ok(); else fail(); return; }
    img.addEventListener('load', ok);
    img.addEventListener('error', fail);
  });

  /* ======================================================================
     Hero-Panel: lebender Himmel plus die echte GPS-Runde
     ====================================================================== */
  function initPanel() {
    var canvas = $('[data-sky]');
    var svg = $('[data-route]');
    if (!canvas || !svg) return;

    var ctx = canvas.getContext('2d');
    var blobs = [
      { x: 0.22, y: 0.72, r: 0.62, c: [229, 114, 42], s: 0.00068, ph: 0.0, ax: 0.30, ay: 0.16 },
      { x: 0.52, y: 0.86, r: 0.54, c: [247, 194, 75], s: 0.00055, ph: 2.1, ax: 0.26, ay: 0.14 },
      { x: 0.80, y: 0.74, r: 0.58, c: [242, 160, 58], s: 0.00047, ph: 4.0, ax: 0.28, ay: 0.18 },
      { x: 0.34, y: 0.24, r: 0.60, c: [40, 52, 92], s: 0.00061, ph: 1.2, ax: 0.24, ay: 0.20 },
      { x: 0.72, y: 0.16, r: 0.52, c: [26, 30, 58], s: 0.00052, ph: 3.1, ax: 0.22, ay: 0.18 }
    ];
    var w = 0, h = 0;
    function size() {
      var r = canvas.getBoundingClientRect();
      /* Der Himmel ist ein weiches Farbfeld, deshalb genügt ein Bruchteil der
         Auflösung. Ein Achtel war zu wenig — auf dem Handy sah man den Raster. */
      var div = isNarrow() ? 3 : 2;
      w = canvas.width = Math.max(2, Math.round(r.width / div));
      h = canvas.height = Math.max(2, Math.round(r.height / div));
    }
    size();
    window.addEventListener('resize', size);

    /* Die Runde aus den echten GPS-Daten in den SVG-Rahmen einpassen. */
    var runner = null, pathLen = 0, routePath = null;
    fetch('../data/route-lap.json').then(function (r) { return r.json(); }).then(function (d) {
      var pts = d.points;
      if (!pts || !pts.length) return;
      var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      pts.forEach(function (p) {
        if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0];
        if (p[1] < minY) minY = p[1]; if (p[1] > maxY) maxY = p[1];
      });
      var W = 1000, H = 400, PAD = 58;
      var spanX = maxX - minX || 1, spanY = maxY - minY || 1;
      var s = Math.min((W - 2 * PAD) / spanX, (H - 2 * PAD) / spanY);
      var ox = (W - spanX * s) / 2 - minX * s;
      var oy = (H - spanY * s) / 2 + maxY * s; /* Y wird gespiegelt: in den Daten zeigt Y nach oben */
      var dstr = pts.map(function (p, i) {
        return (i ? 'L' : 'M') + (ox + p[0] * s).toFixed(1) + ',' + (oy - p[1] * s).toFixed(1);
      }).join(' ');

      var NS = 'http://www.w3.org/2000/svg';
      function make(tag, attrs) {
        var n = document.createElementNS(NS, tag);
        Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
        return n;
      }
      svg.appendChild(make('path', { d: dstr, class: 'route-glow' }));
      routePath = make('path', { d: dstr, class: 'route-line' });
      svg.appendChild(routePath);

      /* Die beiden Wendepunkte sind die westlichste und die östlichste Stelle. */
      var wi = 0, ei = 0;
      pts.forEach(function (p, i) { if (p[0] < pts[wi][0]) wi = i; if (p[0] > pts[ei][0]) ei = i; });
      [wi, ei].forEach(function (idx) {
        svg.appendChild(make('circle', {
          cx: (ox + pts[idx][0] * s).toFixed(1), cy: (oy - pts[idx][1] * s).toFixed(1),
          r: 6, fill: '#f2a03a', stroke: '#1a1208', 'stroke-width': 2
        }));
      });

      if (!REDUCED) {
        runner = make('circle', { r: 7, fill: '#f4e9d3' });
        runner.style.filter = 'drop-shadow(0 0 8px rgba(247,194,75,0.95))';
        svg.appendChild(runner);
        pathLen = routePath.getTotalLength();
      }
    }).catch(function () { /* ohne Route bleibt der Himmel allein — das ist in Ordnung */ });

    var frameId = 0, running = false, near = true;
    function frame(t) {
      frameId = 0;
      if (!running || document.hidden) return;

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#06070d';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < blobs.length; i++) {
        var b = blobs[i];
        var x = (b.x + Math.sin(t * b.s + b.ph) * b.ax + Math.sin(t * b.s * 0.37 + b.ph * 2) * 0.06) * w;
        var y = (b.y + Math.cos(t * b.s * 1.3 + b.ph) * b.ay + Math.cos(t * b.s * 0.53) * 0.05) * h;
        var rad = b.r * Math.max(w, h);
        var g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, 'rgba(' + b.c[0] + ',' + b.c[1] + ',' + b.c[2] + ',0.33)');
        g.addColorStop(1, 'rgba(' + b.c[0] + ',' + b.c[1] + ',' + b.c[2] + ',0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      if (runner && pathLen) {
        var pt = routePath.getPointAtLength((t * 0.045) % pathLen);
        runner.setAttribute('cx', pt.x.toFixed(1));
        runner.setAttribute('cy', pt.y.toFixed(1));
      }
      frameId = requestAnimationFrame(frame);
    }
    function start() { if (running || document.hidden) return; running = true; frameId = requestAnimationFrame(frame); }
    function stop() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }

    if (REDUCED) { running = true; frame(9000); stop(); }
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { near = e[0].isIntersecting; if (near) start(); else stop(); }, { rootMargin: '300px 0px' }).observe(canvas);
      document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (near) start(); });
    } else start();
  }

  /* ======================================================================
     Die Stunden: Tab-Karussell
     ====================================================================== */
  function initHours() {
    var tabs = $$('[data-tab]');
    var slides = $$('[data-slide]');
    var caption = $('[data-caption]');
    if (!tabs.length || !slides.length) return;

    var CAPTIONS = [
      'Alle stehen zusammen im Startbereich. Die erste Runde fühlt sich an wie ein Spaziergang — und genau das ist die Falle.',
      'Die neunte Runde beginnt, dreiundfünfzig Kilometer sind gelaufen. Zwischen zwei Runden bleiben ein paar Minuten für Essen, Trinken und trockene Socken. Im Camp zeigt sich jetzt, wer zu schnell angefangen hat.',
      'Stirnlampen am Fluss. Derselbe Weg wie am Morgen und trotzdem ein anderer. Geschlafen wird zwischen den Runden, in Minuten.',
      'Vierundzwanzig Runden, 160,9 Kilometer. Wer jetzt noch läuft, läuft nicht mehr gegen die Uhr, sondern gegen die letzte andere Person auf der Strecke.'
    ];
    var active = 0, timer = null;

    function show(i, byUser) {
      active = (i + slides.length) % slides.length;
      tabs.forEach(function (t, k) {
        var on = k === active;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === active); });
      if (caption) caption.textContent = CAPTIONS[active];
      if (byUser) restart();
    }
    function restart() { clearInterval(timer); if (!REDUCED) timer = setInterval(function () { show(active + 1); }, 5200); }

    tabs.forEach(function (t) { t.addEventListener('click', function () { show(parseInt(t.dataset.tab, 10), true); }); });
    var prev = $('[data-prev]'), next = $('[data-next]');
    if (prev) prev.addEventListener('click', function () { show(active - 1, true); });
    if (next) next.addEventListener('click', function () { show(active + 1, true); });

    var stage = $('[data-stage]');
    if (!REDUCED && 'IntersectionObserver' in window && stage) {
      new IntersectionObserver(function (e) { if (e[0].isIntersecting) restart(); else clearInterval(timer); }, { rootMargin: '200px 0px' }).observe(stage);
    }
    window.__show = show;
  }

  /* ======================================================================
     Menü auf dem Handy
     ====================================================================== */
  var burger = $('[data-burger]'), sheet = $('[data-sheet]');
  if (burger && sheet) {
    burger.addEventListener('click', function () {
      var open = sheet.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    });
    sheet.addEventListener('click', function (e) { if (e.target.tagName === 'A') sheet.classList.remove('is-open'); });
  }

  /* ======================================================================
     Sprungmarken durch Lenis führen
     ====================================================================== */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.3 });
      else target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
    });
  });

  /* ======================================================================
     Der Termin — eine Quelle für Countdown und alle Datumsangaben
     ====================================================================== */
  var EVENT_START = new Date(2027, 5, 19, 6, 0, 0); /* Sa, 19.06.2027, 06:00 */

  function initEventDate() {
    var long = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(EVENT_START);
    var short = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(EVENT_START);
    $$('[data-event-long]').forEach(function (el) { el.textContent = long; });
    $$('[data-event-short]').forEach(function (el) { el.textContent = short; });
    var label = $('[data-cd-target]');
    if (label) label.textContent = long + ', 06:00 Uhr';
  }

  function initCountdown() {
    var d = $('[data-cd-d]'), h = $('[data-cd-h]'), m = $('[data-cd-m]'), s = $('[data-cd-s]');
    var note = $('[data-cd-note]');
    if (!d) return;
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var timer = null;

    function tick() {
      var diff = EVENT_START - Date.now();
      if (diff <= 0) {
        /* Kein stilles Weiterrollen ins nächste Jahr: das würde die Seite in
           Widerspruch zu ihren eigenen Datumsangaben bringen. */
        d.textContent = h.textContent = m.textContent = s.textContent = '00';
        if (note) note.textContent = 'Dieser Termin liegt zurück. Der Start der nächsten Auflage wird noch bekannt gegeben.';
        if (timer) clearInterval(timer);
        return;
      }
      var dd = Math.floor(diff / 864e5); diff -= dd * 864e5;
      var hh = Math.floor(diff / 36e5); diff -= hh * 36e5;
      var mm = Math.floor(diff / 6e4); diff -= mm * 6e4;
      d.textContent = pad(dd); h.textContent = pad(hh); m.textContent = pad(mm); s.textContent = pad(Math.floor(diff / 1e3));
    }
    tick();
    timer = setInterval(tick, 1000);
  }

  /* ======================================================================
     Die echte Karte der Runde
     ====================================================================== */
  function initMap() {
    var el = $('#map');
    if (!el) return;
    if (!window.L) {
      el.innerHTML = '<p style="padding:26px;color:rgba(244,233,211,.66);font-size:15px;line-height:1.6">Die Karte konnte nicht geladen werden. Die Runde folgt dem Uferweg der Dreisam zwischen dem Hirzbergsteg und dem Schlosssteg in Ebnet.</p>';
      return;
    }
    var L = window.L;
    var map = L.map(el, { scrollWheelZoom: false, zoomAnimation: !REDUCED, fadeAnimation: !REDUCED, markerZoomAnimation: !REDUCED });
    /* Kein Scroll-Diebstahl: erst nach Klick oder Fokus zoomt das Mausrad. */
    map.on('focus click', function () { map.scrollWheelZoom.enable(); });
    map.on('mouseout blur', function () { map.scrollWheelZoom.disable(); });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende'
    }).addTo(map);

    /* Fallback, falls keine Kacheln kommen (kein Netz): wenigstens die Linie zeigen. */
    map.setView([47.98793, 7.88553], 14);

    fetch('../data/route-full.geojson').then(function (r) { return r.json(); }).then(function (full) {
      L.geoJSON(full, { style: { color: '#f4e9d3', weight: 2, opacity: 0.16 } }).addTo(map);
    }).catch(function () {});

    fetch('../data/route-lap.geojson').then(function (r) { return r.json(); }).then(function (lap) {
      var layer = L.geoJSON(lap, { style: { color: '#e5722a', weight: 5, opacity: 1, lineCap: 'round', lineJoin: 'round' } }).addTo(map);
      map.fitBounds(layer.getBounds(), { padding: [34, 34] });

      var coords = lap.features[0].geometry.coordinates; /* [lng, lat] */
      var wi = 0, ei = 0;
      coords.forEach(function (c, i) { if (c[0] < coords[wi][0]) wi = i; if (c[0] > coords[ei][0]) ei = i; });
      function mark(c, text, dir) {
        L.circleMarker([c[1], c[0]], { radius: 8, color: '#1a1208', weight: 2, fillColor: '#f2a03a', fillOpacity: 1 })
          .addTo(map)
          .bindTooltip(text, { permanent: true, direction: dir, className: 'map-label', offset: dir === 'left' ? [-9, 0] : [9, 0] });
      }
      mark(coords[wi], 'Hirzbergsteg', 'left');
      mark(coords[ei], 'Schlosssteg Ebnet', 'right');
      L.circleMarker([coords[0][1], coords[0][0]], { radius: 6, color: '#1a1208', weight: 2, fillColor: '#e5722a', fillOpacity: 1 })
        .addTo(map).bindTooltip('Start und Ziel', { direction: 'top', className: 'map-label' });
    }).catch(function () {});
  }

  /* ======================================================================
     Version aus der einen Quelle
     ====================================================================== */
  function initVersion() {
    var el = $('[data-ver]');
    if (!el) return;
    fetch('../VERSION').then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (t) { if (t) el.textContent = 'v' + t.trim(); })
      .catch(function () {});
  }

  /* ====================================================================== */
  initPanel();
  initHours();
  initEventDate();
  initCountdown();
  initMap();
  initVersion();
  render(window.scrollY);

  window.__tageslauf = { render: render, lenis: lenis, sky: applySky };
})();
