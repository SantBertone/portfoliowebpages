# Vidriera: sitio de la agencia y demos por rubro

Sitio estático en HTML, CSS y JavaScript nativo. No necesita build: se publica tal cual.

```
index.html                  Landing de la agencia
assets/                     agencia.css y agencia.js
img/agencia/                Fotos de la agencia y capturas de las demos
demos/odontologia/          Demo de consultorio (index.html, estilos.css, app.js, img/)
demos/cerrajeria/           Demo de cerrajería de urgencia (index.html, estilos.css, app.js, img/)
demos/cafeteria/            Demo de cafetería: carta con pedido para llevar y reserva
demos/hamburgueseria/       Demo de hamburguesería: "Armá la tuya" y carrito con delivery
demos/peluqueria/           Demo de peluquería y estética: lista de precios que arma el turno
demos/pasteleria/           Demo de pastelería: "Armá tu torta" con precio estimado
demos/pilates/              Demo de pilates y yoga: grilla de clases y clase de prueba
demos/veterinaria/          Demo de veterinaria: plan de vacunas según la fecha de nacimiento
_headers                    Caché y cabeceras de seguridad para Cloudflare Pages
vercel.json                 Lo mismo, por si algún día se usa Vercel
tools/                      Utilidades locales (no se publican)
```

## Cómo están hechas

- Son **landings informativas**: portada, servicios, cómo trabajamos, reseñas, preguntas, horarios y contacto.
- La única interacción es **WhatsApp con mensaje armado**: cada link con `data-wa="..."` abre WhatsApp con ese texto ya escrito. El número está una sola vez, en la constante `WHATSAPP` de cada `app.js` (y en `assets/agencia.js`).
- La demo de odontología muestra "Abierto ahora" con la hora de Buenos Aires. El horario está en la constante `HORARIO` de `demos/odontologia/app.js`.
- La web de la agencia tiene un **probador en vivo** (`#probala`). El botón "Copiar el link de mi boceto" da un link como `index.html?n=Ferreteria%20Don%20Luis&r=comercio&z=Caballito&c=verde&e=claro#probala`, que abre el boceto ya armado: sirve para mandárselo a un prospecto. Rubros válidos: consultorio, cerrajeria, taller, peluqueria, gastronomia, comercio, pasteleria, estudio, veterinaria. Colores: azul, verde, naranja, violeta, rosa, grafito.
- Cada demo es independiente: no usa archivos de afuera de su carpeta, salvo el link a la web de la agencia.
- Todas las rutas son relativas, para que funcione con doble clic y publicado.

## Hacer la demo de un cliente

1. Duplicá la carpeta de la demo del rubro (por ejemplo `demos/odontologia` → `demos/dentaloffice`).
2. En `index.html` cambiá nombre, dirección, textos, mapa y **sus reseñas reales de Google** (sacá la nota de "reseñas de ejemplo").
3. En `app.js` poné su número de WhatsApp y su horario.
4. Cambiá las fotos de `img/` (las de Unsplash se pueden usar comercialmente) y actualizá `credits.json`.

## Datos cargados

- WhatsApp y teléfono: +54 11 3577-8063 (en los links figura como `5491135778063` y `+541135778063`). En las demos también apuntan a este número, para que el mensaje de prueba le llegue a Santiago.
- Contacto: Santiago Bertone, tuvidrieradesarrollo@gmail.com.
- Falta el CUIT: agregalo al pie de `index.html` cuando tengas el monotributo.
- "Vidriera" es un nombre de trabajo; está en `index.html` (título, logo y textos).
- Demos: los negocios, direcciones, matrículas, reseñas y tiempos de llegada son ficticios.

## Probar en tu computadora

Abrí `index.html` con doble clic, o levantá un servidor:

```bash
node tools/serve.mjs 4321
```

Después abrí http://localhost:4321

## Herramientas (necesitan Node y Chrome)

```bash
node tools/captura.mjs
```

Regenera las capturas de las demos que se ven en la web de la agencia (primera pantalla y página completa de odontología y cerrajería, y la primera pantalla de las demos de "Más rubros" en `img/agencia/rubro-*.webp`). Correlo cada vez que cambies una demo, y actualizá el `height` de las imágenes `-full` en `index.html` con lo que imprime.

```bash
node tools/unsplash.mjs fotos.json
```

Baja fotos de Unsplash en webp liviano a `demos/<demo>/img/` y anota el link de cada una en su `credits.json`. El formato de `fotos.json` está explicado al principio del script. Sirve para armar la demo de un rubro nuevo con fotos de plantilla; cuando el cliente manda las suyas, se reemplazan con el mismo nombre de archivo.

```bash
node tools/optimize-images.mjs demos/odontologia/img
```

Convierte los JPG o PNG de esa carpeta a WebP livianos de 1400 px de ancho.

```bash
node tools/og.mjs
```

Regenera `img/og-vidriera.jpg`, la imagen que aparece al compartir la web por WhatsApp. El diseño está en `tools/og-vidriera.html` (si cambiás precios o textos, cambialos ahí también). Después subí el número de `?v=` en el `og:image` de `index.html` para que WhatsApp la vuelva a buscar.

## Publicar en Cloudflare Pages (gratis, permite uso comercial)

El repo de GitHub está conectado (o se conecta) a Cloudflare Pages: **cada `git push` a `main` publica solo**.

Configuración del proyecto en Cloudflare (Workers & Pages → Create → Pages → Connect to Git):

| Campo | Valor |
|---|---|
| Repositorio | `SantBertone/portfoliowebpages` |
| Production branch | `main` |
| Framework preset | None |
| Build command | `node vidriera/tools/build.mjs` |
| Build output directory | `dist` |

`tools/build.mjs` copia `vidriera/` a `dist/` sin `tools/`, `README.md`, los `credits.json` ni los archivos de Vercel. Para ver qué se publica, corrélo desde la raíz del repo:

```bash
node vidriera/tools/build.mjs
```

Links para mandar (cambiá `vidriera` por el nombre que tenga el proyecto en Cloudflare):

- Web de la agencia: `https://vidriera.pages.dev/`
- Ejemplos: `https://vidriera.pages.dev/demos/<rubro>/` (odontologia, cerrajeria, cafeteria, hamburgueseria, peluqueria, pasteleria, pilates, veterinaria)
- Boceto armado para un prospecto: `https://vidriera.pages.dev/?n=Ferreteria%20Don%20Luis&r=comercio&z=Caballito&c=verde&e=claro#probala`

## Fotos

Las fotos son de Unsplash (licencia de Unsplash: uso comercial permitido, sin atribución obligatoria). El link de origen de cada una está en los `credits.json` de cada carpeta de imágenes.
