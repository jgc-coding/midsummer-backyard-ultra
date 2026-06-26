# Changelog

Alle nennenswerten Änderungen an diesem Projekt. Format lose nach [Keep a Changelog](https://keepachangelog.com/),
Versionierung nach [SemVer](https://semver.org/).

## [Unreleased]

## [1.0.0] — 2026-06-26
### Hinzugefügt
- Projekt-Gerüst: Git-Repo, `.gitattributes` (eol=lf), `.gitignore`, Doku.
- Geteilte CI-Tokens (`assets/ci.css`) aus dem Logo: Creme `#F4E9D3`, Orange `#E5722A`, Amber `#F2A03A`.
- `.fit`-Parser (`scripts/fit-to-geojson.mjs`): echte Garmin-Route → `route-full.geojson`,
  `route-lap.geojson`, `route-lap.json` (80,98 km / 8001 Punkte, eine 6,706-km-Runde extrahiert).
- Vendored Libraries (gepinnt): GSAP 3.12.5 + ScrollTrigger, Three.js 0.160.1, Leaflet 1.9.4.
- Lokaler Dev-Server (`scripts/serve.mjs`).
- Variante 01–05 (siehe README) + Galerie-Startseite.
