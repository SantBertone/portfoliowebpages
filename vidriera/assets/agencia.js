// Vidriera: links de WhatsApp con mensaje armado, menú del teléfono, botón flotante y entradas suaves.

const WHATSAPP = '5491135778063';

// ---------- WhatsApp: cada link con data-wa lleva su mensaje escrito ----------
document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(a.dataset.wa)}`;
  a.target = '_blank';
  a.rel = 'noopener';
});

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
