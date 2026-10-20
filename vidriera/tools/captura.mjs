// Regenera las capturas de las demos que se muestran en la web de la agencia (img/agencia/demo-*.webp).
// Uso, desde la carpeta vidriera: node tools/captura.mjs
// Correlo cada vez que cambies el diseño de una demo.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { abrirChrome, sleep } from './chrome.mjs';

const demos = ['odontologia', 'cerrajeria'];
const tamanos = [
  { sufijo: '', width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
  { sufijo: '-movil', width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
];

const chrome = await abrirChrome();
await chrome.send('Page.enable');
for (const demo of demos) {
  for (const t of tamanos) {
    await chrome.send('Emulation.setDeviceMetricsOverride', { width: t.width, height: t.height, deviceScaleFactor: t.deviceScaleFactor, mobile: t.mobile });
    await chrome.send('Page.navigate', { url: pathToFileURL(resolve(`demos/${demo}/index.html`)).href });
    await sleep(3000); // fuentes, fotos y animaciones de entrada
    const { data } = await chrome.send('Page.captureScreenshot', { format: 'webp', quality: 82 });
    const destino = `img/agencia/demo-${demo}${t.sufijo}.webp`;
    writeFileSync(destino, Buffer.from(data, 'base64'));
    console.log(destino);
  }
}
chrome.cerrar();
