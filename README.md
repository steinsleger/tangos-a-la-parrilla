# Tangos a la parrilla

[tangosalaparrilla.com.ar](https://tangosalaparrilla.com.ar)

Toque tangos en cualquier tonalidad o imprima las partituras con su letra. Play tangos in any key or print the sheet music with lyrics.

[Español](#español) · [English](#english)

## Español

Cancionero de tangos, valses y milongas para músicos: busque un tema, lea la partitura y la letra, y llévela al tono que necesite. Está pensado para usarse en el ensayo, también desde el teléfono.

### Funciones

- Índice de 428 temas con búsqueda por título, autor o letrista, sin importar tildes ni puntuación.
- Partituras con acordes, generadas a partir de MusicXML con [OpenSheetMusicDisplay](https://opensheetmusicdisplay.org).
- La letra de cada tema debajo de la partitura, con un botón «Letra» para ir directo a ella.
- Transposición a cualquiera de los 12 tonos. La lista marca el tono original y el elegido.
- El tono queda en la URL, así que se puede compartir un enlace directo a `/partituras/volver/?tono=Gm`.
- El sitio recuerda en su navegador el último tono que usted eligió para cada tema.
- Exportación a PDF, a través del diálogo de impresión del navegador, con la letra en una página aparte, y a XML (MusicXML) para programas como MuseScore o Sibelius, ambas en el tono elegido.
- Enlaces a [Todo Tango](https://www.todotango.com) para cada obra, compositor y letrista que figura allí.
- Página de [novedades](https://tangosalaparrilla.com.ar/novedades/) con el historial de cambios y la fecha de la última actualización.

### Uso local

Hacen falta [Node.js](https://nodejs.org) 24 y pnpm 12. La forma más simple de usar la versión exacta del proyecto es Corepack, que viene con Node:

```sh
corepack enable
pnpm install
pnpm dev
```

Si tiene instalada de forma global una versión de pnpm anterior a la 12, actualícela o asegúrese de que Corepack tenga prioridad en su `PATH`.

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Genera las partituras y levanta el sitio en modo desarrollo |
| `pnpm test` | Corre los tests |
| `pnpm build` | Revisa los tipos y pre-renderiza el sitio estático en `dist/` |
| `pnpm preview` | Sirve `dist/` para probarlo antes de publicar |
| `pnpm songs` | Vuelve a generar `public/songs/`, `src/songs.json` y `src/lyrics/` |

El resultado es un sitio estático con una página HTML por tema, publicado en [Vercel](https://vercel.com). [`vercel.json`](vercel.json) define los comandos, y la versión de Node 24 importa porque Node 26 ya no incluye Corepack.

### Partituras

La carga inicial de partituras proviene del proyecto [Cancionero del Tango](https://hugosatorre.com.ar/portfolio/cancionero/), de Hugo Satorre. Los archivos originales están en [`scores/`](scores) y no se modifican. Pueden ser MusicXML en UTF-16, exportados con Dolet, o en UTF-8, exportados directamente desde Sibelius. [`scripts/build-songs.mjs`](scripts/build-songs.mjs) los convierte en lo que usa el sitio y aplica las correcciones: los acordes escritos como texto, incluidos los glifos de la fuente Opus Chords, se convierten en acordes que se pueden transponer con [`scripts/chords.mjs`](scripts/chords.mjs). La ortografía se corrige en [`scripts/spelling.mjs`](scripts/spelling.mjs). Los créditos de cada tema están en [`scripts/credits.json`](scripts/credits.json) y siguen a [Todo Tango](https://www.todotango.com), que prevalece cuando difiere de los archivos originales.

Los archivos exportados desde Sibelius traen la letra como texto de página, y [`scripts/lyrics.mjs`](scripts/lyrics.mjs) la separa del resto. La letra de los demás temas está transcrita del PDF del Cancionero del Tango en [`lyrics/`](lyrics), un archivo de texto por tema con el nombre de su URL, un verso por línea y las estrofas separadas por una línea en blanco. Esos archivos sí se pueden corregir. Cada página trae solo la letra de su tema.

Para agregar un tema, expórtelo desde Sibelius como MusicXML, déjelo en `scores/` con la extensión `.xml`, agregue sus créditos a `scripts/credits.json` y ejecute `pnpm songs`. Si el archivo no trae la letra, agréguela en `lyrics/`. Al publicar, anote los temas y cambios en [`src/releases.ts`](src/releases.ts), que alimenta la página de novedades, y en [CHANGELOG.md](CHANGELOG.md).

### Comentarios

Su opinión es muy útil. Puede [reportar un error o sugerir una mejora](https://github.com/steinsleger/tangos-a-la-parrilla/issues/new?template=feedback.yml). Si no tiene cuenta de GitHub, escriba a [asteins@gmail.com](mailto:asteins@gmail.com).

Para colaborar con código, consulte [CONTRIBUTING.md](CONTRIBUTING.md).

### Créditos

Creado por **Adrián Steinsleger**: [LinkedIn](https://www.linkedin.com/in/adriansteinsleger/) · [YouTube](https://www.youtube.com/@AdrianSteinsleger) · [asteins@gmail.com](mailto:asteins@gmail.com).

La carga inicial de partituras y letras proviene del proyecto [Cancionero del Tango](https://hugosatorre.com.ar/portfolio/cancionero/), de **Hugo Satorre**.

Desarrollado con **Claude Opus 5.5**, de Anthropic. La notación usa [OpenSheetMusicDisplay](https://opensheetmusicdisplay.org) y [VexFlow](https://www.vexflow.com).

### Licencia

[CC BY-NC 4.0](LICENSE): usted puede compartir y adaptar este proyecto sin fines comerciales, dando crédito a su autor. No se puede vender. Las obras musicales y sus letras pertenecen a sus autores y titulares de derechos. Ni ellas ni las partituras están cubiertas por esta licencia. Si tiene derechos sobre una obra o una partitura y desea que se corrija o se retire, escriba a [asteins@gmail.com](mailto:asteins@gmail.com).

---

## English

A songbook of tangos, valses and milongas for musicians: find a song, read the score and the lyrics, and move it to the key you need. It is built for rehearsals, on a phone as well as a laptop. The site's interface is in Spanish.

### Features

- Index of 428 songs, searchable by title, author or lyricist, ignoring accents and punctuation.
- Lead sheets rendered from MusicXML with [OpenSheetMusicDisplay](https://opensheetmusicdisplay.org).
- Each song's lyrics below the score, with a "Letra" button that jumps to them.
- Transposition to any of the 12 keys. The list marks both the original key and the selected one.
- The key is part of the URL, so you can share a direct link such as `/partituras/volver/?tono=Gm`.
- Your browser remembers the last key you chose for each song.
- Export to PDF, through the browser's print dialog, with the lyrics on a page of their own, and to XML (MusicXML) for programs such as MuseScore or Sibelius, both in the selected key.
- Links to [Todo Tango](https://www.todotango.com) for every work, composer and lyricist listed there.
- A [release notes](https://tangosalaparrilla.com.ar/novedades/) page with the history of changes and the date of the last update.

### Running it locally

You need [Node.js](https://nodejs.org) 24 and pnpm 12. Corepack, which ships with Node, is the simplest way to get the project's exact version:

```sh
corepack enable
pnpm install
pnpm dev
```

If you have a global pnpm older than 12, update it or make sure Corepack comes first in your `PATH`.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Generates the scores and starts the development server |
| `pnpm test` | Runs the tests |
| `pnpm build` | Type-checks and prerenders the static site into `dist/` |
| `pnpm preview` | Serves `dist/` to try it before publishing |
| `pnpm songs` | Regenerates `public/songs/`, `src/songs.json` and `src/lyrics/` |

The output is a static site with one HTML page per song, deployed on [Vercel](https://vercel.com). [`vercel.json`](vercel.json) sets the commands, and Node 24 matters because Node 26 no longer ships Corepack.

### Scores

The initial set of scores comes from the project [Cancionero del Tango](https://hugosatorre.com.ar/portfolio/cancionero/) by Hugo Satorre. The source files live in [`scores/`](scores) and are never edited. They are either UTF-16 MusicXML exported with Dolet or UTF-8 MusicXML exported directly from Sibelius. [`scripts/build-songs.mjs`](scripts/build-songs.mjs) turns them into what the site uses and applies the repairs: chord symbols typed as text, including the glyphs of the Opus Chords font, become chords that transpose through [`scripts/chords.mjs`](scripts/chords.mjs). Spelling is corrected in [`scripts/spelling.mjs`](scripts/spelling.mjs). Each song's credits live in [`scripts/credits.json`](scripts/credits.json) and follow [Todo Tango](https://www.todotango.com), which prevails over the source files when they differ.

Files exported from Sibelius carry their lyrics as page text, which [`scripts/lyrics.mjs`](scripts/lyrics.mjs) tells apart from the rest. The lyrics of the other songs were transcribed from the PDF of Cancionero del Tango into [`lyrics/`](lyrics), one text file per song named after its URL, with one verse per line and stanzas separated by a blank line. Those files can be corrected. Each page only carries the lyrics of its own song.

To add a song, export it from Sibelius as MusicXML, place it in `scores/` with the `.xml` extension, add its credits to `scripts/credits.json` and run `pnpm songs`. If the file has no lyrics, add them to `lyrics/`. When releasing, list the songs and changes in [`src/releases.ts`](src/releases.ts), which feeds the release notes page, and in [CHANGELOG.md](CHANGELOG.md).

### Feedback

Your feedback helps. You can [report a bug or suggest an improvement](https://github.com/steinsleger/tangos-a-la-parrilla/issues/new?template=feedback.yml). If you don't have a GitHub account, write to [asteins@gmail.com](mailto:asteins@gmail.com).

To contribute code, see [CONTRIBUTING.md](CONTRIBUTING.md).

### Credits

Created by **Adrián Steinsleger**: [LinkedIn](https://www.linkedin.com/in/adriansteinsleger/) · [YouTube](https://www.youtube.com/@AdrianSteinsleger) · [asteins@gmail.com](mailto:asteins@gmail.com).

The initial set of scores and lyrics comes from the project [Cancionero del Tango](https://hugosatorre.com.ar/portfolio/cancionero/) by **Hugo Satorre**.

Developed with **Claude Opus 5.5**, by Anthropic. Notation uses [OpenSheetMusicDisplay](https://opensheetmusicdisplay.org) and [VexFlow](https://www.vexflow.com).

### License

[CC BY-NC 4.0](LICENSE): you may share and adapt this project for noncommercial purposes, crediting its author. It may not be sold. The musical works and their lyrics belong to their authors and rights holders. Neither they nor the scores are covered by this license. If you hold rights in a work or a score and want it corrected or removed, write to [asteins@gmail.com](mailto:asteins@gmail.com).
