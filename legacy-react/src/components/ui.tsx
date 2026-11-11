import { useState } from 'react'
import type { ReactNode } from 'react'

type MediaImageProps = {
  src: string
  alt: string
  width: number
  height: number
  srcSet?: string
  sizes?: string
  className?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
}

export function MediaImage({ src, alt, width, height, srcSet, sizes, className, loading = 'lazy', fetchPriority }: MediaImageProps) {
  const [unavailable, setUnavailable] = useState(false)
  if (unavailable) {
    return <div className={`media-unavailable${className ? ` ${className}` : ''}`} role="img" aria-label={`${alt}. Imagen no disponible en este momento.`}><span>Imagen no disponible</span></div>
  }
  return <img className={className} src={src} srcSet={srcSet} sizes={sizes} alt={alt} width={width} height={height} loading={loading} decoding="async" fetchPriority={fetchPriority} onError={() => setUnavailable(true)} />
}

export function Brand({ withLabel = false }: { withLabel?: boolean }) {
  return (
    <a className="brand" href="#inicio" aria-label="PYL Bages, ir al inicio">
      <span className="brand-mark">
        <img src="/images/pylbages-logo.webp" srcSet="/images/pylbages-logo-sm.webp 160w, /images/pylbages-logo.webp 321w" sizes="80px" alt="" width="321" height="449" />
      </span>
      {withLabel && <span className="brand-label" aria-hidden="true"><b>PYL Bages</b><small>Placa de yeso laminado</small></span>}
    </a>
  )
}

export function SectionHead({ number, label, title, children, id }: { number: string; label: string; title: ReactNode; children?: ReactNode; id: string }) {
  return (
    <header className="section-head" data-reveal>
      <p className="section-index"><span>{number}</span>{label}</p>
      <h2 id={id}>{title}</h2>
      {children && <div className="section-intro">{children}</div>}
    </header>
  )
}
