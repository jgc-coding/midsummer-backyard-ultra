# Weitermachen

Stand: 10.09.2026 · Version 2.1.1 · Tag `v2.1.1` · main gepusht, Seite live

<!-- Hier steht bewusst keine Commit-Nummer: save-state schreibt diese Datei und committet sie
     danach, jede notierte Nummer waere also sofort eine zu alt. Der aktuelle Stand ist `git log`. -->

## Stand

Die Regel-Bilder sitzen jetzt auf jeder Bildschirmbreite richtig.

**Der Befund kam von Gabriels Handy:** Die Fotos zeigten je nach Auflösung einen anderen
Ausschnitt, meist den falschen — in der Desktop-Ansicht am Handy waren fast alle Köpfe ab. Die
Messung im Browser erklärte es: Alle vier Dateien sind 4:5 hochkant, der Bildplatz der Karte
wechselte sein Seitenverhältnis aber zwischen 0,78:1 und **4,66:1**, und `object-fit: cover`
schneidet dabei immer mittig — dort steht bei diesen Aufnahmen nichts Wichtiges.

**Drei Ursachen, drei Änderungen** (v2.1.1, Commit `c69dcee`): Jedes Bild trägt einen Fokuspunkt
(`--focus` am `<img>`, Werte am Bild abgelesen und in `media/BILDER.md` begründet). Das Bildband
der Handy-Ansicht ist nicht mehr starr 165/190 px hoch, sondern wächst mit der Breite und weicht
zurück, wenn der Bildschirm niedrig ist. Und der Umbruch der Regel-Karten liegt bei **760 px
statt 980** — genau 980 px stellt Chrome am Handy ein, wenn man „Desktop-Website" wählt, das war
der schlechteste Punkt der ganzen Kurve. Sichtbare Bildhöhe: Handy 54 statt 37 Prozent,
Desktop-Ansicht am Handy 100 statt 17.

**Nebenbefund mitbehoben:** Im Querformat (844 × 390) deckelte `78vh` die Karte unter ihren
Textbedarf — der letzte Absatz fiel weg. Die Kartenhöhe ist jetzt
`max(400px, min(580px, 100vh - 130px))`.

**Footer-Link repariert** (Commit `a951f7a`): Er zeigte auf `https://www.jgc-lumen.de`, deren
Zertifikat nur `jgc-lumen.de` ohne „www" abdeckt — Besucher landeten in einer Sicherheitswarnung.
Jetzt ohne „www". Die übrigen externen Links (freiburg.run, Instagram, Strava) sind geprüft und
in Ordnung. Dass die www-Fassung beim Hoster nachgezogen werden sollte, liegt als Aufgabe auf der
Hub-Karte **Website** — das betrifft die Lumen-Seite, nicht dieses Projekt.

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
- **Der neue Bild-Zuschnitt ist am echten Gerät noch nicht bestätigt.** Gemessen und in
  Standbildern geprüft bei 375, 390, 768, 844 × 390, 980, 1440 × 700 und 1440 × 900; Gabriel
  kontrolliert am Handy (Hub-Aufgabe).

## Nächste Schritte (Claude)

1. Meldet Gabriel, dass ein Bild immer noch schlecht sitzt: **nicht das Layout ändern**, sondern
   den Fokuswert dieses einen Bildes in `index.html` nachziehen (`style="--focus: 50% Y%"` am
   `<img>`, kleinerer Wert = zeigt weiter oben) und `media/BILDER.md` mitziehen. Der härteste
   Testfall ist ein Fenster von etwa 2:1.
2. Wenn Gabriel vom Handy Ruckeln meldet: Diagnose nach dem Muster unter **Offen**, nicht raten.
3. Alten Worktree-Rest entfernen. Der Ordner ist nachweislich leer und bei Git abgemeldet, aber
   ein Prozess hält ihn — am 10.09.2026 erneut vergeblich versucht:

   ```
   Remove-Item -Recurse -Force "C:\Projekte\Midsummer Backyard Website\.claude\worktrees\hero-layer-effekt-203e0c"
   ```

4. Diesen Worktree (`website-arbeit-b563f5`) samt Branch entfernen, sobald diese Sitzung zu ist —
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
- Auf dem Pokal-Bild ist der handschriftliche Vorname auf der Wertungskarte seit v2.1.1 auch
  zwischen 760 und 980 px sichtbar (vorher nur auf großen Bildschirmen). In Anzeigegröße kaum
  lesbar; falls Gabriel es stört, hilft ein größerer `--focus`-Wert bei `regel-sieger.jpg`.
- Ein alter Worktree-Ordner liegt abgemeldet, aber gesperrt auf der Platte — Befehl oben in
  Schritt 3.
- Die Hub-Karte dieses Projekts heißt **„Midsummer Backyard"** (nicht „…Website").
- Das Rohmaterial des Rennens liegt außerhalb des Repos unter
  `C:\Users\chime\Desktop\Backyard Ultra 2026\` und ist nicht versioniert.
- Im Hauptbaum liegt ein unversionierter Ordner `Hero/` mit dem Bildmaterial des Heros. Nicht
  löschen — die Hero-Ebenen stammen daraus. Er taucht in `git status` als `?? Hero/` auf; das ist
  normal und blockiert keinen Merge.
