// Arma la carpeta dist/ (en la raíz del repo) con solo los archivos que se publican.
// Cloudflare Pages lo corre solo en cada push, con:
//   Build command:          node vidriera/tools/build.mjs
//   Build output directory: dist
// También se puede correr a mano desde la raíz del repo para revisar qué se publica.
import { cpSync, rmSync, existsSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const sitio = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destino = join(sitio, '..', 'dist');

// Lo que no se publica: herramientas, notas y créditos internos.
const afuera = new Set(['tools', '.taste-skill', 'README.md', 'credits.json', 'vercel.json', '.vercelignore', '.gitignore', 'node_modules']);

if (existsSync(destino)) rmSync(destino, { recursive: true, force: true });
cpSync(sitio, destino, {
  recursive: true,
  filter: (ruta) => !relative(sitio, ruta).split(sep).some((parte) => afuera.has(parte)) && !afuera.has(basename(ruta)),
});
console.log(`Listo: ${relative(process.cwd(), destino) || destino}`);
