# Weitermachen

Stand: 09.09.2026 · Version 2.0.0 · Tags `v1.4.0` + `v2.0.0` · main gepusht, Seite live

<!-- Hier steht bewusst keine Commit-Nummer: save-state schreibt diese Datei und committet sie
     danach, jede notierte Nummer waere also sofort eine zu alt. Der aktuelle Stand ist `git log`. -->

## Stand

Großer Tag in drei Akten.

**Hero-Retrospektive.** Gabriels Befund (ChatGPT traf den gewünschten Layer-Effekt, meine
Versuche nicht) ist aufgearbeitet: Kernfehler waren umgefärbtes Bildmaterial, Verankerung an der
dunklen Restseite statt an der hellen Referenz und stundenlange Alleingänge ohne Gabriels Blick.
Daraus wurden die drei Regeln im Abschnitt „Gestaltungsarbeit" der CLAUDE.md.

**Neuer Hero mit Morph.** Der freigegebene ChatGPT-Hero (Ordner `Hero/` im Hauptprojekt) ist
eingebaut — Bildmaterial pixelgenau übernommen, Stile ans Stilsystem der Seite angepasst, die
Abdunklung unten läuft in die Grundfarbe der Lichtreise aus. Sonne und Schriftzug starten frei
im Hero und morphen beim Scrollen in die Leiste (Andocken auf ~0,3 px verifiziert, am Anfang ist
oben links bewusst nichts). Details im CHANGELOG unter 1.4.0.

**Eine Fassung, v2.0.0.** Auf Gabriels Entscheidung ist „Tageslauf" die einzige Fassung und liegt
im Projekt-Root. Varianten 01–05, Galerie, `hero-lab/`, `DESIGN.md` und nur dort genutzte Assets
sind gelöscht; der Stand davor bleibt als Tag `v1.3.0`. Die Karten-Scrollfalle vom Handy ist
behoben (Ein-Finger-Ziehen aus). `.claude/pruefen.txt` angelegt und per `.gitignore`-Ausnahme
ins Repo geholt — das Done-Gate prüft jetzt wirklich.

Live: `https://jgc-coding.github.io/midsummer-backyard-ultra/` — das ist ab jetzt der Weg für
den Handy-Blick. Das private Artefakt (claude.ai/code/artifact/65fe4127-…) ist ein Zweitweg und
wurde zuletzt mit dem 2.0.0-Stand aktualisiert.

## Offen

- **8 Bildplätze warten auf Fotos** (Gabriel-Aufgabe im Hub; Motive: `media/BILDER-GESUCHT.md`).
- **Morph-Bildtakt auf echtem Gerät unbestätigt.** Rechnerisch und in Standbildern geprüft;
  Gabriel testet am Handy (Hub-Aufgabe). Meldet er Ruckeln: zuerst reproduzieren (Mess-Fallen in
  der CLAUDE.md!), Verdächtige wären das Inline-Transform pro Frame auf der Marke und der
  SVG-Farbfilter des Schriftzugs.

## Nächste Schritte (Claude)

1. Sobald Fotos da sind: unter den Namen aus `media/BILDER-GESUCHT.md` nach `media/` legen
   (Platzhalter verschwinden von selbst), Dateigrößen unter 500 KB prüfen, einmal durchscrollen.
2. Aufräumrest erledigen, sobald die alten Sitzungen geschlossen sind (Ordner sind aktuell von
   deren Prozessen gesperrt; Inhalte sind vollständig gemergt, es geht nur noch um leere Hüllen):

   ```
   Remove-Item -Recurse -Force "C:\Projekte\Midsummer Backyard Website\.claude\worktrees\variante-6-fortsetzen-b2e736", "C:\Projekte\Midsummer Backyard Website\.claude\worktrees\hero-section-layer-effect-affb3e"
   git -C "C:\Projekte\Midsummer Backyard Website" worktree remove ".claude/worktrees/hero-layer-effekt-203e0c"
   git -C "C:\Projekte\Midsummer Backyard Website" branch -d claude/hero-layer-effekt-203e0c
   git -C "C:\Projekte\Midsummer Backyard Website" worktree prune
   ```

3. Falls Gabriel vom Handy Ruckeln meldet: Diagnose nach dem Muster unter **Offen**, nicht raten.

## Aktuelle Stolperfallen

- **Zwei alte Worktree-Ordner liegen abgemeldet, aber unlöschbar auf der Platte** (Prozesssperre
  noch offener Claude-Sitzungen) — Befehle dafür stehen oben in Schritt 2.
- Die Hub-Karte dieses Projekts heißt **„Midsummer Backyard"** (nicht „…Website").
- Headless-Aufnahmen nur noch mit den Diagnose-Parametern `?y=`/`?vh=` — Details und die
  übrigen Mess-Fallen stehen dauerhaft in der CLAUDE.md.
- Die 404-Meldungen im Browser-Log sind die 8 fehlenden Fotos, eine je Platzhalter. Erwartet.
