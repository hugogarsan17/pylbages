import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

const mediaBase = 'https://pylbages.es/wp-content/uploads/2022/06/'
const photos = [
  { src: `${mediaBase}1654186304846.jpg`, width: 900, height: 1200 },
  { src: `${mediaBase}1654186304837.jpg`, width: 1000, height: 800 },
  { src: `${mediaBase}WhatsApp-Image-2022-06-07-at-5.59.59-PM.jpeg`, width: 1000, height: 800 },
  { src: `${mediaBase}1654186304828.jpg`, width: 1000, height: 800 },
  { src: `${mediaBase}1654186304841.jpg`, width: 1000, height: 800 },
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
  ['¿Trabajáis en obra nueva y en reformas?', 'PYLBAGES publica trabajos relacionados con placa de yeso laminado y sus derivados. Coméntanos si se trata de obra nueva o reforma y valoraremos el alcance concreto.'],
  ['¿Qué diferencia hay entre acondicionamiento e insonorización?', 'El acondicionamiento acústico busca controlar cómo se comporta el sonido dentro de una sala. La insonorización busca reducir la transmisión de sonido entre espacios. La intervención adecuada depende del origen del problema y de cómo está construido el recinto.'],
  ['¿Podéis recomendarme un sistema de aislamiento?', 'Sí, podemos conversar sobre las necesidades. Para concretar una solución hay que valorar el soporte, los encuentros, el uso del espacio y el resultado que se busca; no se puede determinar solo con el nombre del aislamiento.'],
  ['¿En qué municipios trabajáis?', 'La zona de servicio no queda confirmada en la información disponible. Indica el municipio en tu consulta y te confirmaremos si podemos valorar el proyecto.'],
  ['¿Cuándo recibiré respuesta o empezarán los trabajos?', 'Los plazos de respuesta y disponibilidad no están publicados. Consúltanos con los datos del proyecto para hablar de los siguientes pasos.'],
]

function MediaImage({ src, alt, className, width, height, loading = 'lazy', fetchPriority }: { src: string; alt: string; className?: string; width?: number; height?: number; loading?: 'lazy' | 'eager'; fetchPriority?: 'high' | 'low' | 'auto' }) {
  const [unavailable, setUnavailable] = useState(false)
  if (unavailable) return <div className={`media-unavailable${className ? ` ${className}` : ''}`} role="img" aria-label={`${alt}. Imagen original no disponible en este momento.`}><span>Imagen original no disponible</span></div>
  return <img className={className} src={src} alt={alt} width={width} height={height} loading={loading} fetchPriority={fetchPriority} onError={() => setUnavailable(true)} />
}

function Brand() {
  return <a className="brand" href="#inicio" aria-label="PYL Bages, inicio"><img src={`${mediaBase}gif-logo.gif`} alt="" width="180" height="54" /><span>PYL <b>Bages</b></span></a>
}

function SiteHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <Brand />
      <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-nav" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen(!open)}><span /><span /></button>
      <nav className={`site-nav${open ? ' is-open' : ''}`} id="site-nav" aria-label="Navegación principal" onClick={(event) => { if ((event.target as HTMLElement).closest('a')) setOpen(false) }}>
        <a href="#servicios">Servicios</a><a href="#trabajos">Proyectos</a><a href="#empresa">Empresa</a><a href="#contacto">Contacto</a>
        <a className="nav-phone" href="tel:+34931276440">931 27 64 40</a><a className="button button-small" href="#contacto">Solicitar presupuesto a PYL Bages <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  )
}

function SectionKicker({ number, children, light = false }: { number: string; children: React.ReactNode; light?: boolean }) {
  return <div className={`section-kicker${light ? ' section-kicker-light' : ''}`}><span>{number}</span><span>{children}</span></div>
}

function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <MediaImage className="hero-image" src={photos[0].src} alt="Trabajo de placa de yeso laminado realizado por PYLBAGES" width={photos[0].width} height={photos[0].height} loading="eager" fetchPriority="high" />
      <div className="hero-shade" />
      <div className="hero-content"><p className="eyebrow eyebrow-light"><span /> Sistemas interiores · PYL Bages</p><h1 id="hero-title">Tu proyecto toma forma con <em>PYL Bages.</em></h1><p className="hero-intro">Placa de yeso laminado, falsos techos y soluciones de aislamiento.</p><div className="hero-actions"><a className="button" href="#contacto"><span className="cta-wide">Solicitar presupuesto a PYL Bages</span><span className="cta-compact">Solicitar presupuesto</span><span aria-hidden="true">↗</span></a><a className="text-link text-link-light" href="#trabajos">Ver trabajos <span aria-hidden="true">↓</span></a></div></div>
      <div className="hero-index" aria-hidden="true"><span>01</span><i /><span>INTERIORES</span></div><a className="hero-contact" href="tel:+34931276440"><span className="contact-dot" />Hablemos del proyecto <b>931 27 64 40</b></a>
    </section>
  )
}

