// Stanzas of verses, one file per song, so each page only downloads its own.
export type Lyrics = string[][]

export const lyricsUrl = (slug: string) => `/lyrics/${slug}.json`

export async function loadLyrics(slug: string): Promise<Lyrics | undefined> {
  try {
    const response = await fetch(lyricsUrl(slug))
    return response.ok ? await response.json() : undefined
  } catch {
    return undefined
  }
}
