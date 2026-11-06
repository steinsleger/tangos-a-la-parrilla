import { useState } from 'react'
import { songPath } from './route.ts'
import { matches } from './search.ts'
import { HOME_SUMMARY, SITE_NAME } from './seo.ts'
import { creditsOf, songs } from './songs.ts'

export function SongList() {
  const [query, setQuery] = useState('')
  const results = songs.filter((song) => matches(song, query))

  return (
    <main className="page">
      <h1 className="site-title">{SITE_NAME}</h1>
      <p className="site-intro">{HOME_SUMMARY.es}</p>
      <h2 className="index-title">Índice alfabético</h2>
      <div className="search">
        <input
          type="search"
          aria-label="Buscar"
          placeholder="Buscar por título, autor o letrista…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {results.length === 0 ? (
        <p role="status">Sin resultados.</p>
      ) : (
        <ul className="song-list">
          {results.map((song) => (
            <li key={song.slug}>
              <a href={songPath(song.slug)}>
                <span className="song-title">{song.title}</span>
                <span className="song-credits">{creditsOf(song)}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
