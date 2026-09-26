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

Eine Ausnahme, von Gabriel freigegeben (26.09.2026, V13): der Schriftzug.
Seine Quelle hat statt Transparenz ein eingemaltes graues Karomuster. Bis
v2.2.1 rechnete ein SVG-Farbfilter es erst im Browser weg und liess dabei um
jeden Buchstaben einen grauen, gestrichelten Saum stehen. Jetzt stellt
schriftzug() ihn hier einmal frei: Die Buchstabenpixel kommen unveraendert aus
der Quelle, nur der halbdurchsichtige Rand bekommt ihre Farbe statt des
Karo-Graus. Die starre Sonne oben im Quellbild entfaellt dabei; im SVG rotiert
an ihrer Stelle die freigestellte Sonne.
"""
import os
import sys
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "Bildmaterial")
OUT = os.path.join(ROOT, "assets", "hero")

#       Quelle                         Ziel                 max. Breite  Qualitaet
JOBS = [
    ("Layer 1.png",                  "layer1",            1920, 80),  # Baeume vorn
    ("Layer 2.png",                  "layer2",            1920, 80),  # Tal mit Fluss
    ("Layer 3.png",                  "layer3",            1920, 80),  # Bergkette hinten
    ("Sonne ohne Hintergrund.png",   "sonne",             1044, 88),  # rotiert im Schriftzug-SVG
]

# Schriftzug: eigener Weg ueber schriftzug().
SCHRIFT_QUELLE = "Schriftzug plus Sonne.png"  # 1774 x 887, Buchstaben unterhalb von y=450
SCHRIFT_OBEN = 450  # Oberkante des Ausschnitts = y des <image> im Hero-SVG
KARO_MAX = 0.04     # so viel mehr Rot als Blau hat das Karo-Grau hoechstens (Rauschen)
VOLL_AB = 0.87      # ab diesem Abstand Rot minus Blau ist ein Pixel ganz Buchstabe


def schriftzug(pfad, ziel):
    """Stellt den Schriftzug frei. Grau hat gleich viel Rot wie Blau, das
    Orange der Buchstaben fast nur Rot: Der Abstand Rot minus Blau ergibt die
    Deckkraft. Randpixel sind eine Mischung aus Orange und Grau; sie bekommen
    die Buchstabenfarbe, sonst bliebe das Grau als Saum sichtbar."""
    quelle = Image.open(pfad).convert("RGB")
    quelle = quelle.crop((0, SCHRIFT_OBEN, quelle.width, quelle.height))
    px = quelle.load()
    breite, hoehe = quelle.size

    deckkraft = []
    rot, gruen, blau = [], [], []
    voll = Image.new("L", (breite, hoehe))
    vp = voll.load()
    for y in range(hoehe):
        for x in range(breite):
            r, g, b = px[x, y]
            a = ((r - b) / 255 - KARO_MAX) / (VOLL_AB - KARO_MAX)
            deckkraft.append(a)
            if a >= 1:
                rot.append(r)
                gruen.append(g)
                blau.append(b)
                vp[x, y] = 255
    if not rot:
        raise SystemExit(f"Keine Buchstaben gefunden in {pfad} - ist das die richtige Datei?")
    # Leicht warm getoente Karofelder liegen knapp ueber KARO_MAX und blieben
    # als Staub mit bis zu 5 % Deckkraft stehen. Randpixel gibt es nur direkt
    # an einem Buchstaben: Was weiter als 4 px davon weg ist, faellt heraus.
    am_buchstaben = voll.filter(ImageFilter.MaxFilter(9)).load()

    def median(werte):
        return sorted(werte)[len(werte) // 2]

    farbe = (median(rot), median(gruen), median(blau))
    # Auch unter den durchsichtigen Pixeln liegt die Buchstabenfarbe: WebP
    # speichert Farbe nur in halber Aufloesung und mischt dabei Nachbarn, ein
    # schwarzer Untergrund wuerde den Rand also wieder abdunkeln. exact=True
    # verbietet dem Encoder, diese Farbe wegzuoptimieren.
    aus = Image.new("RGBA", (breite, hoehe), farbe + (0,))
    ap = aus.load()
    i = 0
    for y in range(hoehe):
        for x in range(breite):
            a = deckkraft[i]
            i += 1
            if a >= 1:
                ap[x, y] = px[x, y] + (255,)
            elif a > 0 and am_buchstaben[x, y]:
                ap[x, y] = farbe + (round(a * 255),)

    aus.save(ziel, "WEBP", quality=95, method=6, exact=True)
    return aus, farbe, len(rot) / (breite * hoehe)


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

    pfad = os.path.join(SRC, SCHRIFT_QUELLE)
    if os.path.isfile(pfad):
        ziel = os.path.join(OUT, "schriftzug.webp")
        aus, farbe, anteil = schriftzug(pfad, ziel)
        print(f"{'schriftzug':<18} {aus.width}x{aus.height:<7} {os.path.getsize(ziel) / 1024:>7.0f}"
              f"  Randfarbe {farbe}, {anteil:.0%} Buchstabe")
    else:
        print(f"{'schriftzug':<18} FEHLT: {SCHRIFT_QUELLE}")

    summe = sum(os.path.getsize(os.path.join(OUT, f))
                for f in os.listdir(OUT) if f.endswith(".webp"))
    print("-" * 40)
    print(f"Summe {summe / 1024:.0f} KB in assets/hero/")


if __name__ == "__main__":
    main()
