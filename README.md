# Midsummer Backyard Ultra Freiburg — 6 Landingpage-Varianten

Sechs unabhängige, award-orientierte Landingpages für den **Midsummer Backyard Ultra Freiburg**
(2. Auflage: **Sa 20.06.2026, Start 06:00 Uhr**, Schleife entlang der Dreisam zwischen
Hirzbergsteg und Schlosssteg Ebnet).

Jede Variante ist eine eigenständige statische Site (kein Build-Schritt) und nutzt das
Projekt-Logo sowie dessen Farben als Corporate Identity.

## Varianten

| # | Ordner | Ansatz |
|---|--------|--------|
| 01 | [`variant-01-solstice/`](variant-01-solstice/) | „Solstice Sun" — ohne Design-Skill, Three.js-Sonne + GSAP |
| 02 | [`variant-02-taste/`](variant-02-taste/) | Skill `design-taste-frontend` — kinetische Stunden-Timeline |
| 03 | [`variant-03-emil/`](variant-03-emil/) | Skill `emil-design-eng` — Design-Engineering, interaktive Yard-Clock |
| 04 | [`variant-04-impeccable/`](variant-04-impeccable/) | Skill `impeccable` — production-grade, echte Dreisam-Karte (Leaflet) |
| 05 | [`variant-05-highend/`](variant-05-highend/) | Skill `high-end-visual-design` — Three.js-Showstopper, 3D-Route |
| 06 | [`variant-06-tageslauf/`](variant-06-tageslauf/) | „Tageslauf" — durchgehende Scroll-Erzählung, Hintergrund wandert durch die 24 Stunden |

Die Galerie-Startseite (`index.html`) verlinkt alle sechs.

Variante 06 zeigt an Stellen ohne Foto einen beschrifteten Platzhalter. Welche Bilder gesucht
werden, steht in [`variant-06-tageslauf/media/BILDER-GESUCHT.md`](variant-06-tageslauf/media/BILDER-GESUCHT.md).

## CI-Farben (aus dem Logo gesampelt)

- Creme `#F4E9D3` · Orange `#E5722A` · Amber `#F2A03A`

## Lokal ansehen

```bash
npm install            # nur für den .fit-Parser nötig
npm run serve          # statischer Server auf http://localhost:4178
```

## Strecken-Daten

Die echte Route stammt aus einer Garmin-`.fit`-Aufzeichnung des Laufs.
`npm run parse-fit` erzeugt aus ihr `data/route-*.geojson` / `route-lap.json`.
Die Roh-`.fit` (personenbezogen) wird **nicht** veröffentlicht.

## Tech

Vanilla HTML/CSS/JS · GSAP + ScrollTrigger · Three.js · Leaflet · Lenis — alle lokal unter
`assets/vendor/` (gepinnt, keine CDN-Laufzeitabhängigkeit).
