import { Analytics } from '@vercel/analytics/react'
import { slugFromPath } from './route.ts'
import { SITE_NAME } from './seo.ts'
import { SiteFooter } from './SiteFooter.tsx'
import { SongList } from './SongList.tsx'
import { SongPage } from './SongPage.tsx'
import { songs } from './songs.ts'

function Page({ path }: { path: string }) {
  if (path === '/') return <SongList />

  const song = songs.find((candidate) => candidate.slug === slugFromPath(path))
  if (song) return <SongPage song={song} />

  return (
    <main className="page">
      <h1 className="site-title">Página no encontrada</h1>
      <p>
        <a href="/">Ir a {SITE_NAME}: índice alfabético</a>
      </p>
    </main>
  )
}

export function App({ path }: { path: string }) {
  return (
    <>
      <Page path={path} />
      <SiteFooter />
      <Analytics />
    </>
  )
}
