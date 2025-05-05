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

export function trimTextBySentence(text, sentenceLimit) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text] // Split text into sentences
  if (sentences.length > sentenceLimit) {
    return sentences.slice(0, sentenceLimit).join(" ") + "..."
  }
  return text
}

export function trimTextToSentenceEnd(text, charLimit) {
  if (text.length <= charLimit) {
    return text // No trimming needed
  }

  // Trim by character limit first
  const trimmedText = text.substring(0, charLimit)

  // Find the last sentence-ending punctuation within the limit
  const sentenceEndMatch = trimmedText.match(/([.!?])(?=[^.!?]*$)/)
  if (sentenceEndMatch) {
    const lastSentenceEnd = trimmedText.lastIndexOf(sentenceEndMatch[1])
    return trimmedText.substring(0, lastSentenceEnd + 1).trim()
  }

  // If no sentence-ending punctuation, fallback to trimming by words
  const lastSpaceIndex = trimmedText.lastIndexOf(" ")
  if (lastSpaceIndex !== -1) {
    return trimmedText.substring(0, lastSpaceIndex) + "..."
  }

  // If no spaces, return the raw trimmed text with ellipsis
  return trimmedText + "..."
}
