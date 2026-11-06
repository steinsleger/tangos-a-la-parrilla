import assert from 'node:assert/strict'
import { test } from 'node:test'
import { keyFromUrl, slugFromPath, songUrl } from './route.ts'

test('reads the slug from a song path', () => {
  assert.equal(slugFromPath('/partituras/volver/'), 'volver')
  assert.equal(slugFromPath('/partituras/volver'), 'volver')
  assert.equal(slugFromPath('/'), undefined)
  assert.equal(slugFromPath('/partituras/volver/Gm'), undefined)
})

test('keeps the URL clean without a key', () => {
  assert.equal(songUrl('volver'), '/partituras/volver/')
})

test('round-trips sharps', () => {
  const url = songUrl('volver', 'F#m')

  assert.equal(url, '/partituras/volver/?tono=F%23m')
  assert.equal(keyFromUrl(url.slice(url.indexOf('?')), ''), 'F#m')
})

test('accepts a sharp typed by hand', () => {
  assert.equal(keyFromUrl('?tono=F', '#m'), 'F#m')
})

test('never throws on a malformed key', () => {
  assert.equal(keyFromUrl('?tono=%', ''), '%')
  assert.equal(keyFromUrl('', ''), null)
})
