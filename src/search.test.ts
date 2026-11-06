import assert from 'node:assert/strict'
import { test } from 'node:test'
import { matches } from './search.ts'

const malena = { title: 'Malena', author: 'L. Demare', lyricist: 'H. Manzi' }

test('finds by title, author and lyricist', () => {
  assert.ok(matches(malena, 'malena'))
  assert.ok(matches(malena, 'demare'))
  assert.ok(matches(malena, 'manzi'))
  assert.ok(!matches(malena, 'gardel'))
})

test('ignores case and accents', () => {
  assert.ok(matches({ ...malena, title: 'Café la humedad' }, 'CAFE'))
  assert.ok(matches({ ...malena, title: 'Mi taza de cafe' }, 'café'))
  assert.ok(matches({ ...malena, title: 'A la gran muñeca' }, 'muneca'))
})

test('absorbs the spelling differences between source files', () => {
  for (const lyricist of ['E. Cadícamo', 'E. Cadicamo', 'E, Cadícamo']) {
    assert.ok(matches({ ...malena, lyricist }, 'cadicamo'))
  }
  assert.ok(matches({ ...malena, lyricist: 'A Le Pera' }, 'a. le pera'))
  assert.ok(matches({ ...malena, title: '¡Qué me van a hablar de amor!' }, 'que me van'))
})

test('finds each person on a shared credit', () => {
  const shared = { ...malena, author: 'P. Maffia/P. Laurenz' }
  assert.ok(matches(shared, 'maffia'))
  assert.ok(matches(shared, 'laurenz'))
})

test('requires every word, across fields', () => {
  assert.ok(matches(malena, 'manzi malena'))
  assert.ok(!matches(malena, 'manzi volver'))
})

test('an empty query matches everything', () => {
  assert.ok(matches(malena, ''))
  assert.ok(matches(malena, '   '))
})
