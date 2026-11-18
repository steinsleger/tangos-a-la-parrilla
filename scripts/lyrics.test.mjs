import assert from 'node:assert/strict'
import { test } from 'node:test'
import { lyricsInScore, stanzas } from './lyrics.mjs'

const pageText = (text, justify = 'center') =>
  `<credit page="1"><credit-words default-x="1" default-y="1" justify="${justify}">${text}</credit-words></credit>`

test('keeps the page texts that are lyrics, in order', () => {
  const xml = [
    pageText('Un patio'),
    pageText('Música: R. Gallo\nLetra: R. Gallo', 'right'),
    pageText('2', 'left'),
    pageText('Quién pudiera\ntener un patio\ncon durazneros,'),
    pageText('Forma A/A1/B/A/B'),
    pageText('Un pedacito de tierra,\nUn pedacito de cielo…', 'left'),
  ].join('')

  assert.equal(
    lyricsInScore(xml),
    'Quién pudiera\ntener un patio\ncon durazneros,\n\nUn pedacito de tierra,\nUn pedacito de cielo…',
  )
})

test('never takes the credits for lyrics, however long', () => {
  const credits = pageText('Música: X\nLetra: Y\nArreglo: Z\nTranscripción: W', 'right')
  assert.equal(lyricsInScore(credits), '')
})

test('decodes the text of the lyrics', () => {
  assert.equal(
    lyricsInScore(pageText('&quot;Será que así es la vida&quot;\nDijo Don Juan &amp; nadie más')),
    '"Será que así es la vida"\nDijo Don Juan & nadie más',
  )
})

test('finds no lyrics in a score without them', () => {
  assert.equal(lyricsInScore(pageText('Gricel') + pageText('M. Mores\nJ. M. Contursi', 'right')), '')
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
