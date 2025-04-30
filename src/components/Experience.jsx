import React, { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { useAtomValue } from "jotai"
import { Image, Box, Html, Text3D, Text, Plane } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useControls } from "leva"
import { throttle } from "lodash-es" // Keep the import
import {
  XROrigin,
  useXRInputSourceState,
  useXRControllerLocomotion,
  useXR,
} from "@react-three/xr"

import { artworksAtom } from "../store/atom"

import PictureFrame from "./PictureFrame"
import Modal from "./Modal"
import Draggable from "./Draggable"

import { calculateImageScale } from "../utils/calculateImageScale"
import { sortAndGroupArtworks } from "../utils/sortAndGroupArtworks"

const MODAL_FIXED_WIDTH = 1
const VISIBLE_ARTWORK_COUNT = 10
const VISIBILITY_UPDATE_THROTTLE = 200

export const Experience = (props) => {
  const artworksData = useAtomValue(artworksAtom)
  const groupedArtworks = useMemo(
    () => sortAndGroupArtworks(artworksData),
    [artworksData]
  )

  const {
    groupSpacing,
    artworkSpacing,
    artworksBaseY,
    modalOffsetX,
    modalOffsetY,
    floorLineColor,
    floorLineDepth,
    dateLineBaseY,
    dateTextRelativeY,
    useThrottle, // Add Leva control for throttling
  } = useControls({
    groupSpacing: { value: 2.2, min: 0.1, max: 10, step: 0.1 },
    artworkSpacing: { value: 1.35, min: 0.05, max: 2, step: 0.05 },
    artworksBaseY: { value: 1.3, min: -5, max: 5, step: 0.1 },
    modalOffsetX: { value: 0.5, min: 0, max: 2, step: 0.05 },
    modalOffsetY: { value: 0.26, min: -0.5, max: 2.5, step: 0.01 },
    floorLineColor: { value: "#343434" },
    floorLineDepth: { value: 0.05, min: -1, max: 1, step: 0.05 },
    dateLineBaseY: { value: 0.01, min: -5, max: 5, step: 0.01 },
    dateTextRelativeY: { value: 0.37, min: -0.5, max: 0.5, step: 0.01 },
    useThrottle: { value: true, label: "Use Throttle" }, // Default to true or false as needed
  })

  const [visibleArtworkIds, setVisibleArtworkIds] = useState(new Set())
  const { camera } = useThree()
  const { isPresenting } = useXR()

  // Pre-calculate artwork world positions and IDs (remains the same)
  const artworkPositions = useMemo(() => {
    // ... calculation logic ...
    const positions = []
    let currentX = 0

    groupedArtworks.forEach((group) => {
      const groupStartPosition = currentX
      let artworkOffsetX = 0
      let calculatedGroupWidth = 0
      const numArtworksInGroup = group.artworks.length

      group.artworks.forEach((data, index) => {
        if (index < 100) {
          const [width] = calculateImageScale(data)
          const artworkWorldX = groupStartPosition + artworkOffsetX + width / 2
          positions.push({ id: data.id, x: artworkWorldX })

          calculatedGroupWidth += width
          artworkOffsetX += width
          if (index < numArtworksInGroup - 1 && index < 99) {
            const spacing = artworkSpacing
            calculatedGroupWidth += spacing
            artworkOffsetX += spacing
          }
        }
      })

      if (numArtworksInGroup > 0 && numArtworksInGroup <= 100) {
        calculatedGroupWidth += modalOffsetX + MODAL_FIXED_WIDTH
      }
      const groupWidth = Math.max(calculatedGroupWidth, 0.1)
      currentX += groupWidth + groupSpacing
    })
    return positions
  }, [
    groupedArtworks,
    groupSpacing,
    artworkSpacing,
    modalOffsetX,
    artworksData,
  ])

  // Core logic for updating visible artworks (remains the same)
  const _updateVisibleArtworksLogic = useCallback(() => {
    if (!artworkPositions.length) return

    let playerX
    const tempVec = new THREE.Vector3()

    if (isPresenting && props.originRef?.current) {
      props.originRef.current.getWorldPosition(tempVec)
      playerX = tempVec.x
    } else if (camera) {
      camera.getWorldPosition(tempVec)
      playerX = tempVec.x
    } else {
      return
    }

    const artworksWithDistance = artworkPositions.map((artwork) => ({
      ...artwork,
      distance: Math.abs(playerX - artwork.x),
    }))

    artworksWithDistance.sort((a, b) => a.distance - b.distance)

    const closestIds = new Set(
      artworksWithDistance.slice(0, VISIBLE_ARTWORK_COUNT).map((a) => a.id)
    )

    setVisibleArtworkIds((prevVisibleIds) => {
      if (
        closestIds.size !== prevVisibleIds.size ||
        ![...closestIds].every((id) => prevVisibleIds.has(id))
      ) {
        return closestIds
      }
      return prevVisibleIds
    })
  }, [props.originRef, artworkPositions, camera, isPresenting])

  // Create the throttled function instance separately using useMemo
  const throttledUpdate = useMemo(() => {
    // This function will only be created once, or when the core logic changes
    return throttle(_updateVisibleArtworksLogic, VISIBILITY_UPDATE_THROTTLE, {
      leading: true,
      trailing: true,
    })
  }, [_updateVisibleArtworksLogic]) // Dependency is the core logic function

  // Effect to cancel the throttle when useThrottle becomes false or on unmount
  useEffect(() => {
    // Return a cleanup function
    return () => {
      // console.log("Cleaning up throttle"); // Optional: for debugging
      throttledUpdate.cancel()
    }
  }, [throttledUpdate]) // Run cleanup when the throttled function instance changes (or on unmount)

  // Determine which function to call in useFrame based on the Leva control
  const updateVisibleArtworks = useThrottle
    ? throttledUpdate
    : _updateVisibleArtworksLogic

  // Update visibility on frame using the selected function
  useFrame(() => {
    // updateVisibleArtworks will be either the raw or throttled function
    updateVisibleArtworks()
  })

  // --- Rendering Logic --- (remains the same)
  let currentX = 0

  return (
    <>
      {/* Intro Text */}
      <group position={[-3, 1.65, -0.3]}>
        {/* ... Text ... */}
        <Text
          fontSize={0.3}
          anchorX="left"
          anchorY="top"
          color={floorLineColor}
        >
          Lucas Cranach
        </Text>
        <Text
          position={[0, -0.15, 0]}
          fontSize={0.15}
          anchorX="left"
          anchorY="top"
          color={floorLineColor}
        >
          Meisterwerke
        </Text>
      </group>

      {groupedArtworks.map((group, groupIndex) => {
        const groupStartPosition = currentX
        let calculatedGroupWidth = 0
        const numArtworksInGroup = group.artworks.length
        let artworkOffsetX = 0

        // Calculate Group Width (remains the same)
        group.artworks.forEach((data, index) => {
          if (index < 100) {
            const [width] = calculateImageScale(data)
            calculatedGroupWidth += width
            if (index < numArtworksInGroup - 1 && index < 99) {
              calculatedGroupWidth += artworkSpacing
            }
          }
        })
        if (numArtworksInGroup > 0 && numArtworksInGroup <= 100) {
          calculatedGroupWidth += modalOffsetX + MODAL_FIXED_WIDTH
        }
        const groupWidth = Math.max(calculatedGroupWidth, 0.1)

        // Render Artworks Group (remains the same)
        const groupJSX = (
          <group
            key={`${group.date}-artworks`}
            position={[groupStartPosition, artworksBaseY, 0]}
          >
            {group.artworks.map((data, index) => {
              if (index >= 100) return null

              const [width, height] = calculateImageScale(data)
              const artworkPositionY = height / 2
              const currentArtworkOffset = artworkOffsetX
              artworkOffsetX += width + artworkSpacing

              // LAZY LOADING CHECK (remains the same)
              if (!visibleArtworkIds.has(data.id)) {
                return null
              }

              // Render visible artwork (remains the same)
              return (
                <group
                  key={data.id}
                  position={[
                    currentArtworkOffset + width / 2,
                    artworkPositionY,
                    0,
                  ]}
                >
                  <Draggable playerRef={props.originRef}>
                    <group>
                      <PictureFrame
                        key={`${data.id}-frame`}
                        data={data}
                        index={index}
                      />
                    </group>
                  </Draggable>
                  <group
                    position={[
                      width / 2 + modalOffsetX,
                      -height / 2 + modalOffsetY,
                      0.05,
                    ]}
                  >
                    <Modal key={`${data.id}-modal`} data={data} />
                  </group>
                </group>
              )
            })}
          </group>
        )

        // Render Date/Line Group (remains the same)
        const dateLineGroupJSX = (
          <group
            key={`${group.date}-dateline`}
            position={[groupStartPosition, dateLineBaseY, -0.3]}
          >
            <Plane
              args={[groupWidth, 0.02]}
              position={[groupWidth / 2, 0, floorLineDepth]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <meshBasicMaterial
                color={floorLineColor}
                side={THREE.DoubleSide}
              />
            </Plane>
            <Text
              position={[0, dateTextRelativeY, 0]}
              fontSize={0.3}
              color={floorLineColor}
              anchorX="left"
              anchorY="top"
            >
              {group.date}
            </Text>
          </group>
        )

        currentX += groupWidth + groupSpacing
        return [groupJSX, dateLineGroupJSX]
      })}
    </>
  )
}
