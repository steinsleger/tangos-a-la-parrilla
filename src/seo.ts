import { keyOptions, originalKey } from './keys.ts'
import type { Lyrics } from './lyrics.ts'
import { formatDate, lastUpdate } from './releases.ts'
import { CHANGELOG_PATH, songPath } from './route.ts'
import type { Song } from './songs.ts'

export const SITE_NAME = 'Tangos a la parrilla'
export const SITE_URL = 'https://tangosalaparrilla.com.ar'

export const SCORES_SOURCE = {
  name: 'Cancionero del Tango',
  author: 'Hugo Satorre',
  url: 'https://hugosatorre.com.ar/portfolio/cancionero/',
}

const OG_IMAGE = `${SITE_URL}/og-image.png`
const HOME_URL = `${SITE_URL}/`
const CHANGELOG_URL = `${SITE_URL}${CHANGELOG_PATH}`

const CREATOR = {
  '@type': 'Person',
  name: 'Adrián Steinsleger',
  url: 'https://www.linkedin.com/in/adriansteinsleger/',
  sameAs: ['https://www.linkedin.com/in/adriansteinsleger/', 'https://www.youtube.com/@AdrianSteinsleger'],
}

export interface Summary {
  es: string
  en: string
}

export interface PageMeta {
  title: string
  description: string
  image: string
  url?: string
  jsonLd?: object
}

export const absoluteSongUrl = (song: Song) => `${SITE_URL}${songPath(song.slug)}`

export const songTitle = (song: Song, keyName: string, hasLyrics: boolean) =>
  `${song.title} (${keyName}): ${hasLyrics ? 'partitura, acordes y letra' : 'partitura y acordes'} | ${SITE_NAME}`

const person = (name: string) => ({ '@type': 'Person', name })

const inBothLanguages = ({ es, en }: Summary) => [
  { '@language': 'es', '@value': es },
  { '@language': 'en', '@value': en },
]

const breadcrumb = (name: string, url: string) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: SITE_NAME, item: HOME_URL },
    { '@type': 'ListItem', position: 2, name, item: url },
  ],
})

export const HOME_SUMMARY: Summary = {
  es: 'Tangos, valses y milongas para tocar en cualquier tonalidad o imprimir la partitura con acordes y letra.',
  en: 'Tangos, valses and milongas to play in any key or print as sheet music with chords and lyrics.',
}

export function songSummary(song: Song, hasLyrics: boolean): Summary {
  const key = originalKey(keyOptions(song.fifths, song.mode)).name
  const { title, author, lyricist } = song
  const es = [author && `De ${author}`, lyricist && `${author ? 'con letra' : 'Letra'} de ${lyricist}`]
  const en = [author && `By ${author}`, lyricist && `${author ? 'lyrics' : 'Lyrics'} by ${lyricist}`]
  const credits = (parts: string[]) => (parts.some(Boolean) ? `${parts.filter(Boolean).join(', ')}. ` : '')

  return {
    es: `Toque «${title}» en cualquier tonalidad o imprima la partitura con acordes${hasLyrics ? ' y la letra' : ''}. ${credits(es)}Tonalidad original: ${key}.`,
    en: `Play "${title}" in any key or print the sheet music with chords${hasLyrics ? ' and lyrics' : ''}. ${credits(en)}Original key: ${key}.`,
  }
}

export const HOME_META: PageMeta = {
  title: `Partituras de tango con acordes y letra en cualquier tonalidad | ${SITE_NAME}`,
  description: HOME_SUMMARY.es,
  url: HOME_URL,
  image: OG_IMAGE,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: HOME_URL,
    inLanguage: 'es',
    description: inBothLanguages(HOME_SUMMARY),
    creator: CREATOR,
    isBasedOn: {
      '@type': 'CreativeWork',
      name: SCORES_SOURCE.name,
      url: SCORES_SOURCE.url,
      creator: person(SCORES_SOURCE.author),
    },
  },
}

const lyricsText = (lyrics: Lyrics) => lyrics.map((verses) => verses.join('\n')).join('\n\n')

export function songMeta(song: Song, lyrics?: Lyrics): PageMeta {
  const key = originalKey(keyOptions(song.fifths, song.mode)).name
  const url = absoluteSongUrl(song)
  const summary = songSummary(song, Boolean(lyrics))

  return {
    title: songTitle(song, key, Boolean(lyrics)),
    description: summary.es,
    url,
    image: OG_IMAGE,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'MusicComposition',
          name: song.title,
          url,
          description: inBothLanguages(summary),
          musicalKey: key,
          ...(song.author && { composer: person(song.author) }),
          ...(song.lyricist && { lyricist: person(song.lyricist) }),
          ...(lyrics && { lyrics: { '@type': 'CreativeWork', inLanguage: 'es', text: lyricsText(lyrics) } }),
        },
        breadcrumb(song.title, url),
      ],
    },
  }
}

export const CHANGELOG_SUMMARY: Summary = {
  es: `Temas agregados, funciones nuevas y correcciones de ${SITE_NAME}. Última actualización: ${formatDate(lastUpdate)}.`,
  en: `New songs, features and fixes in ${SITE_NAME}. Last updated: ${lastUpdate}.`,
}

export const CHANGELOG_META: PageMeta = {
  title: `Novedades: temas agregados y cambios | ${SITE_NAME}`,
  description: CHANGELOG_SUMMARY.es,
  url: CHANGELOG_URL,
  image: OG_IMAGE,
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Novedades',
        url: CHANGELOG_URL,
        inLanguage: 'es',
        dateModified: lastUpdate,
        description: inBothLanguages(CHANGELOG_SUMMARY),
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: HOME_URL },
      },
      breadcrumb('Novedades', CHANGELOG_URL),
    ],
  },
}

export const notFoundMeta: PageMeta = {
  title: `Página no encontrada | ${SITE_NAME}`,
  description: 'La página que busca no existe.',
  image: OG_IMAGE,
}

export const scriptJson = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c')

const sitemapEntry = (url: string, lastmod?: string) =>
  `<url><loc>${url}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`

// The index and the release notes change with every release, so their date is known.
export const sitemap = (songs: Song[]) =>
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[sitemapEntry(HOME_URL, lastUpdate), sitemapEntry(CHANGELOG_URL, lastUpdate), ...songs.map((song) => sitemapEntry(absoluteSongUrl(song)))].join('\n')}
</urlset>
`
