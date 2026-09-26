# Weitermachen

Stand: 26.09.2026 · Version 2.2.1 committet, **nicht live** (live ist v2.2.0) · Rückkehrpunkt `main` = 1c5e91b

<!-- Die einzige Commit-Nummer hier ist der Rückkehrpunkt: der Stand von main VOR dieser Sitzung.
     Den aktuellen Stand zeigt `git log`; save-state committet diese Datei erst nach dem Schreiben. -->

## Stand

**Seitentexte ohne KI-Klang (v2.2.1): fertig, geprüft, committet, aber noch nicht live.** Gabriel
hat 26 Textänderungen per Abhakliste freigegeben, bei den Regeln die schlichte Überschrift
„So funktioniert ein Backyard Ultra.". Dabei behoben: „am längsten Tag des Jahres" (Sonnenwende
2027 ist der 21., das Rennen der 19. → jetzt „längstes Wochenende"), das unbelegte
Cantrell-Zitat, das unerklärte „DNF" und die falsche Aussage „keine Platzierung". Der Schlussblock
ist 660 statt 620 px breit, damit die neue Überschrift zweizeilig bleibt. Einzelheiten im
CHANGELOG unter 2.2.1; die Schreibregel steht jetzt in der CLAUDE.md (Konventionen).

**Geprüft:** Textplatz der Regel-Karten per DOM in 12 Fenstergrößen, überall mehr Luft als
vorher; Sichtprüfung headless bei 1440 px mit geöffneten Fragen; Done-Gate grün, Tags
ausgeglichen. Am Handy nur gemessen, nicht angesehen.

**Warum nicht live:** Der Kassensturz blockt Merge und Deploy, weil im Hauptordner der
unversionierte Ordner `Hero/` liegt (siehe Stolperfallen). Der Sitzungs-Branch
`claude/backyard-summer-website-text-d53449` ist 3 Commits vor `main`, Fast-Forward möglich.

**Außerdem:** v2.2.0 (vier neue Fragen-Antworten aus einer Cloud-Sitzung, 18.09.) lag nur auf
GitHub und steckt per Merge im Sitzungs-Branch. Neuer Befund V11. Aufgeräumt: Branch
`claude/improve-command-enhancements-43ad24` gelöscht (lokal, war gemergt); die zwei alten
Worktree-Ordnerhüllen sind weg; `.impeccable/` (Critique vom 10.09.) lag nur im Worktree und
ist jetzt zusätzlich im Hauptordner (dort ebenfalls von git ignoriert).

## Aktuelle Stolperfallen

- **`Hero/` blockiert save-state.** Im Hauptordner liegt der unversionierte Ordner `Hero/`
  (Hero-Export: Zip, PNG-Ebenen, Fonts, 20 Dateien). Nicht löschen, die Hero-Ebenen stammen
  daraus. Der Kassensturz wertet ihn als „Hauptordner nicht sauber" und gibt dann weder Merge
  noch Deploy frei. Lösung: `Hero/` in die `.gitignore` (wartet auf Gabriels Ja).
- **Lokaler `main` und `origin/main` sind auseinandergelaufen:** lokal fehlt 6b45ac4 (v2.2.0),
  auf GitHub fehlt 1c5e91b (weitermachen-Commit vom 19.09.). Den lokalen `main` darum nicht
  allein pushen, das wird abgelehnt. Der Fast-Forward des Sitzungs-Branches bringt beides zusammen.
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

## Nächste Schritte (Claude)

1. **Nach Gabriels Ja zum Live-Stellen:** falls freigegeben, `Hero/` im Sitzungs-Branch in die
   `.gitignore` aufnehmen und committen. Dann im Hauptordner mergen, pushen, taggen und live
   prüfen (Footer zeigt v2.2.1, neue Texte da, `gh run list --limit 1`):

   ```
   git -C "C:\Projekte\Midsummer Backyard Website" merge --ff-only claude/backyard-summer-website-text-d53449
   git -C "C:\Projekte\Midsummer Backyard Website" push origin main
   git -C "C:\Projekte\Midsummer Backyard Website" tag v2.2.1
   git -C "C:\Projekte\Midsummer Backyard Website" push origin v2.2.1
   ```

2. Sobald Gabriel die Hub-Fragen beantwortet: freigegebene V-Punkte umsetzen
   (Reihenfolge-Empfehlung: V3, dann V8/V10-Doku, dann Rest), angenommene Ideen als neue
   V-Punkte nach `verbesserungen.md` übernehmen, Abgelehntes dort eintragen.
3. Meldet Gabriel vom Handy ein schlecht sitzendes Bild: nicht das Layout ändern, sondern den
   `--focus`-Wert des einen Bildes in `index.html` nachziehen und `media/BILDER.md` mitziehen
   (härtester Testfall: Fenster um 2:1). Bei Ruckel-Meldung: Diagnose nach dem Muster unter
   **Offen**, nicht raten.
4. Diesen Worktree samt Branch entfernen, sobald v2.2.1 in `main` und gepusht ist und diese
   Sitzung zu ist. `.impeccable/` ist schon im Hauptordner, verloren ginge nichts:

   ```
   git -C "C:\Projekte\Midsummer Backyard Website" worktree remove ".claude/worktrees/improve-command-enhancements-43ad24"
   git -C "C:\Projekte\Midsummer Backyard Website" branch -d claude/backyard-summer-website-text-d53449
   ```

## Offen

- **v2.2.1 wartet auf die Freigabe zum Live-Stellen** (Branch
  `claude/backyard-summer-website-text-d53449`, blockiert durch `Hero/`, Befehle unter
  Nächste Schritte 1).
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

## Was Gabriel selbst tun muss

Am 19.09.2026 von der Hub-Tafel hierher gezogen. Die Tafel nimmt seither nur
noch, was Gabriel selbst eintraegt oder ausdruecklich beauftragt. Wo oben im
Text von der Hub-Karte oder einem Hub-Sammelpunkt die Rede ist, sind diese
Punkte gemeint.

- [ ] **[blockiert Claude]** Live-Stellen von v2.2.1 freigeben, und ob `Hero/` in die `.gitignore` darf (seit 2026-09-26)
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
