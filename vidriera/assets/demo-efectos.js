// Vidriera: movimiento compartido de las demos. Es un extra: sin JavaScript o con "reducir movimiento", todo queda visible.
'use strict';

(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ---------- Fotos: aparecen cuando terminan de cargar, sin saltos ----------
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    if (img.complete) return;
    img.classList.add('vd-foto');
    const lista = () => img.classList.add('is-lista');
    img.addEventListener('load', lista, { once: true });
    img.addEventListener('error', lista, { once: true });
  });

  // ---------- Títulos de sección: cada palabra sube desde su renglón al entrar en pantalla ----------
  // Solo títulos de texto simple que estén a la vista (no los de paneles ocultos, pedidos o formularios).
  if ('IntersectionObserver' in window) {
    const ver = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('vd-sube'); ver.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('h2').forEach((h) => {
      if (h.children.length || h.classList.contains('sr-only') || h.offsetParent === null) return;
      if (h.closest('.vd-cierre, aside, dialog, form, [hidden]')) return;
      const texto = h.textContent.trim();
      if (!texto) return;
      h.setAttribute('aria-label', texto);
      h.textContent = '';
      texto.split(/\s+/).forEach((p, i) => {
        const caja = document.createElement('span');
        caja.className = 'vd-w';
        caja.setAttribute('aria-hidden', 'true');
        const letra = document.createElement('span');
        letra.textContent = p;
        letra.style.setProperty('--w', i);
        caja.append(letra);
        h.append(caja, ' ');
      });
      h.classList.add('vd-titulo');
      ver.observe(h);
    });
  }

  // ---------- Cierre de Vidriera: el título sube palabra por palabra y los datos se trazan en orden ----------
  const cierre = document.querySelector('.vd-cierre');
  if (cierre && 'IntersectionObserver' in window) {
    const titulo = cierre.querySelector('h2');
    const texto = titulo.textContent.trim();
    titulo.setAttribute('aria-label', texto);
    titulo.textContent = '';
    texto.split(/\s+/).forEach((p, i) => {
      const caja = document.createElement('span');
      caja.className = 'vd-w';
      caja.setAttribute('aria-hidden', 'true');
      const letra = document.createElement('span');
      letra.textContent = p;
      letra.style.setProperty('--w', i);
      caja.append(letra);
      titulo.append(caja, ' ');
    });
    cierre.classList.add('vd-espera');
    new IntersectionObserver((entradas, io) => {
      if (entradas.some((e) => e.isIntersecting)) { cierre.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.25 }).observe(cierre);
  }

  // ---------- Botones de Vidriera: se acercan apenas al cursor (solo con mouse) ----------
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.vd-btn').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(1) + 'px');
        b.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * 8).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); });
    });
  }
})();
