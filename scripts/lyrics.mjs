const PAGE_TEXT = /<credit-words[^>]*>([^<]*)<\/credit-words>/g
// Titles, credits, page numbers and notes such as "Forma A/A/B" take up to three lines.
const MIN_LYRICS_LINES = 4

const lineCount = (text) => text.split('\n').filter((line) => line.trim()).length

// Scores exported straight from Sibelius carry their lyrics as page text, in reading order.
export const lyricsInScore = (xml) =>
  [...xml.matchAll(PAGE_TEXT)]
    .map(([, text]) => text)
    .filter((text) => lineCount(text) >= MIN_LYRICS_LINES)
    .join('\n\n')

export const stanzas = (text) =>
  text
    .split(/\n\s*\n/)
    .map((stanza) =>
      stanza
        .split('\n')
        .map((line) => line.replace(/\s+/g, ' ').trim())
        .filter(Boolean),
    )
    .filter((lines) => lines.length > 0)
