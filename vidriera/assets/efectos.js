// Vidriera: movimiento de la landing. Todo es un extra: sin JavaScript o con "reducir movimiento", la página se lee igual.
'use strict';

(() => {
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (quieto) return;
  const raiz = document.documentElement;
  const limitar = (n, min, max) => Math.min(max, Math.max(min, n));

  // ---------- Títulos: cada palabra sube desde su renglón ----------
  // Solo títulos de texto simple; el texto completo queda en aria-label para lectores de pantalla.
  document.querySelectorAll('.h2[data-reveal], .final-title[data-reveal]').forEach((h) => {
    if (h.children.length) return;
    const palabras = h.textContent.trim().split(/\s+/);
    h.setAttribute('aria-label', h.textContent.trim());
    h.textContent = '';
    palabras.forEach((p, i) => {
      const caja = document.createElement('span');
      caja.className = 'w';
      caja.setAttribute('aria-hidden', 'true');
      const letra = document.createElement('span');
      letra.textContent = p;
      letra.style.setProperty('--w', i);
      caja.append(letra);
      h.append(caja, ' ');
    });
    h.classList.add('is-split');
  });

  // ---------- La idea: el texto se entinta palabra por palabra mientras se lee ----------
  const idea = document.querySelector('[data-tinta]');
  let tinta = [];
  if (idea) {
    const texto = idea.textContent.trim();
    idea.setAttribute('aria-label', texto);
    idea.textContent = '';
    tinta = texto.split(/\s+/).map((p) => {
      const s = document.createElement('span');
      s.textContent = p;
      s.setAttribute('aria-hidden', 'true');
      idea.append(s, ' ');
      return s;
    });
    idea.classList.add('is-tinta');
  }

  // ---------- Proceso: una línea que se completa al bajar y enciende cada paso ----------
  const proceso = document.querySelector('.timeline');
  const pasos = proceso ? [...proceso.children] : [];

  // ---------- Cinta de rubros: acompaña la velocidad del scroll ----------
  const cinta = document.querySelector('.ticker-track');
  const animCinta = cinta && cinta.getAnimations ? cinta.getAnimations()[0] : null;
  let ritmo = 1;

  // Un solo cálculo por cuadro para todo lo que depende del scroll
  let ultimoY = scrollY, pendiente = false;
  const pintar = () => {
    pendiente = false;
    const alto = innerHeight;

    if (idea) {
      const r = idea.getBoundingClientRect();
      const avance = limitar((alto * 0.82 - r.top) / (r.height + alto * 0.32), 0, 1);
      const hasta = Math.round(avance * tinta.length);
      tinta.forEach((s, i) => { s.classList.toggle('on', i < hasta); s.classList.toggle('now', i === hasta - 1 && hasta < tinta.length); });
    }

    if (proceso) {
      const r = proceso.getBoundingClientRect();
      const avance = limitar((alto * 0.75 - r.top) / (r.height + alto * 0.2), 0, 1);
      proceso.style.setProperty('--avance', avance.toFixed(3));
      pasos.forEach((li, i) => li.classList.toggle('is-lit', avance > (i + 0.35) / pasos.length));
    }

    if (animCinta) {
      const velocidad = Math.abs(scrollY - ultimoY);
      ritmo = Math.max(1, Math.min(6, 1 + velocidad / 14), ritmo * 0.94);
      animCinta.playbackRate = ritmo;
      if (ritmo > 1.02) pedir();
    }
    ultimoY = scrollY;
  };
  const pedir = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); } };
  addEventListener('scroll', pedir, { passive: true });
  addEventListener('resize', pedir);
  pintar();

  // ---------- Botones principales: se acercan apenas al cursor (solo con mouse) ----------
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.hero-actions .btn, .plan-featured .btn, .contact-send').forEach((b) => {
      b.classList.add('is-iman');
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(1) + 'px');
        b.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * 8).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); });
    });
  }

  raiz.classList.add('fx');
})();
