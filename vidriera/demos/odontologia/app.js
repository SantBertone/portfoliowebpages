// Demo odontología: links de WhatsApp con mensaje armado, "abierto ahora", menú del teléfono y entradas suaves.
// Para personalizar la demo de un cliente, cambiá estas dos constantes y los textos del HTML.

const WHATSAPP = '5491135778063';
// Horario por día (0 = domingo … 6 = sábado), en horas de Buenos Aires. Sin entrada = cerrado.
const HORARIO = { 1: [9, 20], 2: [9, 20], 3: [9, 20], 4: [9, 20], 5: [9, 20], 6: [9, 13] };

// ---------- WhatsApp: cada link con data-wa lleva su mensaje escrito ----------
document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(a.dataset.wa)}`;
  a.target = '_blank';
  a.rel = 'noopener';
});

// ---------- Abierto ahora, con la hora de Buenos Aires ----------
(() => {
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const partes = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(new Date()).map((p) => [p.type, p.value]));
  const hoy = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(partes.weekday);
  const hora = Number(partes.hour) + Number(partes.minute) / 60;

  let texto;
  let abierto = false;
  const turno = HORARIO[hoy];
  if (turno && hora >= turno[0] && hora < turno[1]) {
    abierto = true;
    texto = `Abierto ahora, hasta las ${turno[1]} h`;
  } else if (turno && hora < turno[0]) {
    texto = `Cerrado. Abrimos hoy a las ${turno[0]} h`;
  } else {
    for (let i = 1; i <= 7; i++) {
      const dia = (hoy + i) % 7;
      if (HORARIO[dia]) { texto = `Cerrado. Abrimos ${i === 1 ? 'mañana' : `el ${DIAS[dia]}`} a las ${HORARIO[dia][0]} h`; break; }
    }
  }

  document.querySelectorAll('[data-estado]').forEach((el) => {
    el.classList.toggle('is-open', abierto);
    el.querySelector('[data-estado-texto]').textContent = texto;
  });
  document.querySelectorAll('tr[data-dias]').forEach((tr) => {
    tr.classList.toggle('is-today', tr.dataset.dias.split(',').map(Number).includes(hoy));
  });
})();

// ---------- Menú del teléfono ----------
(() => {
  const top = document.getElementById('top');
  const btn = top.querySelector('.menu-btn');
  const cerrar = () => { top.classList.remove('nav-open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    const abierto = top.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', String(abierto));
  });
  top.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', cerrar));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
})();

// ---------- Cabecera con línea al bajar y botón flotante después de la portada ----------
(() => {
  const top = document.getElementById('top');
  const flotante = document.getElementById('float-wa');
  const portada = document.querySelector('.hero');
  const actualizar = () => {
    top.classList.toggle('is-scrolled', scrollY > 8);
    flotante.classList.toggle('is-on', portada.getBoundingClientRect().bottom < 0);
  };
  addEventListener('scroll', actualizar, { passive: true });
  actualizar();
})();

// ---------- Entradas suaves: se muestran una vez, nunca quedan ocultas ----------
(() => {
  const items = [...document.querySelectorAll('[data-reveal]')];
  const mostrar = (el) => el.classList.add('is-in');
  if (!('IntersectionObserver' in window)) { items.forEach(mostrar); return; }
  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { if (e.isIntersecting) { mostrar(e.target); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach((el) => io.observe(el));
  // Si se salta por la página con el menú, lo que quedó arriba se muestra igual.
  addEventListener('scroll', () => items.forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) mostrar(el); }), { passive: true });
})();
