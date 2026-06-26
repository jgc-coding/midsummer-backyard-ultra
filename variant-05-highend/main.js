// Variante 05 — high-end-visual-design
// WebGL: echte Dreisam-Route als glühendes 3D-Ribbon + Partikel-Läufer + Embers.
import * as THREE from 'three';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsap = window.gsap;
if (gsap && window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

/* ============================================================
   WebGL-Szene
   ============================================================ */
function discTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,225,170,0.85)');
  grd.addColorStop(1, 'rgba(255,170,70,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  return t;
}

const scroll = { p: 0 };

function initScene(points) {
  const canvas = document.getElementById('scene');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { canvas.style.display = 'none'; return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);

  const R = 7;
  // Punkte -> Vector3 in XZ-Ebene, nahe Duplikate entfernen
  const v = [];
  let last = null;
  points.forEach((p) => {
    const x = p[0] * R, z = p[1] * R;
    if (last && Math.hypot(x - last.x, z - last.z) < 0.06) return;
    const vec = new THREE.Vector3(x, 0, z);
    v.push(vec); last = vec;
  });
  const curve = new THREE.CatmullRomCurve3(v, true, 'catmullrom', 0.5);

  const orange = new THREE.Color('#e5722a');
  const amber = new THREE.Color('#f2a03a');

  // Kern-Ribbon
  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 600, 0.05, 8, true),
    new THREE.MeshBasicMaterial({ color: orange })
  );
  scene.add(tube);
  // Glühender Halo
  const glow = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 600, 0.17, 8, true),
    new THREE.MeshBasicMaterial({ color: amber, transparent: true, opacity: 0.13, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  scene.add(glow);

  const tex = discTexture();

  // Läufer-Partikel entlang der Kurve
  const N = 28;
  const runnerOff = new Float32Array(N);
  const rPos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) runnerOff[i] = i / N;
  const rGeo = new THREE.BufferGeometry();
  rGeo.setAttribute('position', new THREE.BufferAttribute(rPos, 3));
  const runners = new THREE.Points(rGeo, new THREE.PointsMaterial({ size: 0.55, map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: new THREE.Color('#ffd27a') }));
  scene.add(runners);

  function placeRunners(t) {
    for (let i = 0; i < N; i++) {
      const u = (runnerOff[i] + t * 0.04) % 1;
      const p = curve.getPointAt(u);
      rPos[i * 3] = p.x; rPos[i * 3 + 1] = p.y + 0.05; rPos[i * 3 + 2] = p.z;
    }
    rGeo.attributes.position.needsUpdate = true;
  }
  placeRunners(0);

  // Embers / Atmosphäre
  const M = 320;
  const ePos = new Float32Array(M * 3);
  for (let i = 0; i < M; i++) { ePos[i * 3] = (Math.random() - 0.5) * 20; ePos[i * 3 + 1] = Math.random() * 7; ePos[i * 3 + 2] = (Math.random() - 0.5) * 14; }
  const eGeo = new THREE.BufferGeometry();
  eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
  const embers = new THREE.Points(eGeo, new THREE.PointsMaterial({ size: 0.18, map: tex, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending, color: amber }));
  scene.add(embers);

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  function positionCamera(t) {
    const ang = -0.55 + scroll.p * 1.7 + (REDUCED ? 0 : Math.sin(t * 0.12) * 0.06);
    const rad = 9.2 - scroll.p * 3.4;
    const hgt = 5.2 - scroll.p * 3.6;
    camera.position.set(Math.sin(ang) * rad, hgt, Math.cos(ang) * rad);
    camera.lookAt(0, 0.2, 0);
  }

  const clock = new THREE.Clock();
  let running = true;
  function render() {
    const t = clock.getElapsedTime();
    if (!REDUCED) {
      placeRunners(t);
      for (let i = 0; i < M; i++) { ePos[i * 3 + 1] += 0.006; if (ePos[i * 3 + 1] > 7) ePos[i * 3 + 1] = 0; }
      eGeo.attributes.position.needsUpdate = true;
    }
    positionCamera(t);
    renderer.render(scene, camera);
    if (running && !REDUCED) requestAnimationFrame(render);
  }
  if (REDUCED) { scroll.p = 0.18; render(); }
  else requestAnimationFrame(render);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { running = false; }
    else if (!REDUCED) { running = true; requestAnimationFrame(render); }
  });

  // Kamerafahrt an Scroll koppeln
  if (gsap && window.ScrollTrigger && !REDUCED) {
    gsap.to(scroll, { p: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.8 } });
  }
}

/* ============================================================
   Reveals, magnetische Buttons, Countdown
   ============================================================ */
function initReveals() {
  // Hero
  if (gsap && !REDUCED) {
    gsap.from('.hero .reveal', { opacity: 0, y: 34, filter: 'blur(12px)', duration: 1.1, ease: 'power3.out', stagger: 0.09, delay: 0.15 });
  }
  // .io Sektionen
  if (REDUCED || !('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll('.io');
  els.forEach((el) => { el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; el.style.filter = 'blur(10px)'; el.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1), filter 0.9s cubic-bezier(0.16,1,0.3,1)'; });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'none'; e.target.style.filter = 'none'; io.unobserve(e.target); } });
  }, { threshold: 0.16 });
  els.forEach((el) => io.observe(el));
}

function initMagnetic() {
  if (REDUCED || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (ev) => {
      const r = el.getBoundingClientRect();
      const dx = ev.clientX - (r.left + r.width / 2);
      const dy = ev.clientY - (r.top + r.height / 2);
      el.style.transform = 'translate(' + (dx * 0.25).toFixed(1) + 'px,' + (dy * 0.3).toFixed(1) + 'px)';
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

function initNav() {
  const nav = document.getElementById('nav');
  if (gsap && window.ScrollTrigger) {
    window.ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { nav.style.boxShadow = s.scroll() > 30 ? '0 20px 50px -22px rgba(0,0,0,.9)' : '0 20px 50px -24px rgba(0,0,0,.8)'; } });
  }
}

function initCountdown() {
  function nextStart() { const now = new Date(); let y = 2026, t = new Date(y, 5, 20, 6, 0, 0); while (t < now) { y++; t = new Date(y, 5, 20, 6, 0, 0); } return t; }
  const target = nextStart();
  document.getElementById('cdTarget').textContent = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(target) + ', 06:00 Uhr';
  const els = ['cdD', 'cdH', 'cdM', 'cdS'].map((id) => document.getElementById(id));
  const pad = (n) => String(n).padStart(2, '0');
  function tick() {
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    els[0].textContent = pad(d); els[1].textContent = pad(h); els[2].textContent = pad(m); els[3].textContent = pad(Math.floor(diff / 1e3));
  }
  tick(); setInterval(tick, 1000);
}

function initVersion() {
  fetch('../VERSION').then((r) => (r.ok ? r.text() : '')).then((t) => { if (t) document.getElementById('ver').textContent = 'v' + t.trim(); }).catch(() => {});
}

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', () => {
  fetch('../data/route-lap.json')
    .then((r) => r.json())
    .then((d) => initScene(d.points))
    .catch(() => { document.getElementById('scene').style.display = 'none'; });
  initReveals(); initMagnetic(); initNav(); initCountdown(); initVersion();
});
