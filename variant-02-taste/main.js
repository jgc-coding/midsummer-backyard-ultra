/* Variante 02 — design-taste-frontend
   Kinetische Typo + horizontaler Stunden-Scroll (GSAP ScrollTrigger).
   Kein window-scroll-Listener (Skill-Verbot): alles über ScrollTrigger. */
(function () {
  'use strict';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  if (gsap && ST) gsap.registerPlugin(ST);

  /* ---- Ticker (eine kinetische Laufschrift, einmal pro Seite) ---- */
  function buildTicker() {
    var items = [
      ['6,706', 'km pro Runde'], ['jede Stunde', 'neu'], ['100 Meilen', '= 24 Runden'],
      ['Tag', 'und Nacht'], ['Last Runner', 'Standing'], ['20. Juni', '2026'], ['Dreisam', 'Freiburg'],
    ];
    var track = document.getElementById('ticker');
    var unit = '';
    items.forEach(function (it) { unit += '<span><b>' + it[0] + '</b> ' + it[1] + '</span><span aria-hidden="true">/</span>'; });
    track.innerHTML = unit + unit; // doppelt für nahtlose Schleife
    if (gsap && !REDUCED) {
      var half = track.scrollWidth / 2;
      gsap.to(track, { x: -half, duration: 24, ease: 'none', repeat: -1 });
    }
  }

  /* ---- Timeline-Panels ---- */
  var PANELS = [
    { t: '06:00', y: 'Yard 01', km: '6,7 km', txt: 'Die Sonne ist gerade aufgegangen. Das ganze Feld läuft los.', alive: 'Alle dabei' },
    { t: '09:00', y: 'Yard 04', km: '26,8 km', txt: 'Noch fühlt es sich an wie ein langer, lockerer Lauf.', alive: 'Fast alle dabei' },
    { t: '12:00', y: 'Yard 07', km: '46,9 km', txt: 'Mittagssonne über der Dreisam. Die ersten verpassen den Start.', alive: 'Das Feld dünnt aus' },
    { t: '15:00', y: 'Yard 10', km: '67,1 km', txt: 'Die Beine werden schwer. Jetzt zählt der Kopf.', alive: 'Eine Gruppe hält' },
    { t: '18:00', y: 'Yard 13', km: '87,2 km', txt: 'Hundert Kilometer rücken in Reichweite.', alive: 'Wenige übrig' },
    { t: '21:00', y: 'Yard 16', km: '107,3 km', txt: 'Dämmerung. Stirnlampen an. Die Nacht beginnt.', alive: 'Eine Handvoll', night: true },
    { t: '00:00', y: 'Yard 19', km: '127,4 km', txt: 'Mitten in der Nacht, allein mit dem eigenen Rhythmus.', alive: 'Nur noch ein paar', night: true },
    { t: '06:00', y: 'Yard 24', km: '160,9 km', txt: 'Wieder Sonnenaufgang. 100 Meilen sind geschafft. Und es geht weiter.', alive: 'Zwei, vielleicht drei' },
    { final: true, y: 'Der letzte Yard', big: 'Last Runner Standing', txt: 'Es läuft, bis nur eine Person eine weitere Runde antritt. Sie gewinnt.' },
  ];
  function buildTimeline() {
    var track = document.getElementById('tlTrack');
    var html = '';
    PANELS.forEach(function (p) {
      if (p.final) {
        html += '<article class="tl__panel tl__panel--final"><div class="tl__time"><small>' + p.y + '</small>' + p.big + '</div><p class="tl__txt">' + p.txt + '</p></article>';
      } else {
        html += '<article class="tl__panel' + (p.night ? ' is-night' : '') + '">' +
          '<div class="tl__time"><small>' + p.y + '</small>' + p.t + '</div>' +
          '<div class="tl__km">' + p.km + '</div>' +
          '<p class="tl__txt">' + p.txt + '</p>' +
          '<div class="tl__alive"><i></i>' + p.alive + '</div></article>';
      }
    });
    track.innerHTML = html;
  }

  /* ---- Horizontaler Scroll (canonical: pin + scrub) ---- */
  function initTimelineScroll() {
    var track = document.getElementById('tlTrack');
    var bar = document.getElementById('tlBar');
    if (!gsap || !ST || REDUCED) {
      // Fallback: natives horizontales Scrollen, kein Pin
      var pin = document.getElementById('tlPin');
      pin.style.height = 'auto';
      track.style.overflowX = 'auto';
      track.style.paddingBottom = '24px';
      return;
    }
    var distance = function () { return Math.max(0, track.scrollWidth - window.innerWidth + 48); };
    gsap.to(track, {
      x: function () { return -distance(); },
      ease: 'none',
      scrollTrigger: {
        trigger: '.tl', start: 'top top', end: function () { return '+=' + distance(); },
        pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: function (s) { if (bar) bar.style.width = (s.progress * 100).toFixed(1) + '%'; },
      },
    });
  }

  /* ---- Reveals + Nav ---- */
  function initMotion() {
    var nav = document.getElementById('nav');
    if (!gsap) { document.querySelectorAll('.ln>span').forEach(function (e) { e.style.transform = 'none'; }); return; }
    if (ST) {
      window.addEventListener('load', function () { ST.refresh(); });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
      ST.create({ start: 0, end: 'max', onUpdate: function (s) { nav.classList.toggle('is-stuck', s.scroll() > 40); } });
    }
    if (REDUCED) return;

    // Hero-Zeilen
    gsap.set('.ln>span', { yPercent: 115 });
    gsap.to('.ln>span', { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.1, delay: 0.1 });

    // Hero-Uhr zählt auf 06:00
    var hourEl = document.getElementById('bigHour');
    var o = { v: 0 };
    gsap.to(o, { v: 6, duration: 1.2, ease: 'power2.out', delay: 0.4, onUpdate: function () { hourEl.textContent = String(Math.round(o.v)).padStart(2, '0'); } });

    if (ST) {
      gsap.utils.toArray('.rules__list li').forEach(function (el, i) {
        gsap.from(el, { y: 36, opacity: 0, duration: 0.7, ease: 'power3.out', delay: (i % 2) * 0.08, scrollTrigger: { trigger: el, start: 'top 88%' } });
      });
      gsap.from('.route__stats div', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: '.route__stats', start: 'top 85%' } });
    }
  }

  /* ---- Strecke ---- */
  function initRoute() {
    var path = document.getElementById('routePath');
    var ghost = document.getElementById('routeGhost');
    var markers = document.getElementById('routeMarkers');
    fetch('../data/route-lap.json').then(function (r) { return r.json(); }).then(function (data) {
      var pts = data.points, cx = 500, cy = 180, scale = 420;
      var toPx = function (p) { return [cx + p[0] * scale, cy - p[1] * scale]; };
      var d = pts.map(function (p, i) { var q = toPx(p); return (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' ');
      path.setAttribute('d', d); ghost.setAttribute('d', d);
      var minI = 0, maxI = 0;
      pts.forEach(function (p, i) { if (p[0] < pts[minI][0]) minI = i; if (p[0] > pts[maxI][0]) maxI = i; });
      function mk(i, label, anchor) {
        var q = toPx(pts[i]); var ns = 'http://www.w3.org/2000/svg';
        var c = document.createElementNS(ns, 'circle'); c.setAttribute('cx', q[0]); c.setAttribute('cy', q[1]); c.setAttribute('r', 6); markers.appendChild(c);
        var t = document.createElementNS(ns, 'text'); t.setAttribute('x', q[0]); t.setAttribute('y', q[1] - 14); t.setAttribute('text-anchor', anchor); t.textContent = label; markers.appendChild(t);
      }
      mk(minI, 'Hirzbergsteg', 'start'); mk(maxI, 'Schlosssteg Ebnet', 'end');
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = REDUCED ? 0 : len;
      if (!REDUCED && gsap && ST) {
        gsap.to(path, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', scrollTrigger: { trigger: '#routeSvg', start: 'top 80%' } });
      }
    }).catch(function () {});
  }

  /* ---- Countdown ---- */
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
      var s = Math.floor(diff / 1e3);
      els[0].textContent = pad(d); els[1].textContent = pad(h); els[2].textContent = pad(m); els[3].textContent = pad(s);
    }
    tick(); setInterval(tick, 1000);
  }

  function initVersion() {
    fetch('../VERSION').then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) { if (t) document.getElementById('ver').textContent = 'v' + t.trim(); }).catch(function () {});
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildTicker(); buildTimeline(); initMotion(); initTimelineScroll(); initRoute(); initCountdown(); initVersion();
  });
})();
