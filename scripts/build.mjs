#!/usr/bin/env node
// Generador estático sin dependencias.
// Lee site.config.json + i18n/*.json + src/ y escribe dist/ (ES en /, CA en /ca/).
// Uso: node scripts/build.mjs            → build de producción
//      node scripts/build.mjs --serve    → build + servidor local en http://localhost:4173 con recarga al guardar
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, watch, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { createServer } from 'node:http'
import { dirname, join, extname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'dist')
const readJSON = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'))

// Rutas por idioma. Vercel sirve /gracias desde gracias.html (cleanUrls).
const ROUTES = {
  es: { home: '/', thanks: '/gracias', legal: '/aviso-legal', privacy: '/privacidad', cookies: '/cookies' },
  ca: { home: '/ca', thanks: '/ca/gracies', legal: '/ca/avis-legal', privacy: '/ca/privacitat', cookies: '/ca/galetes' },
}
const fileFor = (path) => (path.endsWith('/') ? path + 'index.html' : path + '.html').slice(1)

/** Comprueba que ca.json tiene exactamente las mismas claves que es.json. */
function checkKeys(a, b, prefix = '') {
  const errs = []
  for (const k of Object.keys(a)) {
    const p = prefix + k
    if (!(k in b)) errs.push(`falta "${p}"`)
    else if (a[k] && typeof a[k] === 'object' && !Array.isArray(a[k])) errs.push(...checkKeys(a[k], b[k], p + '.'))
    else if (Array.isArray(a[k]) && (!Array.isArray(b[k]) || a[k].length !== b[k].length)) errs.push(`longitud distinta en "${p}"`)
  }
  return errs
}

/** Lista de datos pendientes que se imprime al compilar (y se guarda en dist/_pendiente.txt, que no se publica a buscadores). */
function pendingReport(cfg) {
  const c = cfg.contact
  const p = []
  if (!c.phoneConfirmed) p.push(`Teléfono (${c.phoneDisplay}, tomado de la web actual)`)
  if (!c.whatsappConfirmed || /X/.test(c.whatsappNumber)) p.push('Número de WhatsApp')
  if (!c.emailConfirmed) p.push(`Email (${c.email}, tomado de la web actual)`)
  if (!c.address.confirmed) p.push('Dirección y si atienden al público')
  if (!c.hours.confirmed) p.push('Horario')
  if (!c.social.length) p.push('Redes sociales')
  if (!c.googleBusinessUrl) p.push('Ficha de Google Business')
  if (/X{4,}/.test(cfg.form.endpoint)) p.push('Endpoint del formulario (Formspree)')
  if (!cfg.areaConfirmed) p.push('Lista definitiva de municipios')
  if (!cfg.reviews.length) p.push('Reseñas reales')
  if (/CONFIRMAR/.test(cfg.legalName)) p.push('Razón social y NIF (textos legales)')
  return p
}

