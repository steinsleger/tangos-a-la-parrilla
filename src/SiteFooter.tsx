import type { ReactNode } from 'react'
import { SCORES_SOURCE, SITE_NAME } from './seo.ts'

const REPO_URL = 'https://github.com/steinsleger/tangos-a-la-parrilla'
const CONTACT_EMAIL = 'asteins@gmail.com'

const FEEDBACK_LINKS = [
  { label: 'Reportar un error o sugerir una mejora', href: `${REPO_URL}/issues/new?template=feedback.yml` },
  { label: 'Escribir por correo', href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(SITE_NAME)}` },
]

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <h2>¿Encontró un error o tiene una sugerencia?</h2>
        <ul className="feedback-links">
          {FEEDBACK_LINKS.map(({ label, href }) => (
            <li key={label}>
              <ExternalLink href={href}>{label}</ExternalLink>
            </li>
          ))}
        </ul>
        <p>
          {SITE_NAME}, creado por Adrián Steinsleger ·{' '}
          <ExternalLink href="https://www.linkedin.com/in/adriansteinsleger/">LinkedIn</ExternalLink> ·{' '}
          <ExternalLink href="https://www.youtube.com/@AdrianSteinsleger">YouTube</ExternalLink>
        </p>
        <p>
          Desarrollado con Claude Opus 5.5 · Partituras con{' '}
          <ExternalLink href="https://opensheetmusicdisplay.org">OpenSheetMusicDisplay</ExternalLink>
        </p>
        <p>
          <ExternalLink href="https://creativecommons.org/licenses/by-nc/4.0/deed.es">Licencia CC BY-NC 4.0</ExternalLink> ·{' '}
          <ExternalLink href={REPO_URL}>Código fuente</ExternalLink>
        </p>
        <p>
          La carga inicial de partituras proviene del proyecto{' '}
          <ExternalLink href={SCORES_SOURCE.url}>{SCORES_SOURCE.name}</ExternalLink>, de {SCORES_SOURCE.author}.
        </p>
        <p>Las obras musicales pertenecen a sus autores y titulares de derechos.</p>
      </div>
    </footer>
  )
}
