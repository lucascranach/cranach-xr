import React, { useEffect, useMemo, useRef, useState } from "react"
import { useAtomValue } from "jotai"
import { Image, Box, Html, Text3D, Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useControls } from "leva"

import Painting from "./Painting"

import { calculateImageScale } from "../utils/calculateImageScale"

import { artworksAtom } from "../store/atom"

export const Experience = () => {
  const artworksData = useAtomValue(artworksAtom)
  const [currentIndex, setCurrentIndex] = useState(0)
  const groupRef = useRef()
  const [isAnimating, setIsAnimating] = useState(false)

  const a4Width = 210 / 1000 // A4 width in meters (210mm)
  const a4Height = 297 / 1000

  const { xOffset, yOffset, zOffset, xRotation, yRotation, zRotation } =
    useControls("Transformations", {
      xOffset: { value: 0.1, min: -5, max: 5, step: 0.1 },
      yOffset: { value: 0, min: -5, max: 5, step: 0.1 },
      zOffset: { value: -0.9, min: -5, max: 5, step: 0.1 },
      xRotation: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
      yRotation: { value: -0.4, min: -Math.PI, max: Math.PI, step: 0.1 },
      zRotation: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    })

  return (
    <>
      <group ref={groupRef} position={[0, 1, -0.5]}>
        {artworksData &&
          artworksData.map((work, index) => {
            // test for missing images
            // lucascranach.org/de/DE_BSTGS-GNMN-Lost_Gm209/
            // no images available for this artwork
            // console.log(work)
            if (index === 45) return null
            if (index > 20) return null

            return (
              <group
                key={work.id + index}
                position={[
                  index * xOffset + calculateImageScale(work)[0] / 2,
                  index * yOffset,
                  index * zOffset,
                ]}
                rotation={[xRotation, yRotation, zRotation]}
              >
                <Painting data={work} index={index} />
              </group>
            )
          })}
      </group>
    </>
  )
}
