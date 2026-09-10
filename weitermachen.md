# Weitermachen

Stand: 10.09.2026 · Version 2.1.0 · Tag `v2.1.0` · main gepusht, Seite live

<!-- Hier steht bewusst keine Commit-Nummer: save-state schreibt diese Datei und committet sie
     danach, jede notierte Nummer waere also sofort eine zu alt. Der aktuelle Stand ist `git log`. -->

## Stand

Die Seite hat zum ersten Mal echte Bilder vom Rennen.

**Material gesichtet.** Gabriel lieferte den Ordner `C:\Users\chime\Desktop\Backyard Ultra 2026\`
mit dem kompletten Material der 2. Auflage: siebzehn Handy-Videos vom Renntag, Einzelfotos,
Streckenaufnahmen und zwei fertig geschnittene Filme. Der entscheidende Befund beim Sichten: das
Material endet um 18:00 Uhr nach zwölf Runden, es gibt **keine einzige Nachtaufnahme**. Alles ist
hochkant gefilmt.

**Sektion „Ein Tag und eine Nacht" entfernt.** Sie versprach vier Tageszeiten im Bild, für die
Hälfte davon gab es kein Material. Statt die Lücke zu füllen, ist sie auf Gabriels Entscheidung
weg — samt Tab-Karussell, Stilen und den Navigationspunkten „Stunden".

**Vier Regel-Karten bebildert.** Zwei Bilder von Gabriel (Läufer auf dem Uferweg an der Dreisam
bei Regel 1, Siegerpokal mit der Gravur „Only survivor" bei Regel 4), zwei aus dem Videomaterial
gezogen (die Gruppe geht gemeinsam auf die Runde bei Regel 2, der leere Uferweg bei Regel 3 —
der Weg, der ohne dich weitergeht). Vorgabe war: Gruppen statt Einzelpersonen, kein privates
Camp. Herkunft und Rechtestand jeder Datei stehen in `media/BILDER.md`.

**Footer** trägt jetzt „Website erstellt von JGC Lumen" mit Link auf `www.jgc-lumen.de`.

Live: `https://jgc-coding.github.io/midsummer-backyard-ultra/` — der Weg für den Handy-Blick.
Das private Artefakt (claude.ai/code/artifact/65fe4127-…) ist ein Zweitweg und steht noch auf
dem 2.0.0-Stand.

## Offen

- **Morph-Bildtakt auf echtem Gerät unbestätigt.** Rechnerisch und in Standbildern geprüft;
  Gabriel testet am Handy (Hub-Aufgabe). Meldet er Ruckeln: zuerst reproduzieren (Mess-Fallen in
  der CLAUDE.md!), Verdächtige wären das Inline-Transform pro Frame auf der Marke und der
  SVG-Farbfilter des Schriftzugs.
- **Bild für Regel 3 ist eine Deutung, keine Abbildung.** Der leere Uferweg steht für „Das Aus",
  weil es im Material kein Bild von jemandem gibt, der aufhört — ohne Gabriels privates Camp zu
  zeigen. Angebot zum Tausch steht; Gabriel hat sich dazu noch nicht geäußert.

## Nächste Schritte (Claude)

1. Wenn Gabriel vom Handy Ruckeln meldet: Diagnose nach dem Muster unter **Offen**, nicht raten.
2. Letzten Worktree-Rest entfernen, sobald die Sitzung geschlossen ist, die ihn sperrt. Die
   Git-Registrierung ist schon weg, es geht nur noch um den leeren Ordner:

   ```
   Remove-Item -Recurse -Force "C:\Projekte\Midsummer Backyard Website\.claude\worktrees\hero-layer-effekt-203e0c"
   ```

3. Diesen Worktree (`website-arbeit-b563f5`) samt Branch entfernen, sobald diese Sitzung zu ist —
   der Stand ist vollständig in `main` und gepusht:

   ```
   git -C "C:\Projekte\Midsummer Backyard Website" worktree remove ".claude/worktrees/website-arbeit-b563f5"
   git -C "C:\Projekte\Midsummer Backyard Website" branch -d claude/website-arbeit-b563f5
   ```

## Aktuelle Stolperfallen

- **Die Bildrechte sind nicht geklärt, die Bilder sind trotzdem live.** Gabriel hat das am
  10.09.2026 ausdrücklich entschieden und verantwortet es. Auf `regel-yard.jpg` und
  `regel-stunde.jpg` sind fremde Teilnehmende erkennbar; die Einwilligung steht als Hub-Aufgabe.
  Kommt eine Beschwerde, ist der schnellste Rückweg, die beiden Dateien zu löschen — die Seite
  zeigt an ihrer Stelle automatisch wieder Platzhalter.
- Ein alter Worktree-Ordner liegt abgemeldet, aber gesperrt auf der Platte — Befehl oben in
  Schritt 2.
- Die Hub-Karte dieses Projekts heißt **„Midsummer Backyard"** (nicht „…Website").
- Das Rohmaterial des Rennens liegt außerhalb des Repos unter
  `C:\Users\chime\Desktop\Backyard Ultra 2026\` und ist nicht versioniert.
- Im Hauptbaum liegt ein unversionierter Ordner `Hero/` mit dem Bildmaterial des Heros. Nicht
  löschen — die Hero-Ebenen stammen daraus.
