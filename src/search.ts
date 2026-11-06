import type { Song } from './songs.ts'

type Searchable = Pick<Song, 'title' | 'author' | 'lyricist'>

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\p{M}'’]/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .toLowerCase()

export function matches({ title, author, lyricist }: Searchable, query: string) {
  const text = normalize(`${title} ${author} ${lyricist}`)
  return normalize(query)
    .split(' ')
    .every((word) => text.includes(word))
}
