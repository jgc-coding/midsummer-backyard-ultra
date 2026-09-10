# Bilder der Landingpage — Herkunft und Rechtestand

Die Seite hat vier Bildplätze, alle in der Sektion „Vier Regeln". Alle vier sind belegt.
An einer Stelle ohne Bilddatei zeigt die Seite automatisch einen beschrifteten Platzhalter im
Layout, sie bleibt also auch dann vollständig ansehbar.

Format überall: JPG, sRGB, 1400 × 1750 (4:5 hochkant), unter 500 KB pro Datei.

## Zuschnitt — der Fokuspunkt entscheidet

Der Bildbereich einer Regel-Karte hat kein festes Seitenverhältnis: auf dem Desktop ist er
annähernd quadratisch, auf dem Handy ein Querband. Der Browser füllt ihn mit `object-fit: cover`
und lässt den Überstand stehen — standardmäßig aus der Mitte heraus. Bei diesen Aufnahmen liegt
das Wichtige aber im oberen Drittel, weshalb genau die Köpfe als Erstes wegfielen.

Deshalb trägt **jedes Bild im HTML einen eigenen Ankerpunkt** als `style="--focus: 50% Y%"`
(seit v2.1.1). Der Wert sagt, welcher Punkt der Bildhöhe beim Beschneiden im Fenster bleibt.

| Datei | `--focus` | Anker |
|---|---|---|
| `regel-yard.jpg` | 50% 25% | Kappe des vorderen Läufers |
| `regel-stunde.jpg` | 50% 32% | Köpfe der Gruppe |
| `regel-aus.jpg` | 50% 25% | Punkt, in dem der Weg verschwindet |
| `regel-sieger.jpg` | 50% 35% | Schale und Emblem des Pokals |

Wer eine Datei austauscht, muss den Wert nachziehen. Vorgehen: das Bild in einem Fenster von
etwa 2:1 ansehen und den Wert so wählen, dass das Motiv drin bleibt — das ist der härteste Fall
(kleines Handy, dort sind rund 41 Prozent der Bildhöhe sichtbar). Ein zu 4:5 hochkantes Motiv
bleibt trotzdem ein Kompromiss; ein von Haus aus querformatiges Bild sitzt überall besser.

---

## Die vier Bilder

| Datei | Regel | Motiv | Quelle |
|---|---|---|---|
| `regel-yard.jpg` | 1 · Der Yard | Drei Läufer hintereinander auf dem Uferweg an der Dreisam, Gegenlicht | Von Gabriel geliefert (09.09.2026) |
| `regel-stunde.jpg` | 2 · Die volle Stunde | Das Feld geht gemeinsam auf die Runde, Vormittagslicht | Standbild aus `20260620_110010.mp4`, Sekunde 3 |
| `regel-aus.jpg` | 3 · Das Aus | Der leere Uferweg führt geradeaus in die Ferne — der Weg ohne dich | Standbild aus `Enviromnet Shots/20260624_102853.mp4`, Sekunde 8 |
| `regel-sieger.jpg` | 4 · Das Ende | Der Siegerpokal mit der Gravur „Only survivor", daneben die Wertungskarte | Von Gabriel geliefert (09.09.2026) |

Alle Aufnahmen stammen von der 2. Auflage am 20.06.2026 beziehungsweise von der Strecke
(24.06.2026). Das Rohmaterial liegt außerhalb des Repos unter
`C:\Users\chime\Desktop\Backyard Ultra 2026\`.

---

## Rechte — offen

Auf `regel-yard.jpg` und `regel-stunde.jpg` sind **fremde Teilnehmende erkennbar**. Vor einer
Veröffentlichung braucht es dafür die Einwilligung der abgebildeten Personen und das
Nutzungsrecht der Fotografin oder des Fotografen.

`regel-aus.jpg` zeigt keine Personen. Auf `regel-sieger.jpg` steht ein handschriftlicher Vorname
auf der Wertungskarte, in Anzeigegröße nicht lesbar.

---

## Was bewusst fehlt

Es gibt **kein Bildmaterial bei Dunkelheit** — die Kamera endete am Renntag um 18:00 Uhr nach
zwölf Runden. Die frühere Sektion „Ein Tag und eine Nacht" mit vier Tageszeit-Bildern wurde
deshalb entfernt (Entscheidung Gabriel, 10.09.2026), statt sie mit erfundenen oder fremden
Nachtaufnahmen zu füllen.
