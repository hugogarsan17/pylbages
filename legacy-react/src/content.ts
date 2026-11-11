// Contenido verificado de PYL Bages (fuente: pylbages.es y fotografías propias).
// No añadir cifras, proyectos ni promesas que no estén confirmados por la empresa.

export const company = {
  name: 'PYL Bages',
  legalName: 'PYL Bages S.L.',
  phone: '931 27 64 40',
  phoneHref: 'tel:+34931276440',
  email: 'info@pylbages.es',
  hours: 'Lunes a viernes · 8:00–18:00',
  street: 'Carrer del Pont, 14',
  postalCode: '08691',
  city: 'Monistrol de Montserrat',
  region: 'Barcelona',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=Carrer+del+Pont+14+08691+Monistrol+de+Montserrat',
}

export const nav = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#empresa', label: 'Empresa' },
  { href: '#contacto', label: 'Contacto' },
]

export type Photo = { name: string; widths: number[]; width: number; height: number; alt: string }

const obra = '/images/obra/'
export const photoSrc = (photo: Photo, width = photo.widths[photo.widths.length - 1]) => `${obra}${photo.name}-${width}.webp`
export const photoSrcSet = (photo: Photo) => photo.widths.map((w) => `${photoSrc(photo, w)} ${w}w`).join(', ')

export const heroPhoto: Photo = {
  name: 'techo-descuelgue-hidrofuga',
  widths: [640, 1080],
  width: 1080,
  height: 1080,
  alt: 'Falso techo de placa de yeso laminado con un descuelgue para instalaciones y tabiques de placa resistente a la humedad, con las juntas tratadas, durante la obra',
}

export const teamPhoto: Photo = {
  name: 'equipo-local',
  widths: [640, 900],
  width: 900,
  height: 897,
  alt: 'Dos miembros del equipo de PYL Bages delante del local de la empresa, con el rótulo PYL Bages S.L. en la fachada',
}

export const services = [
  { title: 'Tabiquería de placa de yeso laminado', text: 'Tabiques, trasdosados y derivados para crear nuevas distribuciones o rehacer las existentes. La solución se define según el uso, los encuentros y las instalaciones previstas.' },
  { title: 'Falsos techos', text: 'Todo tipo de falsos techos: continuos, con descuelgues o con registros. Ordenan el plano del techo e integran el paso de instalaciones.' },
  { title: 'Aislamiento térmico', text: 'Capas aislantes incorporadas al sistema de placa para mejorar el confort. Se eligen tras valorar el cerramiento, el soporte y las condiciones de montaje.' },
  { title: 'Aislamiento acústico', text: 'Soluciones de tabique, trasdosado o techo que limitan la transmisión de sonido entre espacios. El resultado depende del conjunto de capas y de sus encuentros.' },
  { title: 'Insonorizaciones', text: 'Intervenciones para reducir el ruido que entra o sale de una estancia. Primero se identifica el origen del problema y cómo está construido el recinto.' },
  { title: 'Protección pasiva contra el fuego', text: 'Sectorizaciones ignífugas y protección de elementos con sistemas de placa, definidas conforme a los requisitos que se apliquen a cada obra.' },
]

export type Project = Photo & { type: string; text: string; layout: 'wide' | 'tall' | 'square' }

