# Contexto del proyecto: agencia "Vidriera"

> Resumen para continuar en otra sesión de Claude. Última actualización: 20/10/2026 (segunda sesión: rediseño como landings y repo en GitHub).
> Leelo completo antes de tocar nada. Responder siempre en español (Argentina, con voseo en los textos para clientes).

---

## 1. Quién es y qué está armando

- **Santiago Bertone**, estudiante de UADE en Buenos Aires, con conocimientos técnicos de desarrollo web.
  - WhatsApp y teléfono: **+54 11 3577-8063** (en los links: `5491135778063` y `+541135778063`).
  - Email: **santiobertone@gmail.com**.
- **Negocio:** agencia unipersonal de digitalización para comercios de barrio. Hace, rescata y protege webs de negocios que:
  - no tienen web,
  - tienen la web vieja o desactualizada, o
  - tienen la web hackeada (por ejemplo, con spam de casinos).
- **Nombre de trabajo:** "Vidriera" (la web es la vidriera del negocio en Google). Todavía no está confirmado y puede cambiar.
- **Zona inicial:** Palermo y alrededores (CABA).
- **Rubros iniciales:** odontología, cerrajería y urgencias, y talleres mecánicos.

## 2. Estrategia comercial (ya definida en la primera sesión)

- **Qué se vende:** confianza, velocidad, seguridad y clientes nuevos, no "código". Lo rentable es el **cobro mensual** de mantenimiento.
- **ACTUALIZACIÓN (20/10/2026, segunda sesión) — lo que vale hoy:** Santiago **solo hace la página web**. Nada de Google Maps, ficha de Google Business, SEO local, rescates de webs hackeadas ni planes mensuales.
  - **Packs en pesos, pago único, 50% al empezar y 50% al publicar:**
    - **Esencial $150.000:** página única (portada, servicios y contacto), botón de WhatsApp con mensaje armado, pensada para el celular, textos y fotos incluidos, candado de seguridad, 1 ronda de cambios. 5 días hábiles.
    - **Completa $200.000 (recomendada):** + un botón de WhatsApp por servicio, reseñas del cliente y preguntas frecuentes, horarios con "abierto ahora", vista previa con foto al compartir por WhatsApp (Open Graph), título y descripción para Google + alta en Search Console, 2 rondas de cambios. 7 días hábiles.
    - **Profesional $250.000:** + secciones extra (galería, equipo o lista de precios), estadísticas de visitas (Cloudflare Web Analytics), código QR para el local o las tarjetas, 3 rondas de cambios, 30 días de ajustes después de publicar. 10 días hábiles.
  - **Hosting gratis en Cloudflare Pages, sin cuota mensual**, en `tunegocio.pages.dev`. El **dominio propio es opcional**: el cliente lo registra a su nombre en NIC Argentina y lo paga aparte por año; se conecta sin costo. Los cambios posteriores se cotizan aparte.
  - Lo que sigue en esta sección (packs en USD, planes mensuales, rescate, etc.) es **la estrategia vieja**: queda como referencia, pero no está en la web.
- **Packs viejos (ya no se ofrecen así; precios de referencia en USD):**
  - **Rescate:** desde USD 150. Limpieza de malware y spam, actualización, cambio de accesos y pedido de revisión a Google. Entrega en 48 a 72 h, con 3 meses de mantenimiento incluidos.
  - **Presencia:** desde USD 250. Landing de una página con WhatsApp, mapa, horarios y textos. Dominio y SSL por un año. Entrega en 5 días hábiles.
  - **Profesional:** desde USD 500. Hasta 5 secciones, SEO local, optimización de la ficha de Google Business, formulario y estadísticas, opción de WordPress seguro. Entrega en 7 a 10 días.
  - **Planes mensuales:** Esencial USD 15, Plus USD 35, Pro USD 80. También hay "web por suscripción" desde USD 40 por mes, con permanencia mínima de 12 meses.
