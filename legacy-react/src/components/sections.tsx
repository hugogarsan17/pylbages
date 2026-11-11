import { useEffect, useRef, useState } from 'react'
import { company, details, faqs, heroPhoto, photoSrc, photoSrcSet, projects, services, steps, teamPhoto } from '../content'
import { MediaImage, SectionHead } from './ui'

const pad = (n: number) => String(n).padStart(2, '0')

export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="hero-eyebrow"><span className="tag">PYL Bages</span><span>Placa de yeso laminado · {company.city}</span></p>
        <h1 id="hero-title"><span>Damos forma</span> <span>a tus espacios.</span></h1>
        <p className="hero-lead">Especialistas en placa de yeso laminado, tabiquería, falsos techos y aislamiento. Ejecución cuidada y atención al detalle en cada obra.</p>
        <div className="hero-actions">
          <a className="button" href="#contacto">Pedir presupuesto</a>
          <a className="button button-ghost" href="#proyectos">Ver proyectos</a>
        </div>
        <dl className="hero-facts">
          <div><dt>Desde</dt><dd>2022</dd></div>
          <div><dt>Experiencia previa</dt><dd>26 años en el sector</dd></div>
          <div><dt>Teléfono</dt><dd><a href={company.phoneHref}>{company.phone}</a></dd></div>
        </dl>
      </div>
      <figure className="hero-media">
        <div className="hero-frame">
          <MediaImage src={photoSrc(heroPhoto)} srcSet={photoSrcSet(heroPhoto)} sizes="(min-width: 1024px) 52vw, 100vw" alt={heroPhoto.alt} width={heroPhoto.width} height={heroPhoto.height} loading="eager" fetchPriority="high" />
        </div>
        <figcaption><span>Obra en curso</span>Falso techo con descuelgue y tabiquería con placa resistente a la humedad</figcaption>
      </figure>
      <ul className="hero-services" aria-label="Servicios principales">
        {services.map((service, index) => <li key={service.title}><span>{pad(index + 1)}</span>{service.title}</li>)}
      </ul>
    </section>
  )
}

export function About() {
  return (
    <section className="about section" aria-labelledby="empresa-title" id="empresa">
      <div className="container about-grid">
        <figure className="about-media" data-reveal>
          <MediaImage src={photoSrc(teamPhoto)} srcSet={photoSrcSet(teamPhoto)} sizes="(min-width: 1024px) 40vw, 100vw" alt={teamPhoto.alt} width={teamPhoto.width} height={teamPhoto.height} />
          <figcaption>Nuestro local en {company.street}, {company.city}</figcaption>
        </figure>
        <div className="about-copy">
          <SectionHead number="01" label="Empresa" id="empresa-title" title={<>Un oficio que se nota <em>en los detalles.</em></>} />
          <div data-reveal>
            <p className="lead">PYL Bages se fundó en 2022 en {company.city} de la mano de profesionales con 26 años de experiencia en el sector.</p>
            <p>Nos dedicamos a todo tipo de trabajos con placa de yeso laminado y sus derivados: distribuciones, techos, aislamiento, insonorización y sectorizaciones ignífugas. Te asesoramos para elegir el sistema adecuado y cuidamos cada encuentro hasta el acabado.</p>
          </div>
          <dl className="about-points" data-reveal>
            <div><dt>Servicio todo incluido</dt><dd>Operarios, productos y maquinaria profesional.</dd></div>
            <div><dt>Todas las marcas</dt><dd>Trabajamos con todas las marcas del mercado.</dd></div>
            <div><dt>Asesoramiento</dt><dd>Cuéntanos tu idea y te asesoramos sin compromiso.</dd></div>
          </dl>
        </div>
      </div>
    </section>
  )
}

export function Services() {
  return (
    <section className="services section" id="servicios" aria-labelledby="servicios-title">
      <div className="container">
        <SectionHead number="02" label="Servicios" id="servicios-title" title={<>Sistemas en seco <em>para cada interior.</em></>}>
          <p>Del reparto de espacios al confort térmico, acústico y la protección contra el fuego. Cada intervención parte de las condiciones concretas de la obra.</p>
        </SectionHead>
        <ol className="service-grid">
          {services.map((service, index) => (
            <li key={service.title} data-reveal>
              <span className="service-num">{pad(index + 1)}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </li>
          ))}
        </ol>
        <div className="services-cta" data-reveal>
          <p>¿No tienes claro qué sistema necesitas?</p>
          <a className="button button-dark" href="#contacto">Explícanos tu proyecto</a>
        </div>
      </div>
    </section>
  )
}

