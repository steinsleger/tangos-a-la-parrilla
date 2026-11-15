// Reads chord symbols typed as text, including the glyphs of Sibelius' Opus Chords font and the Spanish
// habit of writing the accidental after the degree ("9b"), so OSMD can transpose them.

const KINDS = {
  '': 'major',
  m: 'minor',
  7: 'dominant',
  m7: 'minor-seventh',
  maj7: 'major-seventh',
  mmaj7: 'major-minor',
  6: 'major-sixth',
  m6: 'minor-sixth',
  o: 'diminished',
  o7: 'diminished-seventh',
  ø: 'half-diminished',
  m7b5: 'half-diminished',
  '+': 'augmented',
  sus4: 'suspended-fourth',
  9: 'dominant-ninth',
  m9: 'minor-ninth',
  maj9: 'major-ninth',
  11: 'dominant-11th',
  m11: 'minor-11th',
  13: 'dominant-13th',
  m13: 'minor-13th',
}

const NINTH_OF = { dominant: 'dominant-ninth', 'minor-seventh': 'minor-ninth', 'major-seventh': 'major-ninth' }

const ALTER = { '#': 1, b: -1 }

const qualities = [...Object.keys(KINDS), '7sus4'].sort((a, b) => b.length - a.length)
// An apostrophe is Opus Chords' superscript code: the degrees after it are added tones.
const QUALITY = new RegExp(`^(${qualities.map(RegExp.escape).join('|')})((?:'?[#b]?(?:5|9|11|13))*)$`)
const DEGREE = /('?)([#b]?)(5|9|11|13)/g
const ROOT = /^([A-G])([#b]?)(.*)$/
const BASS = /\/([A-G])([#b]?)$/

const pitch = (name, letter, accidental) =>
  `<${name}-step>${letter}</${name}-step>${accidental ? `<${name}-alter>${ALTER[accidental]}</${name}-alter>` : ''}`

const degree = (value, accidental, type = 'add') =>
  `<degree><degree-value>${value}</degree-value><degree-alter>${ALTER[accidental] ?? 0}</degree-alter><degree-type>${type}</degree-type></degree>`

const normalize = (text) =>
  text
    .trim()
    .replace(/&apos;/g, "'")
    .replace(/^\((.*)\)$/, '$1')
    .replaceAll('©', '#')
    .replaceAll('¨', 'b')
    .replaceAll('‹', 'm')
    .replaceAll('Ø', 'ø')
    .replace(/[º°]|dim/g, 'o')
    .replace(/\^|ma[jy]?7|7\+/g, 'maj7')
    .replace(/(5|9|11|13)([#b+])(?!\d)/g, (_, value, accidental) => (accidental === '+' ? '#' : accidental) + value)

function quality(text) {
  const match = text.replace(/[(),/]/g, '').replace(/^-/, 'm').replace(/^0/, 'o').match(QUALITY)
  if (!match) return undefined

  const [, base, extensions] = match
  let kind = base === '7sus4' ? 'dominant' : KINDS[base]
  const degrees = base === '7sus4' ? [degree(4), degree(3, '', 'subtract')] : []

  for (const { 1: apostrophe, 2: accidental, 3: value, index } of extensions.matchAll(DEGREE)) {
    const isPlainNinthAfterSeventh = value === '9' && index === 0 && !apostrophe && !accidental && NINTH_OF[kind]
    if (isPlainNinthAfterSeventh) kind = NINTH_OF[kind]
    else degrees.push(degree(value, accidental))
  }

  return { kind, degrees: degrees.join('') }
}

export function chordHarmony(text) {
  const chord = normalize(text)
  const bass = chord.match(BASS)
  const [, letter, accidental, rest] = chord.slice(0, bass?.index).match(ROOT) ?? []
  const parsed = letter && quality(rest)
  if (!parsed) return undefined

  const bassXml = bass ? `<bass>${pitch('bass', bass[1], bass[2])}</bass>` : ''
  return `<harmony><root>${pitch('root', letter, accidental)}</root><kind>${parsed.kind}</kind>${bassXml}${parsed.degrees}</harmony>`
}
