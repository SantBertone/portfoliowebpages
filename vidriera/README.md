# Vidriera: sitio de la agencia y demos por rubro

Sitio estático en HTML, CSS y JavaScript nativo. No necesita build: Vercel publica los archivos tal cual.

```
index.html                  Sitio de la agencia
assets/                     base.css y base.js (compartidos), agencia.css, agencia.js
img/agencia/                Fotos de la agencia y capturas de las demos
demos/odontologia/          Demo de consultorio (index.html, estilos.css, app.js, img/)
demos/cerrajeria/           Demo de cerrajería de urgencia (index.html, estilos.css, app.js, img/)
vercel.json                 URLs limpias, caché de imágenes y cabeceras de seguridad
tools/                      Utilidades locales (no se publican)
```

## Datos cargados

- WhatsApp y teléfono: +54 11 3577-8063 (en los links figura como `5491135778063` y `+541135778063`). En las demos también apuntan a este número, para que el mensaje de prueba le llegue a Santiago.
- Contacto: Santiago Bertone, santiobertone@gmail.com.
- Falta el CUIT: agregalo al pie de `index.html` cuando tengas el monotributo.
- "Vidriera" es un nombre de trabajo; está en `index.html` (título, logo en bloques y textos).
- Demos: los consultorios, direcciones, matrículas y tiempos de llegada son ficticios. Para cada prospecto, duplicá la carpeta de la demo y cambiá nombre, barrio, fotos y reseñas reales.

## Probar en tu computadora

```bash
node tools/serve.mjs 4321
```

Después abrí http://localhost:4321

## Publicar en Cloudflare Pages (gratis, permite uso comercial)

```bash
npx wrangler login
```

```bash
npx wrangler pages deploy . --project-name vidriera
```

`_headers` configura la caché de imágenes y las cabeceras de seguridad. `vercel.json` queda por si algún día lo publicás en Vercel.

## Fotos

Todas son de colecciones abiertas (Wikimedia Commons, Metropolitan Museum of Art, Art Institute of Chicago) con licencias que permiten uso comercial. Los créditos están en el pie de cada página y el detalle en los `credits.json` de cada carpeta de imágenes.
