import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import { transposeMusicXml } from './musicXml.ts'

const osmd = createRequire(import.meta.url)('opensheetmusicdisplay') as typeof import('opensheetmusicdisplay')

const tag = (name: string, value: string | number) => `<${name}>${value}</${name}>`
const alter = (name: string, value: number) => (value ? tag(name, value) : '')

const key = (fifths: number, cancel?: number) =>
  tag('key', (cancel === undefined ? '' : tag('cancel', cancel)) + tag('fifths', fifths) + tag('mode', 'major'))

const note = (step: string, alterValue: number, octave: number, accidental?: string) =>
  tag(
    'note',
    tag('pitch', tag('step', step) + alter('alter', alterValue) + tag('octave', octave)) +
      tag('duration', 1) +
      (accidental ? tag('accidental', accidental) : ''),
  )

const chord = (step: string, alterValue: number, bass?: [string, number]) =>
  tag(
    'harmony',
    tag('root', tag('root-step', step) + alter('root-alter', alterValue)) +
      tag('kind', 'major') +
      (bass ? tag('bass', tag('bass-step', bass[0]) + alter('bass-alter', bass[1])) : ''),
  )

const transpose = (semitones: number, ...parts: string[]) => transposeMusicXml(parts.join(''), semitones, osmd)

test('keeps the file as it is in the original key', () => {
  const xml = `<key>\n\t<fifths>-1</fifths>\n</key>\n<note>\n\t<pitch>\n\t\t<step>B</step>\n\t\t<alter>-1</alter>\n\t\t<octave>4</octave>\n\t</pitch>\n</note>`
  assert.equal(transposeMusicXml(xml, 0, osmd), xml)
})

test('transposes the key and the notes by interval', () => {
  assert.equal(transpose(-2, key(0), note('C', 0, 4), note('A', 1, 4, 'sharp')), key(-2) + note('B', -1, 3) + note('G', 1, 4, 'sharp'))
})

test('rewrites visible accidentals for the new spelling', () => {
  assert.equal(transpose(-2, key(0), note('F', 1, 4, 'sharp')), key(-2) + note('E', 0, 4, 'natural'))
})

test('leaves accidental marks of ornaments alone', () => {
  const ornament = tag('notations', tag('ornaments', tag('accidental-mark', 'sharp')))
  const withOrnament = (xml: string) => xml.replace('</note>', `${ornament}</note>`)
  assert.equal(transpose(-2, key(0), withOrnament(note('C', 0, 4))), key(-2) + withOrnament(note('B', -1, 3)))
})

test('moves notes across octaves', () => {
  assert.equal(transpose(1, key(0), note('B', 0, 4)), key(-5) + note('C', 0, 5))
})

test('spells chord symbols simply', () => {
  assert.equal(transpose(1, key(2), chord('E', -1)), key(-3) + chord('E', 0))
})

test('transposes the bass of chord symbols', () => {
  assert.equal(transpose(1, key(2), chord('D', 0, ['F', 1])), key(-3) + chord('E', -1, ['G', 0]))
})

test('leaves "no chord" symbols as they are', () => {
  const noChord = `<harmony><root><root-step text=''>C</root-step></root><kind text='N.C.'>none</kind></harmony>`
  assert.equal(transpose(2, key(0), noChord), key(2) + noChord)
})

test('follows key changes and their cancellations', () => {
  assert.equal(transpose(2, key(2), key(0, 2), note('B', -1, 4, 'flat')), key(4) + key(2, 4) + note('C', 0, 5, 'natural'))
})
