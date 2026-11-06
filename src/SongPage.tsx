import { useEffect, useState } from 'react'
import { creditParts } from './credits.ts'
import { KeySelect } from './KeySelect.tsx'
import { chosenKey, keyOptions, originalKey } from './keys.ts'
import { rememberedKey, rememberKey } from './rememberedKeys.ts'
import { keyFromUrl, songUrl } from './route.ts'
import { SITE_NAME, songTitle } from './seo.ts'
import { SheetMusic } from './SheetMusic.tsx'
import type { Song } from './songs.ts'
import { personOnTodoTango, songOnTodoTango } from './todotango.ts'

function People({ credit }: { credit: string }) {
  return creditParts(credit).map((part, index) => {
    const url = personOnTodoTango(part)
    return url ? (
      <a key={index} href={url} target="_blank" rel="noreferrer">
        {part}
      </a>
    ) : (
      part
    )
  })
}

function SongCredits({ song }: { song: Song }) {
  const url = songOnTodoTango(song.slug)

  return (
    <p className="song-credits">
      {song.author && (
        <span>
          Autor: <People credit={song.author} />
        </span>
      )}
      {song.lyricist && (
        <span>
          Letra: <People credit={song.lyricist} />
        </span>
      )}
      {url && (
        <a className="todotango-link" href={url} target="_blank" rel="noreferrer">
          Ver en Todo Tango
        </a>
      )}
    </p>
  )
}

export function SongPage({ song }: { song: Song }) {
  const options = keyOptions(song.fifths, song.mode)
  const [keyName, setKeyName] = useState(originalKey(options).name)
  const selected = options.find((option) => option.name === keyName)!

  function showKey(name?: string) {
    if (name) setKeyName(name)
    history.replaceState(null, '', songUrl(song.slug, name))
  }

  function selectKey(name: string) {
    rememberKey(song.slug, name)
    showKey(name)
  }

  useEffect(() => {
    showKey(chosenKey(options, keyFromUrl(location.search, location.hash), rememberedKey(song.slug))?.name)
  }, [song])

  useEffect(() => {
    document.title = songTitle(song, selected.name)
  }, [song, selected.name])

  return (
    <main className="page page-wide">
      <a className="back-link" href="/">
        {SITE_NAME}: índice alfabético
      </a>
      <header className="song-header">
        <div>
          <h1>{song.title}</h1>
          <SongCredits song={song} />
        </div>
        <div className="song-actions">
          <button type="button" className="print-button" onClick={() => window.print()}>
            Exportar PDF
          </button>
          <KeySelect options={options} selected={selected.name} onChange={selectKey} />
        </div>
      </header>
      <SheetMusic slug={song.slug} semitones={selected.semitones} />
    </main>
  )
}
