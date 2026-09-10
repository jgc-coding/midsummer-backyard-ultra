# Verbesserungen

Stand: 2026-09-10 (Runde 1, Fokus: alles + design, Haltung: Anti-Baukasten
(design-taste-frontend + frontend-design), Lupen: emil-design-eng, impeccable-critique,
redesign-existing-projects)

impeccable-critique-Ergebnis dieser Runde: 32/40 („Good"), 0×P0, 2×P1 — Snapshot mit allen
Kleinbefunden unter `.impeccable/critique/2026-09-10T18-11-59Z__localhost.md`.

## Kernfunktionen (Prüfliste — jede Runde erneut abfahren)

1. **Seite lädt vollständig** — erwartet: alle Assets relativ, keine Konsolen-/Netzwerkfehler · zuletzt: läuft (2026-09-10)
2. **Hero-Morph** — erwartet: Sonne+Schriftzug schrumpfen in die Leiste, docken pixelgenau an · zuletzt: läuft (2026-09-10; Endzustand headless belegt, Zwischenzustände per DOM)
3. **Lichtreise** — erwartet: Seitengrund wandert beim Scrollen durch die Tagesfarben · zuletzt: läuft (2026-09-10, Farbinterpolation gemessen)
4. **Regel-Deck** — erwartet: Karten kleben/stapeln, Bilder sitzen auf jeder Breite (Fokuspunkte) · zuletzt: läuft (320/390/768/980/1440 gemessen, 2026-09-10)
5. **Streckenkarte** — erwartet: OSM-Kacheln + GPS-Route + 3 Marker, kein Scroll-Diebstahl · zuletzt: läuft (21/21 Kacheln, 2026-09-10)
6. **Countdown + Datum** — erwartet: alle Datumsangaben aus EVENT_START, Countdown tickt korrekt · zuletzt: läuft (281 Tage exakt nachgerechnet, 2026-09-10)
7. **Mobiles Menü** — erwartet: Burger öffnet Sheet, aria-expanded wechselt, Link schließt · zuletzt: läuft (390 px, 2026-09-10)
8. **Version + Bild-Fallback** — erwartet: Footer-Version aus VERSION; fehlendes Bild zeigt beschrifteten Platzhalter · zuletzt: läuft (2026-09-10, Fallback nachgestellt)
9. **Reduced Motion** — erwartet: alles sichtbar, nichts bewegt sich, Karten statisch gestapelt · zuletzt: läuft (headless mit --force-prefers-reduced-motion, 2026-09-10)
10. **Anker-Navigation (weiches Scrollen)** — erwartet: Klick auf Nav-Link scrollt zur Sektion · zuletzt: Code-Pfad korrekt, Sprung mit `immediate` belegt; die Animation ist in der Messumgebung nicht prüfbar (rAF-Drossel im ausgeblendeten Browser-Pane) — am echten Gerät bestätigen (deckt Gabriels Hub-Handy-Test mit ab)

## Offen

- [ ] **V1** (B) Skip-Link versetzt den Tastaturfokus nicht
      Gefahr: Wer mit der Tastatur bedient, drückt „Direkt zum Inhalt", landet mit dem
      nächsten Tab aber wieder in der Navigation — der Link ist für genau seine Zielgruppe wirkungslos.
      Beleg: `main.js:378-386` (preventDefault ohne focus()-Aufruf) · Aufwand: S
      Zusatzbeleg: Laufzeittest 2026-09-10 — Tab → Enter auf Skip-Link → nächstes Tab fokussiert
      `.nav__brand` statt Inhalt; zusätzlich kein Scroll in der Messumgebung (rAF-Artefakt, am
      Gerät scrollt es). Fix-Skizze: Ziel `tabindex="-1"` geben und nach dem Scrollen fokussieren.
- [ ] **V2** (B) Social-Vorschau unvollständig (og:image relativ, og:url und twitter:card fehlen)
      Gefahr: Beim Teilen der Seite in Messengern und Social Media erscheint kein Vorschaubild —
      ausgerechnet für eine Event-Seite, die über Instagram beworben wird.
      Beleg: `index.html:11` (og:image="assets/logo.jpg", relative URL; Parser verlangen absolute) · Aufwand: S
- [ ] **V3** (B) Impressum und Datenschutzerklärung fehlen
      Gefahr: Deutsche Event-Seite ohne Anbieterkennzeichnung; die Karte lädt zudem
      OSM-Kacheln von einem Drittserver (IP-Übertragung). Abmahn-/Bußgeldrisiko.
      Beleg: `index.html:301-327` (Footer ohne Rechts-Links), `main.js:448` (tile.openstreetmap.org) · Aufwand: M · Risiko: mittel
      Hinweis: keine Rechtsberatung — ob die Seite als geschäftsmäßig gilt, muss Gabriel
      einschätzen (Footer nennt sie „Konzept-Landingpage", bewirbt aber ein reales Event).
      Positiv: Fonts liegen lokal, kein Google-Fonts-Abfluss.
- [ ] **V4** (C) Intro-Absätze der Sektionen ohne Breitendeckel
      Gefahr: Unter 980 px läuft der Erklärtext über die volle Containerbreite — gemessen
      97 Zeichen je Zeile bei 768 px, 124 bei 980 px (Richtwert: 75). Lange Zeilen lesen sich mühsam.
      Beleg: `style.css:181` (.section-head__p ohne max-width) + `style.css:409` (einspaltig ab 980) · Aufwand: S
- [ ] **V5** (C) Regel-Bilder laden ohne loading="lazy"
      Gefahr: Alle vier Fotos (je bis 500 KB) laden sofort beim Seitenstart, obwohl sie unter
      dem sichtbaren Bereich liegen — auf Mobilfunk zahlt jeder Besucher, auch wer nie hinscrollt.
      Beleg: `index.html:144/159/174/189` (img ohne loading-Attribut); Netzwerkliste 2026-09-10:
      alle vier im Initial-Load · Aufwand: S
      Achtung bei Umsetzung: Wechselwirkung mit dem data-optional-Fallback (img.complete-Pfad in
      `main.js:353-360`) prüfen.
- [ ] **V6** (C) Karten-Routen-Fetches scheitern still
      Gefahr: Kommen die GeoJSON-Dateien nicht an, zeigt die Karte kommentarlos keine Route —
      niemand erfährt, dass etwas fehlt (Regel: nie still scheitern).
      Beleg: `main.js:458` und `main.js:476` (leere .catch) · Aufwand: S
      Mildernd: die stets sichtbare Textalternative unter der Karte beschreibt die Runde auch dann.
- [ ] **V7** (C) Chip-Label über fast jeder Sektion (Gestaltungsentscheidung nötig)
      Gefahr: „Das Format / Die Strecke / Startaufstellung / Fragen" als Mono-Label über 5 von 6
      Sektionen ist genau das wiederholte Sektions-Etikett, das die gewählte Haltung als
      Baukasten-Muster einstuft — die Überschriften tragen die Information bereits selbst.
      Beleg: `style.css:146-152` + Haltungsregel (brand.md-Ban „repeated labels as section
      grammar"; design-taste: max 1 Label je 3 Sektionen) · Aufwand: S
      Abgrenzung: Die Deck-Labels „Regel 1-4" sind eine echte Sequenz und bleiben. Der
      impeccable-Detector flaggte die Chips nicht (kein Uppercase) — das ist ein
      Haltungs-Befund, keine Messgröße; ob die Chips Markenstimme oder Schema sind,
      entscheidet Gabriel.
- [ ] **V8** (D) Doku-Drift: drei Dateien beschreiben einen alten Stand
      Gefahr: Die Projekt-CLAUDE.md wird jede Sitzung als Wahrheit geladen — ihr Tech-Stack
      nennt GSAP, ScrollTrigger, Three.js und eine importmap, die seit v2.0.0 entfernt sind;
      eine künftige Sitzung plant sonst mit Bibliotheken, die es nicht mehr gibt.
      Beleg: CLAUDE.md „Tech-Stack" vs. `assets/vendor/` (nur leaflet+lenis) und
      `index.html:329-330` (keine importmap) · Aufwand: S
      Ebenfalls veraltet: PRODUCT.md nennt „2. Auflage, 20.06.2026" als Zweck (impeccable liest
      das jede critique-Runde); `assets/ci.css` wird von keiner Seite mehr geladen, nennt
      „--event-date: 20. Juni 2026" und einen Varianten-Kommentar — anbinden oder als reines
      Referenzdokument kennzeichnen und den Termin-Token entfernen.
- [ ] **V9** (D) Toter Code aus entfernten Features
      Gefahr: Reste führen Leser und künftige Sitzungen in die Irre und blähen die Dateien auf.
      Beleg: `style.css:473-474` (.tabs/.tab — Stunden-Sektion seit v2.1.0 weg),
      `style.css:164-165` (.btn--ghost ungenutzt), `style.css:104` (Transition für nie gesetztes
      backdrop-filter), `main.js:396` (data-event-long ohne HTML-Gegenstück),
      `style.css:392` (Footer-Grid mit 4 Spuren bei 3 Kindern — rechte Spalte bleibt leer,
      Stunden-Spalte wurde entfernt) · Aufwand: S
- [ ] **V10** (D) Prozess-Hygiene: Stufe fehlt, Versions-Spiegel unbewacht, Tag hinkt
      Gefahr: Ohne Prozess-Stufe in Zeile 1-3 der CLAUDE.md ist nicht entscheidbar, ob fehlende
      Dateien Absicht sind (globale Regel 12). Der Footer-Fallback `v2.1.1` in `index.html:325`
      spiegelt VERSION ohne Wächter in `pruefen.txt`. Und Tag `v2.1.1` zeigt auf `c69dcee` —
      der Footer-Link-Fix `a951f7a` kam danach: Wer den Tag auscheckt, bekommt den kaputten
      Link, den der CHANGELOG unter 2.1.1 als behoben führt.
      Beleg: CLAUDE.md Kopf; `git rev-list -1 v2.1.1` = c69dcee, HEAD = a8be7ac · Aufwand: S

## Ideen

- **I1** (Abrundung) „Termin in den Kalender"-Knopf — Aufwand: S
      Nutzen: Der Start ist erst in 9 Monaten; wer heute begeistert ist, will sich den Termin
      merken statt sich sofort anzumelden · Bedarf: Countdown-Karte hat nur den Anmelde-Weg ·
      Abgrenzung: eine .ics-Datei aus EVENT_START (Data-URI, kein Backend), keine Kalender-API.
- **I2** (Abrundung) Scroll-Spy: aktiver Nav-Link — Aufwand: S
      Nutzen: Die Leiste zeigt beim Scrollen, in welchem Abschnitt man steht — Orientierung auf
      einer langen Erzählseite · Bedarf: 4 Anker-Links ohne Standort-Anzeige (Redesign-Audit:
      „no indication of current page") · Abgrenzung: nur aria-current + Stil, kein neues Menü.
- **I3** (Erweiterung) Höhenprofil der Runde unter der Karte — Aufwand: M
      Nutzen: „Schaffe ich das?" ist DIE Einstiegsfrage; die flache Dreisam-Runde ist ein
      Verkaufsargument, das bisher nur im Text steckt · Bedarf: `data/route-lap.json` enthält
      bereits einen ungenutzten elevation-Datensatz · Abgrenzung: statisches SVG-Profil,
      kein interaktives Chart.

Bewusst nicht vorgeschlagen: eigene 404-Seite (Landingpage ohne interne Unterseiten),
Hell/Dunkel-Umschalter (die Lichtreise IST das Farbkonzept), englische Fassung (regionale
Zielgruppe, laufender Pflegeaufwand), Instagram-Feed-Einbettung (DSGVO + Wartung).
Kleinbefunde unterhalb der Deckel (fehlendes :active-Feedback der Buttons, Sheet ohne
Übergang, „DNF" unerklärt, Geviertstrich statt Halbgeviertstrich) stehen im
impeccable-Snapshot dieser Runde.

## Abgelehnt

(noch nichts)

## Erledigt

(noch nichts)
