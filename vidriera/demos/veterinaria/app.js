// Demo veterinaria: la foto fija cambia según la parte, y el plan de vacunas se arma con la fecha de nacimiento.
// Para personalizar la demo de un cliente, cambiá estas constantes y los textos del HTML.

const WHATSAPP = '5491135778063';
// Horario por día (0 = domingo … 6 = sábado), en horas de Buenos Aires. Sin entrada = cerrado.
const HORARIO = { 1: [9, 20], 2: [9, 20], 3: [9, 20], 4: [9, 20], 5: [9, 20], 6: [9, 14] };
// Plan orientativo: [qué se aplica, a los cuántos días de vida]. 'anual' = refuerzo cada año.
const PLAN = {
  perro: [
    ['A los 21 días', [['Primera desparasitación', 21]]],
    ['A los 45 días', [['Vacuna puppy', 45], ['Segunda desparasitación', 45]]],
    ['A los 2 meses', [['Séxtuple, primera dosis', 60]]],
    ['A los 3 meses', [['Séxtuple, segunda dosis', 90]]],
    ['A los 4 meses', [['Séxtuple, tercera dosis', 120], ['Antirrábica', 120]]],
    ['Cada año', [['Refuerzo séxtuple y antirrábica', 'anual']]],
  ],
  gato: [
    ['A los 21 días', [['Primera desparasitación', 21]]],
    ['A los 2 meses', [['Triple felina, primera dosis', 60]]],
    ['A los 3 meses', [['Triple felina, segunda dosis', 90]]],
    ['A los 4 meses', [['Antirrábica', 120]]],
    ['Cada año', [['Refuerzo triple felina y antirrábica', 'anual']]],
  ],
};

const wa = (t) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`;
document.querySelectorAll('[data-wa]').forEach((a) => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });

// ---------- Abierto ahora ----------
(() => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  const hora = Number(p.hour) + Number(p.minute) / 60;
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const t = HORARIO[dia];
  let texto; let abierto = false;
  if (t && hora >= t[0] && hora < t[1]) { abierto = true; texto = `Abierto ahora, hasta las ${t[1]} h`; }
  else if (t && hora < t[0]) texto = `Hoy abrimos a las ${t[0]} h. Urgencias, las 24 h`;
  else for (let i = 1; i <= 7; i++) { const d = (dia + i) % 7; if (HORARIO[d]) { texto = `Abrimos ${i === 1 ? 'mañana' : `el ${DIAS[d]}`} a las ${HORARIO[d][0]} h. Urgencias, las 24 h`; break; } }
  document.querySelectorAll('[data-estado]').forEach((el) => { el.classList.toggle('is-open', abierto); el.querySelector('[data-estado-texto]').textContent = texto; });
})();

// ---------- Plan de vacunas ----------
(() => {
  const $ = (id) => document.getElementById(id);
  const form = $('plan-form');
  const nacimiento = $('v-nacimiento');
  const DIA = 86400000;
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const corta = (d) => d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined }).replace('.', '');
  const larga = (d) => d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined }).replace(',', '');

  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  nacimiento.max = iso(hoy);
  // De ejemplo, un cachorro de siete semanas
  nacimiento.value = iso(new Date(hoy.getTime() - 50 * DIA));

  function pintar() {
    const especie = form.querySelector('[name="especie"]:checked').value;
    const nombre = $('v-nombre').value.trim();
    const quien = nombre || (especie === 'perro' ? 'tu perro' : 'tu gato');
    const filas = $('slip-filas');
    const total = $('slip-total');
    const boton = $('plan-turno');
    filas.textContent = '';
    $('slip-titulo').textContent = `Plan de ${quien}`;
    if (!nacimiento.value) { $('slip-fecha').textContent = ''; total.textContent = 'Elegí la fecha de nacimiento'; return; }
    const [a, m, d] = nacimiento.value.split('-').map(Number);
    const nac = new Date(a, m - 1, d);
    $('slip-fecha').textContent = `nació el ${corta(nac)}`;

    let proxima = null;
    PLAN[especie].forEach(([grupo, items]) => {
      const g = document.createElement('p'); g.className = 'slip-group'; g.textContent = grupo; filas.appendChild(g);
      items.forEach(([que, dias]) => {
        let fecha;
        if (dias === 'anual') {
          // El refuerzo cae cada año desde la última dosis de los 4 meses
          fecha = new Date(nac.getTime() + 120 * DIA);
          do fecha.setFullYear(fecha.getFullYear() + 1); while (fecha < hoy);
        } else fecha = new Date(nac.getTime() + dias * DIA);
        const fila = document.createElement('p');
        const pasada = fecha < hoy;
        const esProxima = !pasada && !proxima;
        if (esProxima) proxima = { que, fecha };
        fila.className = 'slip-row' + (pasada ? ' is-past' : '') + (esProxima ? ' is-next' : '');
        fila.innerHTML = `<span class="what">${que}</span><span class="dots" aria-hidden="true"></span><span class="when nums">${corta(fecha)}</span>`;
        filas.appendChild(fila);
      });
    });
    total.innerHTML = `<span>Próxima: ${proxima.que.toLowerCase()}</span><span class="nums">${corta(proxima.fecha)}</span>`;
    boton.href = wa(`Hola, quiero pedir turno para ${nombre ? `${nombre} (${especie})` : `mi ${especie}`}. Según el plan le toca ${proxima.que.toLowerCase()} el ${larga(proxima.fecha)}. ¿Tienen lugar?`);
  }
  form.addEventListener('input', pintar);
  form.addEventListener('submit', (e) => e.preventDefault());
  pintar();
})();

// ---------- La foto fija cambia con la sección ----------
(() => {
  const fotos = [...document.querySelectorAll('.stage-photo img')];
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    fotos.forEach((f) => f.classList.toggle('is-on', f.dataset.foto === e.target.dataset.seccion));
  }), { rootMargin: '-45% 0px -45% 0px' });
  document.querySelectorAll('[data-seccion]').forEach((s) => io.observe(s));
})();

// ---------- Botón flotante después de la portada ----------
(() => {
  const b = document.getElementById('float-wa');
  const portada = document.querySelector('.card');
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
