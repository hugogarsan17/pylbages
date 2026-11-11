// Plantilla común: <head> con SEO, cabecera, pie, banner de cookies y botones flotantes.
import { icons } from './icons.mjs'

/** Escapa texto para atributos/HTML (datos de config). Los textos i18n se consideran contenido de confianza. */
export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Resalta marcadores de contenido pendiente ([SUSTITUIR…], [DATO A CONFIRMAR…], [Reseña real]…). Solo para texto visible. */
export const tx = (s = '') =>
  String(s).replace(/\[(SUSTITUIR|SUBSTITUIR|DATO A CONFIRMAR|DADA A CONFIRMAR|Reseña real|Ressenya real|CONFIRMAR)[^\]]*\]/g, (m) => `<mark class="todo">${m}</mark>`)

/** Marca visible junto a un dato no confirmado por el cliente. */
export const todo = (ctx, confirmed) => (!confirmed && ctx.cfg.showTodoMarkers ? ' <mark class="todo">[CONFIRMAR]</mark>' : '')

/** Quita los marcadores de un texto (para atributos alt/meta que no deben mostrar corchetes en producción). */
export const plain = (s = '') => String(s).replace(/\[[^\]]*\]\s*/g, '')

export const contactLinks = (cfg) => {
  const c = cfg.contact
  return {
    tel: `tel:${c.phoneE164}`,
    mail: `mailto:${c.email}`,
    wa: `https://wa.me/${c.whatsappNumber}?text=${encodeURIComponent(c.whatsappMessage)}`,
  }
}

const hreflangs = (ctx) =>
  Object.entries(ctx.alternates)
    .map(([lang, path]) => `<link rel="alternate" hreflang="${lang}" href="${ctx.cfg.siteUrl}${path}">`)
    .join('\n    ') +
  (ctx.alternates.es ? `\n    <link rel="alternate" hreflang="x-default" href="${ctx.cfg.siteUrl}${ctx.alternates.es}">` : '')

