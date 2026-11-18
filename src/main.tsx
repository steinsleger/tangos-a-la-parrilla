import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { loadLyrics, lyricsInPage } from './lyrics.ts'
import { slugFromPath } from './route.ts'
import './styles.css'

const root = document.getElementById('root')!
const isPrerendered = root.firstElementChild !== null
const slug = slugFromPath(location.pathname)
const lyrics = isPrerendered ? lyricsInPage() : slug ? await loadLyrics(slug) : undefined

const app = (
  <StrictMode>
    <App path={location.pathname} lyrics={lyrics} />
  </StrictMode>
)

if (isPrerendered) hydrateRoot(root, app)
else createRoot(root).render(app)
