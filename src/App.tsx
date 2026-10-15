import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

const mediaBase = '/images/'
const photos = [
  { src: `${mediaBase}1654186304846.jpg`, width: 1080, height: 1080 },
  { src: `${mediaBase}1654186304837.jpg`, width: 1080, height: 1080 },
  { src: `${mediaBase}WhatsApp-Image-2022-06-07-at-5.59.59-PM.jpeg`, width: 2040, height: 1536 },
  { src: `${mediaBase}1654186304828.jpg`, width: 1080, height: 1080 },
  { src: `${mediaBase}1654186304841.jpg`, width: 1080, height: 1080 },
]

const services = [
  ['Tabiquería de placa de yeso laminado', 'Para crear nuevas distribuciones, trasdosados y sectorizaciones interiores. La solución se define según el uso, los encuentros y las instalaciones previstas.'],
  ['Falsos techos', 'Para resolver planos de techo, integrar instalaciones y ordenar visualmente el espacio. El sistema y el acabado dependen de cada estancia.'],
  ['Aislamiento térmico', 'Una capa aislante puede contribuir al confort térmico. La elección requiere valorar cerramientos, puentes térmicos y condiciones de montaje.'],
  ['Aislamiento acústico', 'Se incorpora a soluciones constructivas para limitar la transmisión de sonido entre espacios. El comportamiento depende del conjunto de capas y sus encuentros.'],
  ['Acondicionamiento e insonorización', 'El acondicionamiento busca controlar la reverberación dentro de una sala; la insonorización, reducir la transmisión sonora hacia o desde otros espacios. Requieren diagnósticos y soluciones diferentes.'],
  ['Protección pasiva contra el fuego', 'Soluciones de sectorización y protección que deben definirse conforme al sistema, los elementos constructivos y los requisitos aplicables a cada obra.'],
]

const faqs = [
  ['¿Qué información os ayuda a preparar un presupuesto?', 'Cuéntanos el tipo de trabajo, el municipio, las dimensiones aproximadas si las conoces y el estado actual de la obra. Si tienes planos o fotografías, puedes mencionarlo al contactar para que te indiquemos cómo compartirlos.'],
  ['¿Trabajáis en obra nueva y en reformas?', 'Coméntanos si se trata de obra nueva o reforma, qué necesitas hacer y el estado actual del espacio. Valoraremos contigo el alcance concreto.'],
  ['¿Qué diferencia hay entre acondicionamiento e insonorización?', 'El acondicionamiento acústico busca controlar cómo se comporta el sonido dentro de una sala. La insonorización busca reducir la transmisión de sonido entre espacios. La intervención adecuada depende del origen del problema y de cómo está construido el recinto.'],
  ['¿Podéis recomendarme un sistema de aislamiento?', 'Sí, podemos conversar sobre las necesidades. Para concretar una solución hay que valorar el soporte, los encuentros, el uso del espacio y el resultado que se busca; no se puede determinar solo con el nombre del aislamiento.'],
  ['¿En qué municipios trabajáis?', 'Indica el municipio en tu consulta y te confirmaremos si podemos valorar el proyecto.'],
  ['¿Cuándo recibiré respuesta o empezarán los trabajos?', 'La disponibilidad depende del alcance y de la planificación de los trabajos. Consúltanos con los datos del proyecto para concretar los siguientes pasos.'],
]

function MediaImage({ src, alt, className, width, height, loading = 'lazy', fetchPriority }: { src: string; alt: string; className?: string; width?: number; height?: number; loading?: 'lazy' | 'eager'; fetchPriority?: 'high' | 'low' | 'auto' }) {
  const [unavailable, setUnavailable] = useState(false)
  if (unavailable) return <div className={`media-unavailable${className ? ` ${className}` : ''}`} role="img" aria-label={`${alt}. Imagen original no disponible en este momento.`}><span>Imagen original no disponible</span></div>
  return <img className={className} src={src} alt={alt} width={width} height={height} loading={loading} fetchPriority={fetchPriority} onError={() => setUnavailable(true)} />
}

