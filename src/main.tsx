import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { loadLyrics } from './lyrics.ts'
import { slugFromPath } from './route.ts'
import './styles.css'

const slug = slugFromPath(location.pathname)
// The prerendered page already shows the lyrics, so they must be here before the first render.
const lyrics = slug ? await loadLyrics(slug) : undefined

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App path={location.pathname} lyrics={lyrics} />
  </StrictMode>
)

if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
