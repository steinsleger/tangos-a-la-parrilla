import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { sitemap } from '../src/seo.ts'
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

const rootStep = (letter) => `<root-step>${letter}</root-step>`
const harmony = (root, kind, bass = '') => `<harmony><root>${root}</root><kind>${kind}</kind>${bass}</harmony>`

// Sibelius exported these as plain text, which OSMD renders verbatim and can't transpose.
const TEXT_DIRECTION_FIXES = {
  '\\$Title\\': '', // Unexpanded Sibelius wildcard. The page header already shows the title.
  A7: harmony(rootStep('A'), 'dominant'),
  'Am/C': harmony(rootStep('A'), 'minor', '<bass><bass-step>C</bass-step></bass>'),
  'C#0': harmony(`${rootStep('C')}<root-alter>1</root-alter>`, 'diminished'),
  C07: harmony(rootStep('C'), 'diminished-seventh'),
  Gw: harmony(rootStep('G'), 'major'), // The "w" quality glyph is unreadable, only the root is certain.
  '£': '', // Chord font glyph for "previous chord continues", which an empty bar already says.
}

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

const repairTextDirections = (xml) =>
  xml.replace(/<direction[ >].*?<\/direction>/gs, (direction) => {
    const text = direction.match(/<words[^>]*>\s*(.*?)\s*<\/words>/s)?.[1]
    return TEXT_DIRECTION_FIXES[text] ?? direction
  })

const isUtf16 = (bytes) => bytes[0] === 0xff && bytes[1] === 0xfe

function parseSong(xml, fileName) {
  const title = WRONG_SOURCE_TITLES[fileName] ?? collapseWhitespace(readTag(xml, /<movement-title>(.*?)<\/movement-title>/s))
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
  const bytes = readFileSync(join(SOURCE_DIR, fileName))
  if (!isUtf16(bytes)) {
    console.warn(`Skipped, not MusicXML: ${fileName}`)
    continue
  }

  const xml = fixSpelling(
    repairTextDirections(new TextDecoder('utf-16le').decode(bytes).replace("encoding='UTF-16'", "encoding='UTF-8'")),
  )
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
