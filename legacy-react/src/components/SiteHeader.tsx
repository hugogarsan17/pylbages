import { useEffect, useRef, useState } from 'react'
import { company, nav } from '../content'
import { Brand } from './ui'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (!open) return
    const dismiss = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus() }
    }
    const desktop = window.matchMedia('(min-width: 1024px)')
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
    <header
      ref={headerRef}
      className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false) }}
    >
      <div className="header-inner">
        <Brand withLabel />
        <nav className="site-nav" id="site-nav" aria-label="Navegación principal" onClick={(event) => { if ((event.target as HTMLElement).closest('a')) setOpen(false) }}>
          <ul>
            {nav.map((item) => <li key={item.href}><a href={item.href}>{item.label}</a></li>)}
          </ul>
          <a className="nav-phone" href={company.phoneHref}><small>Teléfono</small>{company.phone}</a>
        </nav>
        <a className="button header-cta" href="#contacto">Pedir presupuesto</a>
        <button ref={toggleRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>
          <span className="menu-toggle-label">{open ? 'Cerrar' : 'Menú'}</span>
          <span className="menu-toggle-icon" aria-hidden="true"><i /><i /></span>
        </button>
      </div>
    </header>
  )
}
