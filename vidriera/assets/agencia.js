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

const quiereMovimiento = !matchMedia('(prefers-reduced-motion: reduce)').matches;
const abrirWhatsApp = (texto) => window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');

// ---------- Portada: el rubro del título va cambiando ----------
(() => {
  const el = document.querySelector('.rotator');
  if (!el || !quiereMovimiento) return;
  const palabras = el.dataset.palabras.split('|');
  let i = 0;
  setInterval(() => {
    el.classList.add('is-out');
    setTimeout(() => {
      i = (i + 1) % palabras.length;
      el.textContent = palabras[i];
      el.classList.remove('is-out');
    }, 260);
  }, 2200);
})();

// ---------- Botones Compu / Celular (probador y ejemplos) ----------
const conectarDispositivo = (grupo, alCambiar) => {
  grupo.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    grupo.querySelectorAll('button').forEach((x) => {
      x.classList.toggle('is-on', x === b);
      x.setAttribute('aria-pressed', String(x === b));
    });
    alCambiar(b.dataset.device);
  }));
};

// ---------- Probador en vivo: arma un boceto con el nombre, el rubro y el color ----------
(() => {
  const form = document.getElementById('tryit-form');
  if (!form) return;

  const RUBROS = {
    consultorio: { nombre: 'Consultorio', titulo: 'Tu salud, sin esperas ni sorpresas.', bajada: 'Turnos en el día, obras sociales y presupuesto por escrito.', cta: 'Pedir turno', msg: 'Hola, quiero pedir un turno.', foto: 'demos/odontologia/img/consulta.webp',
      servicios: [['Consultas', 'Con turno en el día', 'Hola, quiero un turno para una consulta.'], ['Tratamientos', 'Presupuesto por escrito', 'Hola, quiero consultar por un tratamiento.'], ['Obras sociales', 'Consultá la tuya', 'Hola, ¿atienden con mi obra social?']] },
    cerrajeria: { nombre: 'Cerrajería', titulo: '¿Te quedaste afuera? Llegamos en 30 minutos.', bajada: 'Puertas y autos, sin romper. Te decimos el precio antes de salir.', cta: 'Pedir cerrajero', msg: 'Hola, me quedé afuera. ¿Pueden venir?', foto: 'demos/cerrajeria/img/puerta-llaves.webp',
      servicios: [['Apertura de puertas', 'Sin romper la cerradura', 'Hola, necesito abrir una puerta.'], ['Cambio de cerraduras', 'En el día', 'Hola, quiero cambiar una cerradura.'], ['Copias de llaves', 'Comunes y de seguridad', 'Hola, necesito copias de llaves.']] },
    taller: { nombre: 'Taller mecánico', titulo: 'Tu auto, en buenas manos.', bajada: 'Service, frenos y tren delantero, con presupuesto antes de arrancar.', cta: 'Pedir presupuesto', msg: 'Hola, quiero un presupuesto para mi auto.', foto: 'img/agencia/taller.webp',
      servicios: [['Service completo', 'Aceite y filtros', 'Hola, quiero hacer el service del auto.'], ['Frenos', 'Revisión sin cargo', 'Hola, quiero que me revisen los frenos.'], ['Tren delantero', 'Alineación y balanceo', 'Hola, quiero un turno para alineación y balanceo.']] },
    peluqueria: { nombre: 'Peluquería', titulo: 'Cortes y color que te quedan bien.', bajada: 'Reservá tu turno por WhatsApp en un minuto.', cta: 'Reservar turno', msg: 'Hola, quiero reservar un turno.', foto: 'img/agencia/peluqueria.webp',
      servicios: [['Corte', 'Con lavado incluido', 'Hola, quiero un turno para corte.'], ['Color y mechas', 'Con diagnóstico previo', 'Hola, quiero consultar por color.'], ['Tratamientos', 'Nutrición e hidratación', 'Hola, quiero consultar por un tratamiento.']] },
    gastronomia: { nombre: 'Restaurante o café', titulo: 'Rico, casero y a la vuelta de tu casa.', bajada: 'Mirá la carta y pedí por WhatsApp para retirar o con envío.', cta: 'Hacer un pedido', msg: 'Hola, quiero hacer un pedido.', foto: 'img/agencia/cafeteria.webp',
      servicios: [['Menú del día', 'Distinto cada día', 'Hola, ¿cuál es el menú de hoy?'], ['Para llevar', 'Listo en 20 minutos', 'Hola, quiero pedir para retirar.'], ['Envíos', 'Por el barrio', 'Hola, ¿hacen envíos a mi zona?']] },
    comercio: { nombre: 'Comercio', titulo: 'Todo lo que buscás, a la vuelta.', bajada: 'Consultá stock, precios y horarios por WhatsApp antes de venir.', cta: 'Consultar stock', msg: 'Hola, quería consultar si tienen stock de…', foto: 'img/agencia/tienda-ropa.webp',
      servicios: [['Productos', 'Consultá stock', 'Hola, ¿tienen stock de…?'], ['Envíos', 'En el barrio', 'Hola, ¿hacen envíos?'], ['Pagos', 'Efectivo y transferencia', 'Hola, ¿qué medios de pago aceptan?']] },
    pasteleria: { nombre: 'Pastelería', titulo: 'Tortas por encargo, como las soñaste.', bajada: 'Elegí sabores y tamaño, y encargala por WhatsApp con tres días.', cta: 'Encargar una torta', msg: 'Hola, quiero encargar una torta.', foto: 'demos/pasteleria/img/floral.webp',
      servicios: [['Tortas', 'Desde 10 porciones', 'Hola, quiero encargar una torta de cumpleaños.'], ['Tartas y budines', 'Para el fin de semana', 'Hola, ¿qué tartas tienen?'], ['Mesa dulce', 'Para tu evento', 'Hola, quiero presupuesto de mesa dulce.']] },
    estudio: { nombre: 'Pilates y yoga', titulo: 'Tu primera clase es gratis.', bajada: 'Grupos chicos, todos los días. Reservá tu lugar por WhatsApp.', cta: 'Reservar clase', msg: 'Hola, quiero reservar una clase de prueba.', foto: 'demos/pilates/img/reformer-3.webp',
      servicios: [['Reformer', 'Grupos de seis', 'Hola, quiero probar reformer.'], ['Yoga', 'Mañana y noche', 'Hola, ¿qué horarios de yoga tienen?'], ['Planes', 'Por mes, sin matrícula', 'Hola, quiero saber los precios de los planes.']] },
    veterinaria: { nombre: 'Veterinaria', titulo: 'Tu veterinaria, a la vuelta.', bajada: 'Consultas, vacunas y peluquería canina. Turnos por WhatsApp.', cta: 'Pedir turno', msg: 'Hola, quiero pedir un turno para mi mascota.', foto: 'demos/veterinaria/img/perro-toalla.webp',
      servicios: [['Consultas', 'Con turno en el día', 'Hola, quiero un turno para una consulta.'], ['Vacunas', 'Plan completo', 'Hola, quiero vacunar a mi mascota.'], ['Peluquería canina', 'Baño y corte', 'Hola, quiero un turno de peluquería canina.']] },
  };
  const COLORES = { azul: '#2445e0', verde: '#12805a', naranja: '#e8590c', violeta: '#6d3fd6', rosa: '#d6336c', grafito: '#2b2e35' };

  const $ = (id) => document.getElementById(id);
  const rubrosBox = $('t-rubros');
  rubrosBox.innerHTML = Object.entries(RUBROS).map(([k, r]) =>
    `<label class="option"><input type="radio" name="r" value="${k}"><span>${r.nombre}</span></label>`).join('');
  $('t-colores').innerHTML = Object.entries(COLORES).map(([k, hex]) =>
    `<label class="swatch" style="--sw:${hex}" title="${k}"><input type="radio" name="c" value="${k}" aria-label="Color ${k}"><span></span></label>`).join('');

  // Un link compartido (?n=...&r=...) abre el boceto ya armado.
  const params = new URLSearchParams(location.search);
  const marcar = (name, valor, porDefecto) => {
    const input = form.querySelector(`input[name="${name}"][value="${valor}"]`) || form.querySelector(`input[name="${name}"][value="${porDefecto}"]`);
    input.checked = true;
  };
  $('t-nombre').value = (params.get('n') || '').slice(0, 32);
  $('t-zona').value = (params.get('z') || '').slice(0, 28);
  marcar('r', params.get('r'), 'consultorio');
  marcar('c', params.get('c'), 'azul');
  marcar('e', params.get('e'), 'claro');

  const estado = () => ({
    nombre: $('t-nombre').value.trim(),
    zona: $('t-zona').value.trim(),
    rubro: form.querySelector('input[name="r"]:checked').value,
    color: form.querySelector('input[name="c"]:checked').value,
    estilo: form.querySelector('input[name="e"]:checked').value,
  });
  const slug = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 24) || 'tunegocio';

  const mini = $('mini');
  const dibujar = () => {
    const s = estado();
    const r = RUBROS[s.rubro];
    const nombre = s.nombre || 'Tu negocio';
    mini.style.setProperty('--c', COLORES[s.color]);
    mini.classList.toggle('is-dark', s.estilo === 'oscuro');
    $('m-inicial').textContent = nombre.charAt(0).toUpperCase();
    $('m-nombre').textContent = nombre;
    $('t-url').textContent = `${slug(s.nombre)}.pages.dev`;
    $('m-etiqueta').textContent = s.zona ? `${r.nombre} · ${s.zona}` : r.nombre;
    $('m-titulo').textContent = r.titulo;
    $('m-bajada').textContent = r.bajada;
    $('m-cta').textContent = r.cta;
    $('m-cta').dataset.msg = r.msg;
    $('m-wa').dataset.msg = r.msg;
    $('m-zona').textContent = s.zona || 'Tu barrio';
    const foto = $('m-foto');
    if (!foto.src.endsWith(r.foto)) foto.src = r.foto;
    $('m-servicios').innerHTML = r.servicios.map(([t, d, m]) =>
      `<button class="mini-card" type="button" data-msg="${m}"><b>${t}</b><span>${d}</span></button>`).join('');

    const lugar = s.zona ? ` en ${s.zona}` : '';
    const texto = `Hola, probé el boceto de su web. Mi negocio es ${s.nombre || '(sin nombre todavía)'}, ${r.nombre.toLowerCase()}${lugar}. Elegí el color ${s.color} y el estilo ${s.estilo}. Quiero una web así.`;
    $('t-quiero').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
  };
  form.addEventListener('input', dibujar);
  form.addEventListener('change', dibujar);
  form.addEventListener('submit', (e) => e.preventDefault());
  $('t-quiero').target = '_blank';
  $('t-quiero').rel = 'noopener';
  dibujar();

  // Tocar un botón del boceto muestra el mensaje que le llegaría al negocio.
  const toast = $('m-toast');
  let tiempo;
  mini.addEventListener('click', (e) => {
    const b = e.target.closest('[data-msg]');
    if (!b) return;
    $('m-toast-texto').textContent = `“${b.dataset.msg}”`;
    toast.classList.add('is-on');
    clearTimeout(tiempo);
    tiempo = setTimeout(() => toast.classList.remove('is-on'), 2600);
  });

  conectarDispositivo(document.querySelector('.tryit-bar .segmented'), (d) => {
    $('t-device').classList.toggle('is-compu', d === 'compu');
    $('t-device').classList.toggle('is-celu', d === 'celu');
  });

  // Copiar un link que abre este mismo boceto (sirve para mandárselo a un cliente).
  const copiar = $('t-copiar');
  copiar.addEventListener('click', async () => {
    const s = estado();
    const q = new URLSearchParams({ n: s.nombre, r: s.rubro, z: s.zona, c: s.color, e: s.estilo });
    const link = `${location.href.split(/[?#]/)[0]}?${q}#probala`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const t = Object.assign(document.createElement('textarea'), { value: link });
      document.body.append(t); t.select(); document.execCommand('copy'); t.remove();
    }
    const antes = copiar.textContent;
    copiar.textContent = '¡Link copiado!';
    setTimeout(() => { copiar.textContent = antes; }, 1800);
  });
})();

