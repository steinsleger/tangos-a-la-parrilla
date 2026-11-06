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

- `scores/`: source files. The initial set comes from the project Cancionero del Tango by Hugo Satorre, so keep that credit in the footer, `README.md` and `LICENSE`. Never edit them. Filenames are mojibake, so metadata comes from the file contents.
- `scripts/build-songs.mjs`: converts UTF-16 MusicXML to UTF-8, extracts metadata, repairs the data and writes `public/sitemap.xml`, which is committed so it stays visible in the repository.
- `scripts/spelling.mjs`: spelling fixes. A word that is only wrong in context goes in with its phrase.
- `scripts/credits.json`: author and lyricist of every song. The `people` keys in `src/todotango.json` are these displayed names, so a change here must be made there too.
- `scripts/prerender.mjs`: writes every page into `dist/`.
- `src/seo.ts`: titles, descriptions, structured data and sitemap. `src/Head.tsx`: head tags. `src/entry-server.tsx`: the list of pages.
- `src/todotango.json`: links to Todo Tango. A song is only linked if the work's page there names one of its credited authors, because many titles are shared by different works.
- `src/keys.ts`: key names and semitone maths. `src/route.ts`: hash URLs. `src/rememberedKeys.ts`: localStorage.
- `src/SheetMusic.tsx`: OSMD wrapper. `src/KeySelect.tsx`: ARIA listbox. `src/SiteFooter.tsx`: feedback links and credits.

### Rules

- Todo Tango is the authority on credits. When it differs from a source file or from anything else, Todo Tango wins, including its spelling of names. Copy a song's credits exactly from the page of that work.
- Fix data in the build scripts, not in `scores/` or the generated files, which are gitignored.
- Use `IntervalTransposeCalculator`. The default one misspells leading tones.
- In OSMD 2.2.1 `render()` does not apply a transposition. Set `Sheet.Transpose`, then call `updateGraphic()` and `render()`.
- Key names must match OSMD's spelling table, so `D#m`, not `Ebm`.
- The key comes from `?tono=`, then the remembered key, then the original. Only a choice made in the selector is saved to localStorage, never a key that came from a link. Key changes use `history.replaceState` so Back returns to the index.
- The first client render must match the prerendered HTML, so read the URL and localStorage in effects, never during render.
- A URL with `?tono=` is canonicalized to the song's clean URL. Do not create pages per key.
- Every page needs its own title and meta description. All visible text is in Spanish; English only appears in the structured data. Descriptions stay in metadata: never show them on the page, and never hide text from users to show it to search engines.
- PDF export is `window.print()`. `SheetMusic` paginates on `beforeprint` so no staff is split, and restores on `afterprint`. The PDF only shows the title, the credits and the score: no site header and no key label.
- The interface is in formal Spanish: address the user as `usted`, never as `vos` or `tú`.
- In documents, do not break lines in the middle of a sentence.

### Dependencies

`pnpm-workspace.yaml` rejects versions younger than 3 days and fails if a package loses its trust level. Do not add exclusions or bypass this. Pick an older version instead. Dependency build scripts stay blocked unless listed in `allowBuilds`. GitHub Actions are pinned by commit SHA.

### Style

Keep code simple and easy to test, with few comments and self-explanatory names. No emojis. Do not add functionality nobody asked for. Update `CHANGELOG.md` for user-facing changes.

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

- `scores/`: archivos fuente. La carga inicial proviene del proyecto Cancionero del Tango, de Hugo Satorre, así que ese crédito debe mantenerse en el pie, `README.md` y `LICENSE`. No se editan nunca. Los nombres están mal codificados, así que los metadatos salen del contenido.
- `scripts/build-songs.mjs`: pasa MusicXML de UTF-16 a UTF-8, extrae metadatos, repara los datos y escribe `public/sitemap.xml`, que se versiona para que quede visible en el repositorio.
- `scripts/spelling.mjs`: correcciones ortográficas. Una palabra que solo está mal según el contexto se agrega con su frase.
- `scripts/credits.json`: autor y letrista de cada tema. Las claves de `people` en `src/todotango.json` son estos nombres visibles, así que un cambio aquí debe hacerse también allí.
- `scripts/prerender.mjs`: escribe cada página en `dist/`.
- `src/seo.ts`: títulos, descripciones, datos estructurados y sitemap. `src/Head.tsx`: etiquetas del encabezado HTML. `src/entry-server.tsx`: la lista de páginas.
- `src/todotango.json`: enlaces a Todo Tango. Un tema solo se enlaza si la página de la obra nombra a alguno de sus autores, porque muchos títulos son compartidos por obras distintas.
- `src/keys.ts`: nombres de tonos y cálculo de semitonos. `src/route.ts`: URLs con hash. `src/rememberedKeys.ts`: localStorage.
- `src/SheetMusic.tsx`: envoltorio de OSMD. `src/KeySelect.tsx`: listbox ARIA. `src/SiteFooter.tsx`: enlaces de comentarios y créditos.

### Reglas

- Todo Tango es la autoridad en cuanto a créditos. Si difiere de un archivo fuente o de cualquier otra referencia, prevalece Todo Tango, incluso en la grafía de los nombres. Los créditos de un tema se copian tal cual de la página de esa obra.
- Los datos se corrigen en los scripts de build, no en `scores/` ni en los archivos generados, que están en `.gitignore`.
- Use `IntervalTransposeCalculator`. El calculador por defecto escribe mal las sensibles.
- En OSMD 2.2.1 `render()` no aplica la transposición. Hay que asignar `Sheet.Transpose` y llamar a `updateGraphic()` y `render()`.
- Los nombres de los tonos deben coincidir con la tabla de OSMD: `D#m`, no `Ebm`.
- El tono sale de `?tono=`, después del tono recordado y por último del original. Solo se guarda en localStorage lo elegido en el selector, nunca el tono de un enlace. Los cambios de tono usan `history.replaceState`, así Atrás vuelve al índice.
- El primer render en el cliente debe coincidir con el HTML pre-renderizado, así que la URL y localStorage se leen en efectos, nunca durante el render.
- Una URL con `?tono=` tiene como canónica la URL limpia del tema. No cree páginas por tono.
- Cada página necesita título y `meta description` propios. Todo el texto visible está en castellano; el inglés solo aparece en los datos estructurados. Las descripciones van solo en los metadatos: no se muestran en la página, y nunca se oculta texto a los usuarios para mostrárselo a los buscadores.
- La exportación a PDF es `window.print()`. `SheetMusic` pagina en `beforeprint` para no cortar pentagramas y restaura en `afterprint`. El PDF solo muestra el título, los créditos y la partitura: sin encabezado del sitio ni indicación de tono.
- La interfaz está en castellano formal: se trata al usuario de `usted`, nunca de `vos` ni de `tú`.
- En los documentos, no corte las líneas en medio de una oración.

### Dependencias

`pnpm-workspace.yaml` rechaza versiones con menos de 3 días y falla si un paquete pierde su nivel de confianza. No agregue excepciones ni eluda esta regla: elija una versión anterior. Los scripts de build de las dependencias siguen bloqueados salvo que figuren en `allowBuilds`. Las GitHub Actions se fijan por SHA de commit.

### Estilo

Mantenga el código simple y fácil de testear, con pocos comentarios y nombres que se expliquen solos. Sin emojis. No agregue funciones que nadie pidió. Actualice `CHANGELOG.md` con los cambios visibles para los usuarios.

### Atribución

Termine los commits hechos con Claude con:

```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```