export function Projects() {
  const [active, setActive] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (active === null) return
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [active])

  const close = () => { dialogRef.current?.close() }
  const step = (delta: number) => setActive((current) => current === null ? null : (current + delta + projects.length) % projects.length)
  const project = active === null ? null : projects[active]

  return (
    <section className="projects section" id="proyectos" aria-labelledby="proyectos-title">
      <span id="trabajos" className="anchor-alias" aria-hidden="true" />
      <div className="container">
        <SectionHead number="03" label="Proyectos" id="proyectos-title" title={<>El trabajo, <em>visto en obra.</em></>}>
          <p>Fotografías de nuestras obras durante la ejecución: estructura, placa y juntas antes del acabado final. Selecciona una imagen para verla completa.</p>
        </SectionHead>
        <div className="project-grid">
          {projects.map((item, index) => (
            <figure className={`project project-${item.layout}`} key={item.name} data-reveal>
              <button type="button" className="project-media" onClick={(event) => { triggerRef.current = event.currentTarget; setActive(index) }} aria-label={`Ampliar: ${item.type}`}>
                <MediaImage src={photoSrc(item, 1080)} srcSet={photoSrcSet(item)} sizes={item.layout === 'wide' ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 42vw, 100vw'} alt={item.alt} width={item.width} height={item.height} />
                <span className="project-zoom" aria-hidden="true">Ampliar</span>
              </button>
              <figcaption>
                <span className="project-num">P.{pad(index + 1)}</span>
                <div><h3>{item.type}</h3><p>{item.text}</p></div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Visor de fotografías de obra"
        onClick={(event) => { if (event.target === dialogRef.current) close() }}
        onClose={() => { setActive(null); triggerRef.current?.focus() }}
        onKeyDown={(event) => { if (event.key === 'ArrowRight') step(1); if (event.key === 'ArrowLeft') step(-1) }}
      >
        {project && (
          <figure>
            <MediaImage src={photoSrc(project)} srcSet={photoSrcSet(project)} sizes="92vw" alt={project.alt} width={project.width} height={project.height} />
            <figcaption><b>{project.type}</b> {project.text}</figcaption>
          </figure>
        )}
        <div className="lightbox-controls">
          <button type="button" onClick={() => step(-1)} aria-label="Fotografía anterior">←</button>
          <span aria-live="polite">{active === null ? '' : `${active + 1} / ${projects.length}`}</span>
          <button type="button" onClick={() => step(1)} aria-label="Fotografía siguiente">→</button>
          <button type="button" className="lightbox-close" onClick={close}>Cerrar</button>
        </div>
      </dialog>
    </section>
  )
}

export function Details() {
  return (
    <section className="details section" id="detalles" aria-labelledby="detalles-title">
      <div className="container">
        <SectionHead number="04" label="Detalles" id="detalles-title" title={<>Detalles que marcan <em>el acabado.</em></>}>
          <p>Lo que queda oculto tras la pintura decide cómo se ve un espacio. Primeros planos de nuestras obras.</p>
        </SectionHead>
        <ul className="detail-grid">
          {details.map((detail, index) => (
            <li key={detail.title} data-reveal>
              <figure>
                <div className="detail-media"><MediaImage src={detail.src} alt={detail.alt} width={detail.size} height={detail.size} /></div>
                <figcaption><span>D.{pad(index + 1)}</span><h3>{detail.title}</h3><p>{detail.text}</p></figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Process() {
  return (
    <section className="process section" id="proceso" aria-labelledby="proceso-title">
      <div className="container">
        <SectionHead number="05" label="Forma de trabajar" id="proceso-title" title={<>Cuatro pasos, <em>sin rodeos.</em></>} />
        <ol className="process-list">
          {steps.map((item, index) => (
            <li key={item.title} data-reveal>
              <span className="process-num">{pad(index + 1)}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function FAQ() {
  return (
    <section className="faq section" id="preguntas" aria-labelledby="preguntas-title">
      <div className="container faq-grid">
        <SectionHead number="06" label="Preguntas" id="preguntas-title" title={<>Antes de <em>empezar.</em></>}>
          <p>Si tu caso depende de las condiciones de la obra, consúltanos y revisamos qué información hace falta.</p>
        </SectionHead>
        <div className="faq-list" data-reveal>
          {faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true" /></summary><p>{answer}</p></details>)}
        </div>
      </div>
    </section>
  )
}
