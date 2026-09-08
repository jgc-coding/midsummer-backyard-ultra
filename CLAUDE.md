# Projekt-CLAUDE.md — Midsummer Backyard Ultra Website

## Was ist das
Sechs eigenständige, award-orientierte Landingpage-Varianten für den Midsummer Backyard Ultra
Freiburg. Statische Sites, Hosting über GitHub Pages.

## Tech-Stack
- Vanilla HTML/CSS/JS, **kein Build-Schritt** (direkt von GitHub Pages servierbar).
- GSAP 3.12.5 + ScrollTrigger, Three.js 0.160.1, Leaflet 1.9.4, Lenis 1.3.26 — **lokal vendored**
  in `assets/vendor/`. Three.js wird per `<script type="importmap">` als ES-Modul eingebunden,
  Lenis als klassisches Skript (setzt `globalThis.Lenis`).
- Node nur als Tooling (`.fit`-Parser, Dev-Server). `package.json type:module`.

## Befehle
- `npm install` — installiert `fit-file-parser` (nur fürs Daten-Tooling).
- `npm run parse-fit` — `Tracking Daten Backyard.fit` → `data/route-*`.
- `npm run serve` / `node scripts/serve.mjs 4178` — lokaler Server auf Port 4178.
- Verifikation: DOM-Abfragen über den In-App-Browser (vorher per `resize_window` eine echte
  Viewport-Größe setzen), Bilder über headless Chrome
  (`--headless=new --window-size=<b>,<h> --virtual-time-budget=40000 --screenshot=<datei> <url>`).
  Chrome schreibt die Datei erst beim Beenden — den Prozess abwarten (`Start-Process -Wait`).
  Headless macht Fenster nicht schmaler als etwa 500 px; schmalere Bilder sind rechts
  beschnitten, obwohl das Layout stimmt. Beide Werkzeuge haben je eine Falle, siehe unten.

## CI / Single Source of Truth
- Farben aus `Bildmaterial/Logo.jpg` gesampelt: Creme `#F4E9D3`, Orange `#E5722A`, Amber `#F2A03A`.
  Tokens in `assets/ci.css`; jede Variante spiegelt sie in eigenen CSS-Custom-Properties.
- Version in `VERSION` (Single Source) + sichtbar im Footer jeder Seite.

## Entscheidungen
- **Variante 04 wird nicht mehr angefasst** (Gabriel, 08.09.2026). Sie bleibt als Fassung stehen,
  bekommt aber keine Korrekturen mehr — auch nicht die Kartenumstellung. Nicht erneut vorschlagen.
- Variante 06 ist die weiterentwickelte Fassung; Arbeit an der Seite findet dort statt.

## Event-Fakten (in den Seiten verwendet)
- 3. Auflage: Sa **19.06.2027, 06:00 Uhr**. Strecke: Dreisam, Hirzbergsteg ↔ Schlosssteg Ebnet.
  Der Termin steht in Variante 06 an genau einer Stelle (`EVENT_START` in `main.js`), in den
  Varianten 01–05 dagegen als fester Text im HTML plus einer eigenen `nextStart()`-Funktion je
  Variante — bei einer Terminänderung alle sieben Dateien durchgehen.
- Backyard-Regel: 6,706 km „Yard" jede Stunde; wer eine Runde nicht schafft, ist raus →
  Last Runner Standing. Erfunden von Gary „Lazarus Lake" Cantrell (2011).
- Anmeldung/CTA: `freiburg.run/event/midsummer-backyard-ultra/` + Instagram `@midsummerbackyard`.

## Konventionen
- **Nur relative Pfade** (Project-Pages liegen unter `/midsummer-backyard-ultra/` — führende `/` brechen Assets).
- Datei-Edits über das Edit/Write-Tool (UTF-8 ohne BOM), nicht per PowerShell-Bulk-Replace (Umlaute!).
- Jede Variante: `prefers-reduced-motion`-Fallback Pflicht; Mobile-Collapse je Section explizit.
- **Effekte auf schmalen Bildschirmen kleiner machen, nicht abschalten.** Ein Breakpoint, der
  Bewegung per `!mobile` ausknipst, lässt auf dem Handy nur Einblendungen übrig — und dort schaut
  die Mehrheit. Kleinerer Ausschlag (zweite Rate, z. B. `data-rate-s`), geringere Auflösung oder
  eine reine CSS-Lösung (`position: sticky`) statt Streichung. Nur wo ein Effekt am Finger
  nachweislich hakt, darf er weichen.
