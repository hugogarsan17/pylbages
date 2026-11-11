// Páginas secundarias: gracias (noindex), 404 (noindex) y textos legales (pendientes del cliente).
import { esc, tx, contactLinks } from './layout.mjs'
import { icons } from './icons.mjs'

const shell = (inner) => `
      <section class="section page-simple">
        <div class="wrap narrow">
${inner}
        </div>
      </section>`

export function thanks(ctx) {
  const { t, cfg, routes } = ctx
  const L = contactLinks(cfg)
  return shell(`
          <p class="page-icon">${icons.check}</p>
          <h1>${t.pages.thanksTitle}</h1>
          <p class="section-intro">${t.pages.thanksText}</p>
          <p class="page-actions">
            <a class="btn btn-primary" href="${routes.home}">${t.pages.backHome}</a>
            <a class="btn btn-outline" href="${L.tel}">${icons.phone}${esc(cfg.contact.phoneDisplay)}</a>
            <a class="btn btn-outline" href="${L.wa}" target="_blank" rel="noopener noreferrer">${icons.whatsapp}WhatsApp<span class="sr-only"> ${t.a11y.newTab}</span></a>
          </p>`)
}

export function notFound(ctx) {
  const { t, routes } = ctx
  return shell(`
          <p class="page-code" aria-hidden="true">404</p>
          <h1>${t.pages.notFoundTitle}</h1>
          <p class="section-intro">${t.pages.notFoundText}</p>
          <p class="page-actions"><a class="btn btn-primary" href="${routes.home}">${t.pages.backHome}</a>
          <a class="btn btn-outline" href="${routes.home}#presupuesto">${t.cta.quote}</a></p>`)
}

export function legal(ctx, key) {
  const { t, cfg } = ctx
  const title = t.pages[key + 'Title']
  const table = key === 'cookies'
    ? `<h2>${t.pages.cookiesTable}</h2>
          <div class="table-wrap"><table>
            <thead><tr>${t.pages.cookiesHead.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
            <tbody>${t.pages.cookiesRows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
          </table></div>
          <p><button type="button" class="btn btn-outline" data-cookie-settings hidden>${t.footer.cookieSettings}</button></p>`
    : ''
  return shell(`
          <h1>${title}</h1>
          <p class="legal-pending">${tx(t.pages.legalPending)}</p>
          <p>${esc(cfg.legalName.replace(/\s*\[[^\]]*\]/g, ''))} · <a href="mailto:${esc(cfg.contact.email)}">${esc(cfg.contact.email)}</a></p>
          ${table}`)
}
