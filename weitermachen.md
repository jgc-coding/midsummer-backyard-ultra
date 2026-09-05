# Weitermachen

Stand: 05.09.2026 · Version 1.1.0 · Tag `v1.1.0` · `main` = `48fbed6`

## Stand

Variante 06 „Tageslauf" ist gebaut, gemergt und live: <https://jgc-coding.github.io/midsummer-backyard-ultra/variant-06-tageslauf/>.
Vorlage war `aiautomationsociety.ai`; übernommen wurden Aufbau und Effekt-Vokabular, bewusst
nicht die Optik. Der rote Faden ist eine Lichtreise: Der Seitengrund wandert beim Scrollen
durch die 24 Stunden des Rennens, alle Bewegungen leiten sich aus einer einzigen Scroll-Zahl ab.
Neu vendored ist Lenis 1.3.26 (MIT) unter `assets/vendor/lenis/`.

Drei Leistungsprobleme wurden dabei gefunden und behoben (Weichzeichner hinter der Leiste,
`filter` auf den Stapelkarten, Farbschreibvorgänge vor den Layout-Messungen); alle drei stehen
jetzt als dauerhafte Stolperfallen in der `CLAUDE.md`. Die Kontraste der kleinen Beschriftungen
lagen bei 3,5:1 bzw. 1,9:1 und sind auf WCAG AA angehoben.

## Offen

- **17 Bildplätze warten auf Fotos.** Die Seite läuft ohne sie und zeigt beschriftete
  Platzhalter. Gesuchte Motive: `variant-06-tageslauf/media/BILDER-GESUCHT.md`.
- **Variante 04 zeigt eine kaputte Karte.** CARTO verlangt inzwischen einen API-Schlüssel und
  liefert sonst nur eine Hinweiskachel — mit Statuscode 200, der Fehler fällt also nicht auf.
  Variante 06 ist auf OpenStreetMap umgestellt, Variante 04 noch nicht (wartet auf Freigabe).
- **Der Countdown in Variante 06 steht auf null,** weil der 20.06.2026 vorbei ist. Der Termin
  liegt an genau einer Stelle: Konstante `EVENT_START` in `variant-06-tageslauf/main.js:454`.
  Wartet auf das echte Datum der nächsten Auflage.

## Nächste Schritte (Claude)

1. Sobald Fotos da sind: Dateien unter den in `BILDER-GESUCHT.md` genannten Namen nach
   `variant-06-tageslauf/media/` legen. Die Platzhalter verschwinden von selbst (Klasse
   `has-photo`). Danach Dateigrößen prüfen (Ziel unter 500 KB) und einmal durchscrollen.
2. Sobald das echte Eventdatum feststeht: `EVENT_START` in `variant-06-tageslauf/main.js:454`
   setzen. **Achtung:** In den Varianten 01 bis 05 steht das Datum als fester Text im HTML und
   muss von Hand mitgezogen werden.
3. Nach Freigabe: Variante 04 auf OpenStreetMap-Kacheln umstellen — dieselbe Änderung wie in
   Variante 06 (`tileLayer`-URL plus CSS-Filter nur auf `.leaflet-tile-pane`).
4. Falls Variante 06 die gewählte Fassung wird: `.claude/pruefen.txt` anlegen, damit das
   Done-Gate im Projekt überhaupt greift.

## Aktuelle Stolperfallen

- **Es gibt keine `.claude/pruefen.txt`.** Der Stop-Hook prüft in diesem Projekt also nichts.
  „Geprüft" ist hier immer eine eigene Aussage und gehört als solche benannt.
- **Der In-App-Browser liefert bei dieser Seite unbrauchbare Aufnahmen,** solange sein
  Fensterbereich ausgeblendet ist — die Seite ist im DOM korrekt, das Bild bleibt schwarz.
  Für Sichtprüfungen echtes Chrome nehmen oder headless rendern:

  ```
  & "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,12700 --virtual-time-budget=20000 --screenshot="ausgabe.png" "http://localhost:4178/variant-06-tageslauf/"
  ```

- **Headless-Chrome macht Fenster nicht schmaler als etwa 500 px.** Eine Aufnahme mit
  `--window-size=400` schneidet rechts ab, obwohl das Layout stimmt. Mobil deshalb mit 500 px
  rendern und die Überbreite zusätzlich im Browser messen (`documentElement.scrollWidth`).
