# Weitermachen

Stand: 10.09.2026 · Version 2.1.2 · Tag `v2.1.2` · main gepusht, Seite live

<!-- Hier steht bewusst keine Commit-Nummer: save-state schreibt diese Datei und committet sie
     danach, jede notierte Nummer waere also sofort eine zu alt. Der aktuelle Stand ist `git log`. -->

## Stand

**Erster /improve-Lauf gefahren und vier Befunde direkt umgesetzt.** Der Lauf (Runde 1, Fokus
alles + Design mit Haltung Anti-Baukasten und drei Lupen) fand die Seite in gutem Zustand: alle
zehn Kernfunktionen grün, alle Kontraste bestanden (5,07:1 bis 10,08:1), impeccable-critique
32/40. Ergebnis sind zehn Befunde und drei Ideen — **`verbesserungen.md` ist neu und ab jetzt
die einzige Heimat der V-/I-Punkte**, diese Datei verweist nur noch auf Nummern.

**Als v2.1.2 umgesetzt und live verifiziert:** V1 (Skip-Link/Anker versetzen den Tastaturfokus),
V2 (Teilen-Vorschau: absolute og-URLs plus neues 1200×630-Vorschaubild `assets/og-vorschau.jpg`,
weil das Logo mit 124 px unter dem Parser-Minimum liegt), V4 (Intro-Absätze auf 60ch gedeckelt,
vorher bis 124 Zeichen je Zeile), V5 (Regel-Fotos laden lazy — beim Seitenstart wird keines mehr
angefordert, vorher bis 2 MB).

**Nebenbei:** Der gemergte Branch `claude/website-arbeit-b563f5` ist gelöscht, sein Worktree
abgemeldet. Die Messumgebungs-Erkenntnis (rAF-Drossel im ausgeblendeten Browser-Pane) steht
jetzt als Stolperfalle in der CLAUDE.md. `.impeccable/` (Critique-Gedächtnis von /improve)
liegt lokal und steht in der `.gitignore` — ob es ins öffentliche Repo soll, ist eine der
offenen Fragen im Hub.

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

## Nächste Schritte (Claude)

1. Sobald Gabriel die Hub-Fragen beantwortet: freigegebene V-Punkte umsetzen
   (Reihenfolge-Empfehlung: V3, dann V8/V10-Doku, dann Rest), angenommene Ideen als neue
   V-Punkte nach `verbesserungen.md` übernehmen, Abgelehntes dort eintragen.
2. Meldet Gabriel vom Handy ein schlecht sitzendes Bild: nicht das Layout ändern, sondern den
   `--focus`-Wert des einen Bildes in `index.html` nachziehen und `media/BILDER.md` mitziehen
   (härtester Testfall: Fenster um 2:1). Bei Ruckel-Meldung: Diagnose nach dem Muster unter
   **Offen**, nicht raten.
3. Diesen Worktree samt Branch entfernen, sobald diese Sitzung zu ist — der Stand ist
   vollständig in `main` und gepusht:

   ```
   git -C "C:\Projekte\Midsummer Backyard Website" worktree remove ".claude/worktrees/improve-command-enhancements-43ad24"
   git -C "C:\Projekte\Midsummer Backyard Website" branch -d claude/improve-command-enhancements-43ad24
   ```

4. Die zwei leeren, bei Git bereits abgemeldeten Worktree-Ordnerhüllen löschen — beide hält
   ein Prozess fest (10.09. zweimal vergeblich; nach einem Rechner-Neustart klappt es):

   ```
   Remove-Item -Recurse -Force "C:\Projekte\Midsummer Backyard Website\.claude\worktrees\hero-layer-effekt-203e0c", "C:\Projekte\Midsummer Backyard Website\.claude\worktrees\website-arbeit-b563f5"
   ```

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
- Im Hauptbaum liegt ein unversionierter Ordner `Hero/` mit dem Bildmaterial des Heros. Nicht
  löschen — die Hero-Ebenen stammen daraus. Er taucht in `git status` als `?? Hero/` auf; das
  ist normal und blockiert keinen Merge.
