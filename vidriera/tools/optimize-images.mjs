// Convierte los JPG y PNG descargados a WebP livianos (máx. 1400 px de ancho) usando Chrome sin ventana.
// Uso, desde la carpeta vidriera: node tools/optimize-images.mjs <carpeta> [<carpeta>...]
// Borra el original después de convertirlo.
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { abrirChrome } from './chrome.mjs';

const chrome = await abrirChrome();
for (const dir of process.argv.slice(2)) {
  for (const file of readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
    const src = join(dir, file);
    const tipo = /\.png$/i.test(file) ? 'png' : 'jpeg';
    const dataUrl = `data:image/${tipo};base64,${readFileSync(src).toString('base64')}`;
    const out = await chrome.evaluar(`(async () => {
      const img = new Image();
      img.src = ${JSON.stringify(dataUrl)};
      await img.decode();
      const scale = Math.min(1, 1400 / img.naturalWidth);
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * scale);
      c.height = Math.round(img.naturalHeight * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      return { w: c.width, h: c.height, data: c.toDataURL('image/webp', 0.78) };
    })()`);
    const dest = src.replace(/\.(jpe?g|png)$/i, '.webp');
    writeFileSync(dest, Buffer.from(out.data.split(',')[1], 'base64'));
    unlinkSync(src);
    console.log(`${dest}  ${out.w}x${out.h}`);
  }
}
chrome.cerrar();
