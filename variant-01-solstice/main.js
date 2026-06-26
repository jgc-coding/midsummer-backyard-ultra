// Variante 01 — "Solstice Sun"
// Three.js-Himmel/Sonne + GSAP-Choreografie + Yard-Clock + Strecke + Countdown.
import * as THREE from 'three';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsap = window.gsap;
if (gsap && window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

/* ============================================================
   1) Lebendiger Himmel + Sonne (WebGL)
   ============================================================ */
const sky = { sunX: 0.32, sunY: 0.30, phase: 0.08 };
(function initSky() {
  const canvas = document.getElementById('sky');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch (e) {
    canvas.style.display = 'none';
    document.body.style.background =
      'linear-gradient(180deg,#f5ead4,#f6d6a3)';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    iTime: { value: 0 },
    iRes: { value: new THREE.Vector2(1, 1) },
    sunPos: { value: new THREE.Vector2(sky.sunX, sky.sunY) },
    phase: { value: sky.phase },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }`,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float iTime; uniform vec2 iRes; uniform vec2 sunPos; uniform float phase;
      float hash(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }
      float noise(vec2 p){ vec2 i=floor(p),f=fract(p);
        float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));
        vec2 u=f*f*(3.-2.*f); return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y; }
      float fbm(vec2 p){ float v=0.,a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=.5;} return v; }
      void main(){
        vec2 uv=vUv; float ar=iRes.x/iRes.y;
        vec2 p=vec2(uv.x*ar,uv.y); vec2 sp=vec2(sunPos.x*ar,sunPos.y);
        vec3 top=mix(vec3(.961,.918,.835),vec3(.969,.886,.706),phase);
        vec3 bot=mix(vec3(.965,.855,.640),vec3(.902,.553,.255),phase);
        vec3 col=mix(bot,top,smoothstep(0.,1.,uv.y));
        float d=distance(p,sp);
        float ang=atan(p.y-sp.y,p.x-sp.x);
        float n=fbm(vec2(ang*2.6,iTime*.12)+d*3.2);
        float corona=smoothstep(.34,.0,d+n*.07);
        float core=smoothstep(.12,.0,d);
        float rays=(.5+.5*sin(ang*18.+iTime*.25))*smoothstep(.55,.0,d)*.4;
        vec3 sunCol=mix(vec3(.969,.760,.290),vec3(1.,.953,.808),core);
        col=mix(col,vec3(.898,.447,.165),corona*.45);
        col+=sunCol*core*1.25;
        col+=vec3(.97,.66,.25)*rays*(.4+.4*n);
        col*=1.-.16*pow(distance(uv,vec2(.5)),2.);
        gl_FragColor=vec4(col,1.);
      }`,
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    uniforms.iRes.value.set(w, h);
  }
  window.addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();
  function render() {
    uniforms.iTime.value = REDUCED ? 4.0 : clock.getElapsedTime();
    uniforms.sunPos.value.set(sky.sunX, sky.sunY);
    uniforms.phase.value = sky.phase;
    renderer.render(scene, camera);
    if (!REDUCED) requestAnimationFrame(render);
  }
  if (REDUCED) render(); else requestAnimationFrame(render);
})();

/* ============================================================
   2) Reveal-Animationen + Scroll-Choreografie (GSAP)
   ============================================================ */
