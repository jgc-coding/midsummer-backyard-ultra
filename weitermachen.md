# Weitermachen

Stand: 08.09.2026 · Version 1.3.0 · Tag `v1.3.0` · alles gepusht, Seite live

<!-- Hier steht bewusst keine Commit-Nummer: save-state schreibt diese Datei und committet sie
     danach, jede notierte Nummer waere also sofort eine zu alt. Der aktuelle Stand ist `git log`. -->


## Stand

Drei Rückmeldungen von Gabriel sind umgesetzt.

**Termin.** Die 3. Auflage startet am Samstag, 19.06.2027 um 06:00 Uhr. Das steckt jetzt in allen
sechs Varianten und der Galerie-Startseite. Der Countdown in Variante 06 läuft wieder.

**Hero.** Neu aufgebaut, in der Anlage an fora.so: alles mittig, ein Knopf, darunter ein leiser
zweiter Weg, dann das Panel, das der Hero unten hart abschneidet. Der Himmel ist ein
Sonnenaufgang in CI-Farben — die Lichtreise beginnt nicht mehr in der Nacht, sondern um 06:00 Uhr
beim Start. Der Rest der Seite bleibt dunkel. Die Bergketten sind Dunst statt Scherenschnitt:
obere Kante per Maske ausgeblendet, Weichzeichner, nach hinten hin blasser. Fora selbst löst das
mit zwei großen Fotos — das war nicht übernehmbar, der Effekt ist mit eigenen Mitteln nachgebaut.

**Ausrüstungsliste.** Steckt jetzt als Antwort in den Fragen, mit dem Hinweis, dass sie ein
Vorschlag und nicht vollständig ist. Der Anmelde-Abschnitt zeigt dadurch Countdown und
Anmelde-Karte nebeneinander statt einer halb leeren Reihe.

Nebenbei gefunden und behoben: In `render()` standen Schreibvorgänge vor den Messungen — dieselbe
Falle wie beim `:root`-Schreiben, nur eine Ebene höher. Steht jetzt als Regel in der `CLAUDE.md`.

Der Stand ist veröffentlicht. GitHub Pages hat nach etwa 30 Sekunden neu gebaut; live geprüft sind
Version, Datum, Auflagen-Nummer, die Ausrüstungsliste in den Fragen und der zentrierte Hero.

## Offen

- **9 Bildplätze warten auf Fotos.** Die Seite läuft ohne sie und zeigt beschriftete Platzhalter.
  Gesuchte Motive: `variant-06-tageslauf/media/BILDER-GESUCHT.md`. (Gabriel-Aufgabe, liegt im Hub.)
- **Blocker für eine belastbare Abnahme:** Geprüft ist über einen emulierten Viewport und
  Headless-Chrome, nicht auf einem echten Gerät.
- **Der Bildtakt ist nicht gemessen.** Die Bergketten haben jetzt einen festen Weichzeichner.
  Das sollte den Compositor nicht belasten, weil nur `transform` animiert wird — nachgewiesen ist
  es nicht, weil `requestAnimationFrame` im ausgeblendeten Browser-Bereich nicht läuft. Falls das
  Scrollen auf dem Handy ruckelt, ist der Weichzeichner der erste Verdächtige.

## Nächste Schritte (Claude)

1. Sobald Fotos da sind: Dateien unter den in `BILDER-GESUCHT.md` genannten Namen nach
   `variant-06-tageslauf/media/` legen. Die Platzhalter verschwinden von selbst (Klasse
   `has-photo`). Danach Dateigrößen prüfen (Ziel unter 500 KB) und einmal durchscrollen.
2. Falls Variante 06 die gewählte Fassung wird: `.claude/pruefen.txt` anlegen, damit das
   Done-Gate im Projekt überhaupt greift.
3. Falls Gabriel am Handy etwas auffällt: zuerst reproduzieren, nicht raten — die beiden
   Mess-Fallen unten machen Fehlbefunde in diesem Projekt sehr wahrscheinlich.

## Aktuelle Stolperfallen

- **Es gibt keine `.claude/pruefen.txt`.** Der Stop-Hook prüft in diesem Projekt also nichts.
  „Geprüft" ist hier immer eine eigene Aussage und gehört als solche benannt.
- Die beiden Fallen zur Sichtprüfung (ausgeblendeter In-App-Browser, unfertige CSS-Übergänge in
  Headless-Aufnahmen) stehen dauerhaft in der `CLAUDE.md`. Befehl für eine Vollseiten-Aufnahme,
  nachdem `node scripts/serve.mjs 4178` läuft:

  ```
  & "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,9600 --virtual-time-budget=40000 --screenshot="ausgabe.png" "http://localhost:4178/variant-06-tageslauf/"
  ```

- **Headless-Chrome macht Fenster nicht schmaler als etwa 500 px,** und die Aufnahme ist dann
  rechts beschnitten, obwohl das Layout stimmt. Mobil deshalb mit 500 px rendern und die
  Überbreite zusätzlich im Browser messen (`documentElement.scrollWidth - window.innerWidth`).
- Chrome schreibt die Bilddatei erst nach dem Beenden — den Prozess mit
  `Start-Process -Wait -NoNewWindow` abwarten.
- Die 404-Meldungen im Browser-Log sind die fehlenden Fotos, eine je Platzhalter. Erwartetes
  Verhalten, kein Fehler.
