# Changelog

Alle nennenswerten Änderungen an diesem Projekt. Format lose nach [Keep a Changelog](https://keepachangelog.com/),
Versionierung nach [SemVer](https://semver.org/).

## [Unreleased]

## [1.3.0] — 2026-09-08
### Geändert
- **Termin auf die 3. Auflage umgestellt: Samstag, 19.06.2027, 06:00 Uhr.** Betrifft alle sechs
  Varianten und die Galerie-Startseite: Meta-Angaben, sichtbare Datumszeilen, die Auflagen-Nummer
  und die fünf eigenständigen `nextStart()`-Funktionen der Varianten 01–05.
- **Hero von Variante 06 neu aufgebaut,** in der Anlage an fora.so orientiert: alles mittig
  (Marker, Überschrift, Untertitel), ein einzelner Knopf mit einem leisen zweiten Weg darunter,
  darunter das Panel, das der Hero unten hart abschneidet. Überschrift etwas leichter und kleiner,
  damit sie zentriert nicht erschlägt. Hero-Höhe von 1290 px auf 1140 px.
- **Hero-Himmel ist jetzt ein Sonnenaufgang in CI-Farben.** Die Lichtreise beginnt nicht mehr in
  der Nacht, sondern um 06:00 Uhr beim Start und läuft über Tag und Nacht zum zweiten
  Sonnenaufgang. Der Rest der Seite bleibt dunkel; warm ist nur der Einstieg.
- **Bergketten sind Dunst statt Scherenschnitt.** Obere Kante per Maske in den Himmel
  ausgeblendet, Weichzeichner gegen die harte Linie, nach hinten hin blasser. Feste Angaben —
  bewegt wird weiterhin nur `transform`.
- Ausrüstungsliste ist aus dem Anmelde-Abschnitt in die Fragen gewandert, mit dem ausdrücklichen
  Hinweis, dass sie ein Vorschlag und nicht vollständig ist. Der Anmelde-Abschnitt zeigt dadurch
  Countdown und Anmelde-Karte nebeneinander statt einer halb leeren Reihe.

### Behoben
- **Schreibvorgänge standen in `render()` vor den Messungen** — dieselbe Falle wie beim
  `:root`-Schreiben, nur eine Ebene höher. Vier `getBoundingClientRect()` kosten gemessen
  0,05 ms, dieselben vier nach einem Schreibvorgang 6,5 ms. Messungen stehen jetzt ganz oben.
- Der Übergang von der Nacht zum zweiten Sonnenaufgang lief durch Grau, weil Blau und Orange
  Gegenfarben sind und ihre Mischung durch die Mitte geht. Eine Zwischenstufe „erstes Licht"
  führt ihn jetzt über ein warmes Rot.
- Der Himmel im Hero-Panel überstrahlte nach der Umstellung die Überschrift; seine Deckkraft ist
  von 0,58 auf 0,33 zurückgenommen.

## [1.2.0] — 2026-09-08
### Geändert
- Variante 06 inhaltlich neu geordnet: von neun Abschnitten auf sieben. Der Prosa-Abschnitt
  „Das Format" ist entfallen — er erklärte dieselbe Regel wie die vier Regelkarten direkt
  darunter; sein Kerngedanke (Cantrell-Zitat) steckt jetzt in Regel 4. Die Galerie „Eindrücke"
  ist entfallen, ihre tragfähigen Motive sind in die Bildstrecke „Ein Tag und eine Nacht"
  gewandert. Neue Reihenfolge: Hero → Format → Strecke → Stunden → Anmelden → Fragen → Schluss.
- Die Kernregel wurde an sieben Stellen erklärt, jetzt noch an einer. FAQ von acht auf fünf
  Fragen gekürzt (die drei gestrichenen beantworteten Regel 3 und die Ausrüstungsliste erneut);
  die zwei FAQ-Reiter entfallen damit ebenfalls.
- Bildplätze von 17 auf 9 reduziert, `media/BILDER-GESUCHT.md` entsprechend neu geschrieben.
  Die beiden Steg-Fotos sind entfallen; die Karte benennt beide Wendepunkte ohnehin, ihre Namen
  stehen jetzt zusätzlich in den Streckenfakten.
- Seitenhöhe dadurch von 12.275 px auf 9.719 px (1440 px breit gemessen).

### Behoben
- **Auf dem Handy waren drei der vier Kerneffekte hart abgeschaltet** (Hero-Parallax,
  klebender Kartenstapel, Bergketten-Drift im Schluss), der vierte lief in einem Achtel der
  Auflösung. Übrig blieben Einblendungen. Jetzt laufen dieselben Effekte auf beiden Geräten,
  auf schmalen Bildschirmen mit kleinerem Ausschlag (`data-rate-s`) statt abgeschaltet.
  Der Himmel im Hero-Panel rendert in einem Drittel statt einem Achtel der Auflösung, die
  30-Bilder-Drosselung ist entfallen.
- Kartenstapel auf dem Handy: Karten kleben und dimmen jetzt auch dort. Ihre Höhe folgt dem
  Text und ist auf 78 % der Fensterhöhe gedeckelt — kleben kann nur, was ins Fenster passt.

### Entfernt
- Bergketten-Drift im Schluss-Abschnitt (kleinste Wirkung, eigene Mess-Schleife pro Bild).

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
