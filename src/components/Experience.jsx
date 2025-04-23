import React, { useEffect, useMemo, useRef, useState } from "react"
import { useAtomValue } from "jotai"
import { Image, Box, Html, Text3D, Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useControls } from "leva"

import { artworksAtom } from "../store/atom"
import Curve from "./Curve"

export const Experience = () => {
  const artworksData = useAtomValue(artworksAtom)

  return (
    <>
      <Curve>
        {Array.from({ length: 100 }).map((_, index) => (
          <mesh key={index}>
            <boxGeometry />
            <meshBasicMaterial color="red" />
          </mesh>
        ))}
      </Curve>
    </>
  )
}