function Brand() {
  return <a className="brand" href="#inicio" aria-label="PYL Bages, inicio"><img src="/images/pylbages-logo.gif" alt="" width="480" height="449" /><span>PYL <b>Bages</b></span></a>
}

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const dismiss = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus() }
    }
    const desktop = window.matchMedia('(min-width: 1101px)')
    const resize = () => { if (desktop.matches) setOpen(false) }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    desktop.addEventListener('change', resize)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', escape)
      desktop.removeEventListener('change', resize)
    }
  }, [open])
  return (
    <header className="site-header" ref={headerRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false) }}>
      <Brand />
      <button ref={toggleRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-nav" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen(!open)}><span /><span /></button>
      <nav className={`site-nav${open ? ' is-open' : ''}`} id="site-nav" aria-label="Navegación principal" onClick={(event) => { if ((event.target as HTMLElement).closest('a')) setOpen(false) }}>
        <a href="#servicios">Servicios</a><a href="#trabajos">Trabajos</a><a href="#empresa">Empresa</a><a href="#contacto">Contacto</a>
        <a className="nav-phone" href="tel:+34931276440">931 27 64 40</a><a className="button button-small" href="#contacto">Solicitar presupuesto <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  )
}

function SectionKicker({ number, children, light = false }: { number: string; children: React.ReactNode; light?: boolean }) {
  return <div className={`section-kicker${light ? ' section-kicker-light' : ''}`}><span>{number}</span><span>{children}</span></div>
}

function Hero() {
  return (
    <section className="hero hero-overview" id="inicio" aria-labelledby="hero-title">
      <div className="hero-overview-copy">
        <p className="eyebrow">PYL Bages / Construcción en seco</p>
        <h1 id="hero-title">Placa de yeso, techos y aislamiento. <em>Un buen acabado empieza aquí.</em></h1>
        <p className="hero-overview-intro">Damos forma a tus espacios con placa de yeso laminado, falsos techos y aislamiento térmico y acústico. Del sistema constructivo al acabado.</p>

        <div className="hero-actions">
          <a className="button" href="#contacto">Solicitar presupuesto <span aria-hidden="true">↗</span></a>
          <a className="text-link" href="#trabajos">Ver trabajos <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-direct-contact" aria-label="Contacto directo">
          <a href="tel:+34931276440">Llama al <strong>931 27 64 40</strong></a>
          <a href="mailto:info@pylbages.es">info@pylbages.es</a>
          <p>Lunes a viernes · 8:00–18:00</p>
        </div>
      </div>
      <figure className="hero-overview-photo">
        <MediaImage src={photos[0].src} alt="Trabajo de placa de yeso laminado de PYL Bages" width={photos[0].width} height={photos[0].height} loading="eager" fetchPriority="high" />
        <figcaption>Trabajos de PYL Bages <a href="#trabajos">Ver galería <span aria-hidden="true">↗</span></a></figcaption>
      </figure>
    </section>
  )
}

function Introduction() {
  return (
    <section className="intro section-pad" id="empresa">
      <SectionKicker number="03">EL OFICIO, EN CADA DETALLE</SectionKicker>
      <div className="intro-grid"><h2>Lo que no se ve también <em>cuenta.</em></h2><div className="intro-copy"><p className="lead">Resolvemos interiores con sistemas de placa de yeso laminado, falsos techos y soluciones de aislamiento.</p><p>Te asesoramos para definir el sistema adecuado y cuidamos la ejecución y el acabado en cada fase. Trabajamos con distintas marcas del sector, según las necesidades del proyecto.</p><a className="text-link" href="#contacto">Cuéntanos qué necesitas <span aria-hidden="true">↗</span></a></div></div>
      <div className="principles"><div><span className="principle-no">A</span><b>Asesoramiento cercano</b><p>Revisamos contigo las necesidades antes de plantear una solución.</p></div><div><span className="principle-no">B</span><b>Ejecución cuidada</b><p>Atención al encuentro entre sistemas y al acabado visible.</p></div><div><span className="principle-no">C</span><b>Revisión conjunta</b><p>Repasamos contigo el trabajo realizado al terminar.</p></div></div>
    </section>
  )
}

