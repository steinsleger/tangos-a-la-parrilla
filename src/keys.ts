export type Mode = 'major' | 'minor'

export interface KeyOption {
  name: string
  semitones: number
  isOriginal: boolean
}

// Spellings match OSMD's TransposeCalculator, so a label always names the signature it renders.
const MAJOR_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
const MINOR_KEYS = ['Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm']

const SEMITONES_PER_FIFTH = 7
const RELATIVE_MINOR_OFFSET = 9
const OCTAVE = 12

const modulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor

export function keyOptions(fifths: number, mode: Mode): KeyOption[] {
  const isMinor = mode === 'minor'
  const originalTonic = modulo(fifths * SEMITONES_PER_FIFTH + (isMinor ? RELATIVE_MINOR_OFFSET : 0), OCTAVE)

  return (isMinor ? MINOR_KEYS : MAJOR_KEYS).map((name, tonic) => ({
    name,
    semitones: modulo(tonic - originalTonic + OCTAVE / 2, OCTAVE) - OCTAVE / 2,
    isOriginal: tonic === originalTonic,
  }))
}

export const originalKey = (options: KeyOption[]) => options.find((option) => option.isOriginal)!

export function chosenKey(options: KeyOption[], urlKey: string | null, rememberedKey: string | null) {
  const named = (name: string | null) => options.find((option) => option.name === name)
  return named(urlKey) ?? named(rememberedKey)
}
