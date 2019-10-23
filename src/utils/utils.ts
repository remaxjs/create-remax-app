export const firstUpperCase = (str: string) => {
  return str.toLowerCase().replace(/^./, (s: string): string => {
    return s.toUpperCase()
  })
}
