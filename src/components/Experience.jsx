import React, { useMemo, useState, useRef } from "react"
import { useAtomValue } from "jotai"
import { Box, Text, Plane, PositionalAudio } from "@react-three/drei"
import * as THREE from "three"
import { useControls } from "leva"

import { artworksAtom, readyAtom } from "../store/atom"
import PictureFrame from "./PictureFrame"
import Modal from "./Modal"
import Draggable from "./Draggable"
import { calculateImageScale } from "../utils/calculateImageScale"
import { sortAndGroupArtworks } from "../utils/sortAndGroupArtworks"

// Define modal width constant
const MODAL_FIXED_WIDTH = 1

// Component for rendering a single artwork
const Artwork = ({
  data,
  index,
  artworkPositionX,
  artworkPositionY,
  modalOffsetX,
  modalOffsetY,
  originRef,
}) => {
  const [width, height] = calculateImageScale(data)

  return (
    <group position={[artworkPositionX, artworkPositionY, 0]}>
      <Draggable>
        <group>
          <PictureFrame
            key={data.id}
            data={data}
            index={index}
            originRef={originRef}
          />
        </group>
      </Draggable>
      <group
        position={[width / 2 + modalOffsetX, -height / 2 + modalOffsetY, -0.05]}
      >
        <Modal data={data} />
      </group>
      <MeasurementPlanes width={width} height={height} />
    </group>
  )
}

// Component for rendering measurement planes
const MeasurementPlanes = ({ width, height }) => (
  <group position={[0, 0, 0.05]} visible={false}>
    <Plane
      args={[0.01, height]}
      position={[-width / 2 - 0.03, 0, 0]}
      rotation={[0, 0, 0]}
    >
      <meshBasicMaterial color="white" transparent opacity={0.5} />
    </Plane>
    <Plane
      args={[width, 0.01]}
      position={[0, height / 2 + 0.03, 0]}
      rotation={[0, 0, 0]}
    >
      <meshBasicMaterial color="white" transparent opacity={0.5} />
    </Plane>
  </group>
)

// Component for rendering a group of artworks
const ArtworkGroup = ({
  group,
  groupStartPosition,
  artworksBaseY,
  artworkSpacing,
  modalOffsetX,
  modalOffsetY,
  originRef,
}) => {
  const ready = useAtomValue(readyAtom)
  let artworkOffsetX = 0

  return (
    <group position={[groupStartPosition, artworksBaseY, 0]}>
      {group.artworks.map((data, index) => {
        if (index >= 100) return null

        const [width] = calculateImageScale(data)
        const artworkPositionX = artworkOffsetX + width / 2
        const artworkPositionY = calculateImageScale(data)[1] / 2

        artworkOffsetX += width + artworkSpacing

        return (
          <Artwork
            key={data.id}
            data={data}
            index={index}
            artworkPositionX={artworkPositionX}
            artworkPositionY={artworkPositionY}
            modalOffsetX={modalOffsetX}
            modalOffsetY={modalOffsetY}
            originRef={originRef}
          />
        )
      })}
    </group>
  )
}

// Component for rendering the date line and text
const DateLineGroup = ({
  group,
  groupStartPosition,
  groupWidth,
  dateLineBaseY,
  floorLineDepth,
  floorLineColor,
  dateTextRelativeY,
}) => (
  <group position={[groupStartPosition, dateLineBaseY, -0.3]}>
    <Box
      args={[groupWidth, 0.02, 0.02]}
      position={[groupWidth / 2, 0, floorLineDepth]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <meshBasicMaterial color={floorLineColor} />
    </Box>
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

// Component for rendering the intro text
const IntroGroup = () => (
  <group position={[-5, 1.65, -0.3]}>
    <Text fontSize={0.3} anchorX="left" anchorY="top" color="white">
      Lucas Cranach
    </Text>
    <Text
      position={[0.015, 0.15, 0]}
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
      position={[0, -1.64, 0.1]}
      rotation={[Math.PI / -2, 0, 0]}
      maxWidth={2.05}
    >
      In dieser VR-Anwendung kannst du die Kunstwerke von Lucas Cranach d. Ä. im
      digitalen Raum erkunden. Anders als im Museum ermöglicht dir die virtuelle
      Realität, auch die Rückseiten der Gemälde mit interessanten Inschriften zu
      betrachten. Dank moderner VR-Technologie erstrahlen die Werke in ihrer
      ursprünglichen Farbintensität – ein faszinierender Blick auf die Kunst der
      Renaissance.
    </Text>
  </group>
)

// Main Experience component
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
  } = useControls({
    groupSpacing: { value: 2.2, min: 0.1, max: 10, step: 0.1 },
    artworkSpacing: { value: 1.35, min: 0.05, max: 2, step: 0.05 },
    artworksBaseY: { value: 1.3, min: -5, max: 5, step: 0.1 },
    modalOffsetX: { value: 0.5, min: 0, max: 2, step: 0.05 },
    modalOffsetY: { value: 0.17, min: -0.5, max: 2.5, step: 0.01 },
    floorLineColor: { value: "#343434" },
    floorLineDepth: { value: 0.05, min: -1, max: 1, step: 0.05 },
    dateLineBaseY: { value: 0.01, min: -5, max: 5, step: 0.01 },
    dateTextRelativeY: { value: 0.37, min: -0.5, max: 0.5, step: 0.01 },
  })

  let currentX = 0

  return (
    <>
      {groupedArtworks.map((group, groupIndex) => {
        // if (groupIndex > 1) return null

        const groupStartPosition = currentX
        const groupWidth = Math.max(
          group.artworks.reduce((acc, data, index) => {
            if (index < 100) {
              const [width] = calculateImageScale(data)
              return (
                acc +
                width +
                (index < group.artworks.length - 1 ? artworkSpacing : 0)
              )
            }
            return acc
          }, modalOffsetX + MODAL_FIXED_WIDTH),
          0.1
        )

        currentX += groupWidth + groupSpacing

        return (
          <React.Fragment key={group.date}>
            <ArtworkGroup
              group={group}
              groupStartPosition={groupStartPosition}
              artworksBaseY={artworksBaseY}
              artworkSpacing={artworkSpacing}
              modalOffsetX={modalOffsetX}
              modalOffsetY={modalOffsetY}
              originRef={props.originRef}
            />
            <DateLineGroup
              group={group}
              groupStartPosition={groupStartPosition}
              groupWidth={groupWidth}
              dateLineBaseY={dateLineBaseY}
              floorLineDepth={floorLineDepth}
              floorLineColor={floorLineColor}
              dateTextRelativeY={dateTextRelativeY}
            />
          </React.Fragment>
        )
      })}
      <IntroGroup />
    </>
  )
}