function Introduction() {
  return (
    <section className="intro section-pad" id="empresa">
      <SectionKicker number="01">PYL BAGES · DESDE 2022</SectionKicker>
      <div className="intro-grid"><h2>Así trabajamos <em>en PYL Bages.</em></h2><div className="intro-copy"><p className="lead">Resolvemos interiores con sistemas de placa de yeso laminado, falsos techos y soluciones de aislamiento.</p><p>Te asesoramos para definir el sistema adecuado y cuidamos la ejecución y el acabado en cada fase. Trabajamos con distintas marcas del sector, según las necesidades del proyecto.</p><a className="text-link" href="#contacto">Cuéntanos qué necesitas <span aria-hidden="true">↗</span></a></div></div>
      <div className="principles"><div><span className="principle-no">A</span><b>Asesoramiento cercano</b><p>Revisamos contigo las necesidades antes de plantear una solución.</p></div><div><span className="principle-no">B</span><b>Ejecución cuidada</b><p>Atención al encuentro entre sistemas y al acabado visible.</p></div><div><span className="principle-no">C</span><b>Revisión conjunta</b><p>La web actual describe una revisión del trabajo con el cliente al terminar.</p></div></div>
    </section>
  )
}

function Services() {
  return (
    <section className="services section-pad" id="servicios">
      <SectionKicker number="02">QUÉ HACEMOS</SectionKicker><div className="section-heading"><h2>Soluciones para <em>cada interior.</em></h2><p>Desde la distribución de espacios hasta el confort térmico y acústico: cada intervención parte de las condiciones concretas de la obra.</p></div>
      <div className="service-layout"><div className="service-image-wrap"><MediaImage src={`${mediaBase}servicios.jpg`} alt="Detalle de una instalación interior en placa de yeso laminado" width={1200} height={1500} /><span className="image-caption">Sistemas de construcción en seco</span><span className="image-cross" aria-hidden="true">+</span></div>
        <div className="service-list">{services.map(([title, text], index) => <article className="service-row" key={title}><span className="service-num">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div><a href="#contacto" aria-label={`Consultar sobre ${title}`}>↗</a></article>)}</div>
      </div><div className="service-footer"><p>¿No tienes claro qué sistema necesitas?</p><a className="button button-dark" href="#contacto">Explícanos el proyecto <span aria-hidden="true">↗</span></a></div>
    </section>
  )
}

function WorkGallery() {
  const [activePhoto, setActivePhoto] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => { if (activePhoto !== null) dialogRef.current?.showModal() }, [activePhoto])
  const close = () => { dialogRef.current?.close(); setActivePhoto(null) }
  return (
    <section className="work section-pad" id="trabajos">
      <SectionKicker number="03">TRABAJOS PYL BAGES</SectionKicker><div className="work-heading"><div><h2>Trabajos de <em>PYL Bages.</em></h2><p>Fotografías publicadas por PYL Bages. Consulta la galería para ver cada imagen con más detalle.</p></div><span className="work-count">01 — 05</span></div>
      <div className="gallery">{photos.map((photo, index) => <button className={`gallery-item${index === 0 ? ' gallery-tall' : ''}`} type="button" key={photo.src} onClick={() => setActivePhoto(index)} aria-label={`Ampliar fotografía de trabajo ${index + 1}`}><MediaImage src={photo.src} alt={`Fotografía de un trabajo de PYLBAGES, imagen ${index + 1}`} width={photo.width} height={photo.height} /><span className="gallery-overlay"><small>TRABAJO</small><b>Ver imagen <i>↗</i></b></span></button>)}</div>
      <p className="gallery-note">Las imágenes se muestran como galería de trabajos; no se atribuyen ubicaciones ni alcances que no estén documentados.</p>
      <dialog ref={dialogRef} className="lightbox" aria-label="Visor de fotografías" onClick={(event) => { if (event.target === dialogRef.current) close() }} onClose={() => setActivePhoto(null)}><button className="lightbox-close" type="button" aria-label="Cerrar imagen" onClick={close}>×</button>{activePhoto !== null && <MediaImage src={photos[activePhoto].src} alt={`Fotografía de un trabajo de PYLBAGES, imagen ${activePhoto + 1}`} />}</dialog>
    </section>
  )
}

function Process() {
  const steps = [['Nos cuentas el proyecto', 'Qué espacio es, qué quieres resolver y en qué punto se encuentra la obra.'], ['Revisamos necesidades y alcance', 'Valoramos la información disponible y qué detalles técnicos conviene aclarar.'], ['Preparamos la propuesta', 'Concretamos los trabajos a considerar y la información necesaria para presupuestar.'], ['Ejecutamos y revisamos', 'Coordinamos la intervención y repasamos el trabajo realizado.']]
  return <section className="process section-pad"><SectionKicker number="04">ASÍ TRABAJAMOS EN PYL BAGES</SectionKicker><div className="process-head"><h2>De la primera conversación <em>al último repaso.</em></h2><p>Estos pasos describen una propuesta basada en la información disponible; PYL Bages debe confirmarlos antes de publicar.</p></div><ol className="process-list">{steps.map(([title, text], index) => <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div><b aria-hidden="true">↗</b></li>)}</ol></section>
}

