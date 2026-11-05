// Genera versiones más chicas de cada WebP (foto-480.webp, foto-900.webp, foto-1200.webp) para usarlas con srcset,
// así el celular baja la foto chica y la compu la que necesita. Usa Chrome sin ventana.
// Uso, desde la carpeta vidriera: node tools/responsive-images.mjs <carpeta> [<carpeta>...]
// No toca el original (que queda como la versión de 1400 px) ni vuelve a procesar las versiones ya hechas.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { abrirChrome } from './chrome.mjs';

const ANCHOS = [480, 900, 1200];
const CALIDAD = 0.74;

const chrome = await abrirChrome();
for (const dir of process.argv.slice(2)) {
  for (const file of readdirSync(dir).filter((f) => /\.webp$/i.test(f) && !/-(480|900|1200)\.webp$/i.test(f))) {
    const src = join(dir, file);
    const dataUrl = `data:image/webp;base64,${readFileSync(src).toString('base64')}`;
    for (const ancho of ANCHOS) {
      const out = await chrome.evaluar(`(async () => {
        const img = new Image();
        img.src = ${JSON.stringify(dataUrl)};
        await img.decode();
        if (img.naturalWidth <= ${ancho}) return null;
        const c = document.createElement('canvas');
        c.width = ${ancho};
        c.height = Math.round(img.naturalHeight * ${ancho} / img.naturalWidth);
        const ctx = c.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, c.width, c.height);
        return { w: c.width, h: c.height, data: c.toDataURL('image/webp', ${CALIDAD}) };
      })()`);
      if (!out) continue;
      const dest = join(dir, file.replace(/\.webp$/i, `-${ancho}.webp`));
      writeFileSync(dest, Buffer.from(out.data.split(',')[1], 'base64'));
      console.log(`${dest}  ${out.w}x${out.h}  ${Math.round(statSync(dest).size / 1024)} KB`);
    }
  }
}
chrome.cerrar();
