/**
 * Sorts artworks by metadata.date and groups them by the same date.
 * @param {Array} artworks - The array of artwork objects.
 * @returns {Array} - An array of objects, each containing a date and an array of artworks for that date, sorted by date.
 */
export const sortAndGroupArtworks = (artworks) => {
  if (!artworks || artworks.length === 0) {
    return []
  }

  // 1. Sort by metadata.date
  const sortedArtworks = [...artworks].sort((a, b) => {
    const dateA = a.metadata?.date || "Unknown Date"
    const dateB = b.metadata?.date || "Unknown Date"
    // Basic string comparison for dates; might need refinement for complex date formats
    return dateA.localeCompare(dateB)
  })

  // 2. Group by date
  const groupedByDate = sortedArtworks.reduce((acc, artwork) => {
    const date = artwork.metadata?.date || "Unknown Date"
    if (!acc[date]) {
      acc[date] = []
    }
    // Since already sorted by date, artworks within a group will maintain that order relative to each other if needed.
    acc[date].push(artwork)
    return acc
  }, {})

  // 3. Convert grouped object to an array of { date, artworks }
  const result = Object.entries(groupedByDate).map(([date, artworks]) => ({
    date,
    artworks,
  }))

  // 4. Sort the final groups by date (ensures consistent order of groups)
  result.sort((a, b) => a.date.localeCompare(b.date))

  return result
}
