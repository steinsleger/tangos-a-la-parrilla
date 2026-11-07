import type { KeyInstruction, Pitch } from 'opensheetmusicdisplay'
import type { KeyOption } from './keys.ts'

type Osmd = typeof import('opensheetmusicdisplay')

const OSMD_OCTAVE_OFFSET = 3
const DEFAULT_OCTAVE = 4
const ACCIDENTALS: Record<number, string> = { [-2]: 'flat-flat', [-1]: 'flat', 0: 'natural', 1: 'sharp', 2: 'double-sharp' }
// "N.C." keeps a hidden root that must not become visible.
const NO_CHORD = /<kind[^>]*>none<\/kind>/

const tag = (name: string, value: string | number) => `<${name}>${value}</${name}>`
const read = (xml: string, name: string) => xml.match(new RegExp(`<${name}>(.*?)</${name}>`, 's'))?.[1]

export const scoreUrl = (slug: string) => `/songs/${slug}.xml`

export function transposeMusicXml(xml: string, semitones: number, osmd: Osmd) {
  if (semitones === 0) return xml

  const calculator = new osmd.IntervalTransposeCalculator()
  let key: KeyInstruction

  function transposeKey(fifths: string) {
    const instruction = new osmd.KeyInstruction(undefined, Number(fifths))
    calculator.transposeKey(instruction, semitones)
    return instruction
  }

  function transposePitch(pitchXml: string, prefix: string, isChordSymbol: boolean) {
    const step = read(pitchXml, `${prefix}step`) as keyof typeof osmd.NoteEnum
    const alter = Number(read(pitchXml, `${prefix}alter`) ?? 0)
    const octave = Number(read(pitchXml, 'octave') ?? DEFAULT_OCTAVE) - OSMD_OCTAVE_OFFSET
    const pitch = new osmd.Pitch(osmd.NoteEnum[step], octave, osmd.Pitch.AccidentalFromHalfTones(alter))
    return calculator.transposePitch(pitch, key, semitones, isChordSymbol)
  }

  const spell = (pitch: Pitch, prefix: string) =>
    tag(`${prefix}step`, osmd.NoteEnum[pitch.FundamentalNote]) +
    (pitch.AccidentalHalfTones ? tag(`${prefix}alter`, pitch.AccidentalHalfTones) : '')

  function transposeNote(note: string) {
    const pitchXml = read(note, 'pitch')
    if (!pitchXml) return note

    const pitch = transposePitch(pitchXml, '', false)
    return note
      .replace(/<pitch>.*?<\/pitch>/s, tag('pitch', spell(pitch, '') + tag('octave', pitch.Octave + OSMD_OCTAVE_OFFSET)))
      .replace(/(<accidental(?: [^>]*)?>)[^<]*/, `$1${ACCIDENTALS[pitch.AccidentalHalfTones]}`)
  }

  function transposeChordSymbol(harmony: string) {
    if (NO_CHORD.test(harmony)) return harmony

    return harmony.replace(/<(root|bass)>.*?<\/\1>/gs, (part, name: string) =>
      tag(name, spell(transposePitch(part, `${name}-`, true), `${name}-`)),
    )
  }

  return xml.replace(
    /<(fifths|cancel)>(-?\d+)<\/\1>|<note[ >].*?<\/note>|<harmony[ >].*?<\/harmony>/gs,
    (element, keyTag: string | undefined, fifths: string) => {
      if (keyTag === 'fifths') {
        key = transposeKey(fifths)
        return tag('fifths', key.Key)
      }
      if (keyTag === 'cancel') return tag('cancel', transposeKey(fifths).Key)
      return element.startsWith('<note') ? transposeNote(element) : transposeChordSymbol(element)
    },
  )
}

export async function downloadMusicXml(slug: string, key: KeyOption) {
  const [response, osmd] = await Promise.all([fetch(scoreUrl(slug)), import('opensheetmusicdisplay')])
  if (!response.ok) throw new Error(`Could not fetch ${scoreUrl(slug)}: ${response.status}`)

  const xml = transposeMusicXml(await response.text(), key.semitones, osmd)
  const url = URL.createObjectURL(new Blob([xml], { type: 'application/vnd.recordare.musicxml+xml' }))
  Object.assign(document.createElement('a'), { href: url, download: `${slug}-${key.name}.xml` }).click()
  URL.revokeObjectURL(url)
}
