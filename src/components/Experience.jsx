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

  return (
    <>
      {artworksData &&
        artworksData.map((work, index) => {
          // test for missing images
          // lucascranach.org/de/DE_BSTGS-GNMN-Lost_Gm209/
          // no images available for this artwork
          // console.log(work)
          if (index === 45) return null
          if (index > 20) return null

          return (
            <group key={work.id + index}>
              <Painting data={work} index={index} />
            </group>
          )
        })}
    </>
  )
}
