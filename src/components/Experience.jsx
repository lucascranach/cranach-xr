import React, { useEffect, useMemo, useRef, useState } from "react"
import { useAtomValue } from "jotai"
import { Image, Box, Html, Text3D, Text, Plane } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useControls } from "leva"
import { Root, Container } from "@react-three/uikit"
import { Flex, Box as Flexbox } from "@react-three/flex"

import { artworksAtom } from "../store/atom"
import Curve from "./Curve"
import Painting from "./Painting"
import PictureFrame from "./PictureFrame"

import { calculateImageScale } from "../utils/calculateImageScale"

const Layout = () => (
  <Flex
    mainAxis="y"
    crossAxis="x"
    flexDirection="row"
    flexWrap="wrap"
    justify="center"
  >
    <Flexbox>
      <Box margin={100}></Box>
    </Flexbox>
    <Flexbox>
      <Box margin={10}></Box>
    </Flexbox>
  </Flex>
)

export const Experience = () => {
  const artworksData = useAtomValue(artworksAtom)

  return (
    <>
      <Plane args={[7, 2]} rotation={[Math.PI / -2, 0, 0]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#949494" />
      </Plane>
      <Box args={[7, 4, 0.2]} position={[0, 1, -1.1]}>
        <meshBasicMaterial color="#949494" />
      </Box>
      <group
        position={[-calculateImageScale(artworksData[0])[0] - 0.2, 1.8, -0.9]}
      >
        <Flex flexDirection="row" padding={0} margin={0} alignItems={"center"}>
          {artworksData.map(
            (data, index) =>
              index < 10 && (
                <Flexbox margin={0.4} centerAnchor={true} key={data.id}>
                  <group key={index} position={[0, 0, 0]}>
                    <PictureFrame key={index} data={data} index={index} />
                  </group>
                </Flexbox>
              )
          )}
        </Flex>
      </group>

      {/* <Curve>
          {Array.from({ length: 100 }).map((_, index) => (
            <mesh key={index}>
              <boxGeometry />
              <meshBasicMaterial color="red" />
            </mesh>
          ))}
        </Curve> */}

      {/* <Curve>
          {artworksData.map(
            (data, index) =>
              index < 10 && <Painting key={index} data={data} index={index} />
          )}
        </Curve> */}
    </>
  )
}
