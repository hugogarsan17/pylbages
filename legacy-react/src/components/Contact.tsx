import { useState } from 'react'
import type { FormEvent } from 'react'
import { company, services } from '../content'

// No hay backend de formularios: el mensaje se prepara y se abre en la aplicación
// de correo del usuario. El envío real lo hace la persona desde su correo.
type Status = { kind: 'idle' } | { kind: 'error'; message: string } | { kind: 'ready'; body: string; copied?: 'ok' | 'fail' }

const subject = 'Solicitud de presupuesto · PYL Bages'

export function Contact() {
  const [contactMethod, setContactMethod] = useState<'email' | 'tel'>('email')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      setStatus({ kind: 'error', message: 'Revisa los campos marcados como obligatorios.' })
      form.querySelector<HTMLElement>(':invalid')?.focus()
      form.reportValidity()
      return
    }
    const data = new FormData(form)
    const body = [
      `Nombre: ${data.get('name')}`,
      `${contactMethod === 'email' ? 'Correo' : 'Teléfono'} de respuesta: ${data.get('replyTo')}`,
      `Tipo de trabajo: ${data.get('service') || 'No especificado'}`,
      `Municipio: ${data.get('municipality') || 'No especificado'}`,
      '',
      'Descripción del proyecto:',
      String(data.get('description') ?? ''),
    ].join('\n')
    setStatus({ kind: 'ready', body })
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const copy = async () => {
    if (status.kind !== 'ready') return
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${status.body}`)
      setStatus({ ...status, copied: 'ok' })
    } catch {
      setStatus({ ...status, copied: 'fail' })
    }
  }

  return (
    <section className="contact section" id="contacto" aria-labelledby="contacto-title">
      <div className="container contact-grid">
        <div className="contact-copy" data-reveal>
          <p className="section-index"><span>07</span>Contacto</p>
          <h2 id="contacto-title">Cuéntanos <em>tu proyecto.</em></h2>
          <p className="contact-lead">Una primera descripción nos ayuda a entender el trabajo y a orientarte. El presupuesto es sin compromiso.</p>
          <ul className="contact-channels">
            <li><small>Llámanos</small><a href={company.phoneHref}>{company.phone}</a></li>
            <li><small>Escríbenos</small><a href={`mailto:${company.email}`}>{company.email}</a></li>
            <li><small>Horario</small><span>{company.hours}</span></li>
            <li><small>Local</small><a href={company.mapsHref} target="_blank" rel="noopener noreferrer">{company.street}<br />{company.postalCode} {company.city}<span className="visually-hidden"> (abre Google Maps en una pestaña nueva)</span></a></li>
          </ul>
        </div>

        <form className="contact-form" onSubmit={submit} noValidate aria-describedby="form-delivery" data-reveal>
          <h3>Solicitud de presupuesto</h3>
          <p className="form-delivery" id="form-delivery">Al continuar se abrirá tu aplicación de correo con el mensaje preparado; tendrás que enviarlo desde allí. Los campos con * son obligatorios.</p>
          <label>Nombre *<input name="name" autoComplete="name" required /></label>
          <fieldset className="contact-method">
            <legend>¿Cómo prefieres que te respondamos?</legend>
            <label><input type="radio" name="contactMethod" value="email" checked={contactMethod === 'email'} onChange={() => setContactMethod('email')} />Correo</label>
            <label><input type="radio" name="contactMethod" value="tel" checked={contactMethod === 'tel'} onChange={() => setContactMethod('tel')} />Teléfono</label>
          </fieldset>
          <label>{contactMethod === 'email' ? 'Correo electrónico' : 'Teléfono'} *
            <input
              key={contactMethod}
              name="replyTo"
              type={contactMethod}
              inputMode={contactMethod === 'email' ? 'email' : 'tel'}
              autoComplete={contactMethod}
              required
              pattern={contactMethod === 'tel' ? '[0-9 +()\\-]{9,}' : undefined}
              title={contactMethod === 'tel' ? 'Introduce un teléfono de al menos 9 dígitos' : undefined}
            />
          </label>
          <div className="form-row">
            <label>Tipo de trabajo
              <select name="service" defaultValue="">
                <option value="">Selecciona una opción</option>
                {services.map((service) => <option key={service.title}>{service.title}</option>)}
                <option>Otro / no lo sé todavía</option>
              </select>
            </label>
            <label>Municipio de la obra<input name="municipality" autoComplete="address-level2" /></label>
          </div>
          <label>Descripción del proyecto *<textarea name="description" rows={4} required placeholder="Qué necesitas resolver, estado de la obra, medidas aproximadas…" /></label>
          <button className="button button-accent" type="submit">Preparar correo</button>

          <div className={`form-status form-status-${status.kind}`} role="status" aria-live="polite">
            {status.kind === 'error' && <p>{status.message}</p>}
            {status.kind === 'ready' && (
              <>
                <p><b>Mensaje preparado.</b> Revisa tu aplicación de correo y pulsa enviar. Si no se ha abierto, copia el mensaje y envíalo a <a href={`mailto:${company.email}`}>{company.email}</a>, o llámanos al <a href={company.phoneHref}>{company.phone}</a>.</p>
                <button type="button" className="text-button" onClick={copy}>Copiar mensaje</button>
                {status.copied === 'ok' && <p>Mensaje copiado al portapapeles.</p>}
                {status.copied === 'fail' && <p>No se ha podido copiar automáticamente. Escríbenos directamente a {company.email}.</p>}
              </>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
