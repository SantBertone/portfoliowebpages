// Convierte los JPG descargados a WebP livianos (máx. 1400 px de ancho) usando Chrome headless.
// Uso: node tools/optimize-images.mjs <carpeta> [<carpeta>...]
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const skill = process.env.TASTE_SKILL;
const { Browser } = await import(pathToFileURL(join(skill, 'scripts/lib/cdp.mjs')).href);
const browser = await Browser.launch({ width: 800, height: 600 });
const page = await browser.newPage({ width: 800, height: 600 });
await page.goto('about:blank');

for (const dir of process.argv.slice(2)) {
  for (const file of readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f))) {
    const src = join(dir, file);
    const dataUrl = `data:image/jpeg;base64,${readFileSync(src).toString('base64')}`;
    const out = await page.eval(async ({ dataUrl, max }) => {
      const img = new Image();
      img.src = dataUrl;
      await img.decode();
      const scale = Math.min(1, max / img.naturalWidth);
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * scale);
      c.height = Math.round(img.naturalHeight * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      return { w: c.width, h: c.height, data: c.toDataURL('image/webp', 0.78) };
    }, { dataUrl, max: 1400 });
    const dest = src.replace(/\.jpe?g$/i, '.webp');
    writeFileSync(dest, Buffer.from(out.data.split(',')[1], 'base64'));
    unlinkSync(src);
    console.log(`${dest}  ${out.w}x${out.h}`);
  }
}
await browser.close();
