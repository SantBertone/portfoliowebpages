// Vidriera: vista previa en vivo, acordeón del proceso y botón flotante de WhatsApp.

// ---------- Vista previa: "Tu negocio" ----------
(() => {
  const form = document.getElementById('try');
  if (!form) return;
  const screen = document.getElementById('preview');
  const out = {
    name: document.getElementById('pv-name'),
    title: document.getElementById('pv-title'),
    text: document.getElementById('pv-text'),
    button: document.getElementById('pv-button'),
    foot: document.getElementById('pv-foot'),
  };
  const name = document.getElementById('try-name');
  const rubro = document.getElementById('try-rubro');
  const barrio = document.getElementById('try-barrio');
  const hidden = document.getElementById('try-text');

  // Textos de ejemplo por rubro; {b} es el barrio.
  const RUBROS = {
    odontologia: { label: 'odontología', title: 'Tu sonrisa, sin miedo y sin sorpresas', text: 'Turnos por WhatsApp en el día, en {b}.', button: 'Pedir turno', foot: 'Abierto hoy de 9 a 20 h' },
    cerrajeria: { label: 'cerrajería', title: 'Llegamos en 30 minutos', text: 'Cerrajero en {b}. Precio por teléfono antes de salir.', button: 'Llamar ahora', foot: 'Atendemos las 24 horas' },
    taller: { label: 'taller mecánico', title: 'Presupuesto antes de tocar tu auto', text: 'Taller en {b}. Te avisamos por WhatsApp en cada etapa.', button: 'Pedir turno', foot: 'Lunes a sábado de 8 a 18 h' },
    gastronomia: { label: 'gastronomía', title: 'Reservá tu mesa en un toque', text: 'La carta completa y los horarios de {b}, siempre al día.', button: 'Reservar', foot: 'Hoy abrimos a las 12 h' },
    estudio: { label: 'estudio profesional', title: 'Tus papeles en orden, sin vueltas', text: 'Estudio en {b}. Primera consulta por videollamada.', button: 'Agendar consulta', foot: 'Lunes a viernes de 9 a 18 h' },
    comercio: { label: 'comercio', title: 'Todo lo que buscás, a la vuelta', text: 'Precios, horarios y envíos en {b}.', button: 'Escribinos', foot: 'Abierto hoy hasta las 20 h' },
  };

  const update = () => {
    const r = RUBROS[rubro.value] || RUBROS.comercio;
    const b = barrio.value.trim() || 'tu barrio';
    const n = name.value.trim() || 'Tu negocio';
    screen.dataset.rubro = rubro.value;
    out.name.textContent = n;
    out.title.textContent = r.title;
    out.text.textContent = r.text.replace('{b}', b);
    out.button.textContent = r.button;
    out.foot.textContent = r.foot;
    hidden.value = `Hola, quiero una web para ${n === 'Tu negocio' ? 'mi negocio' : n} (${r.label}${barrio.value.trim() ? ', ' + b : ''}). La armé en la vista previa de Vidriera.`;
  };
  [name, rubro, barrio].forEach((el) => el.addEventListener('input', update));
  update();

  // Al enviar, abre WhatsApp solo con el texto (no hace falta mandar los demás campos).
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    update();
    window.open(`${form.action}?text=${encodeURIComponent(hidden.value)}`, '_blank', 'noopener');
  });
})();

// ---------- Acordeón del proceso ----------
(() => {
  const stages = [...document.querySelectorAll('.stage')];
  stages.forEach((stage) => {
    stage.querySelector('.stage-name').addEventListener('click', () => {
      stages.forEach((s) => {
        const open = s === stage;
        s.classList.toggle('is-open', open);
        s.querySelector('.stage-name').setAttribute('aria-expanded', String(open));
      });
    });
  });
})();

// ---------- Botón flotante: aparece después de la portada y toma los colores del capítulo ----------
(() => {
  const btn = document.getElementById('float-wa');
  const hero = document.querySelector('.hero');
  if (!btn || !hero) return;
  const show = () => btn.classList.toggle('is-on', hero.getBoundingClientRect().bottom < 0);
  addEventListener('scroll', show, { passive: true });
  show();
  if (!('IntersectionObserver' in window)) return;
  const chapters = document.querySelectorAll('main [data-ink], footer[data-ink]');
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      // El botón usa la tinta del capítulo como fondo y el color del capítulo como texto.
      btn.style.setProperty('--fl-bg', entry.target.dataset.ink);
      btn.style.setProperty('--fl-ink', entry.target.dataset.ground);
    }
  }, { rootMargin: '-90% 0px 0px 0px', threshold: 0 });
  chapters.forEach((el) => io.observe(el));
})();
