// Baja fotos de Unsplash en webp liviano y anota su origen en el credits.json de cada demo.
// Uso, desde la carpeta vidriera: node tools/unsplash.mjs fotos.json
// fotos.json: { "cafeteria": { "latte-art": ["photo-1541167760496-1628856ab772", "nzyzAUsbV0M"], ... }, ... }
//   clave = carpeta de la demo; dentro, nombre del archivo → [ruta de images.unsplash.com, id de la foto en unsplash.com/photos/<id>]
// La licencia de Unsplash permite uso comercial y no exige atribución; igual se guarda el link de cada foto.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const pedido = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const ANCHO = 1400;

for (const [demo, fotos] of Object.entries(pedido)) {
  const carpeta = join('demos', demo, 'img');
  mkdirSync(carpeta, { recursive: true });
  const archivoCreditos = join(carpeta, 'credits.json');
  const creditos = existsSync(archivoCreditos)
    ? JSON.parse(readFileSync(archivoCreditos, 'utf8'))
    : { nota: 'Fotos de Unsplash: la licencia permite uso comercial y no exige atribución. Igual se deja el link de origen de cada una.', fotos: {} };

  for (const [nombre, [ruta, id]] of Object.entries(fotos)) {
    const url = `https://images.unsplash.com/${ruta}?w=${ANCHO}&q=72&fm=webp&fit=max`;
    const r = await fetch(url);
    if (!r.ok) { console.log(`FALLÓ ${demo}/${nombre}: ${r.status}`); continue; }
    const buffer = Buffer.from(await r.arrayBuffer());
    writeFileSync(join(carpeta, `${nombre}.webp`), buffer);
    creditos.fotos[`${nombre}.webp`] = {
      fuente: `https://unsplash.com/photos/${id}`,
      licencia: 'Licencia de Unsplash (uso comercial permitido, sin atribución obligatoria)',
    };
    console.log(`${demo}/${nombre}.webp  ${Math.round(buffer.length / 1024)} KB`);
  }
  writeFileSync(archivoCreditos, JSON.stringify(creditos, null, 2) + '\n');
}
