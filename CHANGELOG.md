# Changelog

Alle nennenswerten Änderungen an diesem Projekt. Format lose nach [Keep a Changelog](https://keepachangelog.com/),
Versionierung nach [SemVer](https://semver.org/).

## [Unreleased]

## [1.1.0] — 2026-09-05
### Hinzugefügt
- Variante 06 „Tageslauf": durchgehende Scroll-Erzählung. Der Seitengrund wandert beim Scrollen
  durch die 24 Stunden des Rennens (Nacht → Sonnenaufgang → Mittag → Abend → Nacht → Sonnenaufgang);
  alle Bewegungen leiten sich aus einer einzigen Scroll-Zahl ab.
- Effekte: Parallax-Bergketten im Hero, Lese-Fokus auf dem hervorgehobenen Absatz, zeichenweise
  aufblendende Überschriften, klebender Kartenstapel für die vier Regeln, Stunden-Karussell,
  lebendes Sonnenaufgangs-Panel mit der echten GPS-Runde, Fortschrittsbalken.
- Bildplatzhalter mit Beschriftung: fehlt ein Foto, bleibt die Seite vollständig ansehbar
  (`variant-06-tageslauf/media/BILDER-GESUCHT.md` listet alle gesuchten Motive).
- Lenis 1.3.26 (MIT) lokal vendored unter `assets/vendor/lenis/`.

### Geändert
- Galerie-Startseite und README auf sechs Varianten erweitert.

### Behoben
- Variante 06: Kartenkacheln von CARTO auf OpenStreetMap umgestellt. CARTO verlangt inzwischen
  einen API-Schlüssel und liefert sonst nur eine Hinweiskachel. **Variante 04 ist davon ebenfalls
  betroffen und noch nicht umgestellt.**

## [1.0.0] — 2026-06-26
### Hinzugefügt
- Projekt-Gerüst: Git-Repo, `.gitattributes` (eol=lf), `.gitignore`, Doku.
- Geteilte CI-Tokens (`assets/ci.css`) aus dem Logo: Creme `#F4E9D3`, Orange `#E5722A`, Amber `#F2A03A`.
- `.fit`-Parser (`scripts/fit-to-geojson.mjs`): echte Garmin-Route → `route-full.geojson`,
  `route-lap.geojson`, `route-lap.json` (80,98 km / 8001 Punkte, eine 6,706-km-Runde extrahiert).
- Vendored Libraries (gepinnt): GSAP 3.12.5 + ScrollTrigger, Three.js 0.160.1, Leaflet 1.9.4.
- Lokaler Dev-Server (`scripts/serve.mjs`).
- Variante 01–05 (siehe README) + Galerie-Startseite.
