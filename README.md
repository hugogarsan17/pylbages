# PYL Bages — web

Web de una sola página para **PYL Bages** (tabiquería de placa de yeso laminado, falsos techos y aislamiento en el Bages).
HTML, CSS y JS vanilla generados por un script de Node **sin dependencias**. Español en `/`, catalán en `/ca`.

## Uso

```bash
npm run dev     # genera dist/ y sirve en http://localhost:4173 (recarga al guardar, con las cabeceras CSP de producción)
npm run build   # genera dist/
```

Requiere Node ≥ 20. No hay `npm install`.

## Dónde se cambia cada cosa

| Qué | Archivo |
| --- | --- |
| Teléfono, WhatsApp, email, dirección, horario, redes, municipios, endpoint del formulario, reseñas | `site.config.json` (único punto) |
| Textos en español / catalán | `i18n/es.json`, `i18n/ca.json` (el build falla si no tienen las mismas claves) |
| Maquetación | `src/pages/*.mjs` |
| Estilos (tokens de color y tipografía al principio) | `src/css/styles.css` |
| Dibujos de sección constructiva de cada servicio | `src/pages/home.mjs` → `drawings` (etiquetas en `services.items[].layers`) |
| Interacción (menú, slider, cookies, mapa, formulario) | `src/js/main.js` |
| Imágenes, fuentes, favicon | `public/` |
| Cabeceras de seguridad y caché | `vercel.json` |

Cuando un dato se confirme con el cliente, cambia su `…Confirmed` a `true` en `site.config.json` y desaparece la etiqueta amarilla **[CONFIRMAR]**.
Para ocultar todas las etiquetas antes de publicar: `"showTodoMarkers": false`.

## Estructura

```
site.config.json        datos de contacto y configuración
i18n/es.json, ca.json   textos
scripts/build.mjs       generador + servidor local
src/pages/              layout.mjs (head SEO, cabecera, pie, cookies), home.mjs, simple.mjs, icons.mjs
src/css/styles.css      se minifica e incrusta en cada página (autorizado por hash en la CSP)
src/js/main.js          mejora progresiva; sin JS todo se lee y el formulario se envía igual
public/                 fonts/ (Archivo autoalojada: una familia en dos anchuras), images/obra/ (AVIF + WebP), og-image.jpg, favicons
dist/                   salida (no editar)
legacy-react/           versión anterior en React, conservada como referencia
```

Páginas generadas: `/`, `/ca`, `/gracias`, `/ca/gracies` (noindex), `/aviso-legal`, `/privacidad`, `/cookies` (+ CA, noindex hasta tener el texto definitivo), `404.html`, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`.

## Despliegue en Vercel

Importa el repositorio: `vercel.json` ya define `buildCommand` y `outputDirectory`.
Si cambias `src/css/styles.css`, ejecuta `npm run build` en local antes de subir: actualiza el hash del CSS en la CSP de `vercel.json`
(en Vercel el build falla a propósito si el hash no coincide, para no publicar una web sin estilos).

## Formulario

- `form.endpoint` en `site.config.json`. Mientras contenga `XXXXXXX`, el envío funciona en **modo demo** (no manda nada).
- Formspree: crea el formulario, activa la subida de archivos (plan de pago) y la redirección `_next` a `/gracias`.
- Sin JS el navegador valida los campos (`required`, `pattern`) y hace un POST multipart normal.
- Antispam: honeypot `_gotcha` + filtro de Formspree.
- **Validación en servidor**: la hace el servicio de formularios. Si se quiere validación propia, añadir una función en `api/` (ojo: Vercel limita el cuerpo a 4,5 MB, menos que 5 archivos × 5 MB).

## Cookies y terceros

Nada externo se carga sin consentimiento. Fuentes e imágenes son locales. Google Maps solo se carga si el usuario acepta «Mapas» y pulsa «Ver en Google Maps».
Para activar analítica, rellena `analytics.plausibleDomain` y añade `https://plausible.io` a `script-src` y `connect-src` en `vercel.json`.