- **Proceso con el cliente:**
  1. Diagnóstico gratis de 15 minutos.
  2. Propuesta cerrada en 24 h.
  3. Seña del 50%.
  4. Formulario de onboarding.
  5. Borrador en 5 días, con 2 rondas de cambios.
  6. Pago del resto al publicar.
- **Garantías:** dominio a nombre del cliente, precio cerrado, rehacer el borrador o devolver la seña, sin permanencias escondidas.
- **Prospección:**
  - Buscar en Google Maps negocios con muchas reseñas y sin web, o con la web vieja o hackeada.
  - Armar una **demo personalizada** antes de contactar.
  - Visitar en persona y escribir por WhatsApp de a uno (nunca mensajes masivos).
  - Seguimiento a los 3, 7 y 14 días.
- **Meta del primer mes:** unos 100 contactos, 15 diagnósticos y 3 a 5 clientes a precio de lanzamiento, a cambio de testimonio y referidos.
- **Ingresos recurrentes a futuro:** hosting y mantenimiento, gestión de la ficha de Google, sistema de reseñas (QR y WhatsApp), turnos online, chatbot de WhatsApp, asistente con IA, menú QR, tiendas online, email con dominio, landings de temporada y Ads.
- **Reglas éticas acordadas:**
  - Revisar solo lo que ve cualquier visitante. Nunca escanear ni intentar entrar a webs ajenas sin permiso escrito.
  - No inventar reseñas, clientes, cifras ni casos.

## 3. Decisiones de Santiago (respetarlas)

1. El proyecto vive en el repo de GitHub **https://github.com/SantBertone/portfoliowebpages** (rama `main`), para trabajar desde varias computadoras. Para empezar en una compu nueva: `git clone https://github.com/SantBertone/portfoliowebpages`. Copias locales conocidas: `C:\Users\santi\OneDrive\Escritorio\PROYECTO` y `C:\Users\Mr Robot\Desktop\PROYECTO\PROYECTO`. Siempre hacer `git pull` antes de tocar y `git push` al terminar.
   - **Las páginas tienen que ser landings informativas**, al estilo de https://franciscoguillen.vercel.app/humo/index.html, /miga/, /burger-break/ y https://nosolorulos.pages.dev/. Nada de herramientas interactivas complejas: **a lo sumo, botones que mandan un mensaje predeterminado al WhatsApp del cliente**.
2. Sus datos de contacto ya están cargados en los sitios.
3. **El hosting va a ser Cloudflare Pages**, porque es gratis y permite uso comercial. El plan Hobby de Vercel es solo para uso no comercial. **La publicación se deja para el final.**
4. **El dominio lo paga y es del cliente, si lo quiere.** En NIC.ar se registra con la clave fiscal del titular. La web de la agencia puede arrancar en `*.pages.dev`.
5. Le expliqué cómo sacar el monotributo (ver la sección 7); lo hace él.
6. Google Business e Instagram de la agencia: **más adelante**.
7. Contrato, propuesta en PDF y formulario de onboarding: **más adelante**.
8. La planilla de prospectos ya está hecha (ver la sección 5).

## 4. Qué hay en la carpeta

```
portfoliowebpages/             raíz del repo de GitHub (rama main)
├── CONTEXTO_PROYECTO.md        este archivo
├── README.md                   cómo está organizado el repo
├── Prospectos_Vidriera.xlsx    planilla de prospectos reales
└── vidriera/                   el sitio
    ├── index.html              landing de la agencia
    ├── assets/                 agencia.css, agencia.js
    ├── img/agencia/            fotos (webp) y capturas de las demos; credits.json
    ├── demos/odontologia/      index.html, estilos.css, app.js, img/ (+ credits.json); independiente
    ├── demos/cerrajeria/       index.html, estilos.css, app.js, img/ (+ credits.json); independiente
    ├── _headers                cabeceras y caché para Cloudflare Pages
    ├── vercel.json, .vercelignore   por si algún día se usa Vercel
    ├── robots.txt              bloquea /demos/ para los buscadores
    ├── favicon.svg, README.md, .gitignore
    ├── tools/                  utilidades locales (no publicar); necesitan Node y Chrome
    │   ├── serve.mjs           servidor estático: node tools/serve.mjs 4321
    │   ├── captura.mjs         regenera las capturas de las demos (img/agencia/demo-*.webp)
    │   ├── optimize-images.mjs jpg/png → webp (máx. 1400 px)
    │   └── chrome.mjs          abre Chrome sin ventana por DevTools (lo usan los otros dos)
    └── .taste-skill/           (solo local, en .gitignore) direcciones de diseño del primer diseño, ya reemplazado
```

