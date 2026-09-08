/* Variante 04 — impeccable
   Echte Leaflet-Karte der Dreisam-Runde (Kernstück) + Countdown + Reveals. */
(function () {
  'use strict';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Leaflet-Karte ---------- */
  function initMap() {
    var L = window.L;
    var el = document.getElementById('map');
    if (!L || !el) { if (el) el.innerHTML = '<p style="padding:24px">Karte konnte nicht geladen werden. Die Strecke verläuft entlang der Dreisam zwischen Hirzbergsteg und Schlosssteg Ebnet.</p>'; return; }

    var map = L.map(el, {
      scrollWheelZoom: false,
      zoomAnimation: !REDUCED,
      fadeAnimation: !REDUCED,
      markerZoomAnimation: !REDUCED,
      attributionControl: true,
    });
    // Scroll erst nach Klick zoomen (kein Scroll-Hijack)
    map.on('focus click', function () { map.scrollWheelZoom.enable(); });
    map.on('mouseout blur', function () { map.scrollWheelZoom.disable(); });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd', maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    var ink = '#1a1206', orange = '#e5722a', amber = '#f2a03a';

    // Gesamt-Track (ausgegraut) als Kontext
    fetch('../data/route-full.geojson').then(function (r) { return r.json(); }).then(function (full) {
      L.geoJSON(full, { style: { color: ink, weight: 2, opacity: 0.18 } }).addTo(map);
    }).catch(function () {});

    // Repräsentative Runde (Hauptlinie)
    fetch('../data/route-lap.geojson').then(function (r) { return r.json(); }).then(function (lap) {
      var layer = L.geoJSON(lap, { style: { color: orange, weight: 5, opacity: 1, lineCap: 'round', lineJoin: 'round' } }).addTo(map);
      map.fitBounds(layer.getBounds(), { padding: [36, 36] });

      // Wendepunkte (Stege) aus den Extrem-Längengraden
      var coords = lap.features[0].geometry.coordinates; // [lng, lat]
      var minI = 0, maxI = 0;
      coords.forEach(function (c, i) { if (c[0] < coords[minI][0]) minI = i; if (c[0] > coords[maxI][0]) maxI = i; });
      function bridge(c, label, dir) {
        L.circleMarker([c[1], c[0]], { radius: 8, color: ink, weight: 2, fillColor: amber, fillOpacity: 1 })
          .addTo(map)
          .bindTooltip(label, { permanent: true, direction: dir, className: 'map-label', offset: dir === 'left' ? [-8, 0] : [8, 0] });
      }
      bridge(coords[minI], 'Hirzbergsteg', 'left');
      bridge(coords[maxI], 'Schlosssteg Ebnet', 'right');
      // Start/Ziel
      L.circleMarker([coords[0][1], coords[0][0]], { radius: 6, color: ink, weight: 2, fillColor: orange, fillOpacity: 1 })
        .addTo(map).bindTooltip('Start / Ziel', { direction: 'top', className: 'map-label' });
    }).catch(function () {});

    // Profil-Fakt aus Höhendaten
    fetch('../data/route-lap.json').then(function (r) { return r.json(); }).then(function (d) {
      if (d.elevation) {
        var delta = Math.round(d.elevation.max - d.elevation.min);
        document.getElementById('profileVal').textContent = delta <= 25 ? 'flach' : 'Δ ' + delta + ' m';
      }
    }).catch(function () {});
  }

  /* ---------- Nav ---------- */
  function initNav() {
    var nav = document.getElementById('nav');
    var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 24); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Sanfte Reveals ---------- */
  function initReveals() {
    if (REDUCED || !('IntersectionObserver' in window)) return;
    var groups = [document.querySelectorAll('.format__list > div'), document.querySelectorAll('.route__facts > div')];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'none'; io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    groups.forEach(function (list) {
      Array.prototype.forEach.call(list, function (el, i) {
        el.style.opacity = '0'; el.style.transform = 'translateY(16px)';
        el.style.transition = 'opacity 600ms cubic-bezier(0.22,1,0.36,1) ' + (i * 60) + 'ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ' + (i * 60) + 'ms';
        io.observe(el);
      });
    });
  }

  /* ---------- Countdown ---------- */
  function initCountdown() {
    function nextStart() { var now = new Date(), y = 2027, t = new Date(y, 5, 19, 6, 0, 0); while (t < now) { y++; t = new Date(y, 5, 19, 6, 0, 0); } return t; }
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
    initMap(); initNav(); initReveals(); initCountdown(); initVersion();
  });
})();
