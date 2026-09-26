# Weitermachen

Stand: 26.09.2026 · Version 2.2.1 · Tag `v2.2.1` · main gepusht, Seite live (geprüft) · Rückkehrpunkt `main` vor dieser Sitzung = 1c5e91b

<!-- Die einzige Commit-Nummer hier ist der Rückkehrpunkt: der Stand von main VOR dieser Sitzung.
     Den aktuellen Stand zeigt `git log`; save-state committet diese Datei erst nach dem Schreiben. -->

## Stand

**Seitentexte ohne KI-Klang (v2.2.1) sind live.** Gabriel hat 26 Textänderungen per Abhakliste
freigegeben, bei den Regeln die schlichte Überschrift „So funktioniert ein Backyard Ultra.".
Dabei behoben: „am längsten Tag des Jahres" (Sonnenwende 2027 ist der 21., das Rennen der 19. →
jetzt „längstes Wochenende"), das unbelegte Cantrell-Zitat, das unerklärte „DNF" und die falsche
Aussage „keine Platzierung". Der Schlussblock ist 660 statt 620 px breit, damit die neue
Überschrift zweizeilig bleibt. Einzelheiten im CHANGELOG unter 2.2.1; die Schreibregel steht in
der CLAUDE.md (Konventionen).

**Geprüft:** Textplatz der Regel-Karten per DOM in 12 Fenstergrößen, überall mehr Luft als
vorher; Sichtprüfung headless bei 1440 px mit geöffneten Fragen; Done-Gate grün. Nach dem Push:
Pages-Build erfolgreich, live liefert `VERSION` 2.2.1, die neuen Texte sind da, die alten weg.
Am Handy nur gemessen, nicht angesehen.

**Git:** `main` per Fast-Forward von 1c5e91b vorgerückt (brachte auch v2.2.0 aus der
Cloud-Sitzung vom 18.09. nach lokal), gepusht, lokal = GitHub. Tag `v2.2.1` gesetzt und gepusht;
v2.2.0 hat weiter keinen Tag (V10). `/Hero/` steht jetzt in der `.gitignore`, der Hauptordner ist
sauber, und der save-state-Kassensturz blockt deswegen nicht mehr.

**Aufgeräumt:** Branch `claude/improve-command-enhancements-43ad24` gelöscht (lokal, war
gemergt); die zwei alten Worktree-Ordnerhüllen sind weg; `.impeccable/` (Critique vom 10.09.)
lag nur im Worktree und ist jetzt zusätzlich im Hauptordner (dort ebenfalls ignoriert).

**Neue Befunde:** V11 (Regel-Karten bei 320 px) und V12 (Anmelde-Weg führt zu einem vergangenen
Event; freiburg.run ist nur ein Kalender und nennt weder Startgeld noch Ausschreibung).

## Aktuelle Stolperfallen

- **Die Bildrechte sind nicht geklärt, die Bilder sind trotzdem live.** Gabriel hat das am
  10.09.2026 ausdrücklich entschieden und verantwortet es. Auf `regel-yard.jpg` und
  `regel-stunde.jpg` sind fremde Teilnehmende erkennbar; die Einwilligung steht als Hub-Aufgabe.
  Kommt eine Beschwerde, ist der schnellste Rückweg, die beiden Dateien zu löschen — die Seite
  zeigt an ihrer Stelle automatisch wieder Platzhalter.
- Auf dem Pokal-Bild ist der handschriftliche Vorname auf der Wertungskarte zwischen 760 und
  980 px sichtbar, in Anzeigegröße kaum lesbar; falls es Gabriel stört, hilft ein größerer
  `--focus`-Wert bei `regel-sieger.jpg`.