### Stack técnico
- **HTML, CSS y JavaScript nativo, sin build ni dependencias.** Se eligió así porque en la carpeta temporal de la primera sesión no se podía ejecutar esbuild, que Astro necesita. En la carpeta real quizá ya funcione: migrar a Astro es opcional y queda pendiente.
- **Rutas relativas en todo el sitio** (por ejemplo `assets/...`, `../../assets/...`, `demos/odontologia/index.html`), para que funcione con doble clic y publicado. **No volver a usar rutas que empiecen con `/`.**
- **Tipografías** desde Google Fonts. Las imágenes ya están optimizadas en webp.
- **WhatsApp con mensaje armado:** cada link con `data-wa="texto"` se convierte en `https://wa.me/<número>?text=<texto>`. El número está una sola vez en la constante `WHATSAPP` de cada `app.js` (y de `assets/agencia.js`); el `href` del HTML queda como respaldo sin JavaScript.
- **Animaciones de entrada** (`data-rise`, `data-reveal`): solo con JavaScript y sin `prefers-reduced-motion`; nunca dejan contenido oculto.
- **Git:** el repo es la carpeta raíz (no `vidriera/`). Usar `git config core.longpaths true` y como autor "Santiago Bertone <santiobertone@gmail.com>".

### Cómo está hecho cada sitio (rediseño del 20/10/2026, segunda sesión)
El primer diseño (hecho con la skill `design-taste-frontend`, muy editorial y con herramientas interactivas) se **reemplazó** porque Santiago quiere landings comerciales como las de referencia. El diseño actual es propio, sin la skill.