- Deutschsprachige UI.

## Stolperfallen
- GitHub Pages = Unterordner-Pfad: alles relativ halten, auch in JS (`fetch('../data/...')`).
- Three.js nur als `three.module.min.js` vendored — keine Addons (Bloom etc. selbst lösen, z. B. additives Blending + CSS-Glow).
- Roh-`.fit` ist personenbezogen → `.gitignore`; nur abgeleitete GeoJSON veröffentlichen.
- Leaflet braucht Kartenkacheln zur Laufzeit — Netzabhängigkeit, Fallback einplanen.
- **CARTO-Kacheln (`basemaps.cartocdn.com`) verlangen inzwischen einen API-Schlüssel** und liefern
  ohne ihn eine Hinweiskachel mit HTTP 200. Der Fehler ist also nicht am Statuscode erkennbar,
  sondern nur an der Dateigröße (~2 KB statt ~7 KB). Stattdessen `tile.openstreetmap.org`;
  für ein dunkles Layout nur die Kachelebene per CSS-Filter einfärben, damit Route, Marker und
  Quellenangabe unverändert lesbar bleiben.
- **Bei scroll-getriebenen Seiten kein `backdrop-filter` auf mitlaufenden Leisten.** Zeichnet die
  Seite permanent neu, muss der Compositor den Hintergrund in jedem Frame erneut lesen; Chrome
  friert dann ein (nachgewiesen an Variante 06). Deckende Fläche statt Weichzeichner.
- **Große Flächen nie per `filter` animieren** (etwa `brightness()` auf Karten eines Stapels) —
  jede Änderung rastert die ganze Ebene neu. Stattdessen eine Deckschicht, deren `opacity` sich
  ändert: das bleibt im Compositor.
- **Ein Schreibvorgang auf `:root` macht die Stilangaben des ganzen Dokuments ungültig.** Steht er
  in einer Scroll-Schleife vor `getBoundingClientRect()`, erzwingt jede Messung eine komplette
  Neuberechnung. Solche Schreibvorgänge ans Ende der Render-Funktion und in Stufen quantisieren.
- **Das gilt für JEDEN Schreibvorgang, nicht nur den auf `:root`.** Auch ein `classList.toggle`
  oder ein Inline-`transform` macht Messungen danach teuer. Gemessen in diesem Projekt: vier
  `getBoundingClientRect()` kosten 0,05 ms — dieselben vier nach einem Schreibvorgang 6,5 ms.
  In einer Render-Funktion deshalb ausnahmslos erst ALLE Messungen, dann alle Schreibvorgänge.
- **Keine Sichtprüfung im In-App-Browser, solange sein Bereich ausgeblendet ist.** Die Seite hat
  dann null sichtbare Fläche, `IntersectionObserver` meldet nie eine Überschneidung, und damit
  bleibt jedes `.reveal` unsichtbar und jede Überschrift undurchsichtig — das sieht aus wie ein
  kaputtes Aufblenden, ist aber nur die Messumgebung. DOM-Abfragen zu Größen und Überbreite
  stimmen trotzdem, sobald per `resize_window` eine echte Viewport-Größe gesetzt ist.
- **Headless-Chrome-Aufnahmen zeigen CSS-Übergänge nicht zu Ende gelaufen.** Ein längeres
  `--virtual-time-budget` hilft nicht; die Animationsuhr hängt nicht daran. Zeichenweise
  aufblendende Überschriften wirken darauf immer hinten abgeschnitten. Vor dem Melden eines
  solchen „Fehlers" denselben Ausschnitt aus der letzten Version rendern (`git show HEAD:<datei>`
  in einen Wegwerf-Ordner unter der Projektwurzel) — zeigt der Gegentest dasselbe, ist es das
  Rendering und keine Regression.

## Veröffentlichung
- Repo: `jgc-coding/midsummer-backyard-ultra` (public). Pages: Branch `main`, Root.
- Jede abgeschlossene Änderung: Version bumpen + CHANGELOG. Release als Git-Tag.