function initMotion() {
  if (!gsap) {
    document.querySelectorAll('.reveal').forEach((el) => (el.style.opacity = 1));
    return;
  }
  const ST = window.ScrollTrigger;

  // Layout-Höhen ändern sich nach Font-Load → ScrollTrigger neu vermessen
  if (ST) {
    window.addEventListener('load', () => ST.refresh());
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ST.refresh());
  }

  // Nav stuck
  const nav = document.getElementById('nav');
  if (ST) {
    ST.create({ start: 'top -40', end: 99999, onUpdate: (s) => nav.classList.toggle('is-stuck', s.progress > 0 || window.scrollY > 40) });
  }
  window.addEventListener('scroll', () => nav.classList.toggle('is-stuck', window.scrollY > 40), { passive: true });

  if (REDUCED) {
    gsap.set('.reveal,.reveal-word,.reveal-line>span', { clearProps: 'all', opacity: 1, y: 0 });
    return;
  }

  // Hero-Titel: zeilenweise enthüllen
  gsap.set('.reveal-line>span', { yPercent: 115 });
  gsap.to('.reveal-line>span', { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12, delay: 0.15 });

  // Hero-Inhalt gestaffelt
  gsap.set('.hero .reveal', { y: 26, opacity: 0 });
  gsap.to('.hero .reveal', { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.5 });

  if (ST) {
    // generische Reveals
    gsap.utils.toArray('.reveal:not(.hero .reveal)').forEach((el) => {
      gsap.set(el, { y: 30, opacity: 0 });
      gsap.to(el, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' },
      });
    });

    // Manifest-Wörter
    gsap.set('.reveal-word', { yPercent: 120, opacity: 0 });
    gsap.to('.reveal-word', {
      yPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: '.manifest', start: 'top 70%' },
    });

    // Sonnenbogen + Tageslauf, gekoppelt an den Hero-Scroll
    gsap.to(sky, {
      sunX: 0.7, sunY: 0.66, phase: 0.62, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}

/* ============================================================
   3) Yard-Clock — scrollt durch die Stunden
   ============================================================ */
function initClock() {
  // Stunden-Ticks
  const ticks = document.getElementById('clockTicks');
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
    const r1 = 150, r2 = i % 6 === 0 ? 134 : 142;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', 200 + Math.cos(a) * r1);
    line.setAttribute('y1', 200 + Math.sin(a) * r1);
    line.setAttribute('x2', 200 + Math.cos(a) * r2);
    line.setAttribute('y2', 200 + Math.sin(a) * r2);
    ticks.appendChild(line);
  }

  const runner = document.getElementById('runner');
  const hand = document.getElementById('clockHand');
  const prog = document.getElementById('clockProgress');
  const hourNum = document.getElementById('hourNum');
  const kmNum = document.getElementById('kmNum');
  const aliveNum = document.getElementById('aliveNum');
  const LAP = 6.706;

  function setHour(h) {
    const hour = Math.max(1, Math.min(30, Math.floor(h) + 1));
    const frac = h - Math.floor(h);
    runner.setAttribute('transform', `rotate(${h * 360} 200 200)`);
    hand.setAttribute('transform', `rotate(${frac * 360} 200 200)`);
    prog.style.strokeDashoffset = String(100 * (1 - frac));
    hourNum.textContent = String(hour);
    kmNum.textContent = (hour * LAP).toFixed(1).replace('.', ',');
    aliveNum.textContent = String(Math.max(1, Math.round(1 + 37 * Math.exp(-hour / 7))));
  }
  setHour(0);

  if (gsap && window.ScrollTrigger && !REDUCED) {
    const state = { h: 0 };
    gsap.to(state, {
      h: 29.99, ease: 'none',
      scrollTrigger: { trigger: '.format', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      onUpdate: () => setHour(state.h),
    });
  } else {
    setHour(14); // statischer, aussagekräftiger Zustand
  }
}

/* ============================================================
   4) Strecke aus echten GPS-Daten zeichnen
   ============================================================ */
async function initRoute() {
  const svg = document.getElementById('routeSvg');
  const pathEl = document.getElementById('routePath');
  const markers = document.getElementById('routeMarkers');
  try {
    const res = await fetch('../data/route-lap.json');
    const data = await res.json();
    const pts = data.points; // [[x,y]] in [-1..1]
    const W = 1000, H = 420, cx = 500, cy = 210, scale = 440;
    const toPx = ([x, y]) => [cx + x * scale, cy - y * scale];
    const d = pts.map((p, i) => (i ? 'L' : 'M') + toPx(p).map((v) => v.toFixed(1)).join(' ')).join(' ');
    pathEl.setAttribute('d', d);

    // Extrempunkte = Wendepunkte an den Stegen
    let minI = 0, maxI = 0;
    pts.forEach((p, i) => { if (p[0] < pts[minI][0]) minI = i; if (p[0] > pts[maxI][0]) maxI = i; });
    const mk = (i, label, anchor, dy) => {
      const [x, y] = toPx(pts[i]);
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 7);
      markers.appendChild(c);
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', x); t.setAttribute('y', y + dy);
      t.setAttribute('text-anchor', anchor);
      t.textContent = label;
      markers.appendChild(t);
    };
    mk(minI, 'Hirzbergsteg', 'start', -16);
    mk(maxI, 'Schlosssteg Ebnet', 'end', -16);

    // Draw-on
    const len = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = len;
    pathEl.style.strokeDashoffset = REDUCED ? 0 : len;
    if (!REDUCED && gsap && window.ScrollTrigger) {
      gsap.to(pathEl, {
        strokeDashoffset: 0, duration: 2, ease: 'power2.inOut',
        scrollTrigger: { trigger: svg, start: 'top 80%' },
      });
      gsap.from(markers, { opacity: 0, duration: 1, delay: 1, scrollTrigger: { trigger: svg, start: 'top 80%' } });
    }
  } catch (e) {
    pathEl.parentElement.insertAdjacentHTML('beforeend', '<text x="500" y="210" text-anchor="middle" fill="#cbb88f">Streckendaten nicht verfügbar</text>');
  }
}

/* ============================================================
   5) Countdown bis zum nächsten Start
   ============================================================ */
function initCountdown() {
  // Nächstes Vorkommen von 20. Juni, 06:00 (lokal). Rollt automatisch ins Folgejahr.
  function nextStart() {
    const now = new Date();
    let year = 2026;
    let t = new Date(year, 5, 20, 6, 0, 0);
    while (t.getTime() < now.getTime()) { year += 1; t = new Date(year, 5, 20, 6, 0, 0); }
    return t;
  }
  const target = nextStart();
  const fmt = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  document.getElementById('cdTarget').textContent = `${fmt.format(target)} · 06:00 Uhr`;

  const elD = document.getElementById('cdD'), elH = document.getElementById('cdH'),
    elM = document.getElementById('cdM'), elS = document.getElementById('cdS');
  const pad = (n) => String(n).padStart(2, '0');
  function tick() {
    let diff = Math.max(0, target.getTime() - Date.now());
    const d = Math.floor(diff / 86400000); diff -= d * 86400000;
    const h = Math.floor(diff / 3600000); diff -= h * 3600000;
    const m = Math.floor(diff / 60000); diff -= m * 60000;
    const s = Math.floor(diff / 1000);
    elD.textContent = pad(d); elH.textContent = pad(h); elM.textContent = pad(m); elS.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   Init
   ============================================================ */
async function fetchVersion() {
  try {
    const r = await fetch('../VERSION');
    if (r.ok) document.getElementById('ver').textContent = 'v' + (await r.text()).trim();
  } catch (_) {}
}

document.addEventListener('DOMContentLoaded', () => {
  initMotion();
  initClock();
  initRoute();
  initCountdown();
  fetchVersion();
});
