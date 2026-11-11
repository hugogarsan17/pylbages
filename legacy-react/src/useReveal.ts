import { useEffect } from 'react'

// Aparición suave de los elementos con [data-reveal]. La clase .js-reveal se añade
// en index.html antes del primer pintado y solo si no se pide movimiento reducido;
// sin ella, el contenido se muestra directamente.
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains('js-reveal')) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}