function FAQ() {
  return <section className="faq section-pad" id="preguntas"><SectionKicker number="05">ANTES DE EMPEZAR</SectionKicker><div className="faq-grid"><div><h2>Preguntas <em>frecuentes.</em></h2><p>Si tu caso depende de las condiciones de la obra, consúltanos y revisamos qué información hace falta.</p><a className="text-link" href="#contacto">Hablar con PYLBAGES <span aria-hidden="true">↗</span></a></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span /></summary><p>{answer}</p></details>)}</div></div></section>
}

function Contact() {
  const [status, setStatus] = useState('El formulario todavía no está conectado a un servicio de envío. Puedes contactar por teléfono o correo electrónico.')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) { setStatus('Revisa los campos obligatorios antes de continuar.'); return }
    const data = new FormData(event.currentTarget)
    const body = [`Nombre: ${data.get('name')}`, `Teléfono o correo: ${data.get('replyTo')}`, `Tipo de trabajo: ${data.get('service') || 'No especificado'}`, `Municipio: ${data.get('municipality') || 'No especificado'}`, '', 'Descripción del proyecto:', data.get('description')].join('\n')
    setStatus('PYL Bages ha preparado tu mensaje. Se abrirá tu aplicación de correo; la solicitud se enviará cuando la envíes desde allí.')
    window.location.href = `mailto:info@pylbages.es?subject=${encodeURIComponent('Solicitud de presupuesto · PYLBAGES')}&body=${encodeURIComponent(body)}`
  }
  return (
    <section className="contact section-pad" id="contacto"><SectionKicker number="06" light>CUÉNTANOS TU PROYECTO</SectionKicker><div className="contact-grid"><div className="contact-copy"><h2>Hablemos de <em>lo que necesitas.</em></h2><p>En PYL Bages, una primera descripción nos ayuda a entender el trabajo y orientarte sobre la información que hace falta para valorarlo.</p><div className="contact-details"><a href="tel:+34931276440"><small>LLÁMANOS</small><b>931 27 64 40</b></a><a href="mailto:info@pylbages.es"><small>ESCRÍBENOS</small><b>info@pylbages.es</b></a><div><small>HORARIO PUBLICADO</small><b>Lunes a viernes · 8:00–18:00</b></div></div><p className="availability-note">No se ha confirmado la ubicación ni la zona de servicio. Indica el municipio y te diremos si podemos valorar el proyecto.</p></div>
      <form className="contact-form" onSubmit={submit}><h3 className="form-title">Cuéntale tu proyecto a PYL Bages</h3><p className="form-intro">SOLICITUD DE PRESUPUESTO <span>* Campos obligatorios</span></p><label>Nombre <span>*</span><input name="name" autoComplete="name" required /></label><label>Teléfono o correo de contacto <span>*</span><input name="replyTo" autoComplete="email" required /></label><div className="form-row"><label>Tipo de trabajo<select name="service"><option value="">Selecciona una opción</option><option>Tabiquería de placa de yeso laminado</option><option>Falso techo</option><option>Aislamiento térmico</option><option>Aislamiento acústico</option><option>Acondicionamiento acústico o insonorización</option><option>Protección pasiva contra el fuego</option><option>Otro / no lo sé todavía</option></select></label><label>Municipio<input name="municipality" autoComplete="address-level2" /></label></div><label>Descripción del proyecto <span>*</span><textarea name="description" rows={4} required placeholder="Qué necesitas resolver, estado de la obra, dimensiones aproximadas…" /></label><button className="button button-light" type="submit"><span className="cta-wide">Solicitar presupuesto a PYL Bages</span><span className="cta-compact">Solicitar presupuesto</span><span aria-hidden="true">↗</span></button><p className="form-status" role="status" aria-live="polite">{status}</p></form>
    </div></section>
  )
}

function SiteFooter() {
  return <footer className="site-footer"><div className="footer-brand"><Brand /><p>Sistemas interiores<br />Placa de yeso laminado · techos · aislamiento</p></div><nav aria-label="Navegación del pie"><a href="#servicios">Servicios</a><a href="#trabajos">Proyectos</a><a href="#empresa">Empresa</a><a href="#contacto">Contacto</a></nav><div className="footer-contact"><a href="tel:+34931276440">931 27 64 40</a><a href="mailto:info@pylbages.es">info@pylbages.es</a></div><div className="legal-placeholder"><span>Textos legales pendientes de incorporar por la empresa</span><small>© PYLBAGES</small></div></footer>
}

function App() {
  return <><a className="skip-link" href="#contenido">Saltar al contenido</a><SiteHeader /><main id="contenido"><Hero /><Introduction /><Services /><WorkGallery /><Process /><FAQ /><Contact /></main><SiteFooter /><div className="mobile-cta" aria-label="Accesos rápidos"><a href="tel:+34931276440"><span aria-hidden="true">⌕</span>Llamar</a><a href="#contacto">Pedir presupuesto <span aria-hidden="true">↗</span></a></div></>
}

export default App
