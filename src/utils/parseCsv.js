export function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/)
  const headers = lines.shift()?.split(',') ?? []
  return lines
    .map((line) => line.split(','))
    .filter((cols) => cols.length === headers.length)
    .map((cols) =>
      headers.reduce((acc, header, idx) => {
        acc[header.trim()] = cols[idx].trim()
        return acc
      }, {})
    )
}
