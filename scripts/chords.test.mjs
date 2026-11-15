import assert from 'node:assert/strict'
import { test } from 'node:test'
import { chordHarmony } from './chords.mjs'

const add = (value, alter = 0) =>
  `<degree><degree-value>${value}</degree-value><degree-alter>${alter}</degree-alter><degree-type>add</degree-type></degree>`

const chord = (root, kind, extra = '') => `<harmony><root>${root}</root><kind>${kind}</kind>${extra}</harmony>`

const A = '<root-step>A</root-step>'
const B = '<root-step>B</root-step>'
const C = '<root-step>C</root-step>'
const D = '<root-step>D</root-step>'
const F_SHARP = '<root-step>F</root-step><root-alter>1</root-alter>'
const B_FLAT = '<root-step>B</root-step><root-alter>-1</root-alter>'

test('reads triads, sevenths and slash chords', () => {
  assert.equal(chordHarmony('A7'), chord(A, 'dominant'))
  assert.equal(chordHarmony('Am/C'), chord(A, 'minor', '<bass><bass-step>C</bass-step></bass>'))
  assert.equal(chordHarmony('D7/A¨'), chord(D, 'dominant', '<bass><bass-step>A</bass-step><bass-alter>-1</bass-alter></bass>'))
  assert.equal(chordHarmony('Dm7(b5)'), chord(D, 'half-diminished'))
  assert.equal(chordHarmony('Bm(7+)'), chord(B, 'major-minor'))
  assert.equal(chordHarmony('C7sus4'), chord(C, 'dominant', `${add(4)}<degree><degree-value>3</degree-value><degree-alter>0</degree-alter><degree-type>subtract</degree-type></degree>`))
})

test('reads the glyphs of the Opus Chords font', () => {
  assert.equal(chordHarmony('F©7'), chord(F_SHARP, 'dominant'))
  assert.equal(chordHarmony('B¨^'), chord(B_FLAT, 'major-seventh'))
  assert.equal(chordHarmony('AØ'), chord(A, 'half-diminished'))
  assert.equal(chordHarmony('Bº'), chord(B, 'diminished'))
  assert.equal(chordHarmony('B07'), chord(B, 'diminished-seventh'))
  assert.equal(chordHarmony('B‹6'), chord(B, 'minor-sixth'))
  assert.equal(chordHarmony('A-6'), chord(A, 'minor-sixth'))
})

test('reads alterations written before or after the degree', () => {
  assert.equal(chordHarmony('B7b9'), chord(B, 'dominant', add(9, -1)))
  assert.equal(chordHarmony('A7(9b)'), chord(A, 'dominant', add(9, -1)))
  assert.equal(chordHarmony('A713b'), chord(A, 'dominant', add(13, -1)))
  assert.equal(chordHarmony('D7#9b13'), chord(D, 'dominant', add(9, 1) + add(13, -1)))
  assert.equal(chordHarmony('C79#11'), chord(C, 'dominant-ninth', add(11, 1)))
})

test('tells a ninth chord from an added ninth', () => {
  assert.equal(chordHarmony('D9'), chord(D, 'dominant-ninth'))
  assert.equal(chordHarmony('Dmaj7/9'), chord(D, 'major-ninth'))
  assert.equal(chordHarmony('C&apos;9'), chord(C, 'major', add(9)))
  assert.equal(chordHarmony('C7&apos;13'), chord(C, 'dominant', add(13)))
})

test('drops the parentheses of an optional chord', () => {
  assert.equal(chordHarmony('(B7)'), chord(B, 'dominant'))
})

test('leaves other text alone', () => {
  for (const text of ['Coda', 'Fine', 'A1', 'Milonga', 'Tiempo de vals', 'Para C', '#7', 'µ', 'E%']) {
    assert.equal(chordHarmony(text), undefined, text)
  }
})
