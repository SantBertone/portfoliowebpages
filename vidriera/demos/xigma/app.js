// Boceto Xigma Estilistas: sin precios, cada servicio abre WhatsApp con su mensaje ya escrito.

const WHATSAPP = '5491168202779';
// Horario por día (0 = domingo … 6 = sábado), en horas de Buenos Aires. Sin entrada = cerrado.
const HORARIO = { 2: [10, 19.5], 3: [10, 19.5], 4: [10, 19.5], 5: [10, 19.5], 6: [10, 19.5] };

const wa = (t) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`;
const hora = (h) => `${Math.floor(h)}${h % 1 ? ':' + String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`;

document.querySelectorAll('[data-wa]').forEach((a) => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });

// ---------- Abierto ahora ----------
(() => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  const ahora = Number(p.hour) + Number(p.minute) / 60;
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const t = HORARIO[dia];
  let texto; let abierto = false;
  if (t && ahora >= t[0] && ahora < t[1]) { abierto = true; texto = `Abierto ahora, hasta las ${hora(t[1])}`; }
  else if (t && ahora < t[0]) texto = `Hoy abrimos a las ${hora(t[0])}`;
  else for (let i = 1; i <= 7; i++) { const d = (dia + i) % 7; if (HORARIO[d]) { texto = `Abrimos ${i === 1 ? 'mañana' : `el ${DIAS[d]}`} a las ${hora(HORARIO[d][0])}`; break; } }
  document.querySelectorAll('[data-estado]').forEach((el) => { el.classList.toggle('is-open', abierto); el.querySelector('[data-estado-texto]').textContent = texto; });
})();

// ---------- Botón flotante: aparece después de la portada ----------
(() => {
  const b = document.getElementById('flotante');
  const portada = document.querySelector('.hero');
  const f = () => b.classList.toggle('is-on', portada.getBoundingClientRect().bottom < 0);
  addEventListener('scroll', f, { passive: true }); f();
})();

// ---------- Entradas al bajar: se repiten cada vez que la sección vuelve a la pantalla ----------
(() => {
  const items = [...document.querySelectorAll('[data-ver]')];
  if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-in')); return; }
  // Entra cuando asoma un poco; se reinicia recién cuando salió del todo, para que no parpadee en el borde.
  const entra = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-in'); }), { rootMargin: '0px 0px -6% 0px' });
  const sale = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) e.target.classList.remove('is-in'); }));
  items.forEach((el) => { entra.observe(el); sale.observe(el); });

  // Portada: si se fue de la pantalla y volvés a subir, su animación arranca de nuevo
  const portada = document.querySelector('.hero');
  let fuera = false;
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) { fuera = true; portada.classList.add('reinicio'); }
    else if (fuera) { fuera = false; portada.classList.remove('reinicio'); }
  }).observe(portada);
})();

// ---------- Movimiento (todo opcional: sin JS o con "reducir movimiento" la página queda quieta y completa) ----------
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Título: cada palabra en su caja, para que suba desde su renglón
  const h1 = document.querySelector('h1');
  if (h1) {
    h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
    let n = 0;
    const partir = (nodo) => {
      [...nodo.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.append(' '); return; }
            const caja = document.createElement('span'); caja.className = 'p-w'; caja.setAttribute('aria-hidden', 'true');
            const p = document.createElement('span'); p.textContent = t; p.style.setProperty('--w', n++);
            caja.append(p); frag.append(caja);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1 && c.tagName !== 'svg') partir(c);
      });
    };
    partir(h1);
    h1.classList.add('partido');
  }

  // El puntaje de Google cuenta de 0 a 4,8 cada vez que aparece
  const nota = document.querySelector('[data-cuenta]');
  if (nota && 'IntersectionObserver' in window) {
    const fin = Number(nota.dataset.cuenta);
    let vuelta = 0;
    nota.textContent = '0,0';
    new IntersectionObserver(([e]) => {
      const mia = ++vuelta;
      if (!e.isIntersecting) { nota.textContent = '0,0'; return; }
      const t0 = performance.now(), dur = 1100;
      const paso = (t) => {
        if (mia !== vuelta) return;
        const k = Math.min(1, (t - t0) / dur), f = 1 - Math.pow(1 - k, 3);
        nota.textContent = (fin * f).toFixed(1).replace('.', ',');
        if (k < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    }, { threshold: 0.6 }).observe(nota);
  }
})();
