import React, { useEffect, useMemo, useRef, useState } from "react"
import { useAtomValue } from "jotai"
import { Image, Box, Html, Text3D, Text, Plane } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useControls } from "leva"
import { Root, Container } from "@react-three/uikit"
import { Flex, Box as Flexbox } from "@react-three/flex"

import { artworksAtom } from "../store/atom"

import PictureFrame from "./PictureFrame"
import Modal from "./Modal"
import DraggableCube from "./DraggableCube"
import Draggable from "./Draggable"

import { calculateImageScale } from "../utils/calculateImageScale"

export const Experience = () => {
  const artworksData = useAtomValue(artworksAtom)

  return (
    <>
      <Draggable>
        <mesh>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </Draggable>

      <Draggable>
        <group position={[-0.6, 1.3, -0.5]}>
          <Root>
            <Modal data={artworksData[0]} />
          </Root>
        </group>
      </Draggable>

      <group
        position={[-calculateImageScale(artworksData[1])[0] - 0.2, 1.8, -0.9]}
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
    </>
  )
}
