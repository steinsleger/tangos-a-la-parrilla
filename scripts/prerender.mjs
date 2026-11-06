import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createServer } from 'vite'

const OUTPUT_DIR = 'dist'

const template = readFileSync(join(OUTPUT_DIR, 'index.html'), 'utf8')
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { pages, renderPage } = await vite.ssrLoadModule('/src/entry-server.tsx')

for (const page of pages) {
  const { app, head } = renderPage(page)
  const html = template
    .replace(/<title>.*<\/title>/, () => head)
    .replace('<div id="root"></div>', () => `<div id="root">${app}</div>`)
  const file = join(OUTPUT_DIR, page.file)

  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

await vite.close()
console.log(`${pages.length} pages prerendered to ${OUTPUT_DIR}`)
