import { LYRICS_DATA_ID, type Lyrics } from './lyrics.ts'
import { SITE_NAME, scriptJson, type PageMeta } from './seo.ts'

interface HeadProps {
  meta: PageMeta
  lyrics?: Lyrics
}

export function Head({ meta, lyrics }: HeadProps) {
  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.url ? <link rel="canonical" href={meta.url} /> : <meta name="robots" content="noindex" />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="es_AR" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />
      {meta.url && <meta property="og:url" content={meta.url} />}
      <meta name="twitter:card" content="summary_large_image" />
      {meta.jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: scriptJson(meta.jsonLd) }} />
      )}
      {lyrics && (
        <script type="application/json" id={LYRICS_DATA_ID} dangerouslySetInnerHTML={{ __html: scriptJson(lyrics) }} />
      )}
    </>
  )
}
