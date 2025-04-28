export function trimText(text, limit) {
  if (typeof limit === "number") {
    // Trim by characters
    if (text.length > limit) {
      // Find the last space within the limit
      const trimmedText = text.substring(0, limit)
      const lastSpaceIndex = trimmedText.lastIndexOf(" ")
      if (lastSpaceIndex !== -1) {
        return trimmedText.substring(0, lastSpaceIndex) + "..."
      }
      return trimmedText + "..."
    }
    return text
  } else {
    // Trim by words
    const words = text.split(" ")
    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + "..."
    }
    return text
  }
}
