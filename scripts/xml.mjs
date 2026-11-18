const ENTITIES = { amp: '&', apos: "'", quot: '"', lt: '<', gt: '>' }

export const decodeEntities = (text) => text.replace(/&(amp|apos|quot|lt|gt);/g, (_, name) => ENTITIES[name])

export const collapseWhitespace = (text) => text.replace(/\s+/g, ' ').trim()
