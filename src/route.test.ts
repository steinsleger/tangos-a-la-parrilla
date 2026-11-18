import assert from 'node:assert/strict'
import { test } from 'node:test'
import { anchorFromUrl, keyFromUrl, slugFromPath, songUrl } from './route.ts'

const page = (path: string) => `https://tangosalaparrilla.com.ar${path}`

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
  assert.equal(keyFromUrl(page(url)), 'F#m')
})

test('accepts a sharp typed by hand', () => {
  assert.equal(keyFromUrl(page('/partituras/volver/?tono=F#m')), 'F#m')
  assert.equal(keyFromUrl(page('/partituras/volver/?tono=F#')), 'F#')
  assert.equal(keyFromUrl(page('/partituras/volver/?tono=F#m&utm_source=x')), 'F#m')
  assert.equal(anchorFromUrl(page('/partituras/volver/?tono=F#m')), '')
})

test('tells an anchor apart from the key', () => {
  assert.equal(keyFromUrl(page('/partituras/volver/?tono=Gm#letra')), 'Gm')
  assert.equal(anchorFromUrl(page('/partituras/volver/?tono=Gm#letra')), '#letra')
  assert.equal(keyFromUrl(page('/partituras/volver/#letra')), null)
  assert.equal(anchorFromUrl(page('/partituras/volver/')), '')
})

test('never throws on a malformed key', () => {
  assert.equal(keyFromUrl(page('/partituras/volver/?tono=%')), '%')
  assert.equal(keyFromUrl(page('/partituras/volver/')), null)
})
