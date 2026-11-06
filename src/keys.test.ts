import assert from 'node:assert/strict'
import { test } from 'node:test'
import { chosenKey, keyOptions, type Mode } from './keys.ts'

const original = (fifths: number, mode: Mode) => keyOptions(fifths, mode).find((option) => option.isOriginal)?.name
const semitonesTo = (name: string, fifths: number, mode: Mode) =>
  keyOptions(fifths, mode).find((option) => option.name === name)?.semitones

test('names the original key from the signature', () => {
  assert.equal(original(-1, 'minor'), 'Dm')
  assert.equal(original(-4, 'minor'), 'Fm')
  assert.equal(original(3, 'minor'), 'F#m')
  assert.equal(original(-3, 'major'), 'Eb')
  assert.equal(original(5, 'major'), 'B')
})

test('moves the short way', () => {
  assert.equal(semitonesTo('Cm', -1, 'minor'), -2)
  assert.equal(semitonesTo('Gm', -1, 'minor'), 5)
  assert.equal(semitonesTo('Am', -1, 'minor'), -5)
})

test('spells keys as OSMD renders them', () => {
  assert.equal(semitonesTo('D#m', -1, 'minor'), 1)
  assert.equal(semitonesTo('Db', 0, 'major'), 1)
  assert.equal(semitonesTo('F#', 0, 'major'), -6)
})

test('every signature offers 12 keys with a single original', () => {
  for (const mode of ['major', 'minor'] as const) {
    for (let fifths = -7; fifths <= 7; fifths++) {
      const options = keyOptions(fifths, mode)
      assert.equal(new Set(options.map((option) => option.semitones)).size, 12)
      assert.deepEqual(options.filter((option) => option.isOriginal).map((option) => option.semitones), [0])
      assert.ok(options.every(({ semitones }) => semitones >= -6 && semitones <= 5))
    }
  }
})

test('prefers the key in the URL over the remembered one', () => {
  const options = keyOptions(-1, 'minor')

  assert.equal(chosenKey(options, 'Gm', 'Am')?.name, 'Gm')
  assert.equal(chosenKey(options, null, 'Am')?.name, 'Am')
  assert.equal(chosenKey(options, null, null), undefined)
})

test('ignores keys the song does not offer', () => {
  const options = keyOptions(-1, 'minor')

  assert.equal(chosenKey(options, 'H', 'Am')?.name, 'Am')
  assert.equal(chosenKey(options, 'G', 'Eb'), undefined)
})
