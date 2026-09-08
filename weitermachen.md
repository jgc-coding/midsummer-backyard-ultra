# Weitermachen

Stand: 08.09.2026 · Version 1.2.0 · Variante 06 inhaltlich gestrafft und auf dem Handy repariert

## Stand

Variante 06 „Tageslauf" wurde auf zwei Rückmeldungen hin überarbeitet: Auf dem Handy wirkten die
Effekte kaum, und der Inhalt war doppelt erzählt.

Auf dem Handy waren drei der vier Kerneffekte hart abgeschaltet und der vierte lief in einem
Achtel der Auflösung — übrig blieben Einblendungen. Jetzt laufen dieselben Effekte auf beiden
Geräten, auf schmalen Bildschirmen nur mit kleinerem Ausschlag. Der Kartenstapel klebt und dimmt
auch am Handy; seine Karten sind so hoch wie ihr Text und auf 78 % der Fensterhöhe gedeckelt.
Der Bergketten-Drift im Schluss ist gestrichen.

Inhaltlich sind es statt neun jetzt sieben Abschnitte. Die Kernregel stand an sieben Stellen und
steht jetzt an einer: in den vier Regelkarten. Der Prosa-Abschnitt „Das Format" davor ist entfallen,
die Galerie „Eindrücke" ebenso — ihre tragfähigen Motive stecken in der Bildstrecke „Ein Tag und
eine Nacht". Bildplätze von 17 auf 9, Seitenhöhe von 12.275 px auf 9.719 px.

## Offen

- **9 Bildplätze warten auf Fotos.** Die Seite läuft ohne sie und zeigt beschriftete Platzhalter.
  Gesuchte Motive: `variant-06-tageslauf/media/BILDER-GESUCHT.md`.
- **Variante 04 zeigt eine kaputte Karte.** CARTO verlangt inzwischen einen API-Schlüssel und
  liefert sonst nur eine Hinweiskachel — mit Statuscode 200, der Fehler fällt also nicht auf.
  Variante 06 ist auf OpenStreetMap umgestellt, Variante 04 noch nicht (wartet auf Freigabe).
- **Der Countdown steht auf null,** weil der 20.06.2026 vorbei ist. Der Termin liegt an genau
  einer Stelle: Konstante `EVENT_START` in `variant-06-tageslauf/main.js:431`. Wartet auf das
  echte Datum der nächsten Auflage. Aus demselben Grund steht der Countdown weiterhin im
  Abschnitt „Anmelden" und nicht im Hero: Er würde dort als Erstes „Dieser Termin liegt zurück"
  melden.
- **Prüfung am echten Gerät steht aus.** Verifiziert ist über einen emulierten Viewport und
  Headless-Chrome, nicht auf Gabriels Handy.

## Nächste Schritte (Claude)

1. Sobald Fotos da sind: Dateien unter den in `BILDER-GESUCHT.md` genannten Namen nach
   `variant-06-tageslauf/media/` legen. Die Platzhalter verschwinden von selbst (Klasse
   `has-photo`). Danach Dateigrößen prüfen (Ziel unter 500 KB) und einmal durchscrollen.
2. Sobald das echte Eventdatum feststeht: `EVENT_START` in `variant-06-tageslauf/main.js:431`
   setzen. **Achtung:** In den Varianten 01 bis 05 steht das Datum als fester Text im HTML und
   muss von Hand mitgezogen werden.
3. Nach Freigabe: Variante 04 auf OpenStreetMap-Kacheln umstellen — dieselbe Änderung wie in
   Variante 06 (`tileLayer`-URL plus CSS-Filter nur auf `.leaflet-tile-pane`).
4. Falls Variante 06 die gewählte Fassung wird: `.claude/pruefen.txt` anlegen, damit das
   Done-Gate im Projekt überhaupt greift.

## Aktuelle Stolperfallen

- **Es gibt keine `.claude/pruefen.txt`.** Der Stop-Hook prüft in diesem Projekt also nichts.
  „Geprüft" ist hier immer eine eigene Aussage und gehört als solche benannt.
- Die beiden Fallen zur Sichtprüfung (ausgeblendeter In-App-Browser, unfertige CSS-Übergänge in
  Headless-Aufnahmen) stehen dauerhaft in der `CLAUDE.md`. Der Befehl für eine Vollseiten-Aufnahme:

  ```
  & "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,9800 --virtual-time-budget=40000 --screenshot="ausgabe.png" "http://localhost:4178/variant-06-tageslauf/"
  ```

- **Headless-Chrome macht Fenster nicht schmaler als etwa 500 px,** und die Aufnahme ist dann
  rechts beschnitten, obwohl das Layout stimmt. Mobil deshalb mit 500 px rendern und die
  Überbreite zusätzlich im Browser messen (`documentElement.scrollWidth - window.innerWidth`).
- Chrome schreibt die Bilddatei erst nach dem Beenden. Ein `Get-ChildItem` direkt danach findet
  nichts — den Prozess mit `Start-Process -Wait -NoNewWindow` abwarten.
