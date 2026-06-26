/* Variante 03 — emil-design-eng
   Interaktiver Last-Runner-Standing-Simulator + Yard-Clock.
   Reine CSS-Transitions (interruptierbar), nur transform/opacity, custom Easing. */
(function () {
  'use strict';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LAP = 6.706;
  var FIELD = 40;

  /* ---------- Simulator-Modell ---------- */
  function activeAt(h) { return Math.max(1, Math.round(FIELD * Math.pow(0.88, h - 1))); }
  function kmAt(h) { return (h * LAP).toFixed(1).replace('.', ','); }
  function clockHour(h) { return (6 + (h - 1)) % 24; }
  function timeAt(h) { return String(clockHour(h)).padStart(2, '0') + ':00'; }
  function noteAt(h, alive) {
    if (alive <= 1) return 'Nur eine Person tritt zur nächsten Runde an. Last Runner Standing. Das Rennen ist entschieden.';
    if (h === 1) return '06:00 Uhr. Alle starten gemeinsam in den ersten Yard.';
    var hod = clockHour(h);
    if (hod >= 6 && hod < 11) return 'Vormittag an der Dreisam. Das Feld läuft noch fast geschlossen.';
    if (hod >= 11 && hod < 14) return 'Mittagssonne. Die ersten verpassen den Start und scheiden aus.';
    if (hod >= 14 && hod < 18) return 'Nachmittag. Die Beine werden schwer, jetzt entscheidet der Kopf.';
    if (hod >= 18 && hod < 21) return 'Abendlicht. Hundert Kilometer rücken in Reichweite.';
    if (hod >= 21 || hod < 5) return 'Nacht. Stirnlampen, Stille, der eigene Rhythmus.';
    return 'Wieder Sonnenaufgang über Freiburg. Ein voller Tag ist vorbei, und es geht weiter.';
  }

  var hour = 1, firing = false, pips = [];

  function buildField() {
    var field = document.getElementById('field');
    var html = '';
    for (var i = 0; i < FIELD; i++) html += '<span class="pip"></span>';
    field.innerHTML = html;
    pips = Array.prototype.slice.call(field.children);
  }

  function swap(el, value) {
    if (REDUCED) { el.textContent = value; return; }
    el.classList.add('is-swapping');
    setTimeout(function () { el.textContent = value; el.classList.remove('is-swapping'); }, 120);
  }

  function render(prevAlive) {
    var alive = activeAt(hour);
    swap(document.getElementById('hour'), String(hour));
    swap(document.getElementById('km'), kmAt(hour));
    swap(document.getElementById('alive'), String(alive));
    document.getElementById('clockTime').textContent = timeAt(hour);

    var note = document.getElementById('note');
    if (REDUCED) { note.textContent = noteAt(hour, alive); }
    else {
      note.classList.add('is-swapping');
      setTimeout(function () { note.textContent = noteAt(hour, alive); note.classList.remove('is-swapping'); }, 110);
    }

    // Ring = Fortschritt Richtung 100 Meilen / 24 h
    var frac = Math.min(1, hour / 24);
    document.getElementById('ring').style.strokeDashoffset = String(100 * (1 - frac));

    // Feld: erste `alive` Pips aktiv, Rest raus. Gestaffeltes Ausscheiden.
    pips.forEach(function (p, i) {
      var shouldOut = i >= alive;
      var isWin = alive === 1 && i === 0;
      if (isWin) { p.classList.remove('out'); p.classList.add('win'); return; }
      p.classList.remove('win');
      if (shouldOut && !p.classList.contains('out')) {
        var delay = REDUCED ? 0 : (i - alive) * 26;
        p.style.transitionDelay = delay + 'ms';
        setTimeout(function () { p.classList.add('out'); p.style.transitionDelay = ''; }, 0);
      } else if (!shouldOut) {
        p.classList.remove('out');
      }
    });

    var next = document.getElementById('next');
    next.disabled = alive <= 1;
    next.querySelector('.btn__label').textContent = alive <= 1 ? 'Rennen entschieden' : 'Nächste Runde';
  }

  function advance() {
    if (firing || activeAt(hour) <= 1) return;
    var btn = document.getElementById('next');
    var prevAlive = activeAt(hour);
    if (REDUCED) { hour += 1; render(prevAlive); return; }
    firing = true;
    btn.classList.add('is-firing');
    setTimeout(function () { hour += 1; render(prevAlive); }, 240);
    setTimeout(function () { btn.classList.remove('is-firing'); firing = false; }, 420);
  }

  function reset() {
    hour = 1; firing = false;
    pips.forEach(function (p) { p.classList.remove('out', 'win'); p.style.transitionDelay = ''; });
    render(FIELD);
  }

  function initSim() {
    buildField();
    render(FIELD);
    document.getElementById('next').addEventListener('click', advance);
    document.getElementById('reset').addEventListener('click', reset);
  }

  /* ---------- Hero: nächster Yard-Start (zur vollen Stunde) ---------- */
  function initNextYard() {
    var el = document.getElementById('nextYard');
    function tick() {
      var now = new Date();
      var ms = (60 - now.getMinutes()) * 60000 - now.getSeconds() * 1000;
      if (ms <= 0) ms += 3600000;
      var m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000);
      el.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }
    tick(); setInterval(tick, 1000);
  }

  /* ---------- Nav stuck ---------- */
  function initNav() {
    var nav = document.getElementById('nav');
    var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 24); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Sanfte Scroll-Reveals (IntersectionObserver) ---------- */
  function initReveals() {
    if (REDUCED || !('IntersectionObserver' in window)) return;
    var els = document.querySelectorAll('[data-io]');
    els.forEach(function (el) { el.style.opacity = '0'; el.style.transform = 'translateY(18px)'; el.style.transition = 'opacity 600ms var(--ease-out), transform 600ms var(--ease-out)'; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target;
          var delay = parseInt(el.getAttribute('data-io-delay') || '0', 10);
          setTimeout(function () { el.style.opacity = '1'; el.style.transform = 'none'; }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.18 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Strecke ---------- */
  function initRoute() {
    var path = document.getElementById('routePath');
    var ghost = document.getElementById('routeGhost');
    var markers = document.getElementById('routeMarkers');
    fetch('../data/route-lap.json').then(function (r) { return r.json(); }).then(function (data) {
      var pts = data.points, cx = 500, cy = 170, scale = 400;
      var toPx = function (p) { return [cx + p[0] * scale, cy - p[1] * scale]; };
      var d = pts.map(function (p, i) { var q = toPx(p); return (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' ');
      path.setAttribute('d', d); ghost.setAttribute('d', d);
      var minI = 0, maxI = 0;
      pts.forEach(function (p, i) { if (p[0] < pts[minI][0]) minI = i; if (p[0] > pts[maxI][0]) maxI = i; });
      function mk(i, label, anchor) {
        var q = toPx(pts[i]); var ns = 'http://www.w3.org/2000/svg';
        var c = document.createElementNS(ns, 'circle'); c.setAttribute('cx', q[0]); c.setAttribute('cy', q[1]); c.setAttribute('r', 6); markers.appendChild(c);
        var t = document.createElementNS(ns, 'text'); t.setAttribute('x', q[0]); t.setAttribute('y', q[1] - 13); t.setAttribute('text-anchor', anchor); t.textContent = label; markers.appendChild(t);
      }
      mk(minI, 'Hirzbergsteg', 'start'); mk(maxI, 'Schlosssteg Ebnet', 'end');
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      if (REDUCED) { path.style.strokeDashoffset = 0; return; }
      path.style.strokeDashoffset = len;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 1800, easing: 'cubic-bezier(0.77,0,0.175,1)', fill: 'forwards' });
            io.disconnect();
          }
        });
      }, { threshold: 0.3 });
      io.observe(document.getElementById('routeSvg'));
    }).catch(function () {});
  }

  /* ---------- Countdown ---------- */
  function initCountdown() {
    function nextStart() { var now = new Date(), y = 2026, t = new Date(y, 5, 20, 6, 0, 0); while (t < now) { y++; t = new Date(y, 5, 20, 6, 0, 0); } return t; }
    var target = nextStart();
    document.getElementById('cdTarget').textContent = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(target) + ', 06:00 Uhr';
    var els = ['cdD', 'cdH', 'cdM', 'cdS'].map(function (id) { return document.getElementById(id); });
    var pad = function (n) { return String(n).padStart(2, '0'); };
    function tick() {
      var diff = Math.max(0, target - Date.now());
      var d = Math.floor(diff / 864e5); diff -= d * 864e5;
      var h = Math.floor(diff / 36e5); diff -= h * 36e5;
      var m = Math.floor(diff / 6e4); diff -= m * 6e4;
      els[0].textContent = pad(d); els[1].textContent = pad(h); els[2].textContent = pad(m); els[3].textContent = pad(Math.floor(diff / 1e3));
    }
    tick(); setInterval(tick, 1000);
  }

  function initVersion() {
    fetch('../VERSION').then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) { if (t) document.getElementById('ver').textContent = 'v' + t.trim(); }).catch(function () {});
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSim(); initNextYard(); initNav(); initReveals(); initRoute(); initCountdown(); initVersion();
  });
})();
