import React, { useEffect, useMemo, useRef, useState } from "react"
import { useAtomValue } from "jotai"
import { Image, Box, Html, Text3D, Text, Plane } from "@react-three/drei" // Make sure Plane is imported
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
import Modal from "./Modal" // Assuming Modal.jsx is the correct component
import Draggable from "./Draggable"

import Curve from "./legacy/Curve"

import { calculateImageScale } from "../utils/calculateImageScale"
import { sortAndGroupArtworks } from "../utils/sortAndGroupArtworks" // Import the helper function

// Define modal width constant (or get from Modal component if possible/needed)
const MODAL_FIXED_WIDTH = 1 // Based on maxWidth in Modal.jsx

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
    // basePositionY, // Removed
    artworksBaseY, // New control for artwork/modal vertical position
    modalOffsetX, // Horizontal space between painting edge and modal
    modalOffsetY, // Fine-tune vertical offset for modal bottom alignment relative to artwork bottom
    floorLineColor, // Control for floor line color
    floorLineDepth, // Control for floor line Z position
    dateLineBaseY, // Renamed control for the absolute Y position of the date/line group
    dateTextRelativeY, // Control vertical offset of date text relative to the line
  } = useControls({
    groupSpacing: { value: 2.2, min: 0.1, max: 10, step: 0.1 },
    artworkSpacing: { value: 1.35, min: 0.05, max: 2, step: 0.05 },
    // basePositionY: { value: 1.3, min: -5, max: 5, step: 0.1 }, // Removed
    artworksBaseY: { value: 1.3, min: -5, max: 5, step: 0.1 }, // Base Y for artworks/modals
    modalOffsetX: { value: 0.5, min: 0, max: 2, step: 0.05 }, // Horizontal space between painting edge and modal
    modalOffsetY: { value: 0.26, min: -0.5, max: 2.5, step: 0.01 }, // Fine-tune vertical offset of modal relative to artwork bottom
    floorLineColor: { value: "#343434" }, // Color picker for the line
    floorLineDepth: { value: 0.05, min: -1, max: 1, step: 0.05 }, // Z position of the line
    dateLineBaseY: { value: 0.01, min: -5, max: 5, step: 0.01 }, // Absolute Y position of the date/line group
    dateTextRelativeY: { value: 0.37, min: -0.5, max: 0.5, step: 0.01 }, // Position of text relative to the line within the group
  })

  let currentX = 0 // Keep track of the current X position for groups

  return (
    <>
      {/* Removed outer Flex container */}
      {groupedArtworks.map((group, groupIndex) => {
        if (groupIndex > 0) return null

        const groupStartPosition = currentX // Store the start X for this group

        // --- Calculate Group Width ---
        // Calculate the width accurately *before* mapping artworks
        let calculatedGroupWidth = 0
        const numArtworksInGroup = group.artworks.length // Use actual count

        group.artworks.forEach((data, index) => {
          if (index < 100) {
            // Keep your limit if needed
            const [width] = calculateImageScale(data)
            calculatedGroupWidth += width // Add artwork width
            // Add spacing *between* artworks
            if (index < numArtworksInGroup - 1 && index < 99) {
              calculatedGroupWidth += artworkSpacing
            }
          }
        })

        // Add width for the last modal and its offset if there are artworks
        if (numArtworksInGroup > 0 && numArtworksInGroup <= 100) {
          // Check if artworks exist within limit
          calculatedGroupWidth += modalOffsetX + MODAL_FIXED_WIDTH
        }

        // Ensure width is at least a small positive number to avoid zero-width plane
        const groupWidth = Math.max(calculatedGroupWidth, 0.1)
        // --- End Calculate Group Width ---

        let artworkOffsetX = 0 // Keep track of X offset within the group

        const groupJSX = (
          // Group container for each date group's artworks and modals
          // Position this group at the calculated start X and the artworksBaseY
          <group
            key={`${group.date}-artworks`} // Unique key
            position={[groupStartPosition, artworksBaseY, 0]} // Use artworksBaseY here
          >
            {/* Map artworks within the group */}
            {group.artworks.map((data, index) => {
              if (index >= 100) return null // Ensure consistency with width calculation limit

              const [width, height] = calculateImageScale(data)
              // Position artwork relative to group origin (which is at [groupStartPosition, artworksBaseY, 0])
              const artworkPositionY = height / 2 // Center artwork vertically such that its bottom is at y=0 (relative to group)
              const artworkPositionX = artworkOffsetX + width / 2 // Center artwork horizontally relative to its start offset

              // Update offset for the next artwork.
              artworkOffsetX += width + artworkSpacing

              return (
                // This group holds both the Draggable PictureFrame and the Modal
                // Position is relative to the date group's origin (artworksBaseY)
                <group
                  key={data.id}
                  position={[artworkPositionX, artworkPositionY, 0]}
                >
                  <Draggable playerRef={props.originRef}>
                    {/* PictureFrame is at the center [0,0,0] of this group */}
                    <group>
                      <PictureFrame key={data.id} data={data} index={index} />
                    </group>
                  </Draggable>

                  {/* Position Modal group relative to the PictureFrame group */}
                  {/* Modal origin is its bottom-left */}
                  <group
                    position={[
                      width / 2 + modalOffsetX, // X: Relative to painting center -> places left edge next to painting right edge + offset
                      -height / 2 + modalOffsetY, // Y: Relative to painting center -> places bottom edge at painting bottom edge + offset
                      -0.05, // Z: Slightly in front
                    ]}
                  >
                    <Modal data={data} />
                  </group>
                  <group
                    position={[0, 0, 0.05]} // Position slightly behind the artwork
                    rotation={[0, 0, 0]} // No rotation
                    visible={false} // Set to false to hide the planes
                  >
                    <Plane
                      args={[0.01, height]} // Width is small, height matches the image
                      position={[-width / 2 - 0.03, 0, 0]} // Position to the left of the image
                      rotation={[0, 0, 0]} // Rotate to align vertically
                    >
                      <meshBasicMaterial
                        color="white"
                        transparent
                        opacity={0.5}
                      />
                    </Plane>
                    <Plane
                      args={[width, 0.01]} // Width is small, height matches the image
                      position={[0, height / 2 + 0.03, 0]} // Position to the left of the image
                      rotation={[0, 0, 0]} // Rotate to align vertically
                    >
                      <meshBasicMaterial
                        color="white"
                        transparent
                        opacity={0.5}
                      />
                    </Plane>
                  </group>
                </group>
              )
            })}
          </group> // End of artworks group for this date
        )

        const dateLineGroupJSX = (
          // Group container for the Date Text and Floor Line for this date
          // Position this group at the calculated start X and the absolute dateLineBaseY
          <group
            key={`${group.date}-dateline`} // Unique key
            position={[groupStartPosition, dateLineBaseY, -0.3]} // Use dateLineBaseY here
          >
            {/* Floor Line - Position relative to the dateLine group */}
            <Box
              args={[groupWidth, 0.02, 0.02]} // Use the updated groupWidth including modal space
              position={[groupWidth / 2, 0, floorLineDepth]} // Center X relative to group start, Y=0 within this group, controlled Z
              rotation={[-Math.PI / 2, 0, 0]} // Rotate to lie flat on XZ plane
            >
              <meshBasicMaterial color={floorLineColor} />
            </Box>
            {/* Date Text - Position relative to the dateLine group */}
            <Text
              position={[0, dateTextRelativeY, 0]} // Y is relative to the line/group origin, Z=0
              fontSize={0.3}
              color={floorLineColor} // Changed color for visibility
              anchorX="left"
              anchorY="top" // Anchor top of text to the position
            >
              {group.date}
            </Text>
          </group> // End of date/line group for this date
        )

        const introGroup = (
          <group position={[-5, 1.65, -0.3]}>
            <Text fontSize={0.3} anchorX="left" anchorY="top" color="white">
              Lucas Cranach
            </Text>
            <Text
              position={[0.015, 0.15, 0]} // Adjusted Y position for spacing
              fontSize={0.15}
              anchorX="left"
              anchorY="top"
              color="white"
              fontWeight={200}
            >
              Meisterwerke
            </Text>
            <Text
              fontSize={0.065}
              anchorX="left"
              anchorY="top"
              color="white"
              fontWeight={100}
              position={[0, -1.64, 0.1]} // Adjusted Y position for spacing
              rotation={[Math.PI / -2, 0, 0]}
              maxWidth={2.05}
            >
              In dieser VR-Anwendung kannst du die Kunstwerke von Lucas Cranach
              d. Ä. im digitalen Raum erkunden. Anders als im Museum ermöglicht
              dir die virtuelle Realität, auch die Rückseiten der Gemälde mit
              interessanten Inschriften zu betrachten. Dank moderner
              VR-Technologie erstrahlen die Werke in ihrer ursprünglichen
              Farbintensität – ein faszinierender Blick auf die Kunst der
              Renaissance.
            </Text>
          </group>
        )

        // Update currentX for the next group
        // Add groupSpacing *after* calculating the full width of the current group
        currentX += groupWidth + groupSpacing

        // Return both groups for rendering
        return [groupJSX, dateLineGroupJSX, introGroup]
      })}
    </>
  )
}
