import assert from 'node:assert/strict'
import { test } from 'node:test'
import { creditParts } from './credits.ts'

test('keeps a single name whole', () => {
  assert.deepEqual(creditParts('A. Le Pera'), ['A. Le Pera'])
})

test('splits every way the credits join people, keeping the separators', () => {
  assert.deepEqual(creditParts('P. Maffia/P. Laurenz'), ['P. Maffia', '/', 'P. Laurenz'])
  assert.deepEqual(creditParts('H. Manzi y C. Castillo'), ['H. Manzi', ' y ', 'C. Castillo'])
  assert.deepEqual(creditParts('M. Caló, A. Pontier y F. Silva'), ['M. Caló', ', ', 'A. Pontier', ' y ', 'F. Silva'])
  assert.deepEqual(creditParts('Magaldi-Noda'), ['Magaldi', '-', 'Noda'])
})

test('loses no text', () => {
  const credit = 'J. M. Mora & V. L. Russo'
  assert.equal(creditParts(credit).join(''), credit)
})
