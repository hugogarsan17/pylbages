// Iconos SVG de trazo lineal (24×24, stroke 1.6). Todos decorativos: aria-hidden.
const svg = (body, cls = '') =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`

export const icons = {
  // Tabique: montantes + placa
  wall: svg('<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M8 3v18M13 3v18M18 3v18M3 9h18"/>'),
  // Falso techo: techo + cuelgues + plano bajado
  ceiling: svg('<path d="M2 4h20M6 4v5M12 4v5M18 4v5M3 9h18v2H3zM9 11v2.5M15 11v2.5"/><path d="M7 20l2-4h6l2 4"/>'),
  // Térmico
  thermal: svg('<path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 9v7"/><path d="M18 6h3M18 10h3"/>'),
  // Acústico
  acoustic: svg('<path d="M4 9v6h3l5 4V5L7 9H4z"/><path d="M16 9.5a3.5 3.5 0 0 1 0 5"/><path d="M18.5 7a7 7 0 0 1 0 10"/><path d="M14 3l7 18" stroke-dasharray="2 2.4"/>'),
  clean: svg('<path d="M14 3l-4 9"/><path d="M6 12h8l2 9H4l2-9z"/><path d="M8 16v5M12 16v5"/><path d="M18 4l.5 1.5L20 6l-1.5.5L18 8l-.5-1.5L16 6l1.5-.5z"/>'),
  calendar: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8.5 15l2.2 2.2L15.5 13"/>'),
  doc: svg('<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 12h7M9 15h7M9 18h4"/>'),
  ruler: svg('<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>'),
  phone: svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
  whatsapp: svg('<path d="M4 20l1.3-4A8 8 0 1 1 8.2 19z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 1a4.5 4.5 0 0 1-2.4-2.4l1-1-1-2z"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  pin: svg('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  home: svg('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
  crane: svg('<path d="M4 21V5h3v16M7 5h13l-3 4M7 9h10M14 9v5"/><rect x="12.5" y="14" width="3" height="2.5"/><path d="M2 21h8"/>'),
  office: svg('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/>'),
  upload: svg('<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>'),
  star: svg('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>'),
  menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
}