function Services() {
  return (
    <section className="services section-pad" id="servicios">
      <SectionKicker number="01">QUÉ HACEMOS</SectionKicker><div className="section-heading"><h2>Soluciones para <em>cada interior.</em></h2><p>Desde la distribución de espacios hasta el confort térmico y acústico: cada intervención parte de las condiciones concretas de la obra.</p></div>
      <div className="service-features">
        <article><MediaImage src={photos[0].src} alt="Encuentros de tabiques y techo de placa de yeso en una obra de PYL Bages" width={1080} height={1080} /><div><span className="service-num">01 / DISTRIBUIR</span><h3>Un espacio, nuevas posibilidades.</h3><p>{services[0][1]}</p><a className="text-link" href="#contacto">Tabiquería y trasdosados <span aria-hidden="true">↗</span></a></div></article>
        <article><MediaImage src={`${mediaBase}servicios.jpg`} alt="Techo de placa de yeso con juntas tratadas y huecos para instalaciones" width={600} height={400} /><div><span className="service-num">02 / RENOVAR</span><h3>El techo también define el espacio.</h3><p>{services[1][1]}</p><a className="text-link" href="#contacto">Falsos techos <span aria-hidden="true">↗</span></a></div></article>
      </div>
      <div className="service-layout"><div className="service-aside"><span className="eyebrow">CONFORT Y PROTECCIÓN</span><h3>El sistema adecuado.<br />Hasta la última capa.</h3><p>Cada necesidad tiene una solución constructiva. Valoramos el conjunto: materiales, soporte y encuentros.</p></div><div className="service-list">{services.slice(2).map(([title, text], index) => <article className="service-row" key={title}><span className="service-num">{String(index + 3).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div><a href="#contacto" aria-label={`Consultar sobre ${title}`}>↗</a></article>)}</div>
      </div><div className="service-footer"><p>¿No tienes claro qué sistema necesitas?</p><a className="button button-dark" href="#contacto">Explícanos el proyecto <span aria-hidden="true">↗</span></a></div>
    </section>
  )
}

function WorkGallery() {
  const [activePhoto, setActivePhoto] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (activePhoto === null) return
    dialogRef.current?.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [activePhoto])
  const close = () => { dialogRef.current?.close(); setActivePhoto(null) }
  return (
    <section className="work section-pad" id="trabajos">
      <SectionKicker number="02">TRABAJOS PYL BAGES</SectionKicker><div className="work-heading"><div><h2>Nuestro trabajo, <em>a la vista.</em></h2><p>Placas, encuentros y acabados. Acércate a nuestros trabajos y descubre los detalles de ejecución.</p></div><span className="work-count">01 — 05</span></div>
      <div className="gallery">{photos.map((photo, index) => <button className={`gallery-item${index === 0 ? ' gallery-tall' : ''}`} type="button" key={photo.src} onClick={() => setActivePhoto(index)} aria-label={`Ampliar fotografía de trabajo ${index + 1}`}><MediaImage src={photo.src} alt={`Fotografía de un trabajo de PYLBAGES, imagen ${index + 1}`} width={photo.width} height={photo.height} /><span className="gallery-overlay"><small>TRABAJO</small><b>Ver imagen <i>↗</i></b></span></button>)}</div>
      <p className="gallery-note">Selecciona una fotografía para verla completa y ampliada.</p>
      <dialog ref={dialogRef} className="lightbox" aria-label="Visor de fotografías" onClick={(event) => { if (event.target === dialogRef.current) close() }} onClose={() => setActivePhoto(null)}><button className="lightbox-close" type="button" aria-label="Cerrar imagen" onClick={close}>×</button>{activePhoto !== null && <MediaImage src={photos[activePhoto].src} alt={`Fotografía de un trabajo de PYLBAGES, imagen ${activePhoto + 1}`} />}</dialog>
    </section>
  )
}

