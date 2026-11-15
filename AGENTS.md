# Agent guide

[English](#english) · [Español](#español)

## English

Tangos a la parrilla is a static Vite + React + TypeScript site. It shows lead sheets from MusicXML with OpenSheetMusicDisplay (OSMD). Every page is prerendered to its own HTML file and hydrated in the browser. There is no backend, router or UI library.

### Commands

Use pnpm 12 through Corepack (`corepack enable`, or prefix commands with `corepack`). Stay on Node 24: it runs the TypeScript tests natively and, unlike Node 26, ships Corepack, which the Vercel build needs.

- `pnpm test`: unit tests in `src/*.test.ts` and `scripts/*.test.mjs`
- `pnpm build`: type-check, build and prerender
- `pnpm dev`: development server
- `pnpm songs`: regenerate `public/songs/` and `src/songs.json`

### Map

- `scores/`: source files. The initial set comes from the project Cancionero del Tango by Hugo Satorre, so keep that credit in the footer, `README.md` and `LICENSE`. Never edit them. The first ones were exported with Dolet as UTF-16 and have mojibake filenames, so metadata comes from the file contents. Later ones are UTF-8 exported directly from Sibelius, saved with the `.xml` extension, and carry their lyrics, credits and instrument names as page text.
- `scripts/build-songs.mjs`: reads both encodings, extracts metadata, repairs the data and writes `public/sitemap.xml`, which is committed so it stays visible in the repository. `SOURCES_IN_RELATIVE_MINOR` fixes sources that declare a major key while being in the relative minor.
- `scripts/chords.mjs`: turns chord symbols typed as text into `<harmony>`, including Opus Chords glyphs (`©` sharp, `¨` flat, `º` diminished, `Ø` half-diminished, `^` major seventh) and accidentals written after the degree (`9b`). `TEXT_DIRECTION_FIXES` in the build covers texts it can't read.
- `scripts/spelling.mjs`: spelling fixes. A word that is only wrong in context goes in with its phrase.
- `scripts/credits.json`: author and lyricist of every song. The `people` keys in `src/todotango.json` are these displayed names, so a change here must be made there too.
- `scripts/prerender.mjs`: writes every page into `dist/`.
- `src/seo.ts`: titles, descriptions, structured data and sitemap. `src/Head.tsx`: head tags. `src/entry-server.tsx`: the list of pages.
- `src/releases.ts`: release notes in Spanish and the date of the last update. `src/Changelog.tsx`: the `/novedades/` page and the button that links to it from the index and the footer.
- `src/todotango.json`: links to Todo Tango. A song is only linked if the work's page there names one of its credited authors, because many titles are shared by different works.
- `src/keys.ts`: key names and semitone maths. `src/route.ts`: hash URLs. `src/rememberedKeys.ts`: localStorage.
- `src/SheetMusic.tsx`: OSMD wrapper. `src/KeySelect.tsx`: ARIA listbox. `src/ExportMenu.tsx`: ARIA menu for PDF and XML. `src/useDropdown.ts`: opening, closing and keyboard logic shared by both. `src/SiteFooter.tsx`: feedback links and credits.
- `src/musicXml.ts`: score URLs and the XML export, transposed in the browser to the selected key.

### Rules

- Todo Tango is the authority on credits. When it differs from a source file or from anything else, Todo Tango wins, including its spelling of names. Copy a song's credits exactly from the page of that work.
- Fix data in the build scripts, not in `scores/` or the generated files, which are gitignored.
- Use `IntervalTransposeCalculator`. The default one misspells leading tones.
- Chord symbols typed as text become `<harmony>` in the build, never on the page. Boxed text is a section label and stays. A chord font text the parser can't read fails the build: add it to `TEXT_DIRECTION_FIXES` with only what the score confirms.
- OSMD runs with `drawCredits: false` and no part names, because the page header shows the title and credits and the newer sources carry lyrics as page text.
- In OSMD 2.2.1 `render()` does not apply a transposition. Set `Sheet.Transpose`, then call `updateGraphic()` and `render()`.
- Key names must match OSMD's spelling table, so `D#m`, not `Ebm`.
- The key comes from `?tono=`, then the remembered key, then the original. Only a choice made in the selector is saved to localStorage, never a key that came from a link. Key changes use `history.replaceState` so Back returns to the index.
- The first client render must match the prerendered HTML, so read the URL and localStorage in effects, never during render.
- A URL with `?tono=` is canonicalized to the song's clean URL. Do not create pages per key.
- Every page needs its own title and meta description. All visible text is in Spanish; English only appears in the structured data. Descriptions stay in metadata: never show them on the page, and never hide text from users to show it to search engines.
- PDF export is `window.print()`. `SheetMusic` paginates on `beforeprint` so no staff is split, and restores on `afterprint`. The PDF only shows the title, the credits and the score: no site header and no key label.
- Every export keeps the selected key. XML in the original key is the file as it is; in any other key it is rewritten with the same `IntervalTransposeCalculator`, so its spelling matches the page.
- The interface is in formal Spanish: address the user as `usted`, never as `vos` or `tú`.
- In documents, do not break lines in the middle of a sentence.

### Dependencies

`pnpm-workspace.yaml` rejects versions younger than 3 days and fails if a package loses its trust level. Do not add exclusions or bypass this. Pick an older version instead. Dependency build scripts stay blocked unless listed in `allowBuilds`. GitHub Actions are pinned by commit SHA.

### Style

Keep code simple and easy to test, with few comments and self-explanatory names. No emojis. Do not add functionality nobody asked for. Update `CHANGELOG.md` for user-facing changes, and `src/releases.ts` in Spanish for visitors. On a release, bump `version` in `package.json` to match the newest entry of both, following Semantic Versioning.

### Attribution

End commits made with Claude with:

```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

---

## Español

Tangos a la parrilla es un sitio estático con Vite, React y TypeScript. Muestra partituras en MusicXML con OpenSheetMusicDisplay (OSMD). Cada página se pre-renderiza en su propio archivo HTML y se hidrata en el navegador. No tiene backend, router ni biblioteca de interfaz.

### Comandos

Use pnpm 12 con Corepack (`corepack enable`, o anteponga `corepack` a cada comando). Mantenga Node 24: corre los tests de TypeScript de forma nativa y, a diferencia de Node 26, incluye Corepack, que el build de Vercel necesita.

- `pnpm test`: tests en `src/*.test.ts` y `scripts/*.test.mjs`
- `pnpm build`: revisa tipos, compila y pre-renderiza
- `pnpm dev`: servidor de desarrollo
- `pnpm songs`: regenera `public/songs/` y `src/songs.json`

### Mapa

- `scores/`: archivos fuente. La carga inicial proviene del proyecto Cancionero del Tango, de Hugo Satorre, así que ese crédito debe mantenerse en el pie, `README.md` y `LICENSE`. No se editan nunca. Los primeros se exportaron con Dolet en UTF-16 y tienen los nombres mal codificados, así que los metadatos salen del contenido. Los posteriores están en UTF-8, exportados directamente desde Sibelius y guardados con extensión `.xml`, y traen la letra, los créditos y los nombres de instrumento como texto de página.
- `scripts/build-songs.mjs`: lee ambas codificaciones, extrae metadatos, repara los datos y escribe `public/sitemap.xml`, que se versiona para que quede visible en el repositorio. `SOURCES_IN_RELATIVE_MINOR` corrige las fuentes que declaran tonalidad mayor y están en la relativa menor.
- `scripts/chords.mjs`: convierte en `<harmony>` los acordes escritos como texto, incluidos los glifos de Opus Chords (`©` sostenido, `¨` bemol, `º` disminuido, `Ø` semidisminuido, `^` séptima mayor) y las alteraciones escritas después del grado (`9b`). `TEXT_DIRECTION_FIXES`, en el build, cubre los textos que no puede leer.
- `scripts/spelling.mjs`: correcciones ortográficas. Una palabra que solo está mal según el contexto se agrega con su frase.
- `scripts/credits.json`: autor y letrista de cada tema. Las claves de `people` en `src/todotango.json` son estos nombres visibles, así que un cambio aquí debe hacerse también allí.
- `scripts/prerender.mjs`: escribe cada página en `dist/`.
- `src/seo.ts`: títulos, descripciones, datos estructurados y sitemap. `src/Head.tsx`: etiquetas del encabezado HTML. `src/entry-server.tsx`: la lista de páginas.
- `src/releases.ts`: novedades en castellano y fecha de la última actualización. `src/Changelog.tsx`: la página `/novedades/` y el botón que lleva a ella desde el índice y el pie.
- `src/todotango.json`: enlaces a Todo Tango. Un tema solo se enlaza si la página de la obra nombra a alguno de sus autores, porque muchos títulos son compartidos por obras distintas.
- `src/keys.ts`: nombres de tonos y cálculo de semitonos. `src/route.ts`: URLs con hash. `src/rememberedKeys.ts`: localStorage.
- `src/SheetMusic.tsx`: envoltorio de OSMD. `src/KeySelect.tsx`: listbox ARIA. `src/ExportMenu.tsx`: menú ARIA para PDF y XML. `src/useDropdown.ts`: apertura, cierre y teclado compartidos por ambos. `src/SiteFooter.tsx`: enlaces de comentarios y créditos.
- `src/musicXml.ts`: URLs de las partituras y exportación a XML, transpuesta en el navegador al tono elegido.

### Reglas

- Todo Tango es la autoridad en cuanto a créditos. Si difiere de un archivo fuente o de cualquier otra referencia, prevalece Todo Tango, incluso en la grafía de los nombres. Los créditos de un tema se copian tal cual de la página de esa obra.
- Los datos se corrigen en los scripts de build, no en `scores/` ni en los archivos generados, que están en `.gitignore`.
- Use `IntervalTransposeCalculator`. El calculador por defecto escribe mal las sensibles.
- Los acordes escritos como texto se convierten en `<harmony>` en el build, nunca en la página. El texto recuadrado es una letra de sección y se mantiene. Si el parser no puede leer un texto en fuente de acordes, el build falla: agréguelo a `TEXT_DIRECTION_FIXES` solo con lo que la partitura confirma.
- OSMD corre con `drawCredits: false` y sin nombres de instrumento, porque el encabezado de la página muestra el título y los créditos, y las fuentes nuevas traen la letra como texto de página.
- En OSMD 2.2.1 `render()` no aplica la transposición. Hay que asignar `Sheet.Transpose` y llamar a `updateGraphic()` y `render()`.
- Los nombres de los tonos deben coincidir con la tabla de OSMD: `D#m`, no `Ebm`.
- El tono sale de `?tono=`, después del tono recordado y por último del original. Solo se guarda en localStorage lo elegido en el selector, nunca el tono de un enlace. Los cambios de tono usan `history.replaceState`, así Atrás vuelve al índice.
- El primer render en el cliente debe coincidir con el HTML pre-renderizado, así que la URL y localStorage se leen en efectos, nunca durante el render.
- Una URL con `?tono=` tiene como canónica la URL limpia del tema. No cree páginas por tono.
- Cada página necesita título y `meta description` propios. Todo el texto visible está en castellano; el inglés solo aparece en los datos estructurados. Las descripciones van solo en los metadatos: no se muestran en la página, y nunca se oculta texto a los usuarios para mostrárselo a los buscadores.
- La exportación a PDF es `window.print()`. `SheetMusic` pagina en `beforeprint` para no cortar pentagramas y restaura en `afterprint`. El PDF solo muestra el título, los créditos y la partitura: sin encabezado del sitio ni indicación de tono.
- Toda exportación respeta el tono elegido. El XML en el tono original es el archivo tal cual; en cualquier otro tono se reescribe con el mismo `IntervalTransposeCalculator`, así su escritura coincide con la de la página.
- La interfaz está en castellano formal: se trata al usuario de `usted`, nunca de `vos` ni de `tú`.
- En los documentos, no corte las líneas en medio de una oración.

### Dependencias

`pnpm-workspace.yaml` rechaza versiones con menos de 3 días y falla si un paquete pierde su nivel de confianza. No agregue excepciones ni eluda esta regla: elija una versión anterior. Los scripts de build de las dependencias siguen bloqueados salvo que figuren en `allowBuilds`. Las GitHub Actions se fijan por SHA de commit.

### Estilo

Mantenga el código simple y fácil de testear, con pocos comentarios y nombres que se expliquen solos. Sin emojis. No agregue funciones que nadie pidió. Actualice `CHANGELOG.md` con los cambios visibles para los usuarios, y `src/releases.ts`, en castellano, para los visitantes. Al publicar una versión, suba `version` en `package.json` para que coincida con la entrada más reciente de ambos, según Semantic Versioning.

### Atribución

Termine los commits hechos con Claude con:

```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```
