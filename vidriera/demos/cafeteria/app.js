// Demo cafetería: pedido para llevar desde la carta, reserva de grupo, "abierto ahora" y WhatsApp con mensaje armado.
// Para personalizar la demo de un cliente, cambiá estas dos constantes y los textos del HTML.

const WHATSAPP = '5491135778063';
// Horario por día (0 = domingo … 6 = sábado), en horas de Buenos Aires. Sin entrada = cerrado.
const HORARIO = { 0: [9, 20], 1: [8, 20], 2: [8, 20], 3: [8, 20], 4: [8, 20], 5: [8, 20], 6: [9, 20] };

const wa = (texto) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
const pesos = (n) => '$' + n.toLocaleString('es-AR');

// ---------- WhatsApp: cada link con data-wa lleva su mensaje escrito ----------
document.querySelectorAll('[data-wa]').forEach((a) => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });

// ---------- Abierto ahora, con la hora de Buenos Aires ----------
(() => {
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  const hoy = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  const hora = Number(p.hour) + Number(p.minute) / 60;
  const turno = HORARIO[hoy];
  let texto; let abierto = false;
  if (turno && hora >= turno[0] && hora < turno[1]) { abierto = true; texto = `Abierto ahora, hasta las ${turno[1]} h`; }
  else if (turno && hora < turno[0]) texto = `Cerrado. Abrimos hoy a las ${turno[0]} h`;
  else for (let i = 1; i <= 7; i++) { const d = (hoy + i) % 7; if (HORARIO[d]) { texto = `Cerrado. Abrimos ${i === 1 ? 'mañana' : `el ${DIAS[d]}`} a las ${HORARIO[d][0]} h`; break; } }
  document.querySelectorAll('[data-estado]').forEach((el) => { el.classList.toggle('is-open', abierto); el.querySelector('[data-estado-texto]').textContent = texto; });
})();

// ---------- Pedido para llevar: cada plato de la carta se puede agregar ----------
(() => {
  const pedido = new Map(); // nombre → { precio, cantidad }
  const lista = document.getElementById('pedido-lista');
  const vacio = document.getElementById('pedido-vacio');
  const total = document.getElementById('pedido-total');
  const form = document.getElementById('pedido-form');
  const enviar = document.getElementById('pedido-enviar');
  const retiro = document.getElementById('retiro');
  const nombre = document.getElementById('nombre-pedido');
  const botones = new Map();

  document.querySelectorAll('[data-item]').forEach((li) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'add';
    b.textContent = 'Agregar';
    b.setAttribute('aria-label', `Agregar ${li.dataset.item} al pedido`);
    b.addEventListener('click', () => cambiar(li.dataset.item, Number(li.dataset.precio), 1));
    li.appendChild(b);
    botones.set(li.dataset.item, b);
  });

  function cambiar(item, precio, delta) {
    const actual = pedido.get(item) || { precio, cantidad: 0 };
    actual.cantidad += delta;
    if (actual.cantidad <= 0) pedido.delete(item); else pedido.set(item, actual);
    pintar();
  }

  function mensaje() {
    const lineas = [...pedido].map(([item, { cantidad }]) => `${cantidad} × ${item}`);
    const suma = [...pedido.values()].reduce((s, x) => s + x.precio * x.cantidad, 0);
    let t = `Hola, quiero hacer un pedido para llevar:\n${lineas.join('\n')}\nTotal: ${pesos(suma)}\nLo retiro: ${retiro.value.toLowerCase()}.`;
    if (nombre.value.trim()) t += `\nA nombre de ${nombre.value.trim()}.`;
    return t;
  }

  function pintar() {
    lista.innerHTML = '';
    let suma = 0;
    for (const [item, { precio, cantidad }] of pedido) {
      suma += precio * cantidad;
      const li = document.createElement('li');
      li.innerHTML = `<span></span><span class="qty"><button type="button" aria-label="Quitar uno">−</button><span class="nums"></span><button type="button" aria-label="Sumar uno">+</button></span><span class="nums"></span>`;
      li.children[0].textContent = item;
      li.querySelector('.qty .nums').textContent = cantidad;
      li.children[2].textContent = pesos(precio * cantidad);
      const [menos, mas] = li.querySelectorAll('button');
      menos.addEventListener('click', () => cambiar(item, precio, -1));
      mas.addEventListener('click', () => cambiar(item, precio, 1));
      lista.appendChild(li);
    }
    const hay = pedido.size > 0;
    vacio.hidden = hay; total.hidden = !hay; form.hidden = !hay;
    total.querySelector('strong').textContent = pesos(suma);
    enviar.href = wa(mensaje());
    const unidades = [...pedido.values()].reduce((s, x) => s + x.cantidad, 0);
    document.getElementById('order-bar').classList.toggle('is-on', hay);
    document.getElementById('order-bar-texto').textContent = `Tu pedido (${unidades}) · ${pesos(suma)}`;
    botones.forEach((b, item) => {
      const c = pedido.get(item)?.cantidad || 0;
      b.classList.toggle('is-added', c > 0);
      b.textContent = c > 0 ? `Agregado (${c})` : 'Agregar';
      b.dataset.count = c;
    });
  }

  [retiro, nombre].forEach((el) => el.addEventListener('input', () => { enviar.href = wa(mensaje()); }));
  enviar.target = '_blank'; enviar.rel = 'noopener';
  document.getElementById('pedido-vaciar').addEventListener('click', () => { pedido.clear(); pintar(); });
})();

// ---------- Reserva para grupos ----------
(() => {
  const form = document.getElementById('reserva');
  const dia = document.getElementById('r-dia');
  dia.min = new Date().toISOString().slice(0, 10);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fecha = new Date(dia.value + 'T12:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    const t = `Hola, soy ${document.getElementById('r-nombre').value.trim()}. Quiero reservar la mesa para ${document.getElementById('r-personas').value} personas el ${fecha}, en el horario de ${document.getElementById('r-hora').value.toLowerCase()}.`;
    window.open(wa(t), '_blank', 'noopener');
  });
})();

// ---------- Botón flotante después de la portada ----------
(() => {
  const b = document.getElementById('float-wa');
  const portada = document.querySelector('.hero');
  const f = () => b.classList.toggle('is-on', portada.getBoundingClientRect().bottom < 0);
  addEventListener('scroll', f, { passive: true }); f();
})();

// ---------- Entradas suaves: se muestran una vez, nunca quedan ocultas ----------
(() => {
  const items = [...document.querySelectorAll('[data-reveal]')];
  const mostrar = (el) => el.classList.add('is-in');
  if (!('IntersectionObserver' in window)) { items.forEach(mostrar); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { mostrar(e.target); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
  items.forEach((el) => io.observe(el));
  addEventListener('scroll', () => items.forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) mostrar(el); }), { passive: true });
})();
