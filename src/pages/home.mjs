// Página principal (una sola página con anclas).
import { icons } from './icons.mjs'
import { esc, tx, todo, plain, contactLinks } from './layout.mjs'

const pad = (n) => String(n).padStart(2, '0')
const serviceIcons = { tabiques: icons.wall, techos: icons.ceiling, termico: icons.thermal, acustico: icons.acoustic }
const whyIcons = [icons.clean, icons.calendar, icons.doc, icons.ruler]
const clientIcons = [icons.home, icons.crane, icons.office]

/** <picture> con AVIF + WebP y srcset. Fotos en /images/obra/{name}-{w}.{ext} */
export const photos = {
  'techo-descuelgue-hidrofuga': { widths: [640, 1080], w: 1080, h: 1080 },
  'techo-continuo-trasdosados': { widths: [640, 1080], w: 1080, h: 1080 },
  'tabique-bajo-l': { widths: [640, 1080], w: 1080, h: 1080 },
  'descuelgue-climatizacion': { widths: [640, 1080], w: 1080, h: 1080 },
  'techo-exterior-glasroc': { widths: [640, 1080, 1600], w: 1600, h: 1205 },
  'equipo-local': { widths: [640, 900], w: 900, h: 897 },
}
const srcset = (name, ext) => photos[name].widths.map((w) => `/images/obra/${name}-${w}.${ext} ${w}w`).join(', ')
export function picture(name, { alt, sizes, eager = false, cls = '' }) {
  const p = photos[name]
  const fallback = `/images/obra/${name}-${p.widths.at(-1)}.webp`
  return `<picture class="${cls}">
        <source type="image/avif" srcset="${srcset(name, 'avif')}" sizes="${sizes}">
        <img src="${fallback}" srcset="${srcset(name, 'webp')}" sizes="${sizes}" width="${p.w}" height="${p.h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}>
      </picture>`
}

const head = (_n, _kicker, title, id, intro = '') => `
        <header class="section-head">
          <h2 id="${id}">${title}</h2>
          ${intro ? `<p class="section-intro">${intro}</p>` : ''}
        </header>`


/* ---------- Secciones constructivas (SVG) ----------
   Dibujos esquemáticos de cada sistema, con llamadas como en un plano. Sin cotas numéricas:
   el sistema exacto se define en obra. Etiquetas desde i18n (services.items[].layers). */
const wave = (x0, x1, yc, amp, step = 14) => {
  let d = `M${x0} ${yc}`
  for (let x = x0; x < x1; x += step) d += ` q${step / 4} ${-amp} ${step / 2} 0 q${step / 4} ${amp} ${step / 2} 0`
  return d
}
const waveV = (y0, y1, xc, amp, step = 14) => {
  let d = `M${xc} ${y0}`
  for (let y = y0; y < y1; y += step) d += ` q${-amp} ${step / 4} 0 ${step / 2} q${amp} ${step / 4} 0 ${step / 2}`
  return d
}
// Llamada: punto en el elemento → línea guía → texto
const call = (x1, y1, x2, y2, text, anchor = 'start') => {
  const tx = anchor === 'start' ? x2 + 5 : anchor === 'end' ? x2 - 5 : x2
  const ty = anchor === 'middle' ? (y2 < y1 ? y2 - 6 : y2 + 14) : y2 + 4
  return `<g class="dw-call"><circle cx="${x1}" cy="${y1}" r="2.5"/><path d="M${x1} ${y1}L${x2} ${y2}"/><text x="${tx}" y="${ty}" text-anchor="${anchor}">${text}</text></g>`
}

