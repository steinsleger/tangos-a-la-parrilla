// Release notes for the site's visitors, newest first. CHANGELOG.md holds the same history for developers.
export interface Release {
  version: string
  date: string
  added?: string[]
  songs?: string[]
  changed?: string[]
  fixed?: string[]
}

export const releases: Release[] = [
  {
    version: '1.2.0',
    date: '2026-11-17',
    added: [
      'La letra de los 428 temas, debajo de la partitura, en dos columnas en las pantallas anchas.',
      'Un botón «Letra», junto a «Exportar», que lleva directamente a la letra.',
    ],
    changed: ['La exportación a PDF agrega la letra en una página aparte, después de la partitura.'],
  },
  {
    version: '1.1.0',
    date: '2026-11-15',
    added: [
      '37 temas nuevos, en su mayoría de autores contemporáneos, y tres que faltaban desde la primera versión: «Afiches», «Gricel» y «Siempre se vuelve a Buenos Aires».',
      'Exportación a XML (MusicXML) en el tono elegido, para abrir la partitura en programas como MuseScore o Sibelius.',
      'Esta página de novedades, con la fecha de la última actualización.',
    ],
    songs: [
      'acrobata-de-luz',
      'adonde-va',
      'afiches',
      'aire-sin-final',
      'al-lado-de-tu-sueno',
      'araca-el-equivoco',
      'asfalto-y-tripas-corazon',
      'balvanera',
      'borron-y-cuenta-nueva',
      'calle',
      'ciudad-de-nadie',
      'cuando-los-demonios-tratan',
      'daria',
      'de-ceniza-y-de-carbon',
      'don-juan-alarcon',
      'el-remate',
      'esa-palabra',
      'fugaz',
      'gricel',
      'inundacion',
      'lysou',
      'marilina',
      'milonga-del-cogotudo',
      'milonga-en-luto',
      'no-es-tango',
      'no-tan-angelito',
      'plegaria',
      'puente-pueyrredon',
      'purpuras-de-piedra-y-puterio',
      'regin',
      'reina-noche',
      'romance-de-cotillon',
      'siempre-se-vuelve-a-buenos-aires',
      'sin-petalos',
      'sinsur',
      'tu-mejor-alumno',
      'un-lado-y-otro',
      'un-nuevo-dia',
      'un-patio',
      'viento-solo',
    ],
    changed: ['El botón «Exportar PDF» ahora es un menú «Exportar» con PDF y XML.'],
  },
  {
    version: '1.0.0',
    date: '2026-11-06',
    added: [
      'Índice de 388 temas con búsqueda por título, autor o letrista.',
      'Partituras con acordes, ajustadas al tamaño de la pantalla.',
      'Transposición a cualquiera de los 12 tonos, con un selector que marca el tono original y el elegido.',
      'El tono elegido queda en la dirección de la página, así que un enlace abre la partitura en ese tono.',
      'El sitio recuerda en su navegador el último tono que usted eligió para cada tema.',
      'Exportación a PDF desde la página de cada tema.',
      'Enlaces a Todo Tango para los temas, compositores y letristas que figuran allí.',
      'Formulario para reportar errores y sugerir mejoras.',
    ],
    fixed: [
      'Ortografía de títulos, créditos y notas de las partituras, sobre todo tildes.',
      'Acordes que estaban escritos como texto y no se podían transponer.',
      'Créditos de autores y letristas según Todo Tango.',
    ],
  },
]

export const lastUpdate = releases[0].date

const DATE_FORMAT = new Intl.DateTimeFormat('es', { dateStyle: 'long', timeZone: 'UTC' })

export const formatDate = (isoDate: string) => DATE_FORMAT.format(new Date(isoDate))
