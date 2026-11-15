import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { sitemap } from '../src/seo.ts'
import { chordHarmony } from './chords.mjs'
import credits from './credits.json' with { type: 'json' }
import { fixSpelling } from './spelling.mjs'

const SOURCE_DIR = 'scores'
const OUTPUT_DIR = 'public/songs'
const INDEX_FILE = 'src/songs.json'
const SITEMAP_FILE = 'public/sitemap.xml'

const WRONG_SOURCE_TITLES = {
  'Campo afuera cancionero.xml': 'Campo afuera',
  'El dia que me quieras cancionero.xml': 'El día que me quieras',
}

// The quality glyph is unreadable or ambiguous in these, so they keep only what the score confirms.
const UNCERTAIN_CHORDS = {
  Gw: 'G',
  'E%': 'E',
  'Em(,7)': 'Em',
  'Gm#º': 'G#º', // The melody spells G#, B and D before A7.
  'A7(„ˆˆ9)': 'A79', // "„ˆˆ" is spacing: the melody has a natural B.
  'E‹9(„ˆˆ11)': "Em9'11", // The melody has a natural A.
}

// Text over the score that chordHarmony can't read, or that must go.
const TEXT_DIRECTION_FIXES = {
  '\\$Title\\': '', // Unexpanded Sibelius wildcard. The page header already shows the title.
  '£': '', // Chord font glyph for "previous chord continues", which an empty bar already says.
  µ: '', // Unreadable chord font glyph after D7 in ¿Adónde va?
  'Música: F. Pieroni - A. RubinLetra: A. Rubin': '', // Credits typed over the score in Calle, as two texts.
  ...Object.fromEntries(Object.entries(UNCERTAIN_CHORDS).map(([text, chord]) => [text, chordHarmony(chord)])),
}

// Their key signature says major, but they start and end in the relative minor.
const SOURCES_IN_RELATIVE_MINOR = new Set([
  'Acróbata de luz cancionero.xml',
  'Asfalto y tripas corazón cancionero.xml',
  'Balvanera cancionero.xml',
  'De ceniza y de carbón cancionero.xml',
  'Don Juan Alarcón cancionero.xml',
  'Lysou cancionero.xml',
  'Milonga en luto cancionero.xml',
  'No es tango cancionero.xml',
  'Puente Pueyrredón cancionero.xml',
  'Reina noche cancionero.xml',
  'Sin pétalos cancionero.xml',
  'Un nuevo día cancionero.xml',
  'Un patio cancionero.xml',
])

// A direction, plus the next one when it only holds degrees, because Sibelius may split "A7" and "13b".
const DIRECTION =
  /<direction[ >].*?<\/direction>(?:\s*<direction[ >](?:(?!<\/direction>).)*<words[^>]*>(?:[#b]\d+|\d+[#b])<\/words>.*?<\/direction>)?/gs
const WORDS = /<words([^>]*)>(.*?)<\/words>/gs
const CHORD_FONT = /font-family=["'][^"']*Chords/

const XML_ENTITIES = { amp: '&', apos: "'" }

const collapseWhitespace = (text) => text.replace(/\s+/g, ' ').trim()

const decodeEntities = (text) => text.replace(/&(amp|apos);/g, (_, name) => XML_ENTITIES[name])

const readTag = (xml, pattern) => decodeEntities(xml.match(pattern)?.[1] ?? '')

const slugify = (title) =>
  title
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const sortableTitle = ({ title }) => title.replace(/^[¡¿]/, '')

// Boxed text is a section label, like A or Coda, never a chord.
function repairDirection(direction, fileName) {
  const words = [...direction.matchAll(WORDS)]
  if (words.length === 0 || words.some(([, attributes]) => attributes.includes('enclosure'))) return direction

  const text = words.map(([, , text]) => text).join('').trim()
  const repaired = TEXT_DIRECTION_FIXES[text] ?? chordHarmony(text)
  if (repaired === undefined && words.some(([, attributes]) => CHORD_FONT.test(attributes))) {
    throw new Error(`Unreadable chord "${text}" in ${fileName}`)
  }
  return repaired ?? direction
}

const repairTextDirections = (xml, fileName) => xml.replace(DIRECTION, (direction) => repairDirection(direction, fileName))

const isUtf16 = (bytes) => bytes[0] === 0xff && bytes[1] === 0xfe

// Scores exported with Dolet are UTF-16, the ones exported directly from Sibelius are UTF-8.
const decode = (bytes) => (isUtf16(bytes) ? new TextDecoder('utf-16le') : new TextDecoder()).decode(bytes)

const fixMode = (xml, fileName) =>
  SOURCES_IN_RELATIVE_MINOR.has(fileName) ? xml.replace('<mode>major</mode>', '<mode>minor</mode>') : xml

function parseSong(xml, fileName) {
  const sourceTitle = readTag(xml, /<movement-title>(.*?)<\/movement-title>/s) || readTag(xml, /<work-title>(.*?)<\/work-title>/s)
  const title = WRONG_SOURCE_TITLES[fileName] ?? collapseWhitespace(sourceTitle)
  // Line 1 is the author and line 2 the lyricist. The file's own <creator type='lyricist'> holds junk.
  const [author = '', lyricist = ''] = readTag(xml, /<creator type='composer'>(.*?)<\/creator>/s)
    .split('\n')
    .map(collapseWhitespace)
    .filter(Boolean)
  const slug = slugify(title)
  const [, fifths, mode] = xml.match(/<fifths>(-?\d+)<\/fifths>\s*<mode>(\w+)<\/mode>/)
  // Todo Tango prevails over the file, so these credits only stand until the song is added to credits.json.
  return { slug, title, author, lyricist, ...credits[slug], fifths: Number(fifths), mode }
}

rmSync(OUTPUT_DIR, { recursive: true, force: true })
mkdirSync(OUTPUT_DIR, { recursive: true })

const songs = []
const slugs = new Set()

for (const fileName of readdirSync(SOURCE_DIR).filter((name) => name.endsWith('.xml'))) {
  const source = decode(readFileSync(join(SOURCE_DIR, fileName)))
  if (!source.startsWith('<?xml')) {
    console.warn(`Skipped, not MusicXML: ${fileName}`)
    continue
  }

  const utf8 = source.replace("encoding='UTF-16'", "encoding='UTF-8'")
  const xml = fixSpelling(repairTextDirections(fixMode(utf8, fileName), fileName))
  const song = parseSong(xml, fileName)

  if (slugs.has(song.slug)) throw new Error(`Duplicate slug "${song.slug}" from ${fileName}`)
  slugs.add(song.slug)

  writeFileSync(join(OUTPUT_DIR, `${song.slug}.xml`), xml)
  songs.push(song)
}

songs.sort((a, b) => sortableTitle(a).localeCompare(sortableTitle(b), 'es'))
writeFileSync(INDEX_FILE, JSON.stringify(songs))
writeFileSync(SITEMAP_FILE, sitemap(songs))
copyFileSync('LICENSE', 'public/LICENSE.txt')
console.log(`${songs.length} songs written to ${OUTPUT_DIR}`)
