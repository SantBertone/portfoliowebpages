// Genera img/og-vidriera.jpg (la imagen que se ve al compartir la web por WhatsApp o redes) a partir de tools/og-vidriera.html.
// Uso, desde la carpeta vidriera: node tools/og.mjs
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { abrirChrome, sleep } from './chrome.mjs';

const chrome = await abrirChrome();
await chrome.send('Page.enable');
await chrome.send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
await chrome.send('Page.navigate', { url: pathToFileURL(resolve('tools/og-vidriera.html')).href });
await sleep(2500); // tipografías e imágenes
const { data } = await chrome.send('Page.captureScreenshot', { format: 'jpeg', quality: 88 });
writeFileSync('img/og-vidriera.jpg', Buffer.from(data, 'base64'));
console.log('img/og-vidriera.jpg');
chrome.cerrar();
