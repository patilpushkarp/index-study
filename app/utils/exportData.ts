/**
 * Client-side file downloader for CSV / JSON data
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  if (typeof window === 'undefined') return
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string) {
  if (!data.length) return

  const headers = Object.keys(data[0])
  const csvRows: string[] = []

  // Header row
  csvRows.push(headers.map(h => `"${h}"`).join(','))

  // Data rows
  for (const row of data) {
    const values = headers.map(h => {
      const val = row[h]
      if (val === null || val === undefined) return '""'
      const escaped = String(val).replace(/"/g, '""')
      return `"${escaped}"`
    })
    csvRows.push(values.join(','))
  }

  downloadFile(csvRows.join('\n'), `${filename}.csv`, 'text/csv;charset=utf-8;')
}

export function exportToJSON<T>(data: T, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2)
  downloadFile(jsonStr, `${filename}.json`, 'application/json')
}
