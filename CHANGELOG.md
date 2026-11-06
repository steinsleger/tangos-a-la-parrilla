# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- Feedback links for bugs, improvements and song requests.
- Author and license credits, including on exported PDFs.

### Fixed

- Spanish spelling in titles, credits and score notes, mainly missing accents.
- Chord symbols that Sibelius exported as plain text, which could not be transposed.
- Two titles that were wrong in the source files.
- Author and lyricist credits now follow Todo Tango, which prevails over the source files.

### Known issues

- `Afiches`, `Grisel` and `Siempre se vuelve a Buenos Aires` are missing because their files are binary Sibelius files.

[1.0.0]: https://github.com/steinsleger/tangos-a-la-parrilla/releases/tag/v1.0.0
