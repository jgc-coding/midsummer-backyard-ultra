"""Bildmaterial/ -> assets/hero/ : bereitet die freigestellten Bilder der
Hero-Section fuer das Web auf.

    python scripts/hero-bilder.py

Braucht Pillow und numpy. Laeuft nur dort, wo `Bildmaterial/` liegt — der
Ordner ist bewusst nicht im Repo (Rohmaterial). Die fertigen `.webp` sind es,
darum muss dieses Skript nur laufen, wenn sich ein Quellbild aendert.

Drei Dinge passieren hier, und jedes hat einen Grund:

1. `Schriftzug.png` hat KEINEN Alphakanal — das Karomuster ist ins Bild
   gemalt. Es wird ueber die Farbsaettigung freigestellt, siehe `freistellen`.

2. Die drei Landschaftsbilder bekommen eine Morgenlicht-Abstufung eingebacken:
   nach hinten dunstiger und heller, nach vorn dunkler und waermer. Die Sonne
   steht hinter der Landschaft, also liegt der Vordergrund im Schatten. Das
   traegt die Tiefenwirkung des Stapels und macht nebenbei den Text unten
   lesbar. Zur Laufzeit wird deshalb kein `filter` gebraucht — der wuerde beim
   Scrollen jede Ebene neu rastern (siehe CLAUDE.md).

3. Jedes Bild wird auf seinen sichtbaren Bereich beschnitten. Dadurch ist die
   Oberkante einer Datei zugleich die Oberkante ihres Motivs, und die
   CSS-Werte `--t-far/--t-mid/--t-near` beschreiben genau das.
"""
import os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "Bildmaterial")
OUT = os.path.join(ROOT, "assets", "hero")


def freistellen(a):
    """Schriftzug.png ueber die Saettigung freistellen.

    Der Hintergrund ist neutralgrau (Karomuster), die Buchstaben sind ein
    einziges gesaettigtes Orange (#EF6206). Ein Mischpixel aus Anteil x
    Orange ueber Grau hat deshalb genau die Saettigung x * 233. Daraus wird
    der Alphakanal; die Farbe wird auf das reine Orange gesetzt. Der graue
    Schlagschatten faellt dabei mit weg.
    """
    rgb = a[:, :, :3].astype(np.int16)   # uint8 wuerde bei max-min-6 unterlaufen
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    alpha = np.clip((sat - 6) / (233.0 - 6), 0, 1)
    out = np.zeros_like(a)
    out[:, :, 0], out[:, :, 1], out[:, :, 2] = 239, 98, 6
    out[:, :, 3] = (alpha * 255).round()
    return out


def hexrgb(s):
    return np.array([int(s[i:i + 2], 16) for i in (1, 3, 5)], dtype=float)


def abstufen(rgb, dunstfarbe, dunst, saettigung, helligkeit, waerme):
    out = rgb * (1 - dunst) + hexrgb(dunstfarbe) * dunst          # Luftperspektive
    grau = (out * np.array([0.2126, 0.7152, 0.0722])).sum(axis=2, keepdims=True)
    out = grau + (out - grau) * saettigung
    out = out * helligkeit
    out = out * (1 - waerme + np.array([1.10, 0.99, 0.86]) * waerme)  # Morgenlicht
    return np.clip(out, 0, 255)


#      Quelle                        Ziel          Breite  Q   Dunstfarbe Dunst Saett Hell Waerme
JOBS = [
    ("Layer 1.png",                "layer1",     2200, 78, "#231508", 0.05, 0.70, 0.40, 0.85),
    ("Layer 2.png",                "layer2",     2200, 78, "#4a2a24", 0.20, 0.62, 0.55, 0.80),
    ("Layer 3.png",                "layer3",     2400, 80, "#7d5f6e", 0.36, 0.55, 0.82, 0.45),
    ("Sonne ohne Hintergrund.png", "sonne",       900, 90, None,      0,    1,    1,    0),
    ("Schriftzug.png",             "schriftzug", 1500, 92, None,      0,    1,    1,    0),
]


def main():
    if not os.path.isdir(SRC):
        raise SystemExit(f"Ordner fehlt: {SRC}\nDas Rohmaterial liegt nicht im Repo.")
    os.makedirs(OUT, exist_ok=True)

    print(f"{'Datei':<12} {'Ausgabe':<14} {'Verhaeltnis':>11} {'KB':>7}")
    print("-" * 48)
    for src, name, breite, q, dunstfarbe, dunst, saett, hell, waerme in JOBS:
        pfad = os.path.join(SRC, src)
        if not os.path.isfile(pfad):
            print(f"{name:<12} FEHLT: {src}")
            continue

        a = np.array(Image.open(pfad).convert("RGBA"))
        if name == "schriftzug":
            a = freistellen(a)
        a[:, :, 3] = np.where(a[:, :, 3] < 8, 0, a[:, :, 3])

        sichtbar = a[:, :, 3] > 0                       # auf das Motiv beschneiden
        ys = np.where(sichtbar.any(axis=1))[0]
        xs = np.where(sichtbar.any(axis=0))[0]
        a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1].astype(float)

        if dunstfarbe:
            a[:, :, :3] = abstufen(a[:, :, :3], dunstfarbe, dunst, saett, hell, waerme)

        im = Image.fromarray(a.astype(np.uint8), "RGBA")
        if im.width > breite:
            im = im.resize((breite, round(im.height * breite / im.width)), Image.LANCZOS)

        ziel = os.path.join(OUT, name + ".webp")
        im.save(ziel, "WEBP", quality=q, method=6)
        print(f"{name:<12} {im.width}x{im.height:<9} {im.width / im.height:>11.4f} "
              f"{os.path.getsize(ziel) / 1024:>7.0f}")

    summe = sum(os.path.getsize(os.path.join(OUT, f))
                for f in os.listdir(OUT) if f.endswith(".webp"))
    print("-" * 48)
    print(f"Summe {summe / 1024:.0f} KB in assets/hero/")


if __name__ == "__main__":
    main()