// ---------- Ejemplos: Compu / Celular y recorrido de la página al pasar el mouse ----------
(() => {
  document.querySelectorAll('.demo').forEach((demo) => {
    const stage = demo.querySelector('.demo-stage');
    const grupo = demo.querySelector('.segmented');
    if (!stage || !grupo) return;
    conectarDispositivo(grupo, (d) => {
      stage.classList.toggle('is-compu', d === 'compu');
      stage.classList.toggle('is-celu', d === 'celu');
    });
  });
  document.querySelectorAll('.scroller').forEach((sc) => {
    const img = sc.querySelector('img');
    const bajar = () => {
      const recorrido = img.offsetHeight - sc.clientHeight;
      if (recorrido <= 0) return;
      img.style.transition = `transform ${Math.min(14, recorrido / 450)}s linear`;
      img.style.transform = `translateY(${-recorrido}px)`;
      sc.classList.add('is-down');
    };
    const subir = () => {
      img.style.transition = 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)';
      img.style.transform = '';
      sc.classList.remove('is-down');
    };
    sc.addEventListener('mouseenter', bajar);
    sc.addEventListener('mouseleave', subir);
    sc.addEventListener('click', () => (sc.classList.contains('is-down') ? subir() : bajar()));
  });
})();

// ---------- Formulario final: arma el mensaje y abre WhatsApp ----------
(() => {
  const form = document.getElementById('contacto-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('c-nombre').value.trim();
    const negocio = document.getElementById('c-negocio').value.trim();
    const pack = form.querySelector('input[name="pack"]:checked').value;
    const mas = document.getElementById('c-mensaje').value.trim();
    let texto = `Hola, soy ${nombre}. Tengo ${negocio} y quiero una web.`;
    texto += pack ? ` Me interesa ${pack}.` : ' Todavía no sé qué web me conviene.';
    if (mas) texto += ` ${mas}`;
    abrirWhatsApp(texto);
  });

  // La misma consulta, por mail: le llega a la casilla con la respuesta automática de Vidriera.
  const MAIL = 'tuvidrieradesarrollo@gmail.com';
  document.getElementById('contacto-mail')?.addEventListener('click', () => {
    if (!form.reportValidity()) return;
    const nombre = document.getElementById('c-nombre').value.trim();
    const negocio = document.getElementById('c-negocio').value.trim();
    const pack = form.querySelector('input[name="pack"]:checked').value;
    const mas = document.getElementById('c-mensaje').value.trim();
    let cuerpo = `Hola, soy ${nombre}. Tengo ${negocio} y quiero una web.`;
    cuerpo += pack ? ` Me interesa ${pack}.` : ' Todavía no sé qué web me conviene.';
    if (mas) cuerpo += `\n\n${mas}`;
    cuerpo += `\n\n${nombre}`;
    const asunto = `Quiero una web para ${negocio}`;
    location.href = `mailto:${MAIL}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  });
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
