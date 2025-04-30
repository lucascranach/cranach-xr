import React, { useState, useCallback } from "react"
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
  const backgroundColor = "#333" // Changed for visibility during testing
  const textColor = "white"
  const backgroundOpacity = 0.8
  // --- ---

  // State to store dynamic heights
  const [titleHeight, setTitleHeight] = useState(titleFontSize) // Initial estimate
  const [descriptionHeight, setDescriptionHeight] =
    useState(descriptionFontSize) // Initial estimate

  // Callbacks to update heights when text geometry is ready
  const onTitleSync = useCallback(
    (mesh) => {
      // textRenderInfo is available after sync
      if (mesh.textRenderInfo) {
        const height =
          mesh.textRenderInfo.blockBounds[3] -
          mesh.textRenderInfo.blockBounds[1]
        setTitleHeight(height > 0 ? height : titleFontSize) // Use calculated height or fallback
      }
    },
    [titleFontSize]
  )

  const onDescriptionSync = useCallback(
    (mesh) => {
      if (mesh.textRenderInfo) {
        const height =
          mesh.textRenderInfo.blockBounds[3] -
          mesh.textRenderInfo.blockBounds[1]
        setDescriptionHeight(height > 0 ? height : descriptionFontSize) // Use calculated height or fallback
      }
    },
    [descriptionFontSize]
  )

  // --- Dynamic Layout Calculations ---
  const titleY = 0 // Title top edge at y=0
  // Position description top edge below the calculated title height + spacing
  const descriptionY = titleY - titleHeight - lineSpacing

  // Calculate background size based on dynamic content height
  const contentHeight = titleHeight + lineSpacing + descriptionHeight
  const backgroundWidth = maxWidth
  const backgroundHeight = contentHeight + padding * 2

  // Calculate the left edge position for text alignment (relative to group center)
  const leftEdgeX = -backgroundWidth / 2 + padding
  // Calculate background Y position (center of the plane) relative to group origin (top)
  const backgroundCenterY = -(backgroundHeight / 2) + padding // Adjust so top padding aligns with titleY=0

  return (
    // Group origin is at the top-center of the modal content area
    <group {...props}>
      {/* Background Plane */}
      {/* <Plane
        args={[backgroundWidth, backgroundHeight]}
        position={[0, backgroundCenterY, -0.01]} // Center X, Calculated Center Y, Slightly behind text
      >
        <meshBasicMaterial
          color={backgroundColor}
          opacity={backgroundOpacity}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </Plane> */}

      {/* Title Text */}
      <Text
        position={[leftEdgeX, titleY, 0]} // Position text left edge, top edge at origin
        fontSize={titleFontSize}
        color={textColor}
        maxWidth={backgroundWidth - padding * 2}
        anchorX="left" // Align text start to the position.x
        anchorY="top" // Anchor text top to its position
        lineHeight={1.3} // Adjust line height if title wraps
        textAlign="left" // Explicitly set text alignment
        onSync={onTitleSync} // Add the sync callback
      >
        {title}
      </Text>

      {/* Description Text */}
      <Text
        position={[leftEdgeX, descriptionY, 0]} // Position text left edge, top edge below title
        fontSize={descriptionFontSize}
        color={textColor}
        maxWidth={backgroundWidth - padding * 2}
        anchorX="left" // Align text start to the position.x
        anchorY="top" // Anchor text top to its position
        lineHeight={1.3} // Adjust line height
        textAlign="left" // Explicitly set text alignment
        onSync={onDescriptionSync} // Add the sync callback
      >
        {trimText(description, 300)} {/* Keep trimming if needed */}
      </Text>
    </group>
  )
}

export default Modal