export function layout(ctx, { title, description, body, noindex = false, jsonld = [], preload = '' }) {
  const { t, cfg, routes, assets } = ctx
  const url = cfg.siteUrl + ctx.path
  const L = contactLinks(cfg)
  const ogImage = `${cfg.siteUrl}/images/og-image.jpg`
  const other = ctx.lang === 'es' ? 'ca' : 'es'
  const otherPath = ctx.alternates[other] || ctx.otherRoutes.home

  // Datos que necesita main.js (no ejecutable: compatible con CSP sin 'unsafe-inline').
  const clientData = {
    lang: ctx.lang,
    form: { endpoint: cfg.form.endpoint, maxFiles: cfg.form.maxFiles, maxFileMB: cfg.form.maxFileMB, accept: cfg.form.accept, thanks: routes.thanks },
    i18n: { form: t.form, cookies: { save: t.cookies.save } },
    mapsEmbed: `https://maps.google.com/maps?q=${encodeURIComponent('Manresa, Bages')}&z=10&hl=${ctx.lang}&output=embed`,
    analytics: cfg.analytics,
  }

  return `<!doctype html>
<html lang="${t.meta.lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    ${noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${url}">\n    ${hreflangs(ctx)}`}
    <meta name="theme-color" content="${cfg.themeColor}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${esc(cfg.brand)}">
    <meta property="og:locale" content="${t.meta.locale}">
    <meta property="og:locale:alternate" content="${ctx.lang === 'es' ? 'ca_ES' : 'es_ES'}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${esc(t.meta.ogImageAlt)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(description)}">
    <meta name="twitter:image" content="${ogImage}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="/favicon.png" type="image/png" sizes="64x64">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="preload" href="/fonts/archivo-var-latin.woff2" as="font" type="font/woff2" crossorigin>
    ${preload}
    <style>${assets.cssInline}</style>
    <script src="${assets.js}" defer></script>
    ${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n    ')}
  </head>
  <body>
    <a class="skip-link" href="#contenido">${t.a11y.skip}</a>

    <header class="site-header">
      <div class="wrap header-inner">
        <a class="brand" href="${routes.home}" aria-label="${esc(cfg.brand)} — inicio">
          <img src="/images/pylbages-logo-sm.webp" width="32" height="45" alt="">
          <span class="brand-name">PYL Bages</span>
        </a>
        <details class="menu">
          <summary class="menu-toggle"><span class="menu-open">${icons.menu}<span>${t.a11y.menu}</span></span><span class="menu-close">${t.a11y.closeMenu}</span></summary>
          <nav class="nav" aria-label="${t.a11y.mainNav}">
            <ul>
              <li><a href="${routes.home}#servicios">${t.nav.services}</a></li>
              <li><a href="${routes.home}#trabajos">${t.nav.work}</a></li>
              <li><a href="${routes.home}#proceso">${t.nav.process}</a></li>
              <li><a href="${routes.home}#zona">${t.nav.area}</a></li>
              <li><a href="${routes.home}#preguntas">${t.nav.faq}</a></li>
              <li class="nav-lang"><a href="${otherPath}" hreflang="${other}" lang="${other}" aria-label="${esc(t.meta.switchLabel)}">${t.meta.switchTo}</a></li>
            </ul>
          </nav>
        </details>
        <a class="btn btn-primary btn-sm header-cta" href="${routes.home}#presupuesto">${t.nav.quote}</a>
      </div>
    </header>

    <main id="contenido" tabindex="-1">
${body}
    </main>

    <footer class="site-footer">
      <div class="wrap footer-grid">
        <div class="footer-brand">
          <p class="brand-name brand-name-lg">PYL Bages</p>
          <p>${t.footer.tagline}</p>
        </div>
        <div>
          <h2 class="footer-title">${t.footer.contact}</h2>
          <ul class="footer-list">
            <li>${icons.phone}<a href="${L.tel}">${esc(cfg.contact.phoneDisplay)}</a>${todo(ctx, cfg.contact.phoneConfirmed)}</li>
            <li>${icons.whatsapp}<a href="${L.wa}" target="_blank" rel="noopener noreferrer">WhatsApp<span class="sr-only"> ${t.a11y.newTab}</span></a>${todo(ctx, cfg.contact.whatsappConfirmed)}</li>
            <li>${icons.mail}<a href="${L.mail}">${esc(cfg.contact.email)}</a>${todo(ctx, cfg.contact.emailConfirmed)}</li>
          </ul>
        </div>
        <div>
          <h2 class="footer-title">${t.footer.hours}</h2>
          <p>${t.footer.hoursText}${todo(ctx, cfg.contact.hours.confirmed)}</p>
          <h2 class="footer-title">${t.footer.area}</h2>
          <p>${t.footer.areaText}</p>
          <p>${cfg.contact.address.publicOffice
            ? `${esc(cfg.contact.address.street)}, ${esc(cfg.contact.address.postalCode)} ${esc(cfg.contact.address.locality)}`
            : `${t.footer.noPublic} · ${esc(cfg.contact.address.locality)}`}${todo(ctx, cfg.contact.address.confirmed)}</p>
        </div>
        <div>
          <h2 class="footer-title">${t.footer.legal}</h2>
          <ul class="footer-list footer-legal">
            <li><a href="${routes.legal}">${t.footer.legalNotice}</a></li>
            <li><a href="${routes.privacy}">${t.footer.privacy}</a></li>
            <li><a href="${routes.cookies}">${t.footer.cookies}</a></li>
            <li><button type="button" class="link-btn" data-cookie-settings hidden>${t.footer.cookieSettings}</button></li>
          </ul>
        </div>
      </div>
      <div class="wrap footer-bottom">
        <p>© ${new Date().getFullYear()} ${esc(cfg.brand)}. ${t.footer.rights}</p>
      </div>
    </footer>

    <!-- Acciones rápidas: WhatsApp flotante (siempre) + Llamar fijo (solo móvil) -->
    <div class="quick-actions">
      <a class="qa-call" href="${L.tel}">${icons.phone}<span>${t.cta.call}</span></a>
      <a class="qa-wa" href="${L.wa}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t.cta.floatWhatsapp)} ${esc(t.a11y.newTab)}">${icons.whatsapp}</a>
    </div>

    <!-- Banner de cookies: oculto sin JS (sin JS no se instala nada). Los tres botones tienen el mismo estilo. -->
    <section class="cookie-banner" id="cookie-banner" aria-labelledby="cookie-title" hidden>
      <div class="cookie-inner">
        <h2 id="cookie-title">${t.cookies.title}</h2>
        <p>${t.cookies.text} <a href="${routes.cookies}">${t.cookies.more}</a></p>
        <form class="cookie-prefs" id="cookie-prefs" hidden>
          <label class="check"><input type="checkbox" checked disabled> <span><b>${t.cookies.necessary}</b> — ${t.cookies.necessaryText}</span></label>
          <label class="check"><input type="checkbox" name="analytics"> <span><b>${t.cookies.analytics}</b> — ${t.cookies.analyticsText}</span></label>
          <label class="check"><input type="checkbox" name="maps"> <span><b>${t.cookies.maps}</b> — ${t.cookies.mapsText}</span></label>
        </form>
        <div class="cookie-actions">
          <button type="button" class="btn btn-cookie" data-consent="reject">${t.cookies.reject}</button>
          <button type="button" class="btn btn-cookie" data-consent="configure" aria-controls="cookie-prefs" aria-expanded="false">${t.cookies.configure}</button>
          <button type="button" class="btn btn-cookie" data-consent="accept">${t.cookies.accept}</button>
        </div>
      </div>
    </section>

    <script type="application/json" id="site-data">${JSON.stringify(clientData).replace(/</g, '\\u003c')}</script>
  </body>
</html>
`
}
