// filepath: /Users/calvinhnzr/Desktop/cranach-xr/src/components/Experience.jsx
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useAtomValue } from "jotai"
import { Image, Box, Html, Text3D, Text, Plane } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useControls } from "leva" // Import useControls
// Removed uikit imports
import {
  XROrigin,
  useXRInputSourceState,
  useXRControllerLocomotion,
} from "@react-three/xr"

import { artworksAtom } from "../store/atom"

import PictureFrame from "./PictureFrame"
// import Modal from "./Modal"; // Remove old import
import Modal from "./Modal"
import Draggable from "./Draggable"

import Curve from "./legacy/Curve"

import { calculateImageScale } from "../utils/calculateImageScale"
import { sortAndGroupArtworks } from "../utils/sortAndGroupArtworks" // Import the helper function

export const Experience = (props) => {
  const artworksData = useAtomValue(artworksAtom)
  const groupedArtworks = useMemo(
    () => sortAndGroupArtworks(artworksData),
    [artworksData]
  )

  // Add Leva controls for spacing
  const {
    groupSpacing,
    artworkSpacing,
    basePositionY,
    dateTextOffsetY,
    modalOffsetX, // Horizontal space between painting edge and modal
    modalOffsetY, // Fine-tune vertical offset for modal bottom alignment
    // Removed estimatedModalHeight from controls for now
  } = useControls({
    groupSpacing: { value: 2.2, min: 0.1, max: 10, step: 0.1 },
    artworkSpacing: { value: 1.35, min: 0.05, max: 2, step: 0.05 },
    basePositionY: { value: 1.3, min: -5, max: 5, step: 0.1 }, // Control the overall bottom alignment
    dateTextOffsetY: { value: -0.7, min: -1, max: 1, step: 0.05 }, // Control vertical offset of date text from base
    modalOffsetX: { value: 0.5, min: 0, max: 2, step: 0.05 }, // Horizontal space between painting edge and modal
    modalOffsetY: { value: 0.26, min: -0.5, max: 2.5, step: 0.01 }, // Fine-tune vertical offset
  })

  let currentX = 0 // Keep track of the current X position for groups

  // Add a console log to verify control values are updating
  console.log("Leva Controls:", { modalOffsetX, modalOffsetY })

  return (
    <>
      {/* Removed outer Flex container */}
      {groupedArtworks.map((group, groupIndex) => {
        const groupStartPosition = currentX // Store the start X for this group

        // Calculate the width of the current group (sum of artwork widths + spacing)
        let groupWidth = 0
        group.artworks.forEach((data, index) => {
          if (index < 100) {
            // Increased limit slightly for testing if needed
            const [width] = calculateImageScale(data)
            groupWidth += width // Add artwork width
            if (index < group.artworks.length - 1 && index < 99) {
              groupWidth += artworkSpacing // Add spacing between artworks
            }
          }
        })

        let artworkOffsetX = 0 // Keep track of X offset within the group

        const groupJSX = (
          // Group container for each date
          <group
            key={group.date}
            position={[groupStartPosition, basePositionY, -1]}
          >
            {/* Position the date text relative to the group's base */}
            <Text
              position={[-0, dateTextOffsetY, 0]} // Use controlled Y offset
              fontSize={0.3}
              color="white"
              anchorX="left"
              anchorY="top" // Anchor top of text to the position, placing it below the baseline
            >
              {group.date}
            </Text>

            {/* Map artworks within the group */}
            {group.artworks.map((data, index) => {
              const [width, height] = calculateImageScale(data)
              // Position artwork relative to group origin (0,0,0) which is at [groupStartPosition, basePositionY, 0]
              const artworkPositionY = height / 2 // Center artwork vertically such that its bottom is at y=0 (relative to group)
              const artworkPositionX = artworkOffsetX + width / 2 // Center artwork horizontally relative to its start offset

              // Update offset for the next artwork. Consider if modal width should be included.
              artworkOffsetX += width + artworkSpacing

              return (
                // This group holds both the Draggable PictureFrame and the Modal
                <group
                  key={data.id}
                  position={[artworkPositionX, artworkPositionY, 0]} // Position artwork+modal group relative to the date group origin
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log(data.metadata.date)
                    console.log(data)
                  }}
                >
                  <Draggable playerRef={props.originRef}>
                    {/* PictureFrame is at the center [0,0,0] of this group */}

                    <group key={data.id} position={[0, 0, 0]}>
                      <PictureFrame key={data.id} data={data} index={index} />
                    </group>
                  </Draggable>

                  {/* Position ManualModal group relative to the PictureFrame group */}
                  {/* Group origin is aligned with the painting's bottom-right edge + offset X */}
                  <group
                    position={[
                      width / 2 + modalOffsetX, // X: Position origin horizontally next to the painting's right edge + offset
                      -height / 2 + modalOffsetY, // Y: Position origin vertically aligned with the painting's bottom edge + FINE-TUNE offset
                      0.05, // Z: Slightly in front
                    ]}
                  >
                    {/* Render the ManualModal directly. Its internal origin is top-center-ish */}
                    <Modal data={data} />
                  </group>
                </group>
              )
            })}
          </group>
        )

        // Update currentX for the next group
        // Add groupSpacing *after* calculating the full width of the current group
        currentX += groupWidth + groupSpacing

        return groupJSX
      })}
    </>
  )
}
