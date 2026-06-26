// Lädt Open-Source-Webfonts (OFL) als woff2 von gstatic herunter und self-hostet sie.
// Erzeugt assets/fonts/<family>-<weight>[-italic].woff2 + assets/fonts/fonts.css
// Aufruf: node scripts/fetch-fonts.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'assets/fonts');
await mkdir(outDir, { recursive: true });

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

// family -> { weights:[...], italics:[...] }
const FONTS = {
  Fraunces: { weights: [400, 500, 600, 900], italics: [400] },
  'Inter Tight': { weights: [400, 500, 600, 700] },
  'Bricolage Grotesque': { weights: [500, 700, 800] },
  'Hanken Grotesk': { weights: [400, 500, 700, 800] },
  'JetBrains Mono': { weights: [400, 500, 700] },
  Syne: { weights: [600, 700, 800] },
  'Plus Jakarta Sans': { weights: [400, 500, 700] },
  'Big Shoulders Display': { weights: [600, 700, 800, 900] },
};

const slug = (s) => s.toLowerCase().replace(/\s+/g, '-');
let css = '/* Self-hosted Webfonts (OFL). Generiert von scripts/fetch-fonts.mjs */\n';
let okCount = 0,
  failCount = 0;

for (const [family, cfg] of Object.entries(FONTS)) {
  const axisWeights = cfg.weights.map((w) => `0,${w}`);
  const axisItalics = (cfg.italics ?? []).map((w) => `1,${w}`);
  const hasItalic = axisItalics.length > 0;
  const tuples = hasItalic ? [...axisWeights, ...axisItalics].sort() : cfg.weights.map(String);
  const axis = hasItalic ? `ital,wght@${tuples.join(';')}` : `wght@${tuples.join(';')}`;
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${axis}&display=swap`;

  let cssText;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    cssText = await r.text();
  } catch (e) {
    console.error('CSS-Fehler', family, e.message);
    failCount++;
    continue;
  }

  // @font-face-Blöcke durchgehen, nur den Latin-Block (U+0000-00FF) nehmen
  const blocks = cssText.split('@font-face').slice(1);
  for (const b of blocks) {
    if (!/U\+0000-00FF/.test(b)) continue; // nur Latin-Subset (enthält Umlaute)
    const wM = b.match(/font-weight:\s*(\d+)/);
    const iM = /font-style:\s*italic/.test(b);
    const uM = b.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    if (!wM || !uM) continue;
    const weight = wM[1];
    const fileName = `${slug(family)}-${weight}${iM ? '-italic' : ''}.woff2`;
    try {
      const fr = await fetch(uM[1], { headers: { 'User-Agent': UA } });
      if (!fr.ok) throw new Error('HTTP ' + fr.status);
      const buf = Buffer.from(await fr.arrayBuffer());
      await writeFile(resolve(outDir, fileName), buf);
      css +=
        `@font-face{font-family:'${family}';font-style:${iM ? 'italic' : 'normal'};` +
        `font-weight:${weight};font-display:swap;src:url('${fileName}') format('woff2');}\n`;
      okCount++;
    } catch (e) {
      console.error('woff2-Fehler', fileName, e.message);
      failCount++;
    }
  }
  console.log('fertig:', family);
}

await writeFile(resolve(outDir, 'fonts.css'), css);
console.log(`\nGesamt: ${okCount} Dateien ok, ${failCount} Fehler. -> assets/fonts/fonts.css`);
