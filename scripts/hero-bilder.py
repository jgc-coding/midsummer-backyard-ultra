"""Bildmaterial/ -> assets/hero/ : bereitet die Hero-Bilder fuer das Web auf.

    python scripts/hero-bilder.py [pfad-zu-Bildmaterial]

Braucht Pillow. `Bildmaterial/` ist bewusst nicht im Repo (Rohmaterial); ohne
Argument wird der Ordner neben der Projektwurzel gesucht. Die fertigen `.webp`
sind im Repo, darum muss dieses Skript nur laufen, wenn sich ein Quellbild
aendert.

WICHTIG (CLAUDE.md, "Gestaltungsarbeit"): Geliefertes Bildmaterial ist
Endzustand, kein Rohstoff. Dieses Skript veraendert deshalb WEDER Farben noch
Helligkeit noch Zuschnitt — es verkleinert nur und speichert als WebP. Die
Seitenverhaeltnisse bleiben exakt erhalten, weil die CSS-Positionswerte der
Hero-Section auf ihnen aufbauen.
"""
import os
import sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "Bildmaterial")
OUT = os.path.join(ROOT, "assets", "hero")

#       Quelle                         Ziel                 max. Breite  Qualitaet
JOBS = [
    ("Layer 1.png",                  "layer1",            1920, 80),  # Baeume vorn
    ("Layer 2.png",                  "layer2",            1920, 80),  # Tal mit Fluss
    ("Layer 3.png",                  "layer3",            1920, 80),  # Bergkette hinten
    ("Sonne ohne Hintergrund.png",   "sonne",             1044, 88),  # rotiert im Schriftzug-SVG
    ("Schriftzug plus Sonne.png",    "schriftzug-sonne",  1774, 95),  # Karomuster entfernt zur
                                                                      # Laufzeit ein SVG-Farbfilter
]


def main():
    if not os.path.isdir(SRC):
        raise SystemExit(f"Ordner fehlt: {SRC}\nDas Rohmaterial liegt nicht im Repo.")
    os.makedirs(OUT, exist_ok=True)

    print(f"{'Ausgabe':<18} {'Groesse':<12} {'KB':>7}")
    print("-" * 40)
    for src, name, breite, q in JOBS:
        pfad = os.path.join(SRC, src)
        if not os.path.isfile(pfad):
            print(f"{name:<18} FEHLT: {src}")
            continue

        im = Image.open(pfad).convert("RGBA")
        if im.width > breite:
            im = im.resize((breite, round(im.height * breite / im.width)), Image.LANCZOS)

        ziel = os.path.join(OUT, name + ".webp")
        im.save(ziel, "WEBP", quality=q, method=6)
        print(f"{name:<18} {im.width}x{im.height:<7} {os.path.getsize(ziel) / 1024:>7.0f}")

    summe = sum(os.path.getsize(os.path.join(OUT, f))
                for f in os.listdir(OUT) if f.endswith(".webp"))
    print("-" * 40)
    print(f"Summe {summe / 1024:.0f} KB in assets/hero/")


if __name__ == "__main__":
    main()
