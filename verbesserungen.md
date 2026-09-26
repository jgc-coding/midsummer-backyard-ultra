# Verbesserungen

Stand: 2026-09-10 (Runde 1, Fokus: alles + design, Haltung: Anti-Baukasten
(design-taste-frontend + frontend-design), Lupen: emil-design-eng, impeccable-critique,
redesign-existing-projects)

impeccable-critique-Ergebnis dieser Runde: 32/40 („Good"), 0×P0, 2×P1 — Snapshot mit allen
Kleinbefunden unter `.impeccable/critique/2026-09-10T18-11-59Z__localhost.md`.

## Kernfunktionen (Prüfliste — jede Runde erneut abfahren)

1. **Seite lädt vollständig** — erwartet: alle Assets relativ, keine Konsolen-/Netzwerkfehler · zuletzt: läuft (2026-09-26, alle Anfragen 200, Konsole leer)
2. **Hero-Morph** — erwartet: Sonne+Schriftzug schrumpfen in die Leiste, docken pixelgenau an · zuletzt: läuft (2026-09-26; Zwischenzustände `?y=300`/`?y=430` headless gegen v2.2.1 verglichen, nur die Buchstabenränder unterscheiden sich)
3. **Lichtreise** — erwartet: Seitengrund wandert beim Scrollen durch die Tagesfarben · zuletzt: läuft (2026-09-26, `--ground` bei 0/50/85 % gemessen; Strecke und Fragen liegen seit v2.3.0 fest auf `--ground-warm` und laufen an den Rändern in diesen Grund aus)
4. **Regel-Deck** — erwartet: Karten kleben/stapeln, Bilder sitzen auf jeder Breite (Fokuspunkte), kein Text abgeschnitten · zuletzt: läuft, außer bei 320 × 568 (→ V11; Textplatz in 12 Fenstergrößen gemessen, 2026-09-26; bei 390 × 844 erneut geprüft für v2.3.0)
5. **Streckenkarte** — erwartet: OSM-Kacheln + GPS-Route + 3 Marker, kein Scroll-Diebstahl · zuletzt: läuft (2026-09-26: 18/18 Kacheln, 2 Linien, 3 Marker, 2 Beschriftungen)
6. **Countdown + Datum** — erwartet: alle Datumsangaben aus EVENT_START, Countdown tickt korrekt · zuletzt: läuft (tickt, 2026-09-26; 281 Tage exakt nachgerechnet am 2026-09-10)
7. **Mobiles Menü** — erwartet: Burger öffnet Sheet, aria-expanded wechselt, Link schließt · zuletzt: öffnet und schließt (390 px, 2026-09-26), aber aria-expanded bleibt nach Link-Klick auf „true" (→ V16)
8. **Version + Bild-Fallback** — erwartet: Footer-Version aus VERSION; fehlendes Bild zeigt beschrifteten Platzhalter · zuletzt: Version läuft (v2.3.0, 2026-09-26); Fallback unverändert, zuletzt nachgestellt 2026-09-10
9. **Reduced Motion** — erwartet: alles sichtbar, nichts bewegt sich, Karten statisch gestapelt · zuletzt: läuft (headless mit --force-prefers-reduced-motion, 1440 und 600 px, 2026-09-26)
10. **Anker-Navigation (weiches Scrollen)** — erwartet: Klick auf Nav-Link scrollt zur Sektion · zuletzt: Code-Pfad korrekt, Sprung mit `immediate` belegt; die Animation ist in der Messumgebung nicht prüfbar (rAF-Drossel im ausgeblendeten Browser-Pane) — am echten Gerät bestätigen (deckt Gabriels Hub-Handy-Test mit ab)

## Offen

- [ ] **V3** (B) Impressum und Datenschutzerklärung fehlen
      Gefahr: Deutsche Event-Seite ohne Anbieterkennzeichnung; die Karte lädt zudem
      OSM-Kacheln von einem Drittserver (IP-Übertragung). Abmahn-/Bußgeldrisiko.
      Beleg: `index.html:301-327` (Footer ohne Rechts-Links), `main.js:448` (tile.openstreetmap.org) · Aufwand: M · Risiko: mittel
      Hinweis: keine Rechtsberatung — ob die Seite als geschäftsmäßig gilt, muss Gabriel
      einschätzen (Footer nennt sie „Konzept-Landingpage", bewirbt aber ein reales Event).
      Positiv: Fonts liegen lokal, kein Google-Fonts-Abfluss.
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
      Seit v2.2.2 dazu: `assets/hero/schriftzug-sonne.webp` (333 KB) wird nicht mehr geladen,
      der freigestellte `schriftzug.webp` ersetzt ihn. Löschen braucht Gabriels Ja; die Quelle
      liegt ohnehin in `Bildmaterial/`.
- [ ] **V10** (D) Prozess-Hygiene: Stufe fehlt, Versions-Spiegel unbewacht, Tag hinkt
      Gefahr: Ohne Prozess-Stufe in Zeile 1-3 der CLAUDE.md ist nicht entscheidbar, ob fehlende
      Dateien Absicht sind (globale Regel 12). Der Footer-Fallback `v2.1.1` in `index.html:325`
      spiegelt VERSION ohne Wächter in `pruefen.txt`. Und Tag `v2.1.1` zeigt auf `c69dcee` —
      der Footer-Link-Fix `a951f7a` kam danach: Wer den Tag auscheckt, bekommt den kaputten
      Link, den der CHANGELOG unter 2.1.1 als behoben führt.
      Beleg: CLAUDE.md Kopf; `git rev-list -1 v2.1.1` = c69dcee, HEAD = a8be7ac · Aufwand: S
      Erneut belegt (2026-09-26): v2.2.0 aus einer Cloud-Sitzung ließ den Footer-Fallback auf
      v2.1.2 stehen und wurde nie getaggt (Tags enden bei v2.1.2); den Fallback hat v2.2.1 nachgezogen.
- [ ] **V11** (C) Regel-Karten schneiden auf sehr kleinen Handys unten Text ab (gefunden 2026-09-26)
      Gefahr: Bei 320 × 568 (iPhone SE der ersten Generation, ebenso Handys mit vergrößerter
      Anzeige) fehlt in drei von vier Karten die Schlusszeile ganz oder halb — wer so ein Gerät
      hat, liest den Merksatz der Regel nicht. Lag schon vor v2.2.1 vor, dort sogar stärker.
      Beleg: DOM-Messung v2.2.1: Schlusszeile ragt 20/−/20/45 px unter den Kartenrand (v2.2.0:
      21/21/96/96); Ursache `style.css` 760er-Umbruch `.deck { max-height: 78vh }` = 443 px ·
      Aufwand: S
      Empfehlung: unter ~360 px Breite den Deckel aufheben — die Karte klebt dann nicht mehr,
      zeigt aber den ganzen Text. Das deckt sich mit der Regel im `.deck`-Kommentar
      („abgeschnittener Text ist schlimmer als eine Karte, die ausnahmsweise nicht klebt").
- [ ] **V12** (B) Der Anmelde-Weg der Seite führt ins Leere (gefunden 2026-09-26, Link-Check vor v2.2.1)
      Gefahr: Wer sich für 2027 anmelden will, landet über jeden Anmelde-Knopf bei einem
      Kalendereintrag, der das Rennen als „Vergangenes Event" vom 20.06.2026 zeigt. Dazu schickt
      die Seite Leser an vier Stellen zu Startgeld, Meldeschluss, Teilnahmebedingungen oder „der
      Ausschreibung auf freiburg.run" — dort steht nichts davon.
      Beleg: freiburg.run ist ein Veranstaltungskalender (Florian Pigorsch), kein Veranstalter-
      Portal; der Eintrag verlinkt nur das Anmeldeformular 2026 (Google Forms), Instagram und
      einen BZ-Artikel. Die Instagram-Bio nennt ebenfalls noch den 20.06.2026. Textstellen in
      `index.html`: Anmelde-Karte („Im Zweifel gilt, was dort steht" aus v2.2.1 erbt das Problem),
      Fragen-Einleitung, Mitbringen-Einleitung, Antwort „Kann ich zuschauen?"; dazu fünf Knöpfe
      und Links auf freiburg.run · Aufwand: S für den Text, braucht aber Gabriels Fakten
      Empfehlung: Bis es eine Anmeldung für 2027 gibt, ehrlich schreiben („Die Anmeldung für 2027
      öffnet später, Neuigkeiten auf Instagram") und die Knöpfe auf Instagram lenken; sobald das
      Formular steht, direkt dorthin verlinken. War vor v2.2.1 genauso, wurde nicht schlechter.
- [ ] **V16** (C) Menü-Knopf meldet nach einem Link-Klick weiter „offen" (gefunden 2026-09-26, Regressionscheck v2.3.0)
      Gefahr: Wer mit Screenreader über das Handy-Menü springt, hört danach am Knopf „Menü
      schließen, erweitert", obwohl das Menü zu ist — er weiß nicht, in welchem Zustand es ist.
      Die Optik stimmt, nur die Ansage nicht.
      Beleg: `main.js:372` entfernt beim Link-Klick nur `is-open`; `aria-expanded` und
      `aria-label` des Knopfs bleiben stehen (DOM-Messung bei 390 × 844) · Aufwand: S
      Empfehlung: dort dieselben zwei Attribute zurücksetzen wie beim Schließen per Knopf.

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
Übergang) stehen im impeccable-Snapshot dieser Runde. Zwei weitere von dort („DNF"
unerklärt, Geviertstriche im Fließtext) sind mit dem Text-Umbau in v2.2.1 erledigt.

## Abgelehnt

(noch nichts)

## Erledigt

- **V1** Skip-Link/Anker-Klicks versetzen den Tastaturfokus aufs Sprungziel — erledigt in v2.1.2
- **V2** Social-Vorschau: absolute og-URLs, og:url/twitter:card, neues 1200×630-Vorschaubild
  `assets/og-vorschau.jpg` (das alte og:image-Logo war mit 124×124 px unter dem Parser-Minimum;
  Vorschaubild trägt den Termin als Pixeltext — bei Terminwechsel neu erzeugen, Anleitung im
  index.html-Kommentar) — erledigt in v2.1.2
- **V4** Intro-Absätze auf 60ch gedeckelt (vorher 97–124 Zeichen je Zeile bei 768–980 px) — erledigt in v2.1.2
- **V5** Regel-Bilder mit loading="lazy" + decoding="async"; Platzhalter-Fallback geprüft — erledigt in v2.1.2
- **V13** Grauer, gestrichelter Rand um den Hero-Schriftzug: Schriftzug einmal sauber
  freigestellt statt Laufzeit-Farbfilter, Teilen-Vorschaubild neu — erledigt in v2.2.2
- **V15** Seite für Suchmaschinen gesperrt (`noindex`), bis die Veranstalter zusagen —
  erledigt in v2.2.2
- **V14** Alle Abschnitte waren gleich schwarz: Strecke und Fragen liegen jetzt auf gedecktem
  Orange (`--ground-warm`, zarteste von drei Stärken, per Standbild gewählt) — erledigt in v2.3.0
