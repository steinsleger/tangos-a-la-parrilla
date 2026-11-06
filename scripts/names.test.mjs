import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fullNames } from './names.mjs'

test('expands a single name', () => {
  assert.equal(fullNames('C. Gardel'), 'Carlos Gardel')
})

test('joins several people the same way, whatever the source used', () => {
  assert.equal(fullNames('C. Gardel/ J. Razzano'), 'Carlos Gardel y José Razzano')
  assert.equal(fullNames('F. Canaro/ M. Mores/Pelay'), 'Francisco Canaro, Mariano Mores y Ivo Pelay')
})

test('keeps a name it does not know', () => {
  assert.equal(fullNames('H. Manzi/U. Bertini'), 'Homero Manzi y U. Bertini')
  assert.equal(fullNames('U. Bertini'), 'U. Bertini')
  assert.equal(fullNames(''), '')
})

test('leaves alone names that only work together', () => {
  assert.equal(fullNames('A. y H. Manzi'), 'A. y H. Manzi')
  assert.equal(fullNames('Magaldi-Noda'), 'Magaldi-Noda')
})
