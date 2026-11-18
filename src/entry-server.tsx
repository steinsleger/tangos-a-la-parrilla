import { existsSync, readFileSync } from 'node:fs'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { App } from './App.tsx'
import { Head } from './Head.tsx'
import { lyricsUrl, type Lyrics } from './lyrics.ts'
import { CHANGELOG_PATH, songPath } from './route.ts'
import { CHANGELOG_META, HOME_META, notFoundMeta, songMeta, type PageMeta } from './seo.ts'
import { songs } from './songs.ts'

function lyricsOf(slug: string): Lyrics | undefined {
  const file = `public${lyricsUrl(slug)}`
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : undefined
}

interface Page {
  path: string
  file: string
  meta: PageMeta
  lyrics?: Lyrics
}

export const pages: Page[] = [
  { path: '/', file: 'index.html', meta: HOME_META },
  { path: CHANGELOG_PATH, file: `${CHANGELOG_PATH.slice(1)}index.html`, meta: CHANGELOG_META },
  ...songs.map((song) => {
    const lyrics = lyricsOf(song.slug)
    return {
      path: songPath(song.slug),
      file: `${songPath(song.slug).slice(1)}index.html`,
      meta: songMeta(song, lyrics),
      lyrics,
    }
  }),
  { path: '/404', file: '404.html', meta: notFoundMeta },
]

export const renderPage = ({ path, meta, lyrics }: Page) => ({
  app: renderToString(<App path={path} lyrics={lyrics} />),
  head: renderToStaticMarkup(<Head meta={meta} lyrics={lyrics} />),
})
