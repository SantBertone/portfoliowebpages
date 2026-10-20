// Evalúa una expresión en una página con Chrome headless: node tools/probe.mjs <url> <ancho> "<expresión>"
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const { Browser } = await import(pathToFileURL(join(process.env.TASTE_SKILL, 'scripts/lib/cdp.mjs')).href);
const [url, width = '1440', expr = 'document.title'] = process.argv.slice(2);
const browser = await Browser.launch({ width: Number(width), height: 900 });
const page = await browser.newPage({ width: Number(width), height: 900 });
await page.goto(url, { settleMs: 2500 });
console.log(JSON.stringify(await page.eval(expr), null, 1));
await browser.close();