function Process() {
  const steps = [['El espacio', 'Indica el municipio y si se trata de una vivienda, un local u otro espacio.'], ['Lo que necesitas', 'Una nueva distribución, renovar un techo o mejorar el confort térmico o acústico.'], ['El punto de partida', 'Cuéntanos el estado de la obra y las dimensiones aproximadas, si las conoces.'], ['Los detalles', 'Si tienes planos o fotografías, menciónalo para que podamos indicarte cómo compartirlos.']]
  return <section className="process section-pad"><SectionKicker number="04">PREPAREMOS TU PROYECTO</SectionKicker><div className="process-head"><h2>Una buena solución empieza <em>por escucharte.</em></h2><p>Una conversación clara es el primer paso. Cuéntanos qué necesitas resolver y en qué estado se encuentra tu espacio.</p></div><ol className="process-list">{steps.map(([title, text], index) => <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div><b aria-hidden="true">↗</b></li>)}</ol></section>
}

function FAQ() {
  return <section className="faq section-pad" id="preguntas"><SectionKicker number="05">ANTES DE EMPEZAR</SectionKicker><div className="faq-grid"><div><h2>Preguntas <em>frecuentes.</em></h2><p>Si tu caso depende de las condiciones de la obra, consúltanos y revisamos qué información hace falta.</p><a className="text-link" href="#contacto">Hablar con PYLBAGES <span aria-hidden="true">↗</span></a></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span /></summary><p>{answer}</p></details>)}</div></div></section>
}

