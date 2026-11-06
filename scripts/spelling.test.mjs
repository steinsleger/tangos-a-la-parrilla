import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fixSpelling } from './spelling.mjs'

const inTag = (text) => `<words>${text}</words>`

test('fixes words and phrases inside text nodes', () => {
  assert.equal(fixSpelling(inTag('Yo soy Maria')), inTag('Yo soy María'))
  assert.equal(fixSpelling(inTag('Yo no se que me han hecho')), inTag('Yo no sé qué me han hecho'))
  assert.equal(fixSpelling(inTag('E, Cadícamo')), inTag('E. Cadícamo'))
})

test('prefers the longest match', () => {
  assert.equal(fixSpelling(inTag('C.Cobian')), inTag('C. Cobián'))
})

test('keeps words that are only wrong in other contexts', () => {
  for (const text of ['Tomo y obligo', 'Este tango no se pudo revisar', 'En esta noche de luna', 'Marianito']) {
    assert.equal(fixSpelling(inTag(text)), inTag(text))
  }
})

test('leaves markup alone', () => {
  const markup = '<words font-family="Paris">Hola</words>'
  assert.equal(fixSpelling(markup), markup)
})
