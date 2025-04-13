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
    return artworksData?.map((_, i) => {
      const childProgress = progress + i * gap
      const clampedProgress = Math.max(0, Math.min(1, childProgress))
      const newPosition = curve.getPoint(clampedProgress, new THREE.Vector3())
      return newPosition
    })
  }, [progress, gap, artworksData, curve])

  return (
    <>
      {artworksData &&
        artworksData.map((work, artworkIndex) => {
          if (artworkIndex === 45) return null
          if (artworkIndex > 0) return null

          return (
            <group
              key={work.id + artworkIndex}
              position={
                curvePositions ? curvePositions[artworkIndex] : [0, 0, 0]
              }
            >
              <Painting data={work} index={artworkIndex} />
            </group>
          )
        })}
    </>
  )
}
