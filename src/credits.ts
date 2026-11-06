const SEPARATOR = /(\s*(?:\/|,| y | & |-)\s*)/

export const creditParts = (credit: string) => credit.split(SEPARATOR)
