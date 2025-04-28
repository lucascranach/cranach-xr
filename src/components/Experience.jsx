import React, { useEffect, useMemo, useRef, useState } from "react"
import { useAtomValue } from "jotai"
import { Image, Box, Html, Text3D, Text, Plane } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useControls } from "leva"
import { Root, Container } from "@react-three/uikit"
import { Flex, Box as Flexbox } from "@react-three/flex"
import {
  XROrigin,
  useXRInputSourceState,
  useXRControllerLocomotion,
} from "@react-three/xr"

import { artworksAtom } from "../store/atom"

import PictureFrame from "./PictureFrame"
import Modal from "./Modal"
import Draggable from "./Draggable"

import Curve from "./legacy/Curve"

import { calculateImageScale } from "../utils/calculateImageScale"

export const Experience = (props) => {
  const artworksData = useAtomValue(artworksAtom)

  return (
    <>
      {/* <Flex flexDirection="row" padding={0} margin={0} alignItems={"center"}>
        <Curve>
          {arr.map((data, index) => (
            <Flexbox key={index} margin={0} centerAnchor={true}>
              <Box args={[index / 5, 0.1, 0.1]} position={[0, 0, 0]}>
                <meshStandardMaterial color="blue" />
              </Box>
            </Flexbox>
          ))}
        </Curve>
      </Flex> */}

      <group position={[-0.5, 2, -0.9]}>
        <Flex
          flexDirection="row"
          padding={0}
          margin={0}
          alignItems={"flex-end"}
        >
          {artworksData.map(
            (data, index) =>
              index < 10 && (
                <group
                  key={data.id}
                  onClick={() => {
                    console.log("Clicked on artwork:", data)
                  }}
                >
                  <Flexbox margin={0.2} centerAnchor={true} key={data.id}>
                    <Draggable playerRef={props.originRef}>
                      <group key={index} position={[0, 0, 0]}>
                        <PictureFrame key={index} data={data} index={index} />
                      </group>
                    </Draggable>
                  </Flexbox>
                  <Flexbox
                    marginRight={1}
                    marginBottom={0.25}
                    centerAnchor={true}
                  >
                    <Root>
                      <Modal data={data} />
                    </Root>
                  </Flexbox>
                </group>
              )
          )}
        </Flex>
      </group>
    </>
  )
}
