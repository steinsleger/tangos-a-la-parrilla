import links from './todotango.json'

const BASE_URL = 'https://www.todotango.com'

const songs: Record<string, string> = links.songs
const people: Record<string, string> = links.people

const absolute = (path?: string) => path && `${BASE_URL}${path}`

export const songOnTodoTango = (slug: string) => absolute(songs[slug])

export const personOnTodoTango = (name: string) => absolute(people[name])