- Die Hub-Karte dieses Projekts heißt **„Midsummer Backyard"** (nicht „…Website").
- Das Rohmaterial des Rennens liegt außerhalb des Repos unter
  `C:\Users\chime\Desktop\Backyard Ultra 2026\` und ist nicht versioniert.
- Im Hauptordner liegt `Hero/` (Hero-Export, seit v2.2.1 per `.gitignore` ausgenommen). Nicht
  löschen — die Hero-Ebenen stammen daraus.

## Nächste Schritte (Claude)

1. Sobald Gabriel die Hub-Fragen beantwortet: freigegebene V-Punkte umsetzen
   (Reihenfolge-Empfehlung: V3, dann V8/V10-Doku, dann Rest), angenommene Ideen als neue
   V-Punkte nach `verbesserungen.md` übernehmen, Abgelehntes dort eintragen.
2. V12 umsetzen, sobald Gabriel sagt, wo Anmeldung und Ausschreibung für 2027 liegen werden
   (oder dass es sie noch nicht gibt) — Texte und Knöpfe nach der Empfehlung in V12.
3. Meldet Gabriel vom Handy ein schlecht sitzendes Bild: nicht das Layout ändern, sondern den
   `--focus`-Wert des einen Bildes in `index.html` nachziehen und `media/BILDER.md` mitziehen
   (härtester Testfall: Fenster um 2:1). Bei Ruckel-Meldung: Diagnose nach dem Muster unter
   **Offen**, nicht raten.
4. Diesen Worktree samt Branch entfernen, sobald diese Sitzung zu ist — v2.2.1 ist in `main` und
   gepusht, `.impeccable/` liegt schon im Hauptordner, verloren ginge nichts:

   ```
   git -C "C:\Projekte\Midsummer Backyard Website" worktree remove ".claude/worktrees/improve-command-enhancements-43ad24"
   git -C "C:\Projekte\Midsummer Backyard Website" branch -d claude/backyard-summer-website-text-d53449
   ```

## Offen

- **Morph-Bildtakt auf echtem Gerät unbestätigt.** Rechnerisch und in Standbildern geprüft;
  Gabriel testet am Handy (Hub-Aufgabe). Meldet er Ruckeln: zuerst reproduzieren (Mess-Fallen in
  der CLAUDE.md!), Verdächtige wären das Inline-Transform pro Frame auf der Marke und der
  SVG-Farbfilter des Schriftzugs. Derselbe Handy-Test bestätigt auch das weiche Anker-Scrollen
  (Kernfunktion 10 der Prüfliste in `verbesserungen.md`) und den neuen Bild-Zuschnitt.
- **Bild für Regel 3 ist eine Deutung, keine Abbildung.** Der leere Uferweg steht für „Das Aus".
  Tausch-Frage liegt jetzt im Hub-Sammelpunkt.
- **Offene Befunde und Ideen aus /improve Runde 1:** V3 (Impressum/Datenschutz), V6–V10 und
  I1–I3 warten auf Gabriels Rückmeldung (Hub-Sammelpunkt). Beschreibungen ausschließlich in
  `verbesserungen.md`.
- **V11** (Regel-Karten schneiden bei 320 px unten Text ab) ist neu und wartet ebenfalls auf
  Freigabe; Beschreibung in `verbesserungen.md`.
- **V12** (Anmelde-Weg führt ins Leere) ist neu und wartet auf Gabriels Fakten zur Anmeldung 2027.

## Was Gabriel selbst tun muss

Am 19.09.2026 von der Hub-Tafel hierher gezogen. Die Tafel nimmt seither nur
noch, was Gabriel selbst eintraegt oder ausdruecklich beauftragt. Wo oben im
Text von der Hub-Karte oder einem Hub-Sammelpunkt die Rede ist, sind diese
Punkte gemeint.

- [ ] **[blockiert Claude]** Sagen, wo Anmeldung und Ausschreibung fuer 2027 liegen werden - oder dass es sie noch nicht gibt (V12) (seit 2026-09-26)
- [ ] Einwilligung fuer die zwei Bilder mit erkennbaren Teilnehmenden einholen (seit 2026-09-10)
  - regel-yard.jpg: drei Laeufer auf dem Uferweg
  - regel-stunde.jpg: die Gruppe geht auf die Runde
  - Nutzungsrecht der aufnehmenden Person mitklaeren
- [ ] Live-Seite am Handy testen und Claude Bescheid geben (4 Punkte) (seit 2026-09-10)
  - Sitzen die Fotos in den vier Regel-Karten jetzt richtig - auch in der Desktop-Ansicht?
  - Laeuft der Sonnen-Morph beim Scrollen fluessig?
  - Scrollt die Seite jetzt ueber die Streckenkarte hinweg?
  - Ab v2.2.1: Lesen sich Regeln, Fragen und Schluss gut, und ist nirgends Text abgeschnitten?
- [ ] Claude Rueckmeldung geben (4 Punkte) (seit 2026-09-10)
  - Befunde V3 + V6-V11 freigeben oder ablehnen (verbesserungen.md)
  - Ideen I1-I3: welche weiterdenken?
  - Regel-3-Bild (leerer Uferweg): tauschen oder behalten?
  - .impeccable-Ordner: lokal lassen oder ins Repo?
