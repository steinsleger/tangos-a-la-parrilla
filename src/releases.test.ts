import assert from 'node:assert/strict'
import { test } from 'node:test'
import pkg from '../package.json' with { type: 'json' }
import { formatDate, lastUpdate, releases } from './releases.ts'

test('writes dates in Spanish without shifting the day', () => {
  assert.equal(formatDate('2026-11-15'), '15 de noviembre de 2026')
  assert.equal(formatDate('2026-01-01'), '1 de enero de 2026')
})

test('lists releases newest first, starting with the current version', () => {
  assert.equal(releases[0].version, pkg.version)
  assert.equal(lastUpdate, releases[0].date)
  const dates = releases.map(({ date }) => date)
  assert.deepEqual(dates, [...dates].sort().reverse())
})
