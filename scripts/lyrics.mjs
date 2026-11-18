import { collapseWhitespace, decodeEntities } from './xml.mjs'

const PAGE_TEXT = /<credit-words([^>]*)>([^<]*)<\/credit-words>/g
// Sibelius right-aligns the credits. Titles, page numbers and notes such as "Forma A/A/B" take one line.
const isLyrics = (attributes, text) =>
  !/justify=["']right["']/.test(attributes) && text.split('\n').filter((line) => line.trim()).length > 1

export const lyricsInScore = (xml) =>
  [...xml.matchAll(PAGE_TEXT)]
    .filter(([, attributes, text]) => isLyrics(attributes, text))
    .map(([, , text]) => decodeEntities(text))
    .join('\n\n')

export const stanzas = (text) =>
  text
    .split(/\n\s*\n/)
    .map((stanza) => stanza.split('\n').map(collapseWhitespace).filter(Boolean))
    .filter((lines) => lines.length > 0)
