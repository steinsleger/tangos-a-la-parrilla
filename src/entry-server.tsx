import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { App } from './App.tsx'
import { Head } from './Head.tsx'
import { songPath } from './route.ts'
import { HOME_META, notFoundMeta, songMeta, type PageMeta } from './seo.ts'
import { songs } from './songs.ts'

interface Page {
  path: string
  file: string
  meta: PageMeta
}

export const pages: Page[] = [
  { path: '/', file: 'index.html', meta: HOME_META },
  ...songs.map((song) => ({
    path: songPath(song.slug),
    file: `${songPath(song.slug).slice(1)}index.html`,
    meta: songMeta(song),
  })),
  { path: '/404', file: '404.html', meta: notFoundMeta },
]

export const renderPage = ({ path, meta }: Page) => ({
  app: renderToString(<App path={path} />),
  head: renderToStaticMarkup(<Head meta={meta} />),
})
