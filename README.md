# Midsummer Backyard Ultra Freiburg — Landingpage „Tageslauf"

Die Event-Seite zum Midsummer Backyard Ultra an der Dreisam: eine scroll-getriebene Erzählung
durch die 24 Stunden des Rennens. Der Einstieg ist ein heller Sonnenaufgang aus illustrierten
Bild-Ebenen (Sonne und Schriftzug morphen beim Scrollen in die Navigationsleiste), danach
wandert der Seitengrund durch Tag und Nacht bis zum zweiten Morgen.

Statische Site ohne Build-Schritt (`index.html`, `style.css`, `main.js`), Hosting über
GitHub Pages. GSAP-frei; eingebunden sind nur die lokal vendorten Bibliotheken Lenis
(weiches Scrollen) und Leaflet (echte Streckenkarte aus GPS-Daten).

Bis Version 1.3.0 (Git-Tag) enthielt das Repo sechs parallele Design-Varianten samt
Galerie-Startseite; seit 2.0.0 ist „Tageslauf" die einzige Fassung.

## Lokal ansehen

```
node scripts/serve.mjs 4178
```

Dann `http://localhost:4178/` öffnen. Diagnose-Parameter für Headless-Aufnahmen:
`?y=<px>` (Scroll-Zustand ohne echtes Scrollen), `?vh=<px>` (feste Hero-Höhe).

## Fotos

An Stellen ohne Foto zeigt die Seite beschriftete Platzhalter. Welche Bilder gesucht werden,
steht in [`media/BILDER-GESUCHT.md`](media/BILDER-GESUCHT.md).

## Daten

`npm run parse-fit` erzeugt aus der (nicht eingecheckten) `.fit`-Aufzeichnung die
veröffentlichten Routen-Dateien unter `data/`.
