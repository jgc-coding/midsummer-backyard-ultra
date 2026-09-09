# Projekt-CLAUDE.md — Midsummer Backyard Ultra Website

## Was ist das
Die Landingpage „Tageslauf" für den Midsummer Backyard Ultra Freiburg — eine scroll-getriebene
Erzählung durch die 24 Stunden des Rennens, direkt im Projekt-Root. Statische Site ohne
Build-Schritt, Hosting über GitHub Pages.

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
- Done-Gate: `.claude/pruefen.txt` (JS-Syntax, VERSION-Format) — liegt per `.gitignore`-Ausnahme im Repo.
- Verifikation: DOM-Abfragen über den In-App-Browser (vorher per `resize_window` eine echte
  Viewport-Größe setzen), Bilder über headless Chrome
  (`--headless=new --window-size=<b>,<h> --virtual-time-budget=40000 --screenshot=<datei> <url>`).
  Chrome schreibt die Datei erst beim Beenden — den Prozess abwarten (`Start-Process -Wait`).
  Headless macht Fenster nicht schmaler als etwa 500 px; schmalere Bilder sind rechts
  beschnitten, obwohl das Layout stimmt. Beide Werkzeuge haben je eine Falle, siehe unten.

## CI / Single Source of Truth
- Farben aus `Bildmaterial/Logo.jpg` gesampelt: Creme `#F4E9D3`, Orange `#E5722A`, Amber `#F2A03A`.
  Tokens in `assets/ci.css`; `style.css` spiegelt sie in eigenen CSS-Custom-Properties.
- Version in `VERSION` (Single Source) + sichtbar im Footer jeder Seite.

## Entscheidungen
- **Es gibt nur noch eine Fassung** (Gabriel, 09.09.2026): die frühere Variante 06 „Tageslauf",
  seither im Projekt-Root. Die Varianten 01–05, die Galerie-Startseite und das `hero-lab/` sind
  gelöscht; der letzte Stand mit allen sechs Fassungen bleibt über den Git-Tag `v1.3.0` abrufbar.

## Event-Fakten (in den Seiten verwendet)
- 3. Auflage: Sa **19.06.2027, 06:00 Uhr**. Strecke: Dreisam, Hirzbergsteg ↔ Schlosssteg Ebnet.
  Der Termin steht an genau einer Stelle: `EVENT_START` in `main.js`; alle sichtbaren
  Datumsangaben und der Countdown leiten sich daraus ab (nur `<meta>`-Texte im `<head>`
  nennen ihn zusätzlich als festen Text).
- Backyard-Regel: 6,706 km „Yard" jede Stunde; wer eine Runde nicht schafft, ist raus →
  Last Runner Standing. Erfunden von Gary „Lazarus Lake" Cantrell (2011).
- Anmeldung/CTA: `freiburg.run/event/midsummer-backyard-ultra/` + Instagram `@midsummerbackyard`.

## Gestaltungsarbeit (Lehre aus der Hero-Retrospektive, 09/2026)
- **Geliefertes Bildmaterial ist Endzustand, kein Rohstoff.** Pixelgenau übernehmen, nur
  verlustfrei skalieren/komprimieren; jede Farb-, Licht- oder Zuschnitt-Änderung braucht vorher
  Gabriels Ja. Der Ebenen-Look entsteht durch Anordnung und Bewegung, nicht durch Umfärben.
- **Referenzseite: Stimmung vor Mechanik.** Vor dem Bauen die Referenz scrollend ansehen und den
  Look in fünf Sätzen festhalten (Licht, Farben, was bewegt sich wie stark). Helligkeit und
  Stimmung der Referenz wiegen schwerer als das dunkle Thema der restlichen Seite — Übergänge
  löst ein Verlauf am Sectionsrand, nicht das Abdunkeln des Motivs.
- **Richtungs-Gate:** Bei Geschmacksarbeit nach spätestens 45 Minuten ein statisches Standbild
  liefern und die Richtung freigeben lassen; erst danach Bewegung und Feinbau. Abnahmeprüfung
  vor jeder Abgabe: eigener Screenshot NEBEN der Referenz — gleiche Familie?

## Konventionen
- **Nur relative Pfade** (Project-Pages liegen unter `/midsummer-backyard-ultra/` — führende `/` brechen Assets).
- Datei-Edits über das Edit/Write-Tool (UTF-8 ohne BOM), nicht per PowerShell-Bulk-Replace (Umlaute!).
- `prefers-reduced-motion`-Fallback ist Pflicht; Mobile-Collapse je Section explizit.
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
- **Eingebettete Karten dürfen die Scroll-Geste nicht fangen:** Ein-Finger-Ziehen am Touch-Gerät
  aus (`dragging: !L.Browser.mobile`), Mausrad-Zoom erst nach Klick (Gabriels Handy-Befund 09/2026).
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
- **Headless-Aufnahmen dieser Seite brauchen die Diagnose-Parameter aus `main.js`:** `?vh=900`
  für Vollseiten-Aufnahmen (der 100svh-Hero würde sonst so hoch wie das 9600er-Fenster und schöbe
  die Seite aus dem Bild) und `?y=<px>` für Scroll-Zustände — echtes Scrollen erzeugt in
  Aufnahmen ein schwarzes Band mit eingefrorenen fixen Elementen, der Parameter rendert den
  Zustand darum, ohne zu scrollen.
- **Headless-Chrome-Aufnahmen zeigen CSS-Übergänge nicht zu Ende gelaufen.** Ein längeres
  `--virtual-time-budget` hilft nicht; die Animationsuhr hängt nicht daran. Zeichenweise
  aufblendende Überschriften wirken darauf immer hinten abgeschnitten. Vor dem Melden eines
  solchen „Fehlers" denselben Ausschnitt aus der letzten Version rendern (`git show HEAD:<datei>`
  in einen Wegwerf-Ordner unter der Projektwurzel) — zeigt der Gegentest dasselbe, ist es das
  Rendering und keine Regression.

## Veröffentlichung
- Repo: `jgc-coding/midsummer-backyard-ultra` (public). Pages: Branch `main`, Root.
- Jede abgeschlossene Änderung: Version bumpen + CHANGELOG. Release als Git-Tag.
