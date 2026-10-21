// Demo pilates y yoga: la grilla de clases por día y tipo, y la clase de prueba que se pide por WhatsApp.
// Para personalizar la demo de un cliente, cambiá estas constantes y los textos del HTML.

const WHATSAPP = '5491135778063';
// Horario del estudio por día (0 = domingo … 6 = sábado), en horas de Buenos Aires.
const HORARIO = { 1: [7, 21], 2: [7, 21], 3: [7, 21], 4: [7, 21], 5: [7, 21], 6: [9, 13] };
// Clases de la semana: [hora, clase, tipo, profesora, lugares libres]
const LUNES = [['08:00', 'Reformer inicial', 'Reformer', 'Lucía', 2], ['09:30', 'Yoga suave', 'Yoga', 'Pilar', 5], ['12:30', 'Reformer intermedio', 'Reformer', 'Lucía', 1], ['18:00', 'Reformer inicial', 'Reformer', 'Sofi', 3], ['19:30', 'Vinyasa', 'Yoga', 'Pilar', 4], ['20:30', 'Mat', 'Mat', 'Sofi', 6]];
const MARTES = [['07:30', 'Reformer intermedio', 'Reformer', 'Sofi', 1], ['10:00', 'Pilates prenatal', 'Mat', 'Lucía', 2], ['12:30', 'Mat', 'Mat', 'Lucía', 4], ['18:30', 'Reformer inicial', 'Reformer', 'Lucía', 2], ['19:30', 'Yoga suave', 'Yoga', 'Pilar', 6], ['20:00', 'Reformer avanzado', 'Reformer', 'Sofi', 3]];
const CLASES = {
  1: LUNES, 2: MARTES, 3: LUNES, 4: MARTES,
  5: [['08:00', 'Reformer inicial', 'Reformer', 'Lucía', 3], ['12:30', 'Mat', 'Mat', 'Sofi', 5], ['18:00', 'Reformer intermedio', 'Reformer', 'Sofi', 2], ['19:00', 'Vinyasa', 'Yoga', 'Pilar', 4]],
  6: [['09:30', 'Reformer inicial', 'Reformer', 'Lucía', 2], ['11:00', 'Yoga suave', 'Yoga', 'Pilar', 6], ['12:00', 'Reformer intermedio', 'Reformer', 'Lucía', 3]],
};
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const wa = (t) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`;
document.querySelectorAll('[data-wa]').forEach((a) => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });

const ahoraBA = () => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), hora: Number(p.hour) + Number(p.minute) / 60 };
};
const { dia: hoy, hora: horaHoy } = ahoraBA();
const enHoras = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h + m / 60; };

// ---------- Abierto ahora ----------
(() => {
  const t = HORARIO[hoy];
  let texto; let abierto = false;
  if (t && horaHoy >= t[0] && horaHoy < t[1]) { abierto = true; texto = `Abierto ahora, hasta las ${t[1]} h`; }
  else if (t && horaHoy < t[0]) texto = `Hoy abrimos a las ${t[0]} h`;
  else for (let i = 1; i <= 7; i++) { const d = (hoy + i) % 7; if (HORARIO[d]) { texto = `Abrimos ${i === 1 ? 'mañana' : `el ${DIAS[d].toLowerCase()}`} a las ${HORARIO[d][0]} h`; break; } }
  document.querySelectorAll('[data-estado]').forEach((el) => { el.classList.toggle('is-open', abierto); el.querySelector('[data-estado-texto]').textContent = texto; });
})();

// ---------- Grilla de clases ----------
(() => {
  const dias = document.getElementById('dias');
  const tipos = document.getElementById('tipos');
  const filas = document.getElementById('filas');
  const selectClase = document.getElementById('p-clase');
  // Arranca en hoy si quedan clases; si no, en el próximo día con clases
  let diaSel = [0, 1, 2, 3, 4, 5, 6].map((i) => (hoy + i) % 7).find((d, i) => CLASES[d] && (i > 0 || CLASES[d].some((c) => enHoras(c[0]) > horaHoy)));
  let tipoSel = 'todas';
  let elegida = '';

  [1, 2, 3, 4, 5, 6].forEach((d) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'day'; b.dataset.dia = d;
    b.innerHTML = d === hoy ? `${DIAS[d].slice(0, 3)} <small>(hoy)</small>` : DIAS[d].slice(0, 3);
    b.setAttribute('aria-label', d === hoy ? `${DIAS[d]}, hoy` : DIAS[d]);
    dias.appendChild(b);
  });

  // Opciones de la clase de prueba: todas las clases de la semana
  [1, 2, 3, 4, 5, 6].forEach((d) => CLASES[d].forEach(([h, nombre]) => {
    const o = document.createElement('option');
    o.value = o.textContent = `${DIAS[d]} ${h} · ${nombre}`;
    selectClase.appendChild(o);
  }));

  function pintar() {
    dias.querySelectorAll('.day').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.dia) === diaSel)));
    tipos.querySelectorAll('.kind').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tipo === tipoSel)));
    const lista = CLASES[diaSel].filter((c) => tipoSel === 'todas' || c[2] === tipoSel);
    const proxima = diaSel === hoy ? lista.find((c) => enHoras(c[0]) > horaHoy) : null;
    filas.textContent = '';
    if (!lista.length) { filas.innerHTML = `<li class="row-empty">No hay clases de ${tipoSel.toLowerCase()} el ${DIAS[diaSel].toLowerCase()}. Probá otro día.</li>`; return; }
    lista.forEach((c) => {
      const [h, nombre, , profe, lugares] = c;
      const valor = `${DIAS[diaSel]} ${h} · ${nombre}`;
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'row' + (c === proxima ? ' is-next' : '') + (valor === elegida ? ' is-picked' : '');
      b.innerHTML = `<span class="row-time nums">${h}${c === proxima ? ' · la próxima' : ''}</span><span class="row-name">${nombre}</span><span class="row-info">${profe} · ${lugares === 1 ? 'queda 1 lugar' : `${lugares} lugares`}</span>`;
      b.addEventListener('click', () => {
        elegida = valor;
        selectClase.value = valor;
        pintar();
        document.getElementById('prueba').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        setTimeout(() => document.getElementById('p-nombre').focus({ preventScroll: true }), 600);
      });
      li.appendChild(b); filas.appendChild(li);
    });
  }

  dias.addEventListener('click', (e) => { const b = e.target.closest('.day'); if (b) { diaSel = Number(b.dataset.dia); pintar(); } });
  tipos.addEventListener('click', (e) => { const b = e.target.closest('.kind'); if (b) { tipoSel = b.dataset.tipo; pintar(); } });
  selectClase.addEventListener('change', () => { elegida = selectClase.value; pintar(); });
  pintar();
})();

// ---------- Clase de prueba por WhatsApp ----------
(() => {
  const form = document.getElementById('form-prueba');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const nombre = document.getElementById('p-nombre').value.trim();
    const clase = document.getElementById('p-clase').value;
    const nivel = form.querySelector('[name="nivel"]:checked').value;
    const nota = document.getElementById('p-nota').value.trim();
    let cual = '¿Qué clase me recomiendan?';
    if (clase) { const [diaHora, nombreClase] = clase.split(' · '); const [d, h] = diaHora.split(' '); cual = `Me interesa ${nombreClase.toLowerCase()}, el ${d.toLowerCase()} a las ${h}.`; }
    const msg = `Hola, soy ${nombre} y quiero reservar mi clase de prueba gratis. ${cual} ${nivel}.${nota ? ` Les cuento: ${nota}.` : ''}`;
    window.open(wa(msg), '_blank', 'noopener');
  });
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
