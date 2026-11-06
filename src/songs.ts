import data from './songs.json'
import type { Mode } from './keys.ts'

export interface Song {
  slug: string
  title: string
  author: string
  lyricist: string
  fifths: number
  mode: Mode
}

export const songs = data as Song[]

export const creditsOf = ({ author, lyricist }: Song) =>
  [author && `Autor: ${author}`, lyricist && `Letra: ${lyricist}`].filter(Boolean).join(' · ')
