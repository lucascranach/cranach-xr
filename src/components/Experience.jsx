import React, { useEffect, useMemo, useRef, useState } from "react"
import { useAtomValue } from "jotai"
import { Image, Box, Html, Text3D, Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

import Painting from "./Painting"

import { artworksAtom } from "../store/atom"

export const Experience = () => {
  const artworksData = useAtomValue(artworksAtom)
  const [currentIndex, setCurrentIndex] = useState(0)
  const groupRef = useRef()
  const [isAnimating, setIsAnimating] = useState(false)

  const a4Width = 210 / 1000 // A4 width in meters (210mm)
  const a4Height = 297 / 1000
  return (
    <>
      <mesh position={[-0, 1, -0.4]}>
        <planeGeometry args={[a4Width, a4Height]} />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} />
      </mesh>
      <group ref={groupRef}>
        {artworksData &&
          artworksData.map((work, index) => {
            // test for missing images
            // lucascranach.org/de/DE_BSTGS-GNMN-Lost_Gm209/
            // no images available for this artwork
            if (index === 45) return null
            if (index > 3) return null

            return (
              <group key={work.id} position={[index * 2, 1, -0.5]}>
                <Painting data={work} index={index} />
              </group>
            )
          })}
      </group>
    </>
  )
}
