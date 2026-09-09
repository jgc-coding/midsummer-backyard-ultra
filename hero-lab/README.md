# hero-lab — Hero-Section mit Ebenen-Effekt

Eine eigenständige Seite, die nur aus der Hero-Section besteht. Sie ist noch in keine der sechs
Varianten eingebaut; sie steht hier, damit die Fassung beurteilt und später übernommen werden kann.

## Was hier liegt

| Datei | Rolle |
| --- | --- |
| `hero.tpl.html` | Die Quelle. Enthält Platzhalter `__IMG_*__` statt Bildpfaden. |
| `build.py` | Füllt die Platzhalter und schreibt die beiden Fassungen. |
| `index.html` | Erzeugt. Bilder als relative Pfade, läuft direkt im Browser. |
| `hero.artefakt.html` | Erzeugt, nicht im Repo. Bilder eingebettet, Form fürs Artefakt-Werkzeug. |

Nach jeder Änderung an `hero.tpl.html`:

```
python hero-lab/build.py
```

Die Bilder selbst kommen aus `assets/hero/` und entstehen mit `python scripts/hero-bilder.py`
aus `Bildmaterial/` — das nur lokal vorliegt, nicht im Repo.

## Aufbau des Stapels

Von vorn nach hinten, mit den z-index-Werten aus `hero.tpl.html`:

```
 9  Text (Marker oben, Datum/Zeile/Knopf unten)
 8  Abdunklung unten
 7  Layer 1 — Baumkronen        (--t-near)
 6  Layer 2 — Dreisamtal        (--t-mid)
 5  Sonne + Schriftzug          Fassung A  ← Standard
 4  Layer 3 — Bergkette         (--t-far)
 3  Sonne + Schriftzug          Fassung B
 2  Auffangstreifen unten
 1  Lichtschein der Sonne
 0  Himmel
```

Umgeschaltet wird über `data-lockup="a"` bzw. `"b"` am `.hero` — mehr passiert zwischen den
beiden Fassungen nicht.

Jede Ebene hängt an einer Oberkante `--t` (Prozent der Hero-Höhe) und läuft nach unten aus ihrem
Kasten heraus. Dadurch steht die Kammlinie fest, egal wie hoch der Hero gerade ist. Die Breiten
`--w` sind auf schmalen Bildschirmen deutlich größer, sonst wären die Bilder dort zu flach und
zwischen Bergkette und Tal bliebe ein Spalt, durch den der Himmel als oranger Fleck blitzt.

## Geometrie von Sonne und Schriftzug

Aus Gabriels Vorlage `Bildmaterial/Schriftzug plus Sonne.png` gemessen:

- Die Sonne ist **63,7 %** so breit wie der Schriftzug.
- Ihr Mittelpunkt liegt **3,9 % der Schriftzugbreite** unter dessen Oberkante.

Daraus folgt der Versatz von `-43,8 %` der eigenen Sonnenhöhe im CSS. Ändert sich eines der
beiden Bilder, müssen diese drei Zahlen zusammen neu bestimmt werden.

## Bewegung

Eine einzige `requestAnimationFrame`-Schleife, darin erst alle Messungen, dann alle
Schreibvorgänge (siehe `CLAUDE.md`). Je Element steuern drei Werte im Markup die Bewegung:

- `data-lag` — wie träge die Ebene dem Scrollen folgt. Hinten größer als vorn.
- `data-amp` — wie weit sie sich am Mauszeiger verschiebt. Vorn größer als hinten.
- `data-intro` — von wie weit unten sie beim Laden einfährt.

Auf schmalen Bildschirmen werden `lag` und `amp` auf 55 % heruntergerechnet, nicht abgeschaltet.
