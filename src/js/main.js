/* PYL Bages — JS de mejora progresiva. Sin JS la web sigue siendo legible y el formulario se envía igual.
   Módulos: menú · slider antes/después · consentimiento de cookies · mapa · formulario de presupuesto */
(() => {
  'use strict'
  const $ = (s, el = document) => el.querySelector(s)
  const $$ = (s, el = document) => [...el.querySelectorAll(s)]
  const data = JSON.parse($('#site-data')?.textContent || '{}')

  /* ---------- Menú: abierto siempre en escritorio, se cierra al navegar en móvil ---------- */
  const menu = $('.menu')
  if (menu) {
    const mq = matchMedia('(min-width: 960px)')
    const sync = () => { menu.open = mq.matches }
    sync()
    mq.addEventListener('change', sync)
    $$('.nav a', menu).forEach((a) => a.addEventListener('click', () => { if (!mq.matches) menu.open = false }))
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.open && !mq.matches) { menu.open = false; $('summary', menu).focus() }
    })
  }

  /* ---------- Slider antes/después: <input type="range"> nativo (teclado + táctil) ---------- */
  $$('[data-compare]').forEach((stage) => {
    const range = $('.compare-range', stage)
    const set = () => {
      stage.style.setProperty('--pos', range.value + '%')
      range.setAttribute('aria-valuetext', `${range.value}%`)
    }
    range.addEventListener('input', set)
    set()
  })

  /* ---------- Consentimiento de cookies ---------- */
  const KEY = 'pyl-consent'
  const banner = $('#cookie-banner')
  const prefs = $('#cookie-prefs')
  const read = () => {
    try {
      const c = JSON.parse(localStorage.getItem(KEY) || 'null')
      // Caduca a los 12 meses
      return c && Date.now() - c.ts < 365 * 864e5 ? c : null
    } catch { return null }
  }
  const save = (c) => {
    try { localStorage.setItem(KEY, JSON.stringify({ ...c, ts: Date.now() })) } catch { /* modo privado */ }
    apply(c)
    hideBanner()
  }
  const showBanner = () => {
    if (!banner) return
    const c = read()
    if (prefs) { prefs.analytics.checked = !!c?.analytics; prefs.maps.checked = !!c?.maps }
    banner.hidden = false
    document.body.classList.add('has-cookie-banner')
  }
  const hideBanner = () => {
    if (!banner) return
    banner.hidden = true
    prefs && (prefs.hidden = true)
    document.body.classList.remove('has-cookie-banner')
  }
  let analyticsLoaded = false
  const apply = (c) => {
    // Analítica: solo si se acepta y hay un proveedor configurado en site.config.json.
    if (c.analytics && !analyticsLoaded && data.analytics?.plausibleDomain) {
      analyticsLoaded = true
      const s = document.createElement('script')
      s.defer = true
      s.dataset.domain = data.analytics.plausibleDomain
      s.src = 'https://plausible.io/js/script.js' // recuerda añadir plausible.io a la CSP de vercel.json
      document.head.appendChild(s)
    }
    const btn = $('[data-load-map]')
    if (btn) btn.hidden = false
  }

  if (banner) {
    banner.addEventListener('click', (e) => {
      const b = e.target.closest('[data-consent]')
      if (!b) return
      const action = b.dataset.consent
      if (action === 'accept') save({ analytics: true, maps: true })
      else if (action === 'reject') save({ analytics: false, maps: false })
      else if (action === 'configure') {
        if (prefs.hidden) {
          prefs.hidden = false
          b.setAttribute('aria-expanded', 'true')
          b.textContent = data.i18n?.cookies?.save || 'Guardar'
          prefs.analytics.focus()
        } else {
          save({ analytics: prefs.analytics.checked, maps: prefs.maps.checked })
        }
      }
    })
    const current = read()
    if (current) apply(current)
    else showBanner()
  }
  $$('[data-cookie-settings]').forEach((b) => {
    b.hidden = false
    b.addEventListener('click', showBanner)
  })

  /* ---------- Mapa de Google: solo tras consentimiento "Mapas" ---------- */
  const mapBtn = $('[data-load-map]')
  const mapBox = $('[data-map-embed]')
  if (mapBtn && mapBox) {
    mapBtn.hidden = false
    mapBtn.addEventListener('click', () => {
      const c = read()
      if (!c?.maps) {
        // Pide consentimiento específico en lugar de cargar el mapa sin permiso.
        showBanner()
        $('[data-consent="configure"]')?.click()
        prefs?.maps.focus()
        return
      }
      const f = document.createElement('iframe')
      f.src = data.mapsEmbed
      f.title = mapBtn.textContent.trim()
      f.loading = 'lazy'
      f.referrerPolicy = 'no-referrer-when-downgrade'
      mapBox.replaceChildren(f)
      mapBox.hidden = false
      mapBtn.hidden = true
    })
  }

  /* ---------- Formulario de presupuesto ---------- */
  const form = $('#quote-form')
  if (!form) return
  form.noValidate = true // con JS validamos nosotros (mensajes accesibles); sin JS valida el navegador
  const T = data.i18n.form
  const E = T.errors
  const cfg = data.form
  const status = $('#form-status')
  const summary = $('#form-summary')
  const submitBtn = $('[data-submit]', form)
  const fileInput = $('#f-files')
  const fileList = $('#file-list')
  const allowed = cfg.accept.split(',')

  const fileErrors = () => {
    const files = [...(fileInput?.files || [])]
    if (files.length > cfg.maxFiles) return E.filesCount
    if (files.some((f) => f.size > cfg.maxFileMB * 1024 * 1024)) return E.fileSize
    if (files.some((f) => f.type && !allowed.includes(f.type))) return E.fileType
    return ''
  }

  const messageFor = (el) => {
    if (el === fileInput) return fileErrors()
    const v = el.validity
    if (el.type === 'checkbox' && v.valueMissing) return E.privacy
    if (v.valueMissing) return E.required
    if (el.type === 'email' && (v.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value))) return E.email
    if (el.type === 'tel' && v.patternMismatch) return E.phone
    if (el.type === 'number' && (v.rangeUnderflow || v.rangeOverflow || v.badInput)) return E.surface
    return ''
  }

  const showError = (el, msg) => {
    const err = $('#' + el.id + '-err')
    el.setAttribute('aria-invalid', msg ? 'true' : 'false')
    if (err) { err.textContent = msg; err.hidden = !msg }
  }

  const fields = $$('input[id], select[id], textarea[id]', form).filter((el) => $('#' + el.id + '-err'))
  fields.forEach((el) => {
    // Valida al salir del campo y, si ya tenía error, mientras se corrige.
    el.addEventListener('blur', () => { if (el.value || el.type === 'checkbox') showError(el, messageFor(el)) })
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') showError(el, messageFor(el)) })
    el.addEventListener('change', () => { if (el.type === 'checkbox' || el.tagName === 'SELECT') showError(el, messageFor(el)) })
  })

  fileInput?.addEventListener('change', () => {
    const files = [...fileInput.files]
    fileList.replaceChildren(...files.map((f) => {
      const li = document.createElement('li')
      const bad = f.size > cfg.maxFileMB * 1024 * 1024 || (f.type && !allowed.includes(f.type))
      li.textContent = `${f.name} · ${(f.size / 1024 / 1024).toFixed(1)} MB`
      if (bad) li.className = 'is-bad'
      return li
    }))
    showError(fileInput, fileErrors())
  })

  const setBusy = (busy) => {
    submitBtn.setAttribute('aria-busy', String(busy))
    submitBtn.disabled = busy
    $('[data-label]', submitBtn).textContent = busy ? T.sending : T.submit
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    status.className = 'form-status'
    status.textContent = ''

    let first = null
    fields.forEach((el) => {
      const msg = messageFor(el)
      showError(el, msg)
      if (msg && !first) first = el
    })
    if (first) {
      summary.textContent = E.summary
      summary.hidden = false
      first.focus()
      return
    }
    summary.hidden = true

    // Honeypot: si un bot lo rellena, fingimos éxito y no enviamos nada.
    const hp = form.querySelector('.hp input')
    if (hp && hp.value) { status.className = 'form-status is-success'; status.textContent = T.success; form.reset(); return }

    // Endpoint sin configurar: modo demostración para enseñar la web al cliente.
    if (/X{4,}/.test(cfg.endpoint)) {
      setBusy(true)
      await new Promise((r) => setTimeout(r, 700))
      setBusy(false)
      status.className = 'form-status is-success'
      status.textContent = `${T.success} [MODO DEMO: configura form.endpoint en site.config.json]`
      return
    }

    setBusy(true)
    try {
      const res = await fetch(cfg.endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      fileList.replaceChildren()
      status.className = 'form-status is-success'
      status.textContent = T.success
      // Redirige a la página de gracias (útil para medir conversiones).
      setTimeout(() => { location.href = cfg.thanks }, 1200)
    } catch {
      status.className = 'form-status is-error'
      status.textContent = T.error
    } finally {
      setBusy(false)
    }
  })
})()