async function build() {
  const t0 = Date.now()
  const cfg = readJSON('site.config.json')
  const i18n = { es: readJSON('i18n/es.json'), ca: readJSON('i18n/ca.json') }
  const keyErrors = checkKeys(i18n.es, i18n.ca)
  if (keyErrors.length) throw new Error('i18n/ca.json no coincide con es.json:\n  ' + keyErrors.join('\n  '))

  // Importación "fresca" de plantillas para que --serve recargue cambios.
  const v = `?v=${Date.now()}`
  const { layout } = await import(pathToFileURL(join(root, 'src/pages/layout.mjs')) + v)
  const { home } = await import(pathToFileURL(join(root, 'src/pages/home.mjs')) + v)
  const { thanks, notFound, legal } = await import(pathToFileURL(join(root, 'src/pages/simple.mjs')) + v)

  rmSync(out, { recursive: true, force: true })
  mkdirSync(join(out, 'assets'), { recursive: true })
  cpSync(join(root, 'public'), out, { recursive: true })

  // Assets con hash de contenido → caché inmutable en Vercel.
  const hashed = (src, name, ext) => {
    const code = readFileSync(join(root, src))
    const h = createHash('sha256').update(code).digest('hex').slice(0, 10)
    const file = `/assets/${name}.${h}.${ext}`
    writeFileSync(join(out, file), code)
    return file
  }
  const assets = { js: hashed('src/js/main.js', 'main', 'js') }

  // CSS minificado e incrustado (evita una petición que bloquea el render → mejor LCP en móvil).
  // Para no abrir la CSP con 'unsafe-inline', se autoriza por hash SHA-256 en vercel.json.
  assets.cssInline = readFileSync(join(root, 'src/css/styles.css'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/:\s+/g, ':') // solo el espacio DESPUÉS de ':' (el de antes es significativo: '.hero :focus-visible')
    .replace(/;}/g, '}')
    // Recupera los espacios necesarios dentro de @media (… and (…)) y selectores con :not/:has
    .replace(/\)and\(/g, ') and (')
    .replace(/@media\(/g, '@media (')
    .trim()
  const styleHash = `'sha256-${createHash('sha256').update(assets.cssInline).digest('base64')}'`
  const vercelPath = join(root, 'vercel.json')
  const vercel = JSON.parse(readFileSync(vercelPath, 'utf8'))
  const cspHeader = vercel.headers[0].headers.find((h) => h.key === 'Content-Security-Policy')
  const newCsp = cspHeader.value.replace(/style-src [^;]*/, `style-src 'self' ${styleHash}`)
  if (newCsp !== cspHeader.value) {
    if (process.env.VERCEL) throw new Error('El hash CSP del CSS ha cambiado: ejecuta "npm run build" en local y sube vercel.json actualizado.')
    cspHeader.value = newCsp
    writeFileSync(vercelPath, JSON.stringify(vercel, null, 2) + '\n')
    console.log('↻ vercel.json: hash CSP del CSS actualizado')
  }

  const pages = []
  const write = (path, html) => {
    const f = join(out, fileFor(path))
    mkdirSync(dirname(f), { recursive: true })
    writeFileSync(f, html)
  }

  for (const lang of ['es', 'ca']) {
    const t = i18n[lang]
    const routes = ROUTES[lang]
    const other = lang === 'es' ? 'ca' : 'es'
    const base = { t, cfg, lang, routes, otherRoutes: ROUTES[other], assets }
    const alt = (key) => ({ es: ROUTES.es[key], ca: ROUTES.ca[key] })

    // JSON-LD del negocio (coherente con title/description/OG porque salen de los mismos datos).
    const c = cfg.contact
    const business = {
      '@context': 'https://schema.org',
      '@type': 'HomeAndConstructionBusiness',
      '@id': `${cfg.siteUrl}/#negocio`,
      name: cfg.brand,
      description: t.meta.description,
      url: cfg.siteUrl + routes.home,
      logo: `${cfg.siteUrl}/images/pylbages-logo.webp`,
      image: `${cfg.siteUrl}/images/og-image.jpg`,
      telephone: c.phoneE164,
      email: c.email,
      address: { '@type': 'PostalAddress', streetAddress: c.address.street, postalCode: c.address.postalCode, addressLocality: c.address.locality, addressRegion: c.address.region, addressCountry: c.address.country },
      geo: { '@type': 'GeoCoordinates', latitude: c.geo.lat, longitude: c.geo.lng },
      areaServed: [{ '@type': 'AdministrativeArea', name: 'Bages' }, ...cfg.areaServed.map((m) => ({ '@type': 'City', name: m.name }))],
      openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: c.hours.days, opens: c.hours.opens, closes: c.hours.closes }],
      knowsAbout: t.services.items.map((s) => s.title),
      inLanguage: lang,
      ...(c.social.length ? { sameAs: c.social } : {}),
      // aggregateRating: solo añadir si hay reseñas reales verificables.
    }
    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: t.faq.items.map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } })),
    }

    const heroPreload = `<link rel="preload" as="image" type="image/avif" imagesrcset="/images/obra/techo-descuelgue-hidrofuga-640.avif 640w, /images/obra/techo-descuelgue-hidrofuga-1080.avif 1080w" imagesizes="100vw" fetchpriority="high">`

    const homeCtx = { ...base, path: routes.home, alternates: alt('home') }
    write(routes.home, layout(homeCtx, { title: t.meta.title, description: t.meta.description, body: home(homeCtx), jsonld: [business, faq], preload: heroPreload }))
    pages.push({ key: 'home', priority: '1.0' })

    const thCtx = { ...base, path: routes.thanks, alternates: alt('thanks') }
    write(routes.thanks, layout(thCtx, { title: `${t.pages.thanksTitle} | ${cfg.brand}`, description: t.pages.thanksText, body: thanks(thCtx), noindex: true }))

    for (const key of ['legal', 'privacy', 'cookies']) {
      const tk = { legal: 'legalNotice', privacy: 'privacy', cookies: 'cookies' }[key]
      const ctx = { ...base, path: routes[key], alternates: alt(key) }
      // Legales: noindex hasta que el cliente aporte el texto definitivo.
      write(routes[key], layout(ctx, { title: `${t.pages[tk + 'Title']} | ${cfg.brand}`, description: t.pages[tk + 'Title'], body: legal(ctx, tk), noindex: true }))
    }

    if (lang === 'es') {
      const nfCtx = { ...base, path: '/404', alternates: {} }
      writeFileSync(join(out, '404.html'), layout(nfCtx, { title: `${t.pages.notFoundTitle} | ${cfg.brand}`, description: t.pages.notFoundText, body: notFound(nfCtx), noindex: true }))
    }
  }

  // sitemap.xml con alternativas hreflang
  const today = new Date().toISOString().slice(0, 10)
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${['es', 'ca'].map((lang) => pages.map((p) => `  <url>
    <loc>${cfg.siteUrl}${ROUTES[lang][p.key]}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${cfg.siteUrl}${ROUTES.es[p.key]}"/>
    <xhtml:link rel="alternate" hreflang="ca" href="${cfg.siteUrl}${ROUTES.ca[p.key]}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${cfg.siteUrl}${ROUTES.es[p.key]}"/>
  </url>`).join('\n')).join('\n')}