function Contact() {
  const [contactMethod, setContactMethod] = useState('email')
  const [status, setStatus] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) { setStatus('Revisa los campos obligatorios antes de continuar.'); return }
    const data = new FormData(event.currentTarget)
    const body = [`Nombre: ${data.get('name')}`, `Teléfono o correo: ${data.get('replyTo')}`, `Tipo de trabajo: ${data.get('service') || 'No especificado'}`, `Municipio: ${data.get('municipality') || 'No especificado'}`, '', 'Descripción del proyecto:', data.get('description')].join('\n')
    setStatus('PYL Bages ha preparado tu mensaje. Se abrirá tu aplicación de correo; la solicitud se enviará cuando la envíes desde allí.')
    window.location.href = `mailto:info@pylbages.es?subject=${encodeURIComponent('Solicitud de presupuesto · PYLBAGES')}&body=${encodeURIComponent(body)}`
  }
  return (
    <section className="contact section-pad" id="contacto"><SectionKicker number="06" light>CUÉNTANOS TU PROYECTO</SectionKicker><div className="contact-grid"><div className="contact-copy"><h2>Cuéntanos qué <em>necesitas hacer.</em></h2><p>En PYL Bages, una primera descripción nos ayuda a entender el trabajo y orientarte sobre la información que hace falta para valorarlo.</p><div className="contact-details"><a href="tel:+34931276440"><small>LLÁMANOS</small><b>931 27 64 40</b></a><a href="mailto:info@pylbages.es"><small>ESCRÍBENOS</small><b>info@pylbages.es</b></a><div><small>HORARIO</small><b>Lunes a viernes · 8:00–18:00</b></div></div><p className="availability-note">Estamos en Monistrol de Montserrat, Barcelona. Indica el municipio de la obra y consulta nuestra disponibilidad.</p></div>
      <form className="contact-form" onSubmit={submit} aria-describedby="contact-delivery"><h3 className="form-title">Cuéntale tu proyecto a PYL Bages</h3><p className="form-intro">SOLICITUD DE PRESUPUESTO <span>* Campos obligatorios</span></p><p className="form-delivery" id="contact-delivery">Al continuar se abrirá tu aplicación de correo con el mensaje preparado. Tendrás que enviarlo desde allí. También puedes llamarnos al <a href="tel:+34931276440">931 27 64 40</a>.</p><label>Nombre <span>*</span><input name="name" autoComplete="name" required /></label><fieldset className="contact-method"><legend>¿Cómo prefieres que te respondamos?</legend><label><input type="radio" name="contactMethod" value="email" checked={contactMethod === 'email'} onChange={() => setContactMethod('email')} />Correo electrónico</label><label><input type="radio" name="contactMethod" value="tel" checked={contactMethod === 'tel'} onChange={() => setContactMethod('tel')} />Teléfono</label></fieldset><label>{contactMethod === 'email' ? 'Correo electrónico' : 'Teléfono'} <span>*</span><input key={contactMethod} name="replyTo" type={contactMethod} inputMode={contactMethod === 'email' ? 'email' : 'tel'} autoComplete={contactMethod} required onInput={(event) => { const field = event.currentTarget; field.setCustomValidity(contactMethod === 'tel' && field.value.replace(/\D/g, '').length < 7 ? 'Introduce un teléfono con al menos 7 dígitos.' : '') }} /></label><div className="form-row"><label>Tipo de trabajo<select name="service"><option value="">Selecciona una opción</option><option>Tabiquería de placa de yeso laminado</option><option>Falso techo</option><option>Aislamiento térmico</option><option>Aislamiento acústico</option><option>Acondicionamiento acústico o insonorización</option><option>Protección pasiva contra el fuego</option><option>Otro / no lo sé todavía</option></select></label><label>Municipio<input name="municipality" autoComplete="address-level2" /></label></div><label>Descripción del proyecto <span>*</span><textarea name="description" rows={4} required placeholder="Qué necesitas resolver, estado de la obra, dimensiones aproximadas…" /></label><button className="button button-light" type="submit"><span>Preparar correo</span><span aria-hidden="true">↗</span></button><p className="form-status" role="status" aria-live="polite">{status}</p></form>
    </div></section>
  )
}

function SiteFooter() {
  return <footer className="site-footer"><div className="footer-brand"><Brand /><p>Sistemas interiores<br />Placa de yeso laminado · techos · aislamiento</p></div><nav aria-label="Navegación del pie"><a href="#servicios">Servicios</a><a href="#trabajos">Trabajos</a><a href="#empresa">Empresa</a><a href="#contacto">Contacto</a></nav><div className="footer-contact"><a href="tel:+34931276440">931 27 64 40</a><a href="mailto:info@pylbages.es">info@pylbages.es</a></div><div className="legal-placeholder"><span>PYL Bages · Construcción en seco</span><small>© PYLBAGES</small></div></footer>
}

function MobileContactBar() {
  const barRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const update = () => document.documentElement.style.setProperty('--mobile-cta-height', `${getComputedStyle(bar).position === 'fixed' ? bar.getBoundingClientRect().height : 0}px`)
    const observer = new ResizeObserver(update)
    observer.observe(bar)
    update()
    return () => { observer.disconnect(); document.documentElement.style.removeProperty('--mobile-cta-height') }
  }, [])
  return <nav ref={barRef} className="mobile-cta" aria-label="Contacto rápido"><a href="tel:+34931276440">Llamar</a><a href="#contacto">Solicitar presupuesto <span aria-hidden="true">↗</span></a></nav>
}

function App() {
  return <><a className="skip-link" href="#contenido">Saltar al contenido</a><SiteHeader /><main id="contenido"><Hero /><Services /><WorkGallery /><Introduction /><Process /><FAQ /><Contact /></main><SiteFooter /><MobileContactBar /></>
}

export default App
