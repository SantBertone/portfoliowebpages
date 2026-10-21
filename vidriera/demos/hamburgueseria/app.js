// Demo hamburguesería: "Armá la tuya" (la burger se dibuja capa por capa), pedido con retiro o delivery por WhatsApp.
// Para personalizar la demo de un cliente, cambiá estas constantes y los textos del HTML.

const WHATSAPP = '5491135778063';
// Horario por día (0 = domingo … 6 = sábado), en horas de Buenos Aires. Sin entrada = cerrado.
const HORARIO = { 0: [19, 24], 2: [19, 24], 3: [19, 24], 4: [19, 24], 5: [19, 24], 6: [19, 24] };
const ENVIO = 1500;
const PRECIOS = { base: 9500, medallon: 3000, dobleCheddar: 1000, sinTacc: 1500, combo: 4500,
  extras: { bacon: 1800, 'cebolla crispy': 1200, huevo: 1200, pepinos: 600, 'lechuga y tomate': 800 } };

const wa = (t) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`;
const pesos = (n) => '$' + n.toLocaleString('es-AR');

document.querySelectorAll('[data-wa]').forEach((a) => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });

// ---------- Abierto ahora, con la hora de Buenos Aires ----------
(() => {
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  const hoy = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  const hora = Number(p.hour) + Number(p.minute) / 60;
  const t = HORARIO[hoy];
  let texto; let abierto = false;
  if (t && hora >= t[0] && hora < t[1]) { abierto = true; texto = 'Abierto ahora, tomamos pedidos'; }
  else if (t && hora < t[0]) texto = `Hoy abrimos a las ${t[0]} h`;
  else for (let i = 1; i <= 7; i++) { const d = (hoy + i) % 7; if (HORARIO[d]) { texto = `Abrimos ${i === 1 ? 'mañana' : `el ${DIAS[d]}`} a las ${HORARIO[d][0]} h`; break; } }
  document.querySelectorAll('[data-estado]').forEach((el) => { el.classList.toggle('is-open', abierto); el.querySelector('[data-estado-texto]').textContent = texto; });
})();

// ---------- El pedido ----------
const pedido = new Map(); // descripción → { precio, cantidad }
const cart = document.getElementById('cart');
const cartBtn = document.getElementById('cart-btn');
const abrir = (si) => { cart.hidden = !si; cartBtn.setAttribute('aria-expanded', String(si)); if (si) cart.querySelector('.cart-close').focus(); };
cartBtn.addEventListener('click', () => abrir(cart.hidden));
document.getElementById('cart-close').addEventListener('click', () => { abrir(false); cartBtn.focus(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !cart.hidden) { abrir(false); cartBtn.focus(); } });

function sumar(desc, precio, n = 1) {
  const x = pedido.get(desc) || { precio, cantidad: 0 };
  x.cantidad += n;
  if (x.cantidad <= 0) pedido.delete(desc); else pedido.set(desc, x);
  pintarPedido();
}

const entrega = () => document.querySelector('input[name="entrega"]:checked').value;
function mensaje() {
  const lineas = [...pedido].map(([d, { precio, cantidad }]) => `${cantidad} × ${d} (${pesos(precio * cantidad)})`);
  let total = [...pedido.values()].reduce((s, x) => s + x.precio * x.cantidad, 0);
  let t = `Hola, quiero hacer un pedido:\n${lineas.join('\n')}`;
  if (entrega() === 'delivery') {
    total += ENVIO;
    const dir = document.getElementById('direccion').value.trim();
    t += `\nEnvío: ${pesos(ENVIO)}\nDelivery a: ${dir || '(te paso la dirección)'}`;
  } else t += '\nLo retiro en el local.';
  t += `\nTotal: ${pesos(total)}`;
  const n = document.getElementById('c-nombre').value.trim();
  if (n) t += `\nA nombre de ${n}.`;
  return { t, total };
}

function pintarPedido() {
  const lista = document.getElementById('cart-list');
  lista.innerHTML = '';
  let unidades = 0;
  for (const [d, { precio, cantidad }] of pedido) {
    unidades += cantidad;
    const li = document.createElement('li');
    li.innerHTML = `<span></span><span class="qty"><button type="button" aria-label="Quitar uno">−</button><span class="nums"></span><button type="button" aria-label="Sumar uno">+</button></span><span class="nums"></span>`;
    li.children[0].textContent = d;
    li.querySelector('.qty .nums').textContent = cantidad;
    li.children[2].textContent = pesos(precio * cantidad);
    const [menos, mas] = li.querySelectorAll('button');
    menos.addEventListener('click', () => sumar(d, precio, -1));
    mas.addEventListener('click', () => sumar(d, precio, 1));
    lista.appendChild(li);
  }
  const hay = pedido.size > 0;
  document.getElementById('cart-empty').hidden = hay;
  document.getElementById('cart-form').hidden = !hay;
  document.getElementById('cart-count').textContent = `(${unidades})`;
  const { t, total } = mensaje();
  document.getElementById('cart-total').textContent = pesos(total);
  document.getElementById('cart-send').href = wa(t);
  document.querySelectorAll('.add').forEach((b) => {
    const c = pedido.get(b.dataset.item)?.cantidad || 0;
    b.classList.toggle('is-added', c > 0);
    b.textContent = c > 0 ? `+ (${c})` : '+ Agregar';
    b.dataset.count = c;
  });
}
document.querySelectorAll('input[name="entrega"]').forEach((r) => r.addEventListener('change', () => {
  const del = entrega() === 'delivery';
  document.getElementById('direccion').hidden = !del;
  document.getElementById('direccion-label').hidden = !del;
  pintarPedido();
}));
['direccion', 'c-nombre'].forEach((id) => document.getElementById(id).addEventListener('input', pintarPedido));

// Botones del menú
document.querySelectorAll('[data-item]').forEach((li) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'add'; b.dataset.item = li.dataset.item; b.textContent = '+ Agregar';
  b.setAttribute('aria-label', `Agregar ${li.dataset.item} al pedido`);
  b.addEventListener('click', () => sumar(li.dataset.item, Number(li.dataset.precio)));
  li.appendChild(b);
});

// ---------- Armá la tuya: la burger se dibuja capa por capa ----------
(() => {
  const form = document.getElementById('builder');
  const svg = document.getElementById('stack');
  const precioEl = document.getElementById('precio');
  const NS = 'http://www.w3.org/2000/svg';
  const C = { pan: '#e5a34a', panTop: '#eeb35c', carne: '#5a3420', queso: '#f6c33b', bacon: '#b5482c', lechuga: '#6dbb4f', tomate: '#d6301f', huevo: '#fffaf0', yema: '#f2a100', cebolla: '#d9a35a', pepino: '#7aa33a', semilla: '#fff4d8' };
  let anteriores = new Set();

  const estado = () => {
    const carne = Number(form.querySelector('input[name="carne"]:checked').value);
    const queso = form.querySelector('input[name="queso"]:checked').value;
    const extras = [...form.querySelectorAll('input[name="extra"]:checked')].map((i) => i.value);
    const pan = form.querySelector('input[name="pan"]:checked').value;
    const combo = document.getElementById('combo').checked;
    let precio = PRECIOS.base + (carne - 1) * PRECIOS.medallon + (queso === 'doble cheddar' ? PRECIOS.dobleCheddar : 0)
      + extras.reduce((s, e) => s + PRECIOS.extras[e], 0) + (pan === 'sin TACC' ? PRECIOS.sinTacc : 0) + (combo ? PRECIOS.combo : 0);
    return { carne, queso, extras, pan, combo, precio };
  };

  const capa = (key, alto, dibujar) => ({ key, alto, dibujar });
  function capas({ carne, queso, extras }) {
    const L = [capa('pan-abajo', 34, (g, y) => rect(g, 70, y, 260, 34, 14, C.pan))];
    if (extras.includes('lechuga y tomate')) {
      L.push(capa('lechuga', 14, (g, y) => wave(g, 62, y, 276, 14, C.lechuga)));
      L.push(capa('tomate', 12, (g, y) => rect(g, 80, y, 240, 12, 6, C.tomate)));
    }
    for (let i = 0; i < carne; i++) {
      L.push(capa(`carne-${i}`, 32, (g, y) => rect(g, 66, y, 268, 32, 12, C.carne)));
      if (queso !== 'sin queso') {
        const fetas = queso === 'doble cheddar' ? 2 : 1;
        for (let f = 0; f < fetas; f++) L.push(capa(`queso-${i}-${f}`, 8, (g, y) => drip(g, 60, y, 280, 8, C.queso)));
      }
    }
    if (extras.includes('bacon')) L.push(capa('bacon', 12, (g, y) => wave(g, 72, y, 256, 12, C.bacon)));
    if (extras.includes('huevo')) L.push(capa('huevo', 22, (g, y) => { ellipse(g, 200, y + 11, 120, 11, C.huevo); ellipse(g, 200, y + 9, 30, 8, C.yema); }));
    if (extras.includes('cebolla crispy')) L.push(capa('cebolla', 12, (g, y) => { for (let x = 90; x <= 310; x += 28) ellipse(g, x, y + 6, 16, 6, C.cebolla); }));
    if (extras.includes('pepinos')) L.push(capa('pepinos', 10, (g, y) => { for (let x = 110; x <= 290; x += 45) ellipse(g, x, y + 5, 18, 5, C.pepino); }));
    L.push(capa('pan-arriba', 92, (g, y) => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', `M64 ${y + 92} Q64 ${y} 200 ${y} Q336 ${y} 336 ${y + 92} Z`);
      p.setAttribute('fill', C.panTop); g.appendChild(p);
      [[150, 30], [200, 22], [250, 32], [175, 50], [228, 52], [120, 56], [282, 58]].forEach(([x, dy]) => ellipse(g, x, y + dy, 6, 3, C.semilla));
    }));
    return L;
  }
  function rect(g, x, y, w, h, r, fill) { const e = document.createElementNS(NS, 'rect'); Object.entries({ x, y, width: w, height: h, rx: r, fill }).forEach(([k, v]) => e.setAttribute(k, v)); g.appendChild(e); }
  function ellipse(g, cx, cy, rx, ry, fill) { const e = document.createElementNS(NS, 'ellipse'); Object.entries({ cx, cy, rx, ry, fill }).forEach(([k, v]) => e.setAttribute(k, v)); g.appendChild(e); }
  function wave(g, x, y, w, h, fill) {
    let d = `M${x} ${y + h}`; const n = 10;
    for (let i = 0; i <= n; i++) d += ` Q${x + (w / n) * (i - 0.5)} ${y - 4} ${x + (w / n) * i} ${y + (i % 2 ? 2 : 6)}`;
    d += ` L${x + w} ${y + h} Z`;
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('fill', fill); g.appendChild(p);
  }
  function drip(g, x, y, w, h, fill) {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', `M${x} ${y} H${x + w} V${y + h} H${x + w - 40} q-6 14 -12 0 H${x + 120} q-6 18 -12 0 H${x + 50} q-6 12 -12 0 H${x} Z`);
    p.setAttribute('fill', fill); g.appendChild(p);
  }

  function dibujar() {
    const e = estado();
    const L = capas(e);
    const alto = L.reduce((s, c) => s + c.alto, 0);
    svg.setAttribute('viewBox', `0 0 400 ${Math.max(300, alto + 30)}`);
    svg.innerHTML = '';
    let y = Math.max(300, alto + 30) - 10;
    const ahora = new Set();
    for (const c of L) {
      y -= c.alto;
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'layer');
      c.dibujar(g, y);
      if (!anteriores.has(c.key) && anteriores.size && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        g.animate([{ transform: 'translateY(-60px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      }
      svg.appendChild(g);
      ahora.add(c.key);
    }
    anteriores = ahora;
    precioEl.textContent = pesos(e.precio);
  }

  form.addEventListener('change', dibujar);
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const e = estado();
    const nombres = ['simple', 'doble', 'triple'];
    let desc = `Burger ${nombres[e.carne - 1]}, ${e.queso}`;
    if (e.extras.length) desc += `, con ${e.extras.join(', ')}`;
    desc += `, pan ${e.pan}`;
    if (e.combo) desc += ' (combo con papas y gaseosa)';
    sumar(desc, e.precio);
    abrir(true);
  });
  dibujar();
})();

pintarPedido();

// ---------- Entradas suaves ----------
(() => {
  const items = [...document.querySelectorAll('[data-reveal]')];
  const mostrar = (el) => el.classList.add('is-in');
  if (!('IntersectionObserver' in window)) { items.forEach(mostrar); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { mostrar(e.target); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
  items.forEach((el) => io.observe(el));
  addEventListener('scroll', () => items.forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) mostrar(el); }), { passive: true });
})();
