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
  /* Hero-Ebenen laufen über drei CSS-Variablen (--mx/--my/--sy) am Hero selbst;
     hier braucht es nur die Teile des Morphs: die Marke im Hero, ihr Ziel in
     der Leiste und die SVG-Teile, die unterwegs aus- bzw. aufgeblendet werden. */
  var brand = $('[data-brand]');
  var h1El = $('.hero__h1');
  var dateEl = $('.hero__date');
  var lettering = $('[data-lettering]');
  var sunClip = $('[data-sun-clip]');
  var slotEl = $('[data-brand-slot]');
  var nav = $('#nav');
  var progress = $('.progress');
  var bar = $('[data-progress]');
  var head = $('[data-progress-head]');
  var decks = $$('[data-deck]');
  var stack = $('[data-stack]');

  var heroH = 0, docH = 1;
  /* Morph-Geometrie: einmal je Layoutänderung vermessen, im Bildtakt nur noch
     gerechnet. Alle Werte sind Layoutmaße (offset*), die von Transforms
     unberührt bleiben — so darf measure() auch mitten im Morph laufen. */
  var M = { on: false, sunX: 0, sunY: 0, homeX: 0, homeY: 0, slotX: 0, slotY: 0, endScale: 0.06, range: 1 };
  function measure() {
    heroH = hero ? hero.offsetHeight : 0;
    docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (hero && brand && h1El && slotEl && !REDUCED) {
      var bw = brand.offsetWidth;
      /* Sonnenmitte innerhalb der Marke: im SVG (1774 breit) liegt sie bei
         x=887, y=450 — gerendert also bei bw/2 bzw. h1-Oberkante + bw·450/1774. */
      M.sunX = bw / 2;
      M.sunY = h1El.offsetTop + bw * (450 / 1774);
      M.homeX = hero.offsetLeft + brand.offsetLeft;
      M.homeY = hero.offsetTop + brand.offsetTop;
      var slot = slotEl.getBoundingClientRect(); /* Leiste ist fixed → Viewport-stabil */
      M.slotX = slot.left + slot.width / 2;
      M.slotY = slot.top + slot.height / 2;
      /* Am Ende soll die gerenderte Sonne (1044/1774 der Markenbreite) exakt
         die Slotbreite haben. */
      M.endScale = slot.width / (bw * (1044 / 1774));
      M.range = Math.max(200, heroH * 0.58);
      M.on = true;
      brand.style.transformOrigin = M.sunX + 'px ' + M.sunY + 'px';
      /* Nach einer Größenänderung sofort neu zeichnen, nicht erst beim
         nächsten Scrollen (queueHero ist gehoisted und prüft M.on selbst). */
      queueHero();
    }
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
     Hero-Bewegung und Morph.
     Ein eigener Bildtakt neben render(): Er läuft nur, solange gescrollt wird,
     die Maus über dem Hero nachschwingt oder der Hero in Reichweite ist, und
     er liest NICHTS aus dem Layout — alles Nötige steht vermessen in M.
     Der Weg der Marke: Ruhelage mit Parallaxe → beim Scrollen zur Sonnenmitte
     hin verkleinert und in die Leiste gezogen; dort übernimmt .nav__brand.
     ====================================================================== */
  var lastY = 0;
  var mxT = 0, myT = 0, mx = 0, my = 0; /* Maus: Ziel und geglättet, -1..1 */
  var heroRafId = 0, docked = false;
  var lastDateO = -1, lastLetterO = -1, lastClipH = -1;

  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function queueHero() {
    if (!heroRafId && !REDUCED && M.on) heroRafId = requestAnimationFrame(heroFrame);
  }

  function heroFrame() {
    heroRafId = 0;
    /* Kein document.hidden-Wächter: versteckt pausiert der Browser den
       Bildtakt selbst, und erzwungene Diagnose-Aufrufe sollen immer zeichnen. */
    if (REDUCED || !M.on) return;
    mx += (mxT - mx) * 0.075;
    my += (myT - my) * 0.075;

    var y = lastY;
    var sy = clamp(y, 0, heroH);
    var p = clamp((y - 40) / (M.range - 40), 0, 1);
    var k = easeInOut(p);
    /* Schmale Bildschirme: kleinerer Ausschlag, nicht aus (CLAUDE.md). */
    var amp = isNarrow() ? 0.55 : 1;

    /* Ebenen: drei Variablen am Hero, die Transforms rechnet das CSS. */
    hero.style.setProperty('--mx', (mx * amp).toFixed(4));
    hero.style.setProperty('--my', (my * amp).toFixed(4));
    hero.style.setProperty('--sy', sy.toFixed(1));

    /* Marke: Sonnenmitte in Ruhelage (mit Parallaxe) … */
    var px = M.homeX + M.sunX + mx * -9 * amp;
    var py = M.homeY + M.sunY - y + my * -5 * amp + sy * 0.23;
    /* … und zum Andockpunkt hin gemischt. Origin liegt auf der Sonnenmitte,
       darum beschreibt (cx, cy) direkt deren Bahn. */
    var cx = px + (M.slotX - px) * k;
    var cy = py + (M.slotY - py) * k;
    var s = 1 + (M.endScale - 1) * k;
    brand.style.transform = 'translate3d(' + (cx - (M.homeX + M.sunX)).toFixed(2) + 'px, '
      + (cy - (M.homeY + M.sunY - y)).toFixed(2) + 'px, 0) scale(' + s.toFixed(5) + ')';

    /* Unterwegs: Datumzeile früh ausblenden, Schriftzug spät; dafür öffnet
       sich der Sonnen-Clip, bis die Scheibe komplett ist. Quantisiert, damit
       nicht jeder Frame Attribute anfasst. */
    var dateO = Math.round((1 - clamp(p / 0.22, 0, 1)) * 50) / 50;
    if (dateEl && dateO !== lastDateO) { lastDateO = dateO; dateEl.style.opacity = dateO; }
    var letterO = Math.round((1 - clamp((p - 0.62) / 0.26, 0, 1)) * 50) / 50;
    if (lettering && letterO !== lastLetterO) { lastLetterO = letterO; lettering.style.opacity = letterO; }
    var clipH = 800 + Math.round(90 * clamp((p - 0.6) / 0.35, 0, 1)) * 10;
    if (sunClip && clipH !== lastClipH) { lastClipH = clipH; sunClip.setAttribute('height', clipH); }

    /* Angedockt: die Marke der Leiste übernimmt, pixelgleich an der Stelle. */
    var d = p >= 0.999;
    if (d !== docked) {
      docked = d;
      if (nav) nav.classList.toggle('is-docked', d);
      brand.style.visibility = d ? 'hidden' : '';
    }

    /* Weiterlaufen, bis die Maus nachgeschwungen ist; Scrollen stößt über
       render() neu an. */
    if (Math.abs(mxT - mx) + Math.abs(myT - my) > 0.001) queueHero();
  }

  if (hero && !REDUCED) {
    document.body.classList.add('has-morph');
    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      mxT = clamp((e.clientX / Math.max(1, window.innerWidth)) * 2 - 1, -1, 1);
      myT = clamp(((e.clientY + lastY) / Math.max(1, heroH)) * 2 - 1, -1, 1);
      queueHero();
    });
    hero.addEventListener('pointerleave', function () { mxT = 0; myT = 0; queueHero(); });
  }

  /* ======================================================================
     Der einzige Schreibvorgang pro Frame
     ====================================================================== */
  function render(y) {
    var p = clamp(y / docH, 0, 1);
    var vw = window.innerWidth;

    /* --- Lesephase, und zwar als ALLERERSTES. Jeder Schreibvorgang macht die
           Stilangaben ungültig; eine Messung danach erzwingt eine komplette
           Neuberechnung. Gemessen kostet 0,05 ms, gemessen nach einem
           Schreibvorgang 6,5 ms — derselbe Fehler wie beim :root-Schreiben,
           nur eine Ebene höher. Deshalb steht hier oben nichts Schreibendes. --- */
    var deckRects = (!REDUCED && decksNear && decks.length)
      ? decks.map(function (el) { return el.getBoundingClientRect(); })
      : null;

    /* --- Schreibphase --- */
    lastY = y;
    if (nav) {
      /* Über dem hellen Hero: Tagesmodus ohne dunklen Grund. Erst wenn der
         Hero durchgescrollt ist, kommt die gewohnte dunkle Leiste zurück. */
      nav.classList.toggle('nav--day', y < heroH - 70);
      nav.classList.toggle('is-scrolled', y >= heroH - 70);
    }
    if (bar) bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    if (head) head.style.transform = 'translateX(' + (p * vw).toFixed(1) + 'px)';
    if (progress) progress.classList.toggle('is-on', y > 8);
    if (REDUCED) { applySky(p); return; }

    /* Hero-Ebenen und Morph laufen im eigenen Bildtakt; jedes Scrollen stößt
       ihn an, solange der Hero in Reichweite ist. */
    if (hero && y < heroH + 400) queueHero();

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
  initHours();
  initEventDate();
  initCountdown();
  initMap();
  initVersion();
  render(window.scrollY);

  /* Diagnose (nur über URL-Parameter, ändert normalen Betrieb nicht):
     ?y=<px>  rendert beim Laden den Zustand dieser Scroll-Position, ohne
              wirklich zu scrollen (echtes Scrollen verfälscht Headless-
              Aufnahmen: schwarzes Band, eingefrorene fixe Elemente).
     ?vh=<px> gibt dem Hero eine feste Höhe. Nötig für Vollseiten-Aufnahmen
              im hohen Fenster: dort wäre der 100svh-Hero sonst fensterhoch
              und schöbe den Rest der Seite aus dem Bild. */
  var dbgQ = new URLSearchParams(location.search);
  var dbgY = parseFloat(dbgQ.get('y'));
  var dbgVh = parseFloat(dbgQ.get('vh'));
  if (dbgY > 0 || dbgVh > 0) window.addEventListener('load', function () {
    if (dbgVh > 0 && hero) { hero.style.height = dbgVh + 'px'; measure(); }
    render(dbgY > 0 ? dbgY : window.scrollY);
    if (!REDUCED) heroFrame();
  });

  /* heroFrame und M sind fuer die Verifikation zugreifbar: ein Zustand laesst
     sich damit auch ohne laufenden Bildtakt synchron erzwingen und nachmessen. */
  window.__tageslauf = { render: render, lenis: lenis, sky: applySky, heroFrame: heroFrame, morph: M };
})();
