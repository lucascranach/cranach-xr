import React, { useEffect, useMemo, useRef, useState } from "react"
import { useAtomValue } from "jotai"
import { Image, Box, Html, Text3D, Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useControls } from "leva"

import Painting from "./Painting"

import { calculateImageScale } from "../utils/calculateImageScale"

import { artworksAtom } from "../store/atom"

export const Experience = ({ progress, gap, start, end, mid, index }) => {
  const artworksData = useAtomValue(artworksAtom)

  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(start.x, start.y, start.z),
      new THREE.Vector3(mid.x, mid.y, mid.z),
      new THREE.Vector3(end.x, end.y, end.z)
    )
  }, [start, mid, end])

  const curvePositions = useMemo(() => {
    const numberOfBoxes = artworksData.length // Total number of boxes
    return Array.from({ length: numberOfBoxes }).map((_, i) => {
      // Distribute boxes evenly from 0 to 1
      let evenlyDistributedProgress = (i / (numberOfBoxes - 1) + progress) % 1

      const newPosition = curve.getPoint(
        evenlyDistributedProgress,
        new THREE.Vector3()
      )
      return newPosition
    })
  }, [curve, progress, artworksData])

  return (
    <>
      {artworksData &&
        // Array.from({ length: 100 }).map((_, artworkIndex) => {

        artworksData.map((work, artworkIndex) => {
          const position = curvePositions ? curvePositions[artworkIndex] : null
          if (!position) return null // Skip rendering if position is null
          // if (artworkIndex > 10) return null

          return (
            <group key={artworkIndex} position={position}>
              {/* <Painting data={work} index={artworkIndex} /> */}
              <Text position={[0, 2, 0]}>{artworkIndex}</Text>

              <mesh>
                <boxGeometry />
                <meshBasicMaterial color="red" />
              </mesh>
            </group>
          )
        })}
    </>
  )
}
