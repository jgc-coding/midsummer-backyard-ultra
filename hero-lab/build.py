"""hero.tpl.html + assets/hero/ -> zwei Fassungen derselben Seite.

    python hero-lab/build.py

  hero-lab/index.html          Bilder als relative Pfade. Klein genug fuers
                               Repo, laeuft auf GitHub Pages, dient als
                               Vorlage fuer den Einbau in eine Variante.

  hero-lab/hero.artefakt.html  Bilder als data-URI eingebettet, ohne
                               doctype/head/body. Genau die Form, die das
                               Artefakt-Werkzeug erwartet. Rund 1 MB, deshalb
                               nicht im Repo (siehe .gitignore).

Beide entstehen aus derselben Vorlage; die Platzhalter __IMG_*__ und
__W_*__/__H_*__ werden nur unterschiedlich gefuellt.
"""
import base64
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BILDER = os.path.join(ROOT, "assets", "hero")

EBENEN = ("layer1", "layer2", "layer3")
LOGO = (("SONNE", "sonne"), ("SCHRIFTZUG", "schriftzug"))


def datei(name):
    return os.path.join(BILDER, name + ".webp")


def data_uri(name):
    with open(datei(name), "rb") as f:
        return "data:image/webp;base64," + base64.b64encode(f.read()).decode("ascii")


def masse(name):
    with Image.open(datei(name)) as im:
        return im.size


def fuellen(tpl, quelle):
    """quelle(name) liefert den Wert fuer src bzw. url()."""
    for key, name in LOGO:
        w, h = masse(name)
        tpl = (tpl.replace(f"__IMG_{key}__", quelle(name))
                  .replace(f"__W_{key}__", str(w))
                  .replace(f"__H_{key}__", str(h)))
    return tpl + (
        "\n<style>\n:root {\n"
        + "".join(f'  --img-{n}: url("{quelle(n)}");\n' for n in EBENEN)
        + "}\n</style>\n"
    )


def schreiben(pfad, text):
    with open(pfad, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print(f"{os.path.relpath(pfad, ROOT):<28} {os.path.getsize(pfad) / 1024:7.0f} KB")


def main():
    tpl = open(os.path.join(HERE, "hero.tpl.html"), encoding="utf-8").read()

    seite = fuellen(tpl, lambda n: f"../assets/hero/{n}.webp")
    schreiben(os.path.join(HERE, "index.html"),
              '<!doctype html>\n<html lang="de">\n<head>\n'
              '<meta charset="utf-8" />\n'
              '<meta name="viewport" content="width=device-width, initial-scale=1" />\n'
              '<meta name="description" content="Hero-Section des Midsummer Backyard Ultra '
              'Freiburg: Sonne und Schriftzug in einem Stapel aus drei Landschaftsebenen." />\n'
              '</head>\n<body>\n' + seite + '\n</body>\n</html>\n')

    schreiben(os.path.join(HERE, "hero.artefakt.html"), fuellen(tpl, data_uri))


if __name__ == "__main__":
    main()
