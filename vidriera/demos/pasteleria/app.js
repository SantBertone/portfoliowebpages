// Demo pastelería: "Armá tu torta" dibuja la torta vista desde arriba, estima el precio y la encarga por WhatsApp.
// Para personalizar la demo de un cliente, cambiá estas constantes y los textos del HTML.

const WHATSAPP = '5491135778063';
// Horario de retiro por día (0 = domingo … 6 = sábado), en horas de Buenos Aires. Sin entrada = cerrado.
const HORARIO = { 2: [10, 19], 3: [10, 19], 4: [10, 19], 5: [10, 19], 6: [10, 19] };
// Precio base por porciones y lo que suma cada opción.
const BASE = { 10: 38000, 15: 52000, 20: 66000, 30: 98000 };
const SUMA = { 'Red velvet': 3000, 'Crema y frutillas': 3000, 'Mousse de chocolate': 2500, ganache: 2000, rosa: 1000, pistacho: 5000, frase: 1500 };
// Días de anticipación: 3 para tortas, 7 para las de dos pisos.
const anticipacion = (porciones) => (porciones >= 30 ? 7 : 3);

const wa = (t) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`;
const pesos = (n) => '$' + n.toLocaleString('es-AR');

document.querySelectorAll('[data-wa]').forEach((a) => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });

// ---------- Abierto ahora (para retirar) ----------
(() => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  const hora = Number(p.hour) + Number(p.minute) / 60;
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const t = HORARIO[dia];
  let texto; let abierto = false;
  if (t && hora >= t[0] && hora < t[1]) { abierto = true; texto = `Abierto para retirar, hasta las ${t[1]} h`; }
  else if (t && hora < t[0]) texto = `Hoy abrimos a las ${t[0]} h`;
  else for (let i = 1; i <= 7; i++) { const d = (dia + i) % 7; if (HORARIO[d]) { texto = `Abrimos ${i === 1 ? 'mañana' : `el ${DIAS[d]}`} a las ${HORARIO[d][0]} h`; break; } }
  document.querySelectorAll('[data-estado]').forEach((el) => { el.classList.toggle('is-open', abierto); el.querySelector('[data-estado-texto]').textContent = texto; });
})();

// ---------- Armá tu torta ----------
(() => {
  const form = document.getElementById('torta');
  const $ = (id) => document.getElementById(id);
  const svg = $('cake');
  const NS = 'http://www.w3.org/2000/svg';
  const COLOR = { crema: '#fbf3ea', ganache: '#5a2e22', rosa: '#f4b6c3', pistacho: '#bcd9a8' };
  const ROSETA = { crema: '#f4b6c3', ganache: '#8a4a36', rosa: '#ffffff', pistacho: '#ffffff' };
  const TEXTO = { crema: '#c42b4f', ganache: '#fbe3c6', rosa: '#a11f3f', pistacho: '#3a1f2b' };

  const el = (tag, attrs, padre = svg) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); padre.appendChild(n); return n; };

  // Fecha mínima según anticipación
  const isoLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  function fechaMinima() {
    const d = new Date(); d.setDate(d.getDate() + anticipacion(Number($('porciones').value)));
    $('fecha').min = isoLocal(d);
    if ($('fecha').value && $('fecha').value < $('fecha').min) $('fecha').value = '';
  }

  function precio() {
    const v = (id) => $(id).value;
    let total = BASE[v('porciones')];
    total += SUMA[v('bizcochuelo')] || 0;
    total += SUMA[v('relleno')] || 0;
    total += SUMA[v('cobertura')] || 0;
    if ($('frase').value.trim()) total += SUMA.frase;
    return total;
  }

  function dibujar() {
    const porciones = Number($('porciones').value);
    const cob = $('cobertura').value;
    const frase = $('frase').value.trim();
    svg.textContent = '';
    el('circle', { cx: 150, cy: 150, r: 146, fill: '#ffffff' });
    el('circle', { cx: 150, cy: 150, r: 132, fill: '#f8d3da' });
    const r = { 10: 96, 15: 108, 20: 118, 30: 124 }[porciones];
    const pisos = porciones >= 30 ? [r, 78] : [r];
    pisos.forEach((radio, piso) => {
      el('circle', { cx: 150, cy: 150, r: radio, fill: COLOR[cob], stroke: piso ? 'rgb(58 31 43 / .18)' : 'none', 'stroke-width': 3 });
      // Rosetas alrededor del borde: más porciones, más rosetas
      const n = Math.round(radio / 6);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        el('circle', { cx: 150 + Math.cos(a) * (radio - 11), cy: 150 + Math.sin(a) * (radio - 11), r: 7, fill: ROSETA[cob] });
      }
    });
    // Frutillas si el relleno las lleva
    if ($('relleno').value === 'Crema y frutillas') {
      [[-38, -30], [34, -40], [44, 26], [-30, 40], [0, -58], [-58, 6]].forEach(([x, y]) => el('circle', { cx: 150 + x, cy: 150 + y, r: 9, fill: '#c42b4f' }));
    }
    if (frase) {
      const t = el('text', { x: 150, y: 156, 'text-anchor': 'middle', fill: TEXTO[cob], 'font-family': 'Stack Sans Headline, system-ui, sans-serif', 'font-weight': 300, 'font-size': frase.length > 14 ? 16 : 22 });
      t.textContent = frase;
    }
    $('estimado').textContent = pesos(precio());
  }

  form.addEventListener('input', () => { fechaMinima(); dibujar(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const [a, m, d] = $('fecha').value.split('-').map(Number);
    const dia = new Date(a, m - 1, d).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).replace(',', '');
    const frase = $('frase').value.trim();
    const cobTexto = $('cobertura').selectedOptions[0].textContent.toLowerCase();
    const msg = `Hola, quiero encargar una torta de ${$('porciones').value} porciones: bizcochuelo de ${$('bizcochuelo').value.toLowerCase()}, relleno de ${$('relleno').value.toLowerCase()} y cobertura de ${cobTexto}${frase ? `, con la frase "${frase}"` : ''}. Es para el ${dia}. El precio estimado es ${pesos(precio())}. ¿Me confirman?`;
    window.open(wa(msg), '_blank', 'noopener');
  });

  // En el teléfono el corte del cupón queda entre la torta y el formulario
  const muesca = () => form.style.setProperty('--notch', `${form.querySelector('.coupon-left').offsetHeight - 22}px`);
  addEventListener('resize', muesca);

  fechaMinima(); dibujar(); muesca();
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
