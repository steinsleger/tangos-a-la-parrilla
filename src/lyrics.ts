import { lyricsInJsonLd } from './seo.ts'

type Stanza = string[]
export type Lyrics = Stanza[]

export const lyricsFile = (slug: string) => `src/lyrics/${slug}.json`

// A prerendered page carries its lyrics in its structured data, so hydration never waits for the network.
export function lyricsInPage(): Lyrics | undefined {
  const jsonLd = document.querySelector('script[type="application/ld+json"]')?.textContent
  return jsonLd ? lyricsInJsonLd(JSON.parse(jsonLd)) : undefined
}

// Only the dev server, which renders from scratch, has to fetch them.
export async function loadLyrics(slug: string): Promise<Lyrics | undefined> {
  try {
    const response = await fetch(`/${lyricsFile(slug)}`)
    return response.ok ? await response.json() : undefined
  } catch {
    return undefined
  }
}
