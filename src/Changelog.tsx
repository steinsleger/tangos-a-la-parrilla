import { formatDate, lastUpdate, releases, type Release } from './releases.ts'
import { CHANGELOG_PATH, songPath } from './route.ts'
import { SITE_NAME } from './seo.ts'
import { songs } from './songs.ts'

const NOTE_GROUPS = [
  ['added', 'Nuevo'],
  ['changed', 'Cambios'],
  ['fixed', 'Correcciones'],
] as const

function songWithSlug(slug: string) {
  const song = songs.find((candidate) => candidate.slug === slug)
  if (!song) throw new Error(`Unknown song "${slug}" in releases.ts`)
  return song
}

function DateLabel({ date }: { date: string }) {
  return <time dateTime={date}>{formatDate(date)}</time>
}

export function UpdatesLink() {
  return (
    <a className="updates-link" href={CHANGELOG_PATH}>
      <strong>Novedades</strong>
      <span aria-hidden="true">·</span>
      <span>
        Actualizado el <DateLabel date={lastUpdate} />
      </span>
    </a>
  )
}

function AddedSongs({ slugs }: { slugs: string[] }) {
  return (
    <>
      <h3>Temas agregados</h3>
      <ul className="release-songs">
        {slugs.map(songWithSlug).map((song) => (
          <li key={song.slug}>
            <a href={songPath(song.slug)}>{song.title}</a>
          </li>
        ))}
      </ul>
    </>
  )
}

function ReleaseNotes({ release }: { release: Release }) {
  return (
    <section className="release">
      <h2>Versión {release.version}</h2>
      <p className="release-date">
        <DateLabel date={release.date} />
      </p>
      {NOTE_GROUPS.map(([group, heading]) => {
        const notes = release[group]
        return (
          notes && (
            <div key={group}>
              <h3>{heading}</h3>
              <ul>
                {notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
              {group === 'added' && release.songs && <AddedSongs slugs={release.songs} />}
            </div>
          )
        )
      })}
    </section>
  )
}

export function ChangelogPage() {
  return (
    <main className="page">
      <a className="back-link" href="/">
        {SITE_NAME}: índice alfabético
      </a>
      <h1 className="site-title">Novedades</h1>
      <p className="site-intro">Temas agregados, funciones nuevas y correcciones de {SITE_NAME}.</p>
      {releases.map((release) => (
        <ReleaseNotes key={release.version} release={release} />
      ))}
    </main>
  )
}