</urlset>
`
  writeFileSync(join(out, 'sitemap.xml'), sitemap)
  writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /gracias\nDisallow: /ca/gracies\n\nSitemap: ${cfg.siteUrl}/sitemap.xml\n`)
  writeFileSync(join(out, 'manifest.webmanifest'), JSON.stringify({
    name: `${cfg.brand} — Pladur, falsos techos y aislamiento`,
    short_name: cfg.brand,
    lang: 'es',
    start_url: '/',
    display: 'browser',
    background_color: cfg.themeColor,
    theme_color: cfg.themeColor,
    icons: [
      { src: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
  }, null, 2))

  const pending = pendingReport(cfg)
  console.log(`✓ dist/ generado en ${Date.now() - t0} ms`)
  if (pending.length) console.log('⚠ Pendiente del cliente:\n  - ' + pending.join('\n  - '))
}

// ---------- servidor local opcional ----------
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' }
function serve(port = 4173) {
  createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    const candidates = [url, url + '.html', join(url, 'index.html')]
    let file = candidates.map((p) => join(out, p)).find((p) => existsSync(p) && statSync(p).isFile())
    let status = 200
    if (!file) { file = join(out, '404.html'); status = 404 }
    // Mismas cabeceras de seguridad que en producción (vercel.json), para detectar fallos de CSP en local.
    const sec = Object.fromEntries(JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8')).headers[0].headers.filter((h) => h.key !== 'Strict-Transport-Security').map((h) => [h.key, h.value.replace('; upgrade-insecure-requests', '')]))
    res.writeHead(status, { ...sec, 'content-type': TYPES[extname(file)] || 'application/octet-stream' })
    res.end(readFileSync(file))
  }).listen(port, () => console.log(`→ http://localhost:${port}`))
}

await build()
if (process.argv.includes('--serve')) {
  serve()
  let timer
  for (const dir of ['src', 'i18n', 'public']) watch(join(root, dir), { recursive: true }, () => { clearTimeout(timer); timer = setTimeout(() => build().catch((e) => console.error(e.message)), 120) })
  watch(join(root, 'site.config.json'), () => { clearTimeout(timer); timer = setTimeout(() => build().catch((e) => console.error(e.message)), 120) })
}
