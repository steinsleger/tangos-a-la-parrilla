const storageKey = (slug: string) => `tangos-a-la-parrilla:key:${slug}`

export function rememberedKey(slug: string) {
  try {
    return localStorage.getItem(storageKey(slug))
  } catch {
    return null
  }
}

export function rememberKey(slug: string, keyName: string) {
  try {
    localStorage.setItem(storageKey(slug), keyName)
  } catch {
    // Storage can be blocked or full. The key still applies, it just won't be remembered.
  }
}
