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

import { calculateImageScale } from "../utils/calculateImageScale"

export const Experience = () => {
  const artworksData = useAtomValue(artworksAtom)

  return (
    <>
      <DraggableCube />
      <group position={[-1, 1, -0.8]} scale={0.5}>
        <Root>
          0
          <Modal data={artworksData[0]} />
        </Root>
      </group>
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
    </>
  )
}
