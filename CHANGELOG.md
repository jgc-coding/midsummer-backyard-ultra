# Changelog

Alle nennenswerten Änderungen an diesem Projekt. Format lose nach [Keep a Changelog](https://keepachangelog.com/),
Versionierung nach [SemVer](https://semver.org/).

## [2.1.2] — 2026-09-10
### Behoben
- **Der Skip-Link und die Anker-Navigation nehmen jetzt den Tastaturfokus mit.** Vorher scrollte
  ein Klick nur; wer mit der Tastatur „Direkt zum Inhalt" wählte, landete mit dem nächsten Tab
  trotzdem wieder in der Navigationsleiste. Sprungziele werden jetzt programmatisch fokussiert
  (ohne Rahmen um die ganze Sektion — das Weitertabben im Inhalt ist das Feedback).
- **Beim Teilen der Seite erscheint jetzt ein Vorschaubild.** Die Bild-Angabe war eine relative
  URL, die Social-Media-Parser nicht auflösen; zudem war das Logo mit 124 × 124 px unter dem
  Minimum der Dienste. Neu: `assets/og-vorschau.jpg`, ein 1200 × 630-Standbild des Heros, samt
  `og:url`, `og:type`, `og:locale` und `twitter:card`. Das Bild trägt den Termin als Pixeltext —
  bei einem Terminwechsel neu erzeugen (Anleitung im Kommentar in `index.html`).
- **Die Intro-Absätze der Sektionen sind auf 60 Zeichen Breite gedeckelt.** Unter 980 px wird
  der Sektionskopf einspaltig, und der Erklärtext lief auf gemessene 97 (768 px) bis
  124 Zeichen (980 px) je Zeile — Richtwert ist 75.

### Geändert
- **Die vier Regel-Fotos laden erst, wenn man in ihre Nähe scrollt** (`loading="lazy"`).
  Vorher lud jeder Besucher beim Start bis zu 2 MB Bilder, auch ohne je hinzuscrollen.
  Der Platzhalter-Mechanismus bleibt: Bis ein Bild da ist, steht die beschriftete Fläche.


### Behoben
- **Die Regel-Bilder zeigten je nach Bildschirmbreite einen anderen Ausschnitt, meist den
  falschen.** Alle vier Dateien sind 4:5 hochkant, der Bildplatz der Karte wechselte sein
  Seitenverhältnis aber zwischen 0,78:1 und 4,66:1 — und `object-fit: cover` schneidet mittig,
  wo bei diesen Aufnahmen nichts Wichtiges steht. Am Handy blieben 37 Prozent der Bildhöhe
  übrig, in der Desktop-Ansicht am Handy nur 17 Prozent; die Köpfe fielen als Erstes weg.
  Drei Änderungen, gemessen im Browser:
  - Jedes Bild trägt jetzt einen **Fokuspunkt** (`--focus`), der beim Beschneiden im Fenster
    bleibt: Kappe des Läufers, Köpfe der Gruppe, Fluchtpunkt des Weges, Schale des Pokals.
    Werte und Begründung in `media/BILDER.md`.
  - Das **Bildband der Handy-Ansicht** ist nicht mehr fix 165/190 px hoch, sondern wächst mit
    der Breite und weicht zurück, wenn der Bildschirm niedrig ist — die Karte muss unter 78vh
    bleiben, sonst klebt sie nicht mehr. Sichtbare Bildhöhe bei 390 px: 54 statt 37 Prozent.
  - Der **Umbruch der Regel-Karten liegt bei 760 px statt 980 px**. Damit ist der Bereich
    dazwischen wieder zweispaltig, der Bildplatz hochformatig, und in der Höhe fehlt nichts.
    Genau 980 px stellt Chrome am Handy ein, wenn man „Desktop-Website" wählt.

  Die Bilddateien selbst sind unverändert.

- **Im Querformat schnitt die Regel-Karte Text ab.** Bei einem niedrigen Sichtfenster (Handy quer,
  844 × 390) griff der Deckel von 78vh, der Inhalt brauchte aber mehr — der letzte Absatz war
  weg. Die Kartenhöhe ist jetzt `max(400px, min(580px, 100vh - 130px))`: so hoch wie das Fenster
  erlaubt, nie unter 400 px. Auf üblichen Bildschirmen bleibt es bei den bisherigen 580 px.

  Geprüft bei 375, 390, 768, 844 × 390, 980, 1440 × 700 und 1440 × 900: kein Textüberlauf, keine
  Konsolenfehler, `prefers-reduced-motion` unverändert vollständig lesbar.

- **Der Footer-Link auf JGC Lumen führte in eine Sicherheitswarnung.** Er zeigte auf
  `https://www.jgc-lumen.de`; das Zertifikat der Seite gilt aber nur für `jgc-lumen.de` ohne
  „www" (`ERR_TLS_CERT_ALTNAME_INVALID`). Der Link steht jetzt ohne „www". Bei der Gelegenheit
  alle externen Links der Seite geprüft — freiburg.run, Instagram und Strava sind in Ordnung.

## [2.1.0] — 2026-09-10
### Hinzugefügt
- **Die vier Regel-Karten haben echte Bilder vom Rennen 2026.** Zwei stammen von Gabriel (Läufer
  auf dem Uferweg an der Dreisam, Siegerpokal mit der Gravur „Only survivor"), zwei sind
  Standbilder aus dem Videomaterial (das Feld geht gemeinsam auf die Runde; der leere Uferweg für
  „Das Aus"). Herkunft und Rechtestand jeder Datei stehen in `media/BILDER.md`.
- Footer-Zeile „Website erstellt von JGC Lumen" mit Link auf `www.jgc-lumen.de`.

### Geändert
- **Die Sektion „Ein Tag und eine Nacht" ist entfernt** (Gabriels Entscheidung, 10.09.2026). Das
  vorhandene Material endet um 18:00 Uhr nach zwölf Runden, es gibt keine einzige Nachtaufnahme —
  ohne Bilder trug die Sektion nicht. Mit ihr entfielen das Tab-Karussell in `main.js`, die
  zugehörigen Stile und die Navigationspunkte „Stunden" in Kopf- und Fußzeile.
- `media/BILDER-GESUCHT.md` wurde zu `media/BILDER.md`: aus der Suchliste ist eine
  Herkunfts- und Rechtedokumentation geworden.

### Offen
- Auf zwei Bildern sind fremde Teilnehmende erkennbar. Vor einer Veröffentlichung braucht es
  deren Einwilligung und das Nutzungsrecht der aufnehmenden Person.

## [2.0.0] — 2026-09-09
### Geändert
- **„Tageslauf" ist die einzige Fassung und liegt jetzt im Projekt-Root** (Gabriels Entscheidung,
  09.09.2026). Die Seite ist damit direkt unter der Pages-Adresse erreichbar; alle internen Pfade
  von `../…` auf Root-relativ umgestellt, Footer ohne Varianten-Verweis, `media/` samt
  `BILDER-GESUCHT.md` in den Root gezogen.
- `assets/` verschlankt: Schriften nur noch die drei genutzten Familien (Plus Jakarta Sans,
  Inter Tight, JetBrains Mono), Vendor nur noch Lenis und Leaflet.
- `.claude/pruefen.txt` angelegt — das Done-Gate prüft jetzt JS-Syntax und VERSION-Format.

### Behoben
- **Die Streckenkarte fing am Handy die Scroll-Geste** (ein Finger verschob die Karte statt die
  Seite zu scrollen). Ein-Finger-Ziehen ist am Touch-Gerät jetzt aus; zoomen geht weiter mit zwei
  Fingern und den +/−-Knöpfen, am Rechner nach Klick auch per Mausrad.

### Entfernt
- Varianten 01–05, Galerie-Startseite, `hero-lab/` (Vorstufe), `DESIGN.md` (beschrieb nur
  Variante 04) und die nur dort genutzten Schriften und Bibliotheken (GSAP, ScrollTrigger,
  Three.js, altes `schriftzug.webp`). Der letzte Stand mit allen sechs Varianten bleibt über den
  Git-Tag `v1.3.0` abrufbar.

## [1.4.0] — 2026-09-09
### Hinzugefügt
- **Der freigegebene Hero (ChatGPT-Export aus `Hero/`) ist in Variante 06 eingebaut.** Heller
  Morgen aus dem unveränderten Bildmaterial: Bergkette hinten, Sonne+Schriftzug davor, dann Tal
  mit Fluss und Baumkronen vorn; Maus- und Scroll-Parallaxe je Ebene, die Sonne dreht in
  110 s einmal durch. Schriften, Farben und Knöpfe kommen aus dem Stilsystem der Seite; die
  Abdunklung unten läuft in die Grundfarbe der Lichtreise aus — der helle Start ist damit
  erzählerisch der Sonnenaufgang um 06:00 Uhr, danach wandert die Seite wie bisher in die Nacht.
- **Morph beim Scrollen:** Sonne und Schriftzug starten frei im Hero (oben links ist nichts) und
  schrumpfen beim Scrollen in die Leiste; unterwegs blenden Datumzeile und Schriftzug aus, die
  Sonnenscheibe vervollständigt sich und dockt pixelgenau als dauerhaftes Marken-Symbol neben dem
  Schriftzug „Midsummer Backyard" an. Rückwärts läuft alles wieder auseinander. Bei reduzierter
  Bewegung: kein Morph, Marke in der Leiste von Anfang an sichtbar.
- Diagnose-Parameter `?y=<px>` (Scroll-Zustand ohne echtes Scrollen rendern) und `?vh=<px>`
  (feste Hero-Höhe) für Headless-Aufnahmen — echtes Scrollen und `100svh` verfälschen sie sonst.
- `hero-lab/` (Vorstufe vom Vormittag, eigenständige Hero-Seite mit A/B-Umschalter) bleibt als
  Referenz liegen, ist aber durch den Einbau in Variante 06 überholt.

### Geändert
- **`scripts/hero-bilder.py` arbeitet jetzt originalgetreu:** nur verkleinern und als WebP
  speichern, kein Umfärben, kein Beschnitt mehr (Regel „Geliefertes Bildmaterial ist Endzustand"
  in der CLAUDE.md). Das Karomuster hinter dem Schriftzug entfernt zur Laufzeit ein SVG-Farbfilter
  aus dem Export. `assets/hero/` entsprechend neu erzeugt (fünf Dateien, zusammen 1,3 MB),
  neu dabei `schriftzug-sonne.webp`; das alte freigestellte `schriftzug.webp` nutzt nur noch
  `hero-lab/`.
- Navigation: feste Rasterspalten (die Knopf-Gruppe rutschte auf dem Handy in die Mittelspalte,
  sobald die Links ausgeblendet waren) und ein Tagesmodus mit dunkelgrünen Zeichen über dem
  hellen Hero-Himmel; die dunkle Leiste kommt erst nach dem Hero.

### Entfernt
- Alter v06-Hero (gezeichneter Sonnenaufgang, Dunst-Bergketten, Überschrift „Von Sonne zu
  Sonne") samt Panel mit Blob-Himmel und GPS-Mini-Runde — Runde und Kennzahlen stehen weiterhin
  im Strecken-Abschnitt mit der echten Karte. Der Hero-Bildplatz `hero-daemmerung.jpg` entfällt
  (8 statt 9 gesuchte Fotos, `media/BILDER-GESUCHT.md` angepasst).

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
