# Projekt-CLAUDE.md — Midsummer Backyard Ultra Website

## Was ist das
Fünf eigenständige, award-orientierte Landingpage-Varianten für den Midsummer Backyard Ultra
Freiburg. Statische Sites, Hosting über GitHub Pages.

## Tech-Stack
- Vanilla HTML/CSS/JS, **kein Build-Schritt** (direkt von GitHub Pages servierbar).
- GSAP 3.12.5 + ScrollTrigger, Three.js 0.160.1, Leaflet 1.9.4 — **lokal vendored** in `assets/vendor/`.
  Three.js wird per `<script type="importmap">` als ES-Modul eingebunden.
- Node nur als Tooling (`.fit`-Parser, Dev-Server). `package.json type:module`.

## Befehle
- `npm install` — installiert `fit-file-parser` (nur fürs Daten-Tooling).
- `npm run parse-fit` — `Tracking Daten Backyard.fit` → `data/route-*`.
- `npm run serve` / `node scripts/serve.mjs 4178` — lokaler Server auf Port 4178.
- Verifikation: Preview-MCP (`launch.json` → `midsummer`) ODER Chrome-MCP gegen `localhost:4178`.

## CI / Single Source of Truth
- Farben aus `Bildmaterial/Logo.jpg` gesampelt: Creme `#F4E9D3`, Orange `#E5722A`, Amber `#F2A03A`.
  Tokens in `assets/ci.css`; jede Variante spiegelt sie in eigenen CSS-Custom-Properties.
- Version in `VERSION` (Single Source) + sichtbar im Footer jeder Seite.

## Event-Fakten (in den Seiten verwendet)
- 2. Auflage: Sa **20.06.2026, 06:00 Uhr**. Strecke: Dreisam, Hirzbergsteg ↔ Schlosssteg Ebnet.
- Backyard-Regel: 6,706 km „Yard" jede Stunde; wer eine Runde nicht schafft, ist raus →
  Last Runner Standing. Erfunden von Gary „Lazarus Lake" Cantrell (2011).
- Anmeldung/CTA: `freiburg.run/event/midsummer-backyard-ultra/` + Instagram `@midsummerbackyard`.

## Konventionen
- **Nur relative Pfade** (Project-Pages liegen unter `/midsummer-backyard-ultra/` — führende `/` brechen Assets).
- Datei-Edits über das Edit/Write-Tool (UTF-8 ohne BOM), nicht per PowerShell-Bulk-Replace (Umlaute!).
- Jede Variante: `prefers-reduced-motion`-Fallback Pflicht; Mobile-Collapse je Section explizit.
- Deutschsprachige UI.

## Stolperfallen
- GitHub Pages = Unterordner-Pfad: alles relativ halten, auch in JS (`fetch('../data/...')`).
- Three.js nur als `three.module.min.js` vendored — keine Addons (Bloom etc. selbst lösen, z. B. additives Blending + CSS-Glow).
- Roh-`.fit` ist personenbezogen → `.gitignore`; nur abgeleitete GeoJSON veröffentlichen.
- Leaflet braucht OSM-Tiles zur Laufzeit (nur Variante 04) — Netzabhängigkeit, Fallback einplanen.

## Veröffentlichung
- Repo: `jgc-coding/midsummer-backyard-ultra` (public). Pages: Branch `main`, Root.
- Jede abgeschlossene Änderung: Version bumpen + CHANGELOG. Release als Git-Tag.
