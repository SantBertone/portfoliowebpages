// Abre Chrome sin ventana y lo maneja por el protocolo de DevTools. Lo usan captura.mjs y optimize-images.mjs.
// Busca Chrome en las rutas de Windows; si está en otro lado, pasá su ruta en la variable CHROME.
import { spawn } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const rutas = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean);

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function abrirChrome() {
  const exe = rutas.find((r) => existsSync(r));
  if (!exe) throw new Error('No encontré Chrome. Pasá su ruta en la variable CHROME.');
  const puerto = 9300 + Math.floor(Math.random() * 500);
  const perfil = join(tmpdir(), `vidriera-chrome-${puerto}`);
  const proceso = spawn(exe, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    `--remote-debugging-port=${puerto}`, `--user-data-dir=${perfil}`, 'about:blank'], { stdio: 'ignore' });

  let pestana;
  for (let i = 0; i < 50 && !pestana; i++) {
    await sleep(200);
    try { pestana = (await (await fetch(`http://127.0.0.1:${puerto}/json`)).json()).find((t) => t.type === 'page'); } catch {}
  }
  if (!pestana) throw new Error('Chrome no respondió.');

  const ws = new WebSocket(pestana.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0;
  const pendientes = new Map();
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pendientes.has(m.id)) { pendientes.get(m.id)(m.result ?? m); pendientes.delete(m.id); }
  });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pendientes.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const evaluar = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.value;
  const cerrar = () => { ws.close(); proceso.kill(); setTimeout(() => rmSync(perfil, { recursive: true, force: true }), 500); };
  return { send, evaluar, cerrar };
}
