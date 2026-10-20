// Demo odontología: el armador de turnos escribe el mensaje de WhatsApp mientras elegís.
(() => {
  const form = document.getElementById('composer');
  if (!form) return;
  const bubble = document.getElementById('bubble');
  const hidden = document.getElementById('composer-text');
  const os = document.getElementById('os');

  const message = () => {
    const tratamiento = form.querySelector('input[name="tratamiento"]:checked')?.value || 'un control';
    const franja = form.querySelector('input[name="franja"]:checked')?.value || '';
    const obra = os.value.trim();
    const que = tratamiento === 'una urgencia' ? 'una urgencia' : `un turno para ${tratamiento}`;
    let text = `Hola, quiero ${que}`;
    if (franja && tratamiento !== 'una urgencia') text += ` ${franja}`;
    text += '.';
    if (tratamiento === 'una urgencia') text += ' ¿Tienen algún turno libre hoy?';
    if (obra) text += ` Tengo ${obra}.`;
    return text;
  };

  const update = () => { const t = message(); bubble.textContent = t; hidden.value = t; };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    window.open(`${form.action}?text=${encodeURIComponent(message())}`, '_blank', 'noopener');
  });
})();

// Botón flotante en el teléfono, después de la primera pantalla.
(() => {
  const btn = document.getElementById('float-turno');
  const hero = document.querySelector('.hero');
  if (!btn || !hero) return;
  const show = () => btn.classList.toggle('is-on', hero.getBoundingClientRect().bottom < 0);
  addEventListener('scroll', show, { passive: true });
  show();
})();
