// Regenera las capturas de las demos que se muestran en la web de la agencia (img/agencia/demo-*.webp):
// la primera pantalla (para la portada) y la página completa (para recorrerla en "Ejemplos").
// Uso, desde la carpeta vidriera: node tools/captura.mjs
// También saca la primera pantalla de las demos de "Más rubros" (img/agencia/rubro-*.webp).
// Correlo cada vez que cambies el diseño de una demo. Después revisá el width y height de esas imágenes en index.html.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { abrirChrome, sleep } from './chrome.mjs';

const demos = ['odontologia', 'cerrajeria'];
const tamanos = [
  // escala: cuánto se achica la página completa (la de celular queda más nítida para verla en el marco del teléfono)
  { sufijo: '', width: 1440, height: 900, deviceScaleFactor: 1, mobile: false, escala: 0.6 },
  { sufijo: '-movil', width: 390, height: 844, deviceScaleFactor: 2, mobile: true, escala: 1.4 },
];

const chrome = await abrirChrome();
await chrome.send('Page.enable');
for (const demo of demos) {
  for (const t of tamanos) {
    await chrome.send('Emulation.setDeviceMetricsOverride', { width: t.width, height: t.height, deviceScaleFactor: t.deviceScaleFactor, mobile: t.mobile });
    await chrome.send('Page.navigate', { url: pathToFileURL(resolve(`demos/${demo}/index.html`)).href });
    await sleep(3000); // fuentes, fotos y animaciones de entrada

    // Primera pantalla
    let { data } = await chrome.send('Page.captureScreenshot', { format: 'webp', quality: 82 });
    let destino = `img/agencia/demo-${demo}${t.sufijo}.webp`;
    writeFileSync(destino, Buffer.from(data, 'base64'));
    console.log(destino);

    // Página completa: se recorre para que aparezcan todas las secciones y se ocultan los botones fijos
    const alto = await chrome.evaluar('document.documentElement.scrollHeight');
    for (let y = 0; y < alto; y += 500) { await chrome.evaluar(`scrollTo({ top: ${y}, behavior: 'instant' })`); await sleep(50); }
    await chrome.evaluar(`scrollTo({ top: 0, behavior: 'instant' });
      document.head.insertAdjacentHTML('beforeend', '<style>.float-wa, .callbar { display: none !important; } .top { position: relative !important; }</style>')`);
    await sleep(1200);
    const total = await chrome.evaluar('document.documentElement.scrollHeight');
    ({ data } = await chrome.send('Page.captureScreenshot', {
      format: 'webp', quality: 78, captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: t.width, height: total, scale: t.escala / t.deviceScaleFactor },
    }));
    destino = `img/agencia/demo-${demo}${t.sufijo}-full.webp`;
    writeFileSync(destino, Buffer.from(data, 'base64'));
    console.log(`${destino}  ${Math.round(t.width * t.escala)}x${Math.round(total * t.escala)}`);
  }
}
// Más rubros: solo la primera pantalla de compu, achicada a la mitad (img/agencia/rubro-*.webp)
const rubros = ['cafeteria', 'hamburgueseria', 'peluqueria', 'pasteleria', 'pilates', 'veterinaria'];
for (const demo of rubros) {
  await chrome.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await chrome.send('Page.navigate', { url: pathToFileURL(resolve(`demos/${demo}/index.html`)).href });
  await sleep(3500);
  const { data } = await chrome.send('Page.captureScreenshot', { format: 'webp', quality: 80, clip: { x: 0, y: 0, width: 1440, height: 900, scale: 0.5 } });
  const destino = `img/agencia/rubro-${demo}.webp`;
  writeFileSync(destino, Buffer.from(data, 'base64'));
  console.log(`${destino}  720x450`);
}
chrome.cerrar();
