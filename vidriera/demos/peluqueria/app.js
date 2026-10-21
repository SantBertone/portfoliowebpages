// Demo peluquería: la lista de precios arma el turno (suma tiempo y precio) y lo manda por WhatsApp.
// Para personalizar la demo de un cliente, cambiá estas constantes y los textos del HTML.

const WHATSAPP = '5491135778063';
// Horario por día (0 = domingo … 6 = sábado), en horas de Buenos Aires. Sin entrada = cerrado.
const HORARIO = { 2: [10, 20], 3: [10, 20], 4: [10, 20], 5: [10, 20], 6: [10, 20] };

const wa = (t) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`;
const pesos = (n) => '$' + n.toLocaleString('es-AR');
const duracion = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}`);

document.querySelectorAll('[data-wa]').forEach((a) => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });

// ---------- Abierto ahora ----------
const ahoraBA = () => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), hora: Number(p.hour) + Number(p.minute) / 60 };
};
(() => {
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const { dia, hora } = ahoraBA();
  const t = HORARIO[dia];
  let texto; let abierto = false;
  if (t && hora >= t[0] && hora < t[1]) { abierto = true; texto = `Abierto ahora, hasta las ${t[1]} h`; }
  else if (t && hora < t[0]) texto = `Hoy abrimos a las ${t[0]} h`;
  else for (let i = 1; i <= 7; i++) { const d = (dia + i) % 7; if (HORARIO[d]) { texto = `Abrimos ${i === 1 ? 'mañana' : `el ${DIAS[d]}`} a las ${HORARIO[d][0]} h`; break; } }
  document.querySelectorAll('[data-estado]').forEach((el) => { el.classList.toggle('is-open', abierto); el.querySelector('[data-estado-texto]').textContent = texto; });
})();

// ---------- El turno: cada servicio de la lista se puede tildar ----------
(() => {
  const filas = [...document.querySelectorAll('tr[data-servicio]')];
  const elegidos = new Set();
  const dia = document.getElementById('t-dia');
  const franja = document.getElementById('t-franja');
  const enviar = document.getElementById('turno-enviar');

  // Próximos días en que el salón abre
  const hoy = new Date();
  for (let i = 1, n = 0; n < 8 && i < 20; i++) {
    const d = new Date(hoy); d.setDate(hoy.getDate() + i);
    if (!HORARIO[d.getDay()]) continue;
    const o = document.createElement('option');
    o.textContent = d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).replace(',', '');
    dia.appendChild(o); n++;
  }

  // Fila de encabezado: una columna más para tildar
  document.querySelector('.price-table thead tr').insertAdjacentHTML('beforeend', '<th scope="col"><span class="sr-only">Elegir</span></th>');
  document.querySelectorAll('.price-table tr.group th').forEach((th) => th.setAttribute('colspan', '4'));
  filas.forEach((tr, i) => {
    const td = document.createElement('td');
    td.className = 'pick';
    td.innerHTML = `<label><input type="checkbox" id="s${i}"><span class="sr-only">Elegir ${tr.dataset.servicio}</span></label>`;
    tr.appendChild(td);
    td.querySelector('input').addEventListener('change', (e) => {
      if (e.target.checked) elegidos.add(tr); else elegidos.delete(tr);
      tr.classList.toggle('is-picked', e.target.checked);
      pintar();
    });
  });

  function pintar() {
    const lista = [...elegidos];
    const min = lista.reduce((s, tr) => s + Number(tr.dataset.min), 0);
    const precio = lista.reduce((s, tr) => s + Number(tr.dataset.precio), 0);
    document.getElementById('turno').classList.toggle('is-on', lista.length > 0);
    document.getElementById('turno-detalle').hidden = false;
    document.getElementById('turno-tiempo').textContent = duracion(min);
    document.getElementById('turno-precio').textContent = pesos(precio);
    const servicios = lista.map((tr) => tr.dataset.servicio.toLowerCase());
    const listaTexto = servicios.length > 1 ? `${servicios.slice(0, -1).join(', ')} y ${servicios.at(-1)}` : servicios[0];
    enviar.href = wa(`Hola, quiero un turno para ${listaTexto} (más o menos ${duracion(min)}, ${pesos(precio)}). ¿Tienen lugar el ${dia.value} ${franja.value.toLowerCase()}?`);
  }
  [dia, franja].forEach((el) => el.addEventListener('change', pintar));
})();

// ---------- Botón flotante después de la portada ----------
(() => {
  const b = document.getElementById('float-wa');
  const portada = document.querySelector('.hero');
  const f = () => b.classList.toggle('is-on', portada.getBoundingClientRect().bottom < 0);
  addEventListener('scroll', f, { passive: true }); f();
})();

// ---------- Entradas suaves ----------
(() => {
  const items = [...document.querySelectorAll('[data-reveal]')];
  const mostrar = (el) => el.classList.add('is-in');
  if (!('IntersectionObserver' in window)) { items.forEach(mostrar); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { mostrar(e.target); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
  items.forEach((el) => io.observe(el));
  addEventListener('scroll', () => items.forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) mostrar(el); }), { passive: true });
})();
