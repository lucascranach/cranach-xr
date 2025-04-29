import React from "react"
import { Text, Plane } from "@react-three/drei"
import * as THREE from "three"

import { trimText } from "../utils/trimText" // Assuming you still need this

const Modal = ({ data, ...props }) => {
  const title = data?.metadata?.title || "No Title"
  const description = data?.description || "No Description"

  // --- Configuration ---
  const maxWidth = 1 // Max width of the modal in world units
  const padding = 0.05
  const titleFontSize = 0.04
  const descriptionFontSize = 0.025
  const lineSpacing = 0.03 // Additional space between title and description
  const backgroundColor = "white"
  const textColor = "white"
  const backgroundOpacity = 0.8
  // --- ---

  // Simple estimation for layout (more complex layout requires measuring text)
  const titleY = 0 // Title at the top (relative to group origin)
  const descriptionY = titleY - titleFontSize - lineSpacing

  // Estimate background size (this is tricky without measuring text accurately)
  // We'll make it wide enough and tall enough for typical content
  const estimatedHeight =
    titleFontSize + descriptionFontSize + lineSpacing + padding * 2 // Rough estimate
  const backgroundWidth = maxWidth
  const backgroundHeight = estimatedHeight // Adjust as needed

  // Calculate the left edge position for text alignment
  const leftEdgeX = -backgroundWidth / 2 + padding

  return (
    <group {...props}>
      {/* Background Plane */}

      {/* Title Text */}
      <Text
        position={[leftEdgeX, 0, 0]} // Position text at the left edge
        fontSize={titleFontSize}
        color={textColor}
        maxWidth={backgroundWidth - padding * 2}
        anchorX="left" // Align text start to the position.x
        anchorY="top" // Anchor text top to its position
        lineHeight={1} // Adjust line height if title wraps
        textAlign="left" // Explicitly set text alignment
      >
        {title}
      </Text>

      {/* Description Text */}
      <Text
        position={[leftEdgeX, descriptionY, 0]} // Position text at the left edge
        fontSize={descriptionFontSize}
        color={textColor}
        maxWidth={backgroundWidth - padding * 2}
        anchorX="left" // Align text start to the position.x
        anchorY="top" // Anchor text top to its position
        lineHeight={1.3} // Adjust line height
        textAlign="left" // Explicitly set text alignment
      >
        {trimText(description, 300)} {/* Keep trimming if needed */}
      </Text>
    </group>
  )
}

export default Modal