export const projects: Project[] = [
  {
    name: 'techo-exterior-glasroc', widths: [640, 1080, 1600], width: 2040, height: 1536, layout: 'wide',
    type: 'Techo exterior',
    text: 'Techo de porche resuelto con placa para exteriores Glasroc X, atornillada sobre la estructura antes del tratamiento de juntas.',
    alt: 'Techo exterior de un porche revestido con placas Glasroc X atornilladas, sostenido por pilares metálicos, con el jardín al fondo',
  },
  {
    name: 'techo-continuo-trasdosados', widths: [640, 1080], width: 1080, height: 1080, layout: 'tall',
    type: 'Falso techo y trasdosados',
    text: 'Techo continuo y trasdosados con las juntas encintadas. Se dejan registros en la pared para los colectores de la instalación.',
    alt: 'Estancia con falso techo continuo y paredes trasdosadas de placa de yeso con las juntas encintadas y dos registros abiertos para colectores',
  },
  {
    name: 'tabique-bajo-l', widths: [640, 1080], width: 1080, height: 1080, layout: 'square',
    type: 'Tabiquería',
    text: 'Tabique bajo en L con las aristas definidas y las juntas plastecidas, a falta del acabado final.',
    alt: 'Tabique bajo de placa de yeso laminado en forma de L, con aristas rectas y juntas plastecidas, sobre suelo de terrazo',
  },
  {
    name: 'descuelgue-climatizacion', widths: [640, 1080], width: 1080, height: 1080, layout: 'square',
    type: 'Falso techo con descuelgue',
    text: 'Descuelgue de techo con un registro abierto para el paso del conducto de climatización y del cableado.',
    alt: 'Falso techo de placa de yeso con un descuelgue y un hueco abierto por el que bajan un conducto flexible de climatización y cables',
  },
]

export const details = [
  { src: '/images/obra/detalle-encuentro.webp', size: 650, title: 'Encuentro entre planos', text: 'El descuelgue se une al techo continuo con la junta tratada, sin escalones ni fisuras visibles.', alt: 'Primer plano del encuentro entre un descuelgue y el falso techo de placa de yeso, con las juntas tratadas' },
  { src: '/images/obra/detalle-arista.webp', size: 640, title: 'Aristas rectas', text: 'El canto del tabique queda definido antes del acabado: es lo primero que se ve y lo que más se nota.', alt: 'Primer plano de la arista de un tabique bajo de placa de yeso, recta y con la junta plastecida' },
  { src: '/images/obra/detalle-juntas.webp', size: 660, title: 'Juntas encintadas', text: 'Cinta y pasta en cada unión de placas para dejar el techo listo para lijar y pintar.', alt: 'Primer plano de un falso techo con las juntas entre placas encintadas y plastecidas' },
  { src: '/images/obra/detalle-fijacion.webp', size: 730, title: 'Placa para exterior', text: 'En exterior se emplea una placa específica. Aquí se ve el atornillado antes de tratar las juntas.', alt: 'Primer plano de placas Glasroc X atornilladas en un techo exterior, con la línea de junta entre dos placas' },
]

export const steps = [
  { title: 'Contacto', text: 'Nos cuentas qué necesitas resolver, dónde está la obra y en qué estado se encuentra.' },
  { title: 'Valoración', text: 'Revisamos contigo el alcance, el soporte y las instalaciones para plantear el sistema adecuado. El asesoramiento es sin compromiso.' },
  { title: 'Propuesta y planificación', text: 'Preparamos un presupuesto sin compromiso, con operarios, productos y maquinaria incluidos, y organizamos los trabajos.' },
  { title: 'Ejecución y revisión', text: 'Ejecutamos la obra y, antes de entregarla, verificamos el trabajo contigo para que des tu conformidad.' },
]

export const faqs = [
  ['¿Qué información os ayuda a preparar un presupuesto?', 'El tipo de trabajo, el municipio, las dimensiones aproximadas si las conoces y el estado actual de la obra. Si tienes planos o fotografías, menciónalo al contactar y te indicaremos cómo compartirlos.'],
  ['¿Con qué marcas trabajáis?', 'Trabajamos con todas las marcas del mercado. Elegimos el sistema según las necesidades de cada obra.'],
  ['¿Qué diferencia hay entre acondicionamiento acústico e insonorización?', 'El acondicionamiento controla cómo se comporta el sonido dentro de una sala; la insonorización reduce la transmisión de sonido entre espacios. La intervención adecuada depende del origen del problema y de cómo está construido el recinto.'],
  ['¿En qué municipios trabajáis?', 'Estamos en Monistrol de Montserrat. Indica el municipio de la obra en tu consulta y te confirmaremos si podemos valorarla.'],
]
