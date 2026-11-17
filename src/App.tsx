import { Analytics } from '@vercel/analytics/react'
import { ChangelogPage } from './Changelog.tsx'
import type { Lyrics } from './lyrics.ts'
import { CHANGELOG_PATH, slugFromPath } from './route.ts'
import { SITE_NAME } from './seo.ts'
import { SiteFooter } from './SiteFooter.tsx'
import { SongList } from './SongList.tsx'
import { SongPage } from './SongPage.tsx'
import { songs } from './songs.ts'

interface PageProps {
  path: string
  lyrics?: Lyrics
}

function Page({ path, lyrics }: PageProps) {
  if (path === '/') return <SongList />
  if (path === CHANGELOG_PATH) return <ChangelogPage />

  const song = songs.find((candidate) => candidate.slug === slugFromPath(path))
  if (song) return <SongPage song={song} lyrics={lyrics} />

  return (
    <main className="page">
      <h1 className="site-title">Página no encontrada</h1>
      <p>
        <a href="/">Ir a {SITE_NAME}: índice alfabético</a>
      </p>
    </main>
  )
}

export function App({ path, lyrics }: PageProps) {
  return (
    <>
      <Page path={path} lyrics={lyrics} />
      <SiteFooter />
      <Analytics />
    </>
  )
}
