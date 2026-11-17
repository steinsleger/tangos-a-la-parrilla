# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-11-17

### Added

- Lyrics on every song page, below the score, in two columns on wide screens and one on phones. 37 come from the page text of the newer source files, and the other 391 were transcribed from the PDF of Cancionero del Tango into `lyrics/`. Each song's lyrics are a separate JSON file in `public/lyrics/`, so a page only downloads its own.
- A "Letra" button next to "Exportar" that jumps to the lyrics.
- Song titles and descriptions mention the lyrics, and the structured data includes their text as `MusicComposition.lyrics`.

### Changed

- The PDF export adds the lyrics on a page of their own after the score.
- The index title and description mention chords and lyrics.

### Known issues

- `Milonguera de ley` is still left out until its key signature is fixed in the source.

## [1.1.0] - 2026-11-15

### Added

- 37 new songs, mostly by contemporary authors, exported directly from Sibelius as UTF-8 MusicXML.
- `Afiches`, `Gricel` and `Siempre se vuelve a Buenos Aires`, re-exported as MusicXML, which were missing from 1.0.0.
- XML export of every song in the selected key, for notation programs such as MuseScore or Sibelius.
- A "Novedades" page at `/novedades/` with the release history in Spanish, linked from the index and the footer by a button that shows the date of the last update. It has its own title, description, structured data and sitemap entry, and the sitemap now gives the date of the last update for the index and this page.

### Changed

- The "Exportar PDF" button is now an "Exportar" menu with PDF and XML.

### Fixed

- Chord symbols typed as text in any notation, including Sibelius' Opus Chords glyphs, are converted into real chords that transpose. The build fails if a chord font text can't be read.
- Lyrics, credits and instrument names that the new source files carry as page text are no longer drawn over the score.
- Thirteen new songs declared a major key while being in the relative minor, so their original key was named wrong.
- Spelling of the new titles, credits, notes and lyrics. Credits follow Todo Tango wherever the work is listed there.

### Known issues

- `Milonguera de ley` is left out until its key signature is fixed in the source: it is written with two sharps but is in E minor.

## [1.0.0] - 2026-11-06

First public release, by Adrián Steinsleger, developed with Claude Opus 5.5. The initial set of scores comes from the project Cancionero del Tango by Hugo Satorre.

### Added

- Index of 388 songs with search by title, author or lyricist.
- Lead sheets rendered with OpenSheetMusicDisplay, sized to the screen.
- Transposition to any of the 12 keys, with a selector that marks the original and the selected key.
- The selected key is part of the URL, and links with a key open directly in that key.
- The last key chosen for each song is remembered in the browser.
- PDF export from every song page.
- Prerendered pages with real URLs, plus titles, descriptions, canonical URLs, social previews, structured data, a sitemap and robots.txt.
- Spanish and English descriptions in the structured data.
- Links to Todo Tango for songs, composers and lyricists.
- Feedback link for bugs and improvements.
- Author and license credits.

### Fixed

- Spanish spelling in titles, credits and score notes, mainly missing accents.
- Chord symbols that Sibelius exported as plain text, which could not be transposed.
- Two titles that were wrong in the source files.
- Author and lyricist credits now follow Todo Tango, which prevails over the source files.

### Known issues

- `Afiches`, `Gricel` and `Siempre se vuelve a Buenos Aires` are missing because their files are binary Sibelius files.

[Unreleased]: https://github.com/steinsleger/tangos-a-la-parrilla/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/steinsleger/tangos-a-la-parrilla/releases/tag/v1.2.0
[1.1.0]: https://github.com/steinsleger/tangos-a-la-parrilla/releases/tag/v1.1.0
[1.0.0]: https://github.com/steinsleger/tangos-a-la-parrilla/releases/tag/v1.0.0
