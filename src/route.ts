const KEY_PARAM = 'tono'

export const songPath = (slug: string) => `/partituras/${slug}/`

export const songUrl = (slug: string, keyName?: string) =>
  keyName ? `${songPath(slug)}?${new URLSearchParams({ [KEY_PARAM]: keyName })}` : songPath(slug)

export const slugFromPath = (path: string) => path.match(/^\/partituras\/([^/]+)\/?$/)?.[1]

// A sharp typed by hand lands in the fragment: `?tono=F#m`.
export const keyFromUrl = (search: string, hash: string) => new URLSearchParams(search + hash).get(KEY_PARAM)
