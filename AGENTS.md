# Agent guide

Tangos a la parrilla is a static Vite + React + TypeScript site. It shows lead sheets from MusicXML with OpenSheetMusicDisplay (OSMD). Every page is prerendered to its own HTML file and hydrated in the browser. There is no backend, router or UI library.

## Commands

Use pnpm 12 through Corepack (`corepack enable`, or prefix commands with `corepack`). Stay on Node 24: it runs the TypeScript tests natively and, unlike Node 26, ships Corepack, which the Vercel build needs.

- `pnpm test`: unit tests in `src/*.test.ts` and `scripts/*.test.mjs`
- `pnpm build`: type-check, build and prerender
- `pnpm dev`: development server
- `pnpm songs`: regenerate `public/songs/`, `src/songs.json` and `public/lyrics/`

## Map

- `scores/`: source files. The initial set comes from the project Cancionero del Tango by Hugo Satorre, so keep that credit in the footer, `README.md` and `LICENSE`. Never edit them. The first ones were exported with Dolet as UTF-16 and have mojibake filenames, so metadata comes from the file contents. Later ones are UTF-8 exported directly from Sibelius, saved with the `.xml` extension, and carry their lyrics, credits and instrument names as page text.
- `scripts/build-songs.mjs`: reads both encodings, extracts metadata, repairs the data and writes `public/sitemap.xml`, which is committed so it stays visible in the repository. `SOURCES_IN_RELATIVE_MINOR` fixes sources that declare a major key while being in the relative minor.
- `scripts/chords.mjs`: turns chord symbols typed as text into `<harmony>`, including Opus Chords glyphs (`©` sharp, `¨` flat, `º` diminished, `Ø` half-diminished, `^` major seventh) and accidentals written after the degree (`9b`). `TEXT_DIRECTION_FIXES` in the build covers texts it can't read.
- `scripts/spelling.mjs`: spelling fixes. A word that is only wrong in context goes in with its phrase.
- `lyrics/`: lyrics of the songs whose XML has none, transcribed from the PDF of Cancionero del Tango. One file per slug, one verse per line, stanzas separated by a blank line. Unlike `scores/`, these files are corrected in place.
- `scripts/lyrics.mjs`: finds the lyrics among a score's page texts and splits them into stanzas.
- `scripts/credits.json`: author and lyricist of every song. The `people` keys in `src/todotango.json` are these displayed names, so a change here must be made there too.
- `scripts/prerender.mjs`: writes every page into `dist/`.
- `src/seo.ts`: titles, descriptions, structured data and sitemap. `src/Head.tsx`: head tags. `src/entry-server.tsx`: the list of pages.
- `src/releases.ts`: release notes in Spanish and the date of the last update. They only list what is already on the site, never pending work. `src/Changelog.tsx`: the `/novedades/` page and the button that links to it from the index and the footer.
- `src/todotango.json`: links to Todo Tango. A song is only linked if the work's page there names one of its credited authors, because many titles are shared by different works.
- `src/lyrics.ts`: fetches one song's lyrics from `public/lyrics/`, where the build writes a JSON file per song.
- `src/keys.ts`: key names and semitone maths. `src/route.ts`: hash URLs. `src/rememberedKeys.ts`: localStorage.
- `src/SheetMusic.tsx`: OSMD wrapper. `src/KeySelect.tsx`: ARIA listbox. `src/ExportMenu.tsx`: ARIA menu for PDF and XML. `src/useDropdown.ts`: opening, closing and keyboard logic shared by both. `src/SiteFooter.tsx`: feedback links and credits.
- `src/musicXml.ts`: score URLs and the XML export, transposed in the browser to the selected key.

## Rules

- Todo Tango is the authority on credits. When it differs from a source file or from anything else, Todo Tango wins, including its spelling of names. Copy a song's credits exactly from the page of that work.
- Fix data in the build scripts, not in `scores/` or the generated files, which are gitignored.
- Use `IntervalTransposeCalculator`. The default one misspells leading tones.
- Chord symbols typed as text become `<harmony>` in the build, never on the page. Boxed text is a section label and stays. A chord font text the parser can't read fails the build: add it to `TEXT_DIRECTION_FIXES` with only what the score confirms.
- OSMD runs with `drawCredits: false` and no part names, because the page header shows the title and credits and the newer sources carry lyrics as page text.
- Lyrics come from the score's page text, or else from `lyrics/<slug>.txt`. Correct lyrics that come from an XML in `scripts/spelling.mjs`, and a transcription in its own file. The build fails if a file in `lyrics/` matches no song.
- Lyrics are prerendered under the score, and `main.tsx` loads them before hydrating so the first render matches. Never put them in `songs.json`, which every page downloads.
- In OSMD 2.2.1 `render()` does not apply a transposition. Set `Sheet.Transpose`, then call `updateGraphic()` and `render()`.
- Key names must match OSMD's spelling table, so `D#m`, not `Ebm`.
- The key comes from `?tono=`, then the remembered key, then the original. Only a choice made in the selector is saved to localStorage, never a key that came from a link. Key changes use `history.replaceState` so Back returns to the index.
- The first client render must match the prerendered HTML, so read the URL and localStorage in effects, never during render.
- A URL with `?tono=` is canonicalized to the song's clean URL. Do not create pages per key.
- Every page needs its own title and meta description. All visible text is in Spanish; English only appears in the structured data. Descriptions stay in metadata: never show them on the page, and never hide text from users to show it to search engines.
- PDF export is `window.print()`. `SheetMusic` paginates on `beforeprint` so no staff is split, and restores on `afterprint`. The PDF shows the title, the credits, the score and, on a new page, the lyrics: no site header and no key label.
- Every export keeps the selected key. XML in the original key is the file as it is; in any other key it is rewritten with the same `IntervalTransposeCalculator`, so its spelling matches the page.
- The interface is in formal Spanish: address the user as `usted`, never as `vos` or `tú`.
- In documents, do not break lines in the middle of a sentence.

## Dependencies

`pnpm-workspace.yaml` rejects versions younger than 3 days and fails if a package loses its trust level. Do not add exclusions or bypass this. Pick an older version instead. Dependency build scripts stay blocked unless listed in `allowBuilds`. GitHub Actions are pinned by commit SHA.

## Style

Keep code simple and easy to test, with few comments and self-explanatory names. No emojis. Do not add functionality nobody asked for. Update `CHANGELOG.md` for user-facing changes, and `src/releases.ts` in Spanish for visitors. On a release, bump `version` in `package.json` to match the newest entry of both, following Semantic Versioning.
