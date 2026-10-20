// Demo cerrajería: tiempo de llegada según el barrio, acordeón, tira de fotos y "te llamamos".

// ---------- ¿Dónde estás? La tabla de zonas es la única fuente de datos ----------
(() => {
  const select = document.getElementById('barrio');
  const rows = [...document.querySelectorAll('#lineup tr[data-min]')];
  if (!select || !rows.length) return;
  const minOut = document.getElementById('eta-min');
  const nowOut = document.getElementById('eta-now');

  select.innerHTML = rows.map((r, i) => `<option value="${i}">${r.cells[0].textContent}</option>`).join('');

  const update = () => {
    const row = rows[Number(select.value)] || rows[0];
    const { min, max } = row.dataset;
    const horario = row.cells[2].textContent.trim();
    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    const hora = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
    const night = h >= 22 || h < 7;
    let open = true;
    if (horario !== '24 h') { const [a, b] = horario.match(/\d+/g).map(Number); open = h >= a && h < b; }

    minOut.textContent = open ? `Llegamos en ${min} a ${max} minutos.` : `Ahora no llegamos a ${row.cells[0].textContent}.`;
    nowOut.textContent = !open
      ? `Ahí atendemos de ${horario}. Dejanos un WhatsApp y te llamamos a primera hora.`
      : night
        ? `Son las ${hora}: atendemos igual, con recargo nocturno que te decimos antes de salir.`
        : `Son las ${hora}: hay cerrajeros en camino por tu zona.`;

    rows.forEach((r) => r.classList.toggle('is-here', r === row));
  };
  select.addEventListener('change', update);
  update();
})();

// ---------- Acordeón ----------
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

// ---------- Tira de fotos: se duplica para girar sin cortes ----------
(() => {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  track.append(...[...track.children].map((n) => n.cloneNode(true)));
  track.classList.add('is-running');
})();

// ---------- Te llamamos: arma el WhatsApp con nombre y teléfono ----------
(() => {
  const form = document.getElementById('callback');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cb-name').value.trim();
    const tel = document.getElementById('cb-tel').value.trim();
    const text = `Hola, soy ${name}. Necesito un cerrajero, ¿me llaman al ${tel}?`;
    window.open(`${form.action}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
})();
