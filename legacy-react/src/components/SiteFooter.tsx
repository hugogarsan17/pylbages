import { useEffect, useRef } from 'react'
import { company, nav, services } from '../content'
import { Brand } from './ui'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Brand />
          <p><b>{company.legalName}</b><br />Placa de yeso laminado, tabiquería, falsos techos y aislamiento.</p>
        </div>
        <nav aria-label="Navegación del pie">
          <h2>Navegación</h2>
          <ul>{nav.map((item) => <li key={item.href}><a href={item.href}>{item.label}</a></li>)}</ul>
        </nav>
        <div>
          <h2>Servicios</h2>
          <ul>{services.map((service) => <li key={service.title}><a href="#servicios">{service.title}</a></li>)}</ul>
        </div>
        <address>
          <h2>Contacto</h2>
          <a href={company.phoneHref}>{company.phone}</a>
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <span>{company.hours}</span>
          <span>{company.street}<br />{company.postalCode} {company.city} ({company.region})</span>
        </address>
      </div>
      <div className="container footer-bottom">
        <small>© {new Date().getFullYear()} {company.legalName}</small>
        <a href="#inicio">Volver arriba ↑</a>
      </div>
    </footer>
  )
}

export function MobileContactBar() {
  const barRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const update = () => document.documentElement.style.setProperty('--mobile-cta-height', `${getComputedStyle(bar).display === 'none' ? 0 : bar.getBoundingClientRect().height}px`)
    const observer = new ResizeObserver(update)
    observer.observe(bar)
    update()
    return () => { observer.disconnect(); document.documentElement.style.removeProperty('--mobile-cta-height') }
  }, [])
  return (
    <nav ref={barRef} className="mobile-cta" aria-label="Contacto rápido">
      <a href={company.phoneHref}>Llamar</a>
      <a href="#contacto">Pedir presupuesto</a>
    </nav>
  )
}