- **Agencia** (`index.html`). Ahora es una **presentación de lo que hacemos** con los packs en pesos (ver la sección 2). Crema `#f7f3ec`, tinta `#161615`, naranja `#ff8126` (botones), celeste `#4db3ff` y lima `#c5f53d` como acentos. Red Hat Display 900 + Red Hat Text. Logo: tres bloques de color + "Vidriera".
  - **Interactivo (inspirado en https://lmsstudio.vercel.app/, la web de un amigo de Santiago; no copiar sus textos):**
    - Título con el rubro que rota: "Hacemos la web de tu negocio / consultorio / cerrajería / taller…" (`data-palabras` en `.rotator`).
    - **Probador en vivo** (`#probala`): nombre, rubro (6), barrio, color (6) y estilo claro/oscuro arman un boceto con fotos reales del rubro, vista Compu/Celular y dirección `nombre.pages.dev`. Los botones del boceto muestran el mensaje que llegaría. "Quiero esta web" manda todo por WhatsApp. **"Copiar el link de mi boceto"** genera `index.html?n=Nombre&r=rubro&z=Barrio&c=color&e=claro#probala`: sirve para mandarle a un prospecto su boceto ya armado. Los textos por rubro están en `RUBROS` de `assets/agencia.js`.
    - Ejemplos con botón Compu/Celular y recorrido de la página completa al pasar el mouse (capturas `img/agencia/demo-*-full.webp`, generadas con `node tools/captura.mjs`).
    - Formulario final (`#contacto`): nombre, negocio, pack (Esencial / Completa / Profesional / No sé) y comentario; arma el mensaje y abre WhatsApp. Sin servidor.
  - Secciones: portada "Hacemos la web de tu negocio." con foto de un barbero riéndose con un cliente, un celular con la demo dental y una burbuja de WhatsApp; franja de rubros; probador en vivo; "Para quién es" (sin web / solo Instagram / web vieja); "Qué hacemos" (6 ítems); ejemplos (las demos, con "Quiero una así"); "¿Tenés otro rubro?"; precios (Esencial, Completa destacada, Profesional) + "¿Dónde queda tu web?" (dirección gratis .pages.dev, dominio propio opcional, cambios después); proceso (Día 0, 1, 5, Online); garantías; preguntas (incluye "¿Tengo que pagar algo por mes?" y "¿Qué es el dominio?"); cierre "Mirala antes de pagar." con el formulario a WhatsApp; pie.
  - Se sacó la "vista previa en vivo" del armador de webs.
- **Demo de odontología** ("Dental Palermo", ficticio). Crema `#f6f2ea`, cobalto `#2445e0`, amarillo `#f4d84a`. Fraunces + Figtree. Estilo bento como Miga.
  - Secciones: portada en bloques (título, foto, horario con "Abierto ahora" calculado con la hora de Buenos Aires, puntaje, franja "¿Te duele ahora?"); franja de confianza; 6 tratamientos con foto y botón de turno con mensaje; primera consulta en 3 pasos; consultorio y doctora (M.N. 00000 ficticia); "¿Atienden con tu obra social?" con chips de prepagas; reseñas **de ejemplo, con aviso**; preguntas; "Visitanos" con horarios (resalta hoy) y botones de turno, cómo llegar y llamar. Sin mapa embebido (decisión de Santiago).
- **Demo de cerrajería** ("LlaveYa", ficticio). Negro `#111`, amarillo `#ffd400`, fondo `#f2f0eb`. Barlow Condensed + Barlow. Estilo urgencia, como Burger Break.
  - Secciones: portada negra "¿Te quedaste afuera? Llegamos en 30 minutos." con Llamar y WhatsApp; **"¿Qué te pasó?"**: 6 casos que mandan el mensaje escrito; servicios con foto y "Consultar precio"; banda amarilla de números; cómo trabajamos (4 pasos); barrios con tiempo de llegada (cada barrio manda "estoy en X"); reseñas de ejemplo; preguntas; cierre amarillo con el teléfono gigante.
  - En el teléfono, la barra de Llamar y WhatsApp está siempre visible. Tiene JSON-LD `Locksmith`; la dental tiene JSON-LD `Dentist`.
- **En las demos, los links de WhatsApp y teléfono van al número real de Santiago**, a propósito: cuando un prospecto prueba la demo, el mensaje le llega a él. Los demás datos de las demos son ficticios.
- **Fotos:** de **Unsplash** (licencia de Unsplash: uso comercial permitido, sin atribución obligatoria). El link de cada una está en los `credits.json`. Se eligieron desde la búsqueda con `license=free` (las de Unsplash+ no sirven). Las fotos viejas de Wikimedia/The Met se borraron (quedan en el historial de git).
- Se verificaron las tres páginas con capturas a 1440 y 390 px (sin scroll horizontal).

### Pendientes en el sitio
- Agregar el **CUIT** al pie de `index.html` cuando Santiago tenga el monotributo (hoy dice "© 2026 Vidriera, de Santiago Bertone.").
- Confirmar o cambiar el nombre "Vidriera". Aparece en el título, el logo en bloques, los textos y los guiones de la planilla.
- **PUBLICADO (20/10/2026) en https://vidriera.pages.dev/**, con el repo conectado a Cloudflare Pages: cada push a `main` se publica solo. Vista previa para WhatsApp con `og:image` absoluta (`img/og-vidriera.jpg` y `demos/*/img/og.jpg`, 1200x630). Si cambia el dominio, actualizar `og:url`, `og:image` y `canonical` en los tres `index.html`.
- Cómo quedó configurado: Santiago crea la cuenta y conecta el repo (Claude no puede crear cuentas ni autorizar GitHub). Build command `node vidriera/tools/build.mjs`, output `dist`, rama `main`. Después de cada `git push` se publica solo. Cuando esté la URL definitiva, pasar `og:image` a una dirección absoluta (WhatsApp no muestra la vista previa con rutas relativas). Método viejo, por si hace falta:
  - Santiago crea su cuenta e inicia sesión con `npx wrangler login`. Claude no puede crear cuentas ni ingresar credenciales.
  - Publicar **solo los archivos del sitio** (`vidriera/`), sin `tools/`, `.taste-skill/`, `README.md` ni los `credits.json`. Lo más simple es copiarlos a una carpeta `dist/` y correr `npx wrangler pages deploy dist --project-name vidriera`. Alternativa: conectar el repo de GitHub a Cloudflare Pages.
- Opcional: sumar demos de taller mecánico, gastronomía y estudio contable (mismo estilo landing), y migrar las plantillas a Astro para generar demos personalizadas más rápido.
- Si cambia una demo, correr `node tools/captura.mjs` (desde `vidriera/`) para actualizar las capturas de la web de la agencia.

## 5. La planilla `Prospectos_Vidriera.xlsx`

- Hojas: **Cómo usar**, **Prospectos**, **Resumen**, **Puntos**, **Guiones**.
- **34 negocios reales** relevados el 20/10/2026 con la búsqueda local de Google (`google.com/search?q=...&tbm=lcl`), más una revisión pasiva de cada web con `curl`:
  - 16 cerrajerías, 11 odontólogos y 7 talleres de Palermo, Villa Crespo y Barrio Norte.
  - 22 sin web propia, 5 solo con redes o WhatsApp, y el resto con problemas en la web: lenta, caída, sin HTTPS forzado, pie desactualizado, WordPress desactualizado o hecha con Jimdo.
- **Columnas:** número, Prioridad, Puntos, Negocio, Rubro, Zona, Dirección, Teléfono, Tipo de línea, WhatsApp (HYPERLINK a wa.me), Puntaje Google, Reseñas, Horario, Web actual, Situación, Problema detectado, Cómo verificarlo, Gancho para el primer mensaje, Pack sugerido, Canal recomendado, Guion a usar, Demo a mostrar, Estado (lista desplegable), Fecha 1er contacto, Seguimientos a +3, +7 y +14 días (fórmulas), Próximo paso y Notas. Las celdas amarillas las completa Santiago.
- **Prioridad por fórmula:** puntos según la situación (tabla en la hoja Puntos), +2 con 100 reseñas o más, +1 con 30 a 99, +1 con puntaje de 4,5 o más, −2 con puntaje menor a 3. Alta con 5 o más, Media con 3 a 4. El reparto calculado es **17 de prioridad alta, 14 media y 3 baja**.
- **Prospectos de prioridad alta:**
  - Cerrajerías: Herrería Punta Palermo, Santi, Keys 24 h, Antigua Norte, Maciel, Manu, Sam-se y Ezequiel.
  - Odontología: Dres. Gallo, Dentaloffice, Palermo Dental (Güemes), DLT, BYM, Dental Palermo (Charcas, con la web lenta) y Malva (con la web caída).
  - Talleres: Taller Palermo (chapa y pintura) y Gomería y Mecánica 24 h.
- **Advertencias:**
  - Los datos de Google cambian; verificar antes de contactar.
  - "Malva Odontología" no cargó desde la red de UADE; probar con datos móviles.
  - Trevisani y Borges tienen un link en Google que no se pudo identificar.
  - El tipo de línea (fijo o celular) está deducido del número.
- Las fórmulas se calculan al abrir el archivo; no se precalcularon porque no hay LibreOffice instalado. El generador fue un script de Python con openpyxl, ya instalado con `pip --user`.

## 6. Próximos pasos sugeridos (en orden)

1. **Personalizar una demo para un prospecto de prioridad alta.** Copiar `demos/odontologia/` y cambiar nombre, barrio, fotos, mapa, horario (`HORARIO` en `app.js`) y **sus reseñas reales** (sacar el aviso de "reseñas de ejemplo"). El candidato sugerido es Odontología Dentaloffice: 124 reseñas de 5 estrellas y sin web.
2. **Contrato** de una página (alcance, 2 rondas de cambios, 50/50, dominio a nombre del cliente, mantenimiento aparte), **propuesta en PDF** con las 3 opciones y **formulario de onboarding** (Google Forms o Tally).
3. **Precios de lanzamiento en pesos.**
4. **Tarjetas con QR** a la web para las visitas presenciales.
5. **Google Business e Instagram** de la agencia (Santiago lo dejó para más adelante).
6. **Publicar en Cloudflare Pages**, al final.

## 7. Monotributo (explicado, lo hace Santiago)

1. **Clave fiscal nivel 3:** desde la app **Mi ARCA**, validando con el DNI y una selfie.
2. **Adhesión:** en arca.gob.ar, **Monotributo → Adherir**.
3. **Actividad:** una de servicios informáticos, por ejemplo **620100**. Confirmarla con un contador.
4. **Categoría:** la A al empezar. Los topes se actualizan cada seis meses.
5. **Obra social:** elegir una. La cuota incluye la obra social y la jubilación.
6. **Ingresos Brutos:** en CABA y en la Provincia de Buenos Aires suele venir unificado en la misma cuota.
7. **Domicilio fiscal electrónico:** aceptarlo.
8. **Punto de venta:** dar de alta uno del tipo "Factura en línea – Monotributo" y emitir **Factura C**.
9. **Después:** pagar la cuota antes del día 20 de cada mes y recategorizarse en enero y julio.

## 8. Notas del entorno (Windows) útiles para la próxima sesión

- **Compu "Mr Robot"** (segunda sesión): proyecto en `C:\Users\Mr Robot\Desktop\PROYECTO\PROYECTO`. Hay Node 22.23, Python 3.13 con Pillow, Git y Chrome. No hay `gh` ni 7-Zip (el `tar.exe` de Windows lista archivos `.rar`). El Chrome headless con `--window-size` no baja de unos 500 px de ancho: para capturas de celular usar DevTools (`Emulation.setDeviceMetricsOverride`), como hace `tools/chrome.mjs`.
- Las páginas usan `scroll-behavior: smooth`: en scripts de captura, hacer `scrollTo({ top, behavior: 'instant' })`.

- Escritorio: `C:\Users\santi\OneDrive\Escritorio`. Hay Node 22.16, Python 3.14 (con openpyxl), Git y Chrome en `C:\Program Files\Google\Chrome\Application\chrome.exe`. No hay LibreOffice.
- En la herramienta Bash, los heredocs a veces se comían las barras invertidas (`\`). Para escribir archivos con regex o JSON, usar la herramienta Write.
- Al llamar a `python -` con un heredoc, el proceso se colgó. Usar archivos `.py` y `timeout`.
- Las herramientas de la skill de diseño (`draw.mjs`, `inspect.mjs`, `lint.mjs`, `assets.mjs`) están dentro de la carpeta de la skill `design-taste-frontend`. Para inspeccionar, levantar el servidor con `node tools/serve.mjs 4321` en `vidriera/` y correr `node <skill>/scripts/inspect.mjs http://localhost:4321/...`.
- Para relevar prospectos funciona la búsqueda local de Google en el navegador integrado. Google Maps directo muestra una "vista limitada". El botón "Sitio web" está dentro de la tarjeta de cada resultado: si la tarjeta lo tiene, el negocio tiene web; los links `aclk` son anuncios.
