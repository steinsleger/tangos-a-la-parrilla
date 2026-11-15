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

test('fixes lyrics without touching voseo', () => {
  assert.equal(fixSpelling(inTag('Mi ciudad esta por todos lados')), inTag('Mi ciudad está por todos lados'))
  assert.equal(fixSpelling(inTag('De que planeta sos')), inTag('De qué planeta sos'))
  assert.equal(fixSpelling(inTag('Subíte con tus clavas')), inTag('Subite con tus clavas'))
})

test('keeps words that are only wrong in other contexts', () => {
  for (const text of ['Tomo y obligo', 'Este tango no se pudo revisar', 'En esta noche de luna', 'Marianito', 'Me paro en cada estatua']) {
    assert.equal(fixSpelling(inTag(text)), inTag(text))
  }
})

test('leaves markup alone', () => {
  const markup = '<words font-family="Paris">Hola</words>'
  assert.equal(fixSpelling(markup), markup)
})
