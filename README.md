# Tangos a la parrilla

[tangosalaparrilla.com.ar](https://tangosalaparrilla.com.ar)

Toque tangos en cualquier tonalidad o imprima las partituras. Play tangos in any key or print the sheet music.

[Español](#español) · [English](#english)

## Español

Cancionero de tangos, valses y milongas para músicos: busque un tema, lea la partitura y llévela al tono que necesite. Está pensado para usarse en el ensayo, también desde el teléfono.

### Funciones

- Índice de 388 temas con búsqueda por título, autor o letrista, sin importar tildes ni puntuación.
- Partituras con acordes, generadas a partir de MusicXML con [OpenSheetMusicDisplay](https://opensheetmusicdisplay.org).
- Transposición a cualquiera de los 12 tonos. La lista marca el tono original y el elegido.
- El tono queda en la URL, así que se puede compartir un enlace directo a `/partituras/volver/?tono=Gm`.
- El sitio recuerda en su navegador el último tono que usted eligió para cada tema.
- Exportación a PDF desde la página de cada tema, a través del diálogo de impresión del navegador.
- Enlaces a [Todo Tango](https://www.todotango.com) para cada obra, compositor y letrista que figura allí.

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
| `pnpm songs` | Vuelve a generar `public/songs/` y `src/songs.json` |

El resultado es un sitio estático con una página HTML por tema, publicado en [Vercel](https://vercel.com). [`vercel.json`](vercel.json) define los comandos, y la versión de Node 24 importa porque Node 26 ya no incluye Corepack.

### Partituras

La carga inicial de partituras proviene del proyecto [Cancionero del Tango](https://hugosatorre.com.ar/portfolio/cancionero/), de Hugo Satorre. Los archivos originales están en [`scores/`](scores) y no se modifican. [`scripts/build-songs.mjs`](scripts/build-songs.mjs) los convierte en lo que usa el sitio y aplica las correcciones. La ortografía se corrige en [`scripts/spelling.mjs`](scripts/spelling.mjs). Los créditos de cada tema están en [`scripts/credits.json`](scripts/credits.json) y siguen a [Todo Tango](https://www.todotango.com), que prevalece cuando difiere de los archivos originales.

Para agregar un tema, expórtelo desde Sibelius como MusicXML, déjelo en `scores/`, agregue sus créditos a `scripts/credits.json` y ejecute `pnpm songs`.

### Comentarios

Su opinión es muy útil. Puede [reportar un error](https://github.com/steinsleger/tangos-a-la-parrilla/issues/new?template=bug_report.yml), [sugerir una mejora](https://github.com/steinsleger/tangos-a-la-parrilla/issues/new?template=feature_request.yml) o [pedir un tango](https://github.com/steinsleger/tangos-a-la-parrilla/issues/new?template=song_request.yml). Si no tiene cuenta de GitHub, escriba a [asteins@gmail.com](mailto:asteins@gmail.com).

Para colaborar con código, consulte [CONTRIBUTING.md](CONTRIBUTING.md).

### Créditos

Creado por **Adrián Steinsleger**: [LinkedIn](https://www.linkedin.com/in/adriansteinsleger/) · [YouTube](https://www.youtube.com/@AdrianSteinsleger) · [asteins@gmail.com](mailto:asteins@gmail.com).

La carga inicial de partituras proviene del proyecto [Cancionero del Tango](https://hugosatorre.com.ar/portfolio/cancionero/), de **Hugo Satorre**.

Desarrollado con **Claude Opus 5.5**, de Anthropic. La notación usa [OpenSheetMusicDisplay](https://opensheetmusicdisplay.org) y [VexFlow](https://www.vexflow.com).

### Licencia

[CC BY-NC 4.0](LICENSE): usted puede compartir y adaptar este proyecto sin fines comerciales, dando crédito a su autor. No se puede vender. Las obras musicales pertenecen a sus autores y titulares de derechos. Ni ellas ni las partituras están cubiertas por esta licencia. Si tiene derechos sobre una obra o una partitura y desea que se corrija o se retire, escriba a [asteins@gmail.com](mailto:asteins@gmail.com).

---

## English

A songbook of tangos, valses and milongas for musicians: find a song, read the score and move it to the key you need. It is built for rehearsals, on a phone as well as a laptop. The site's interface is in Spanish.

### Features

- Index of 388 songs, searchable by title, author or lyricist, ignoring accents and punctuation.
- Lead sheets rendered from MusicXML with [OpenSheetMusicDisplay](https://opensheetmusicdisplay.org).
- Transposition to any of the 12 keys. The list marks both the original key and the selected one.
- The key is part of the URL, so you can share a direct link such as `/partituras/volver/?tono=Gm`.
- Your browser remembers the last key you chose for each song.
- PDF export from every song page, through the browser's print dialog.
- Links to [Todo Tango](https://www.todotango.com) for every work, composer and lyricist listed there.

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
| `pnpm songs` | Regenerates `public/songs/` and `src/songs.json` |

The output is a static site with one HTML page per song, deployed on [Vercel](https://vercel.com). [`vercel.json`](vercel.json) sets the commands, and Node 24 matters because Node 26 no longer ships Corepack.

### Scores

The initial set of scores comes from the project [Cancionero del Tango](https://hugosatorre.com.ar/portfolio/cancionero/) by Hugo Satorre. The source files live in [`scores/`](scores) and are never edited. [`scripts/build-songs.mjs`](scripts/build-songs.mjs) turns them into what the site uses and applies the repairs. Spelling is corrected in [`scripts/spelling.mjs`](scripts/spelling.mjs). Each song's credits live in [`scripts/credits.json`](scripts/credits.json) and follow [Todo Tango](https://www.todotango.com), which prevails over the source files when they differ.

To add a song, export it from Sibelius as MusicXML, place it in `scores/`, add its credits to `scripts/credits.json` and run `pnpm songs`.

### Feedback

Your feedback helps. You can [report a bug](https://github.com/steinsleger/tangos-a-la-parrilla/issues/new?template=bug_report.yml), [suggest an improvement](https://github.com/steinsleger/tangos-a-la-parrilla/issues/new?template=feature_request.yml) or [request a song](https://github.com/steinsleger/tangos-a-la-parrilla/issues/new?template=song_request.yml). If you don't have a GitHub account, write to [asteins@gmail.com](mailto:asteins@gmail.com).

To contribute code, see [CONTRIBUTING.md](CONTRIBUTING.md).

### Credits

Created by **Adrián Steinsleger**: [LinkedIn](https://www.linkedin.com/in/adriansteinsleger/) · [YouTube](https://www.youtube.com/@AdrianSteinsleger) · [asteins@gmail.com](mailto:asteins@gmail.com).

The initial set of scores comes from the project [Cancionero del Tango](https://hugosatorre.com.ar/portfolio/cancionero/) by **Hugo Satorre**.

Developed with **Claude Opus 5.5**, by Anthropic. Notation uses [OpenSheetMusicDisplay](https://opensheetmusicdisplay.org) and [VexFlow](https://www.vexflow.com).

### License

[CC BY-NC 4.0](LICENSE): you may share and adapt this project for noncommercial purposes, crediting its author. It may not be sold. The musical works belong to their authors and rights holders. Neither they nor the scores are covered by this license. If you hold rights in a work or a score and want it corrected or removed, write to [asteins@gmail.com](mailto:asteins@gmail.com).
