// Stanzas of verses.
export type Lyrics = string[][]

export const LYRICS_DATA_ID = 'lyrics-data'

export const lyricsUrl = (slug: string) => `/lyrics/${slug}.json`

// A prerendered page carries its lyrics, so hydration never waits for the network.
export function lyricsInPage(): Lyrics | undefined {
  const data = document.getElementById(LYRICS_DATA_ID)?.textContent
  return data ? JSON.parse(data) : undefined
}

// Only the dev server, which renders from scratch, has to fetch them.
export async function loadLyrics(slug: string): Promise<Lyrics | undefined> {
  try {
    const response = await fetch(lyricsUrl(slug))
    return response.ok ? await response.json() : undefined
  } catch {
    return undefined
  }
}