const drawings = {
  // Planta de un tabique: placa | montantes C + lana | placa
  tabiques: ([board, stud, wool]) => {
    const studs = [70, 180, 290].map((x) => `<path class="dw-stud" d="M${x + 16} 84H${x}V136H${x + 16}"/>`).join('')
    return `<rect class="dw-board dw-board-green" x="20" y="72" width="320" height="12"/>
      <rect class="dw-board" x="20" y="136" width="320" height="12"/>
      <path class="dw-wool" d="${wave(22, 336, 110, 18)}"/>${studs}
      ${call(120, 78, 150, 34, board)}${call(70, 110, 40, 190, stud)}${call(240, 110, 250, 190, wool)}`
  },
  // Sección vertical de un falso techo
  techos: ([slab, rod, profile, board, services]) => {
    const rods = [70, 190, 310].map((x) => `<path class="dw-rod" d="M${x} 52V124"/>`).join('')
    return `<defs><pattern id="hatch-concrete" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V8" class="dw-hatch"/></pattern></defs><rect class="dw-concrete" x="20" y="24" width="320" height="28"/>
      ${rods}<rect class="dw-profile" x="20" y="124" width="320" height="8"/>
      <rect class="dw-board" x="20" y="132" width="320" height="12"/>
      <circle class="dw-duct" cx="130" cy="90" r="18"/><circle class="dw-duct" cx="250" cy="96" r="10"/>
      ${call(320, 38, 300, 12, slab, 'end')}${call(190, 84, 205, 66, rod)}${call(50, 128, 40, 186, profile)}${call(310, 138, 300, 186, board)}${call(130, 108, 140, 204, services)}`
  },
  // Planta de un trasdosado sobre fachada
  termico: ([wall, insul, board, ext, int]) => `<defs><pattern id="hatch-brick" width="20" height="10" patternUnits="userSpaceOnUse"><path d="M0 0H20M0 5H20M5 0V5M15 5V10" class="dw-hatch"/></pattern></defs>
      <rect class="dw-brick" x="40" y="20" width="70" height="170"/>
      <rect class="dw-insul" x="112" y="20" width="56" height="170"/>
      <path class="dw-wool" d="${waveV(22, 186, 140, 18)}"/>
      <path class="dw-stud" d="M184 60V44H170V60M184 150V134H170V150"/>
      <rect class="dw-board" x="184" y="20" width="12" height="170"/>
      <text class="dw-side" x="74" y="210" text-anchor="middle">${ext}</text>
      <text class="dw-side" x="290" y="210" text-anchor="middle">${int}</text>
      ${call(75, 40, 75, 4, wall, 'middle')}${call(140, 100, 230, 96, insul)}${call(190, 160, 230, 160, board)}`,
  // Planta de un tabique acústico de doble estructura
  acustico: ([dbl, frame, wool]) => {
    const rowA = [50, 170, 290].map((x) => `<path class="dw-stud" d="M${x + 16} 68H${x}V104H${x + 16}"/>`).join('')
    const rowB = [100, 220].map((x) => `<path class="dw-stud" d="M${x + 16} 116H${x}V152H${x + 16}"/>`).join('')
    return `<rect class="dw-board" x="20" y="48" width="320" height="10"/><rect class="dw-board" x="20" y="58" width="320" height="10"/>
      <rect class="dw-board" x="20" y="152" width="320" height="10"/><rect class="dw-board" x="20" y="162" width="320" height="10"/>
      <path class="dw-wool" d="${wave(22, 336, 86, 14)}"/><path class="dw-wool" d="${wave(22, 336, 134, 14)}"/>
      <path class="dw-gap" d="M20 110H340"/>${rowA}${rowB}
      ${call(300, 58, 300, 20, dbl, 'middle')}${call(108, 134, 80, 200, frame)}${call(250, 86, 280, 200, wool)}`
  },
}
export const drawing = (id, layers, title) =>
  `<svg class="dw" viewBox="0 0 360 220" role="img" aria-label="${title}: ${layers.slice(0, 3).join(', ')}">${drawings[id](layers)}</svg>`

