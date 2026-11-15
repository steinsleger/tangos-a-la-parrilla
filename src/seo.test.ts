import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CHANGELOG_META, HOME_META, serializeJsonLd, sitemap, songMeta, songSummary } from './seo.ts'
import type { Song } from './songs.ts'

const volver: Song = {
  slug: 'volver',
  title: 'Volver',
  author: 'C. Gardel',
  lyricist: 'A. Le Pera',
  fifths: -1,
  mode: 'minor',
}

test('describes a song by its own data', () => {
  const meta = songMeta(volver)

  assert.equal(meta.title, 'Volver (Dm): partitura y acordes | Tangos a la parrilla')
  assert.equal(meta.url, 'https://tangosalaparrilla.com.ar/partituras/volver/')
  assert.equal(
    meta.description,
    'Toque «Volver» en cualquier tonalidad o imprima la partitura con acordes. De C. Gardel, con letra de A. Le Pera. Tonalidad original: Dm.',
  )
})

test('summarizes a song in Spanish and English', () => {
  assert.equal(
    songSummary(volver).en,
    'Play "Volver" in any key or print the sheet music with chords. By C. Gardel, lyrics by A. Le Pera. Original key: Dm.',
  )
  assert.match(JSON.stringify(songMeta(volver).jsonLd), /"@language":"en"/)
})

test('leaves out credits a song does not have', () => {
  const song = { ...volver, author: '', lyricist: '' }

  assert.match(songSummary(song).es, /con acordes\. Tonalidad original/)
  assert.match(songSummary(song).en, /with chords\. Original key/)
  assert.doesNotMatch(JSON.stringify(songMeta(song).jsonLd), /composer|lyricist/)
})

test('credits a lyricist without an author', () => {
  const song = { ...volver, author: '' }

  assert.match(songSummary(song).es, /Letra de A\. Le Pera\./)
  assert.match(songSummary(song).en, /Lyrics by A\. Le Pera\./)
})

test('credits the source of the scores', () => {
  assert.match(JSON.stringify(HOME_META.jsonLd), /"isBasedOn".*"name":"Hugo Satorre"/)
})

test('keeps the English description out of the visible text', () => {
  assert.equal(HOME_META.description, 'Tangos, valses y milongas para tocar en cualquier tonalidad o imprimir la partitura con acordes.')
  assert.match(JSON.stringify(HOME_META.jsonLd), /"@language":"en"/)
})

test('cannot close its script tag from the data', () => {
  assert.doesNotMatch(serializeJsonLd({ name: '</script>' }), /<\/script>/)
})

test('lists the home page, the release notes and every song in the sitemap', () => {
  const xml = sitemap([volver])

  assert.match(xml, /<loc>https:\/\/tangosalaparrilla\.com\.ar\/<\/loc><lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/)
  assert.match(xml, /<loc>https:\/\/tangosalaparrilla\.com\.ar\/novedades\/<\/loc><lastmod>/)
  assert.match(xml, /<loc>https:\/\/tangosalaparrilla\.com\.ar\/partituras\/volver\/<\/loc><\/url>/)
})

test('describes the release notes with the date of the last update', () => {
  assert.equal(CHANGELOG_META.url, 'https://tangosalaparrilla.com.ar/novedades/')
  assert.match(CHANGELOG_META.description, /Última actualización: \d{1,2} de \p{L}+ de \d{4}\.$/u)
  assert.match(JSON.stringify(CHANGELOG_META.jsonLd), /"dateModified":"\d{4}-\d{2}-\d{2}"/)
})
