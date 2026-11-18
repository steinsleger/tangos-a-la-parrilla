const KEY_PARAM = 'tono'

export const CHANGELOG_PATH = '/novedades/'

export const songPath = (slug: string) => `/partituras/${slug}/`

export const songUrl = (slug: string, keyName?: string) =>
  keyName ? `${songPath(slug)}?${new URLSearchParams({ [KEY_PARAM]: keyName })}` : songPath(slug)

export const slugFromPath = (path: string) => path.match(/^\/partituras\/([^/]+)\/?$/)?.[1]

// Read from the whole URL because `location.hash` drops a bare `#`, as in a hand-typed `?tono=F#`.
const fragmentOf = (href: string) => (href.includes('#') ? href.slice(href.indexOf('#')) : '')

// A sharp typed by hand starts the fragment, as in `?tono=F#m&x=1`. Any other fragment, like `#letra`, is an anchor.
const TYPED_SHARP = /^#m?(&|$)/

export function keyFromUrl(href: string) {
  const fragment = fragmentOf(href)
  return new URLSearchParams(new URL(href).search + (TYPED_SHARP.test(fragment) ? fragment : '')).get(KEY_PARAM)
}

export function anchorFromUrl(href: string) {
  const fragment = fragmentOf(href)
  return TYPED_SHARP.test(fragment) ? '' : fragment
}