/** Mapa esquemático (SVG local, sin terceros): proyección equirectangular de lat/lng. */
function areaMap(ctx) {
  const { cfg, t } = ctx
  const X = (lng) => Math.round((lng - 1.64) * 1044 + 24)
  const Y = (lat) => Math.round((41.95 - lat) * 1400 + 10)
  // Lado de la etiqueta para evitar solapes: r (derecha), l (izquierda), t (arriba), b (abajo)
  const side = { manresa: 'l', 'sant-joan-de-vilatorrada': 'l', callus: 'l', castellgali: 'l', 'sant-fruitos-de-bages': 't', cardona: 'b' }
  const pt = (lng, lat) => `${X(lng)},${Y(lat)}`
  const llobregat = `M${pt(1.872, 41.97)} L${pt(1.8772, 41.8997)} ${pt(1.8761, 41.8633)} ${pt(1.8955, 41.8256)} ${pt(1.903, 41.7517)} ${pt(1.852, 41.718)} ${pt(1.8667, 41.6667)} ${pt(1.8433, 41.6105)} ${pt(1.85, 41.585)}`
  const cardener = `M${pt(1.65, 41.95)} L${pt(1.6796, 41.9141)} ${pt(1.75, 41.8333)} ${pt(1.7833, 41.7833)} ${pt(1.8048, 41.7454)} ${pt(1.8268, 41.7286)} ${pt(1.852, 41.718)}`
  const towns = cfg.areaServed.map((m) => {
    const x = X(m.lng), y = Y(m.lat)
    const s = side[m.slug] || 'r'
    const base = m.slug === 'monistrol-de-montserrat'
    const lx = s === 'r' ? x + 9 : s === 'l' ? x - 9 : x
    const ly = s === 't' ? y - 10 : s === 'b' ? y + 17 : y + 4
    const anchor = s === 'r' ? 'start' : s === 'l' ? 'end' : 'middle'
    return `<a href="#municipio-${m.slug}" class="map-town${base ? ' is-base' : ''}"><circle cx="${x}" cy="${y}" r="${base ? 6 : 4.5}"/><text x="${lx}" y="${ly}" text-anchor="${anchor}">${esc(m.name)}</text></a>`
  }).join('')
  return `<svg class="area-map" viewBox="0 0 430 520" role="img" aria-labelledby="map-title">
          <title id="map-title">${t.area.mapTitle}</title>
          <g class="map-grid" aria-hidden="true">${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${i * 65}H430"/>`).join('')}${Array.from({ length: 7 }, (_, i) => `<path d="M${i * 66} 0V520"/>`).join('')}</g>
          <path class="map-river" d="${llobregat}"/><path class="map-river" d="${cardener}"/>
          <text class="map-river-label" x="${X(1.88) + 8}" y="${Y(41.935)}">Llobregat</text>
          <text class="map-river-label" x="${X(1.705) - 2}" y="${Y(41.88)}">Cardener</text>
          ${towns}
        </svg>`
}

export function home(ctx) {
  const { t, cfg, routes } = ctx
  const L = contactLinks(cfg)
  const f = t.form
  const privacy = f.privacy.replace('{privacyUrl}', routes.privacy)

  const body = `
      <!-- 1. HERO -->
      <section class="hero" aria-labelledby="hero-title">
        ${picture('techo-descuelgue-hidrofuga', { alt: t.hero.imageAlt, sizes: '100vw', eager: true, cls: 'hero-media' })}
        <div class="wrap hero-inner">
          <p class="hero-eyebrow">${t.hero.eyebrow}</p>
          <h1 id="hero-title">${t.hero.title}</h1>
          <span class="chalk" aria-hidden="true"></span>
          <p class="hero-lead">${t.hero.lead}</p>
          <div class="hero-actions">
            <a class="btn btn-primary btn-lg" href="#presupuesto">${t.cta.quote}</a>
            <div class="hero-secondary" role="group" aria-label="${esc(t.cta.callOrWhatsapp)}">
              <a class="btn btn-light" href="${L.tel}">${icons.phone}${t.cta.call}</a>
              <a class="btn btn-light" href="${L.wa}" target="_blank" rel="noopener noreferrer">${icons.whatsapp}${t.cta.whatsapp}<span class="sr-only"> ${t.a11y.newTab}</span></a>
            </div>
          </div>
          <p class="hero-caption">${t.hero.caption}</p>
        </div>
      </section>

      <!-- 2. BARRA DE CONFIANZA (solo datos verificables) -->
      <section class="trust" aria-label="${esc(t.trust.label)}">
        <ul class="wrap trust-list">
          ${t.trust.items.map((i) => `<li>${i}</li>`).join('')}
        </ul>
      </section>

      <!-- 3. SERVICIOS -->
      <section class="section" id="servicios" aria-labelledby="servicios-title">
        <div class="wrap">
          ${head(1, t.services.kicker, t.services.title, 'servicios-title', t.services.intro)}
          <nav class="service-index" aria-label="${esc(t.services.indexLabel)}">
            <ul>
              ${t.services.items.map((s) => `<li><a href="#servicio-${s.id}">${serviceIcons[s.id]}<span><b>${s.title}</b>${s.short}</span></a></li>`).join('')}
            </ul>
          </nav>
          <div class="service-rows">
            ${t.services.items.map((s) => `
            <article class="service-row" id="servicio-${s.id}" aria-labelledby="servicio-${s.id}-t">
              <figure class="service-drawing">${drawing(s.id, s.layers, s.title)}</figure>
              <div class="service-text">
                <h3 id="servicio-${s.id}-t">${s.title}</h3>
                <p>${s.body}</p>
                <ul class="ticks">${s.points.map((p) => `<li>${p}</li>`).join('')}</ul>
              </div>
            </article>`).join('')}
          </div>
          <p class="service-note">${t.services.drawingNote} ${t.services.fire}</p>
          
        </div>
      </section>

      <!-- 4. POR QUÉ PYL Bages -->
      <section class="section section-line" id="por-que" aria-labelledby="why-title">
        <div class="wrap">
          ${head(2, t.why.kicker, t.why.title, 'why-title')}
          <ul class="why-list">
            ${t.why.items.map((w, i) => `<li >${whyIcons[i]}<h3>${w.title}</h3><p>${w.text}</p></li>`).join('')}
          </ul>
        </div>
      </section>

      <!-- 5. TRABAJOS: antes/después + galería real -->
      <section class="section" id="trabajos" aria-labelledby="work-title">
        <div class="wrap">
          ${head(3, t.work.kicker, t.work.title, 'work-title', t.work.intro)}
          <div class="compare-grid">
            ${t.work.pairs.map((p, i) => `
            <figure class="compare">
              <div class="compare-stage" data-compare>
                <img class="compare-before" src="/images/placeholders/antes-${i + 1}.svg" width="1200" height="800" alt="${esc(p.beforeAlt)}" loading="lazy">
                <div class="compare-after"><img src="/images/placeholders/despues-${i + 1}.svg" width="1200" height="800" alt="${esc(p.afterAlt)}" loading="lazy"></div>
                <span class="compare-tag compare-tag-before" aria-hidden="true">${t.work.before}</span>
                <span class="compare-tag compare-tag-after" aria-hidden="true">${t.work.after}</span>
                <span class="compare-handle" aria-hidden="true"></span>
                <input class="compare-range" type="range" min="0" max="100" value="50" step="1" aria-label="${esc(t.work.compareLabel)}: ${esc(plain(p.title))}" aria-describedby="compare-help">
              </div>
              <figcaption>${tx(p.title)}</figcaption>
            </figure>`).join('')}
          </div>
          <p class="sr-only" id="compare-help">${t.work.sliderHelp}</p>
          <ul class="gallery">
            ${t.work.gallery.map((g, i) => `
            <li class="gallery-item gallery-item-${i + 1}">
              <figure>
                ${picture(g.img, { alt: g.alt, sizes: i === 3 ? '(min-width: 960px) 66vw, 100vw' : '(min-width: 960px) 33vw, (min-width: 600px) 50vw, 100vw' })}
                <figcaption><b>${g.type}</b> ${g.text}</figcaption>
              </figure>
            </li>`).join('')}
          </ul>
        </div>
      </section>

      <!-- 6. PROCESO -->
      <section class="section section-tint" id="proceso" aria-labelledby="process-title">
        <div class="wrap">
          ${head(4, t.process.kicker, t.process.title, 'process-title')}
          <ol class="steps">
            ${t.process.steps.map((s, i) => `<li ><span class="step-num" aria-hidden="true">${i + 1}</span><h3>${s.title}</h3><p>${s.text}</p></li>`).join('')}
          </ol>
        </div>
      </section>

      <!-- 7. SOLUCIONES POR TIPO DE CLIENTE -->
      <section class="section" id="clientes" aria-labelledby="clients-title">
        <div class="wrap">
          ${head(5, t.clients.kicker, t.clients.title, 'clients-title')}
          <ul class="client-cols">
            ${t.clients.items.map((c, i) => `
            <li class="client">
              <span class="service-icon">${clientIcons[i]}</span>
              <h3>${c.title}</h3>
              <p>${c.text}</p>
              <ul class="ticks">${c.points.map((p) => `<li>${p}</li>`).join('')}</ul>
            </li>`).join('')}
          </ul>
          <p class="after-cta"><a class="btn btn-outline" href="#presupuesto">${t.clients.cta}</a></p>
        </div>
      </section>

      <!-- 8. AISLAMIENTO Y CONFORT -->
      <section class="section" id="confort" aria-labelledby="comfort-title">
        <div class="wrap">
          ${head(6, t.comfort.kicker, t.comfort.title, 'comfort-title')}
          <div class="comfort-grid">
            <div class="comfort-col">
              <h3>${icons.thermal}${t.comfort.thermalTitle}</h3>
              <p class="comfort-when">${t.comfort.thermalWhen}</p>
              <ul class="ticks">${t.comfort.thermalItems.map((p) => `<li>${p}</li>`).join('')}</ul>
            </div>
            <div class="comfort-col">
              <h3>${icons.acoustic}${t.comfort.acousticTitle}</h3>
              <p class="comfort-when">${t.comfort.acousticWhen}</p>
              <ul class="ticks">${t.comfort.acousticItems.map((p) => `<li>${p}</li>`).join('')}</ul>
            </div>
          </div>
          <p class="comfort-note">${t.comfort.note}</p>
        </div>
      </section>

      <!-- 9. OPINIONES (solo reseñas reales; si no hay, placeholders marcados) -->
      <section class="section" id="opiniones" aria-labelledby="reviews-title">
        <div class="wrap">
          ${head(7, t.reviews.kicker, t.reviews.title, 'reviews-title')}
          <ul class="review-grid">
            ${(cfg.reviews.length ? cfg.reviews : [0, 1, 2]).map((r) => r && r.text
              ? `<li class="review-card"><blockquote><p>${esc(r.text)}</p></blockquote><p class="review-author">${esc(r.author)}${r.town ? ', ' + esc(r.town) : ''}</p></li>`
              : `<li class="review-card review-placeholder"><p class="review-tag">${tx(t.reviews.placeholderTag)}</p><p>${tx(t.reviews.placeholderText)}</p><p class="review-author">${t.reviews.placeholderAuthor}</p></li>`).join('')}
          </ul>
          ${cfg.contact.googleBusinessUrl ? `<p class="center"><a class="btn btn-outline" href="${esc(cfg.contact.googleBusinessUrl)}" target="_blank" rel="noopener noreferrer">${icons.star}${t.reviews.google}<span class="sr-only"> ${t.a11y.newTab}</span></a></p>` : ''}
        </div>
      </section>

      <!-- 10. ZONA DE TRABAJO (SEO local) -->
      <section class="section section-tint" id="zona" aria-labelledby="area-title">
        <div class="wrap area-grid">
          <div>
            ${head(8, t.area.kicker, t.area.title, 'area-title', t.area.intro + todo(ctx, cfg.areaConfirmed))}
            <ul class="towns" aria-label="${esc(t.area.listLabel)}">
              ${cfg.areaServed.map((m) => `<li id="municipio-${m.slug}">${esc(m.name)}</li>`).join('')}
            </ul>
          </div>
          <div class="map-box">
            ${areaMap(ctx)}
            <div class="map-embed" data-map-embed hidden></div>
            <p class="map-consent">${t.area.mapConsent}</p>
            <button type="button" class="btn btn-outline btn-sm" data-load-map hidden>${icons.pin}${t.area.loadMap}</button>
          </div>
        </div>
      </section>

      <!-- 11. PREGUNTAS FRECUENTES -->
      <section class="section" id="preguntas" aria-labelledby="faq-title">
        <div class="wrap faq-wrap">
          ${head(9, t.faq.kicker, t.faq.title, 'faq-title')}
          <div class="faq-list">
            ${t.faq.items.map((q) => `<details class="faq-item"><summary><h3>${q.q}</h3><span class="faq-sign" aria-hidden="true"></span></summary><p>${q.a}</p></details>`).join('')}
          </div>
        </div>
      </section>

      <!-- 12. FORMULARIO DE PRESUPUESTO (funciona sin JS: POST multipart al endpoint) -->
      <section class="section section-dark" id="presupuesto" aria-labelledby="form-title">
        <div class="wrap form-grid">
          <div class="form-aside">
            ${head(10, f.kicker, f.title, 'form-title', f.intro)}
            <ul class="form-contact">
              <li><a href="${L.tel}">${icons.phone}<span>${esc(cfg.contact.phoneDisplay)}</span></a>${todo(ctx, cfg.contact.phoneConfirmed)}</li>
              <li><a href="${L.wa}" target="_blank" rel="noopener noreferrer">${icons.whatsapp}<span>WhatsApp</span><span class="sr-only"> ${t.a11y.newTab}</span></a>${todo(ctx, cfg.contact.whatsappConfirmed)}</li>
              <li><a href="${L.mail}">${icons.mail}<span>${esc(cfg.contact.email)}</span></a>${todo(ctx, cfg.contact.emailConfirmed)}</li>
              <li><span class="form-contact-plain">${icons.clock}<span>${t.footer.hoursText}</span></span>${todo(ctx, cfg.contact.hours.confirmed)}</li>
            </ul>
          </div>

          <form class="quote-form" id="quote-form" action="${esc(cfg.form.endpoint)}" method="post" enctype="multipart/form-data">
            <input type="hidden" name="_subject" value="Solicitud de presupuesto · ${esc(cfg.brand)}">
            <input type="hidden" name="_next" value="${cfg.siteUrl}${routes.thanks}">
            <input type="hidden" name="idioma" value="${ctx.lang}">
            <div class="hp" aria-hidden="true"><label>${f.honeypot}<input type="text" name="${cfg.form.honeypotField}" tabindex="-1" autocomplete="off"></label></div>

            <div class="form-summary" id="form-summary" role="alert" tabindex="-1" hidden></div>

            <div class="field">
              <label for="f-name">${f.name} <span aria-hidden="true">*</span></label>
              <input id="f-name" name="nombre" type="text" autocomplete="name" required maxlength="100" aria-describedby="f-name-err">
              <p class="field-error" id="f-name-err" hidden></p>
            </div>
            <div class="field-row">
              <div class="field">
                <label for="f-phone">${f.phone} <span aria-hidden="true">*</span></label>
                <input id="f-phone" name="telefono" type="tel" inputmode="tel" autocomplete="tel" required pattern="(\\+34|0034)?\\s?[6789]([\\s.\\-]?\\d){8}" aria-describedby="f-phone-err">
                <p class="field-error" id="f-phone-err" hidden></p>
              </div>
              <div class="field">
                <label for="f-email">${f.email} <span aria-hidden="true">*</span></label>
                <input id="f-email" name="email" type="email" inputmode="email" autocomplete="email" required maxlength="150" aria-describedby="f-email-err">
                <p class="field-error" id="f-email-err" hidden></p>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label for="f-town">${f.town} <span aria-hidden="true">*</span></label>
                <input id="f-town" name="municipio" type="text" list="towns-list" autocomplete="address-level2" required maxlength="80" aria-describedby="f-town-err">
                <datalist id="towns-list">${cfg.areaServed.map((m) => `<option value="${esc(m.name)}">`).join('')}</datalist>
                <p class="field-error" id="f-town-err" hidden></p>
              </div>
              <div class="field">
                <label for="f-type">${f.workType} <span aria-hidden="true">*</span></label>
                <select id="f-type" name="tipo_trabajo" required aria-describedby="f-type-err">
                  <option value="">${f.choose}</option>
                  ${f.workOptions.map((o) => `<option>${o}</option>`).join('')}
                </select>
                <p class="field-error" id="f-type-err" hidden></p>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label for="f-surface">${f.surface}</label>
                <input id="f-surface" name="superficie_m2" type="number" inputmode="decimal" min="1" max="100000" step="any" aria-describedby="f-surface-hint f-surface-err">
                <p class="field-hint" id="f-surface-hint">${f.surfaceHint}</p>
                <p class="field-error" id="f-surface-err" hidden></p>
              </div>
              <fieldset class="field field-radios">
                <legend>${f.clientType} <span aria-hidden="true">*</span></legend>
                <div class="radios">
                  ${f.clientOptions.map((o, i) => `<label class="radio"><input type="radio" name="tipo_cliente" value="${o}" ${i === 0 ? 'checked' : ''} required> <span>${o}</span></label>`).join('')}
                </div>
              </fieldset>
            </div>
            <div class="field">
              <label for="f-msg">${f.message} <span aria-hidden="true">*</span></label>
              <textarea id="f-msg" name="mensaje" rows="5" required maxlength="3000" placeholder="${esc(f.messagePlaceholder)}" aria-describedby="f-msg-err"></textarea>
              <p class="field-error" id="f-msg-err" hidden></p>
            </div>
            <div class="field">
              <label for="f-files">${f.files}</label>
              <div class="file-drop">
                ${icons.upload}
                <input id="f-files" name="adjuntos" type="file" multiple accept="${esc(cfg.form.accept)}" aria-describedby="f-files-hint f-files-err">
              </div>
              <p class="field-hint" id="f-files-hint">${f.filesHint}</p>
              <ul class="file-list" id="file-list" aria-live="polite"></ul>
              <p class="field-error" id="f-files-err" hidden></p>
            </div>
            <div class="field">
              <label class="check check-privacy" for="f-privacy">
                <input id="f-privacy" name="acepta_privacidad" type="checkbox" value="si" required aria-describedby="f-privacy-err f-privacy-note">
                <span>${privacy} <span aria-hidden="true">*</span></span>
              </label>
              <p class="field-error" id="f-privacy-err" hidden></p>
              <p class="field-hint" id="f-privacy-note">${f.privacyNote}</p>
            </div>
            <button class="btn btn-primary btn-lg btn-block" type="submit" data-submit><span data-label>${f.submit}</span></button>
            <div class="form-status" id="form-status" role="status" aria-live="polite"></div>
          </form>
        </div>
      </section>`

  return body
}
