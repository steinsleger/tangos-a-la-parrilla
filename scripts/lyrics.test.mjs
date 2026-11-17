import assert from 'node:assert/strict'
import { test } from 'node:test'
import { lyricsInScore, stanzas } from './lyrics.mjs'

const pageText = (text) => `<credit page="1"><credit-words default-x="1" default-y="1">${text}</credit-words></credit>`

test('keeps only the page texts long enough to be lyrics, in order', () => {
  const xml = [
    pageText('Un patio'),
    pageText('Música: R. Gallo\nLetra: R. Gallo'),
    pageText('2'),
    pageText('Quién pudiera\ntener un patio\ncon durazneros,\ndos paraísos'),
    pageText('Forma A/A1/B/A/B'),
    pageText('Quién pudiera\nen ese patio\nverlos creciendo\ndespués dudando'),
  ].join('')

  assert.equal(
    lyricsInScore(xml),
    'Quién pudiera\ntener un patio\ncon durazneros,\ndos paraísos\n\nQuién pudiera\nen ese patio\nverlos creciendo\ndespués dudando',
  )
})

test('finds no lyrics in a score without them', () => {
  assert.equal(lyricsInScore(pageText('Gricel') + pageText('M. Mores\nJ. M. Contursi')), '')
})

test('splits stanzas on blank lines and tidies each verse', () => {
  assert.deepEqual(stanzas('\n \nUna lástima que cae \nLastima  y vuelve\n\n\n  \nAlma fugaz\nUna vez más\n\n'), [
    ['Una lástima que cae', 'Lastima y vuelve'],
    ['Alma fugaz', 'Una vez más'],
  ])
})

test('has no stanzas without text', () => {
  assert.deepEqual(stanzas(''), [])
})
