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

const arr = [0, 0, 0, 0, 0, 0, 0, 0]

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

      {/* <Draggable playerRef={props.originRef}>
        <group position={[-0.6, 1.3, -0.5]}>
          <Root>
            <Modal data={artworksData[0]} />
          </Root>
        </group>
      </Draggable> */}

      <group
        position={[-calculateImageScale(artworksData[1])[0] - 0.2, 1.8, -0.9]}
      >
        <Flex
          flexDirection="row"
          padding={0}
          margin={0}
          // alignItems={"flex-end"}
          alignItems={"center"}
        >
          {artworksData.map(
            (data, index) =>
              index < 10 && (
                <group key={data.id}>
                  <Flexbox margin={0.2} centerAnchor={true} key={data.id}>
                    <Draggable playerRef={props.originRef}>
                      <group key={index} position={[0, 0, 0]}>
                        <PictureFrame key={index} data={data} index={index} />
                      </group>
                    </Draggable>
                  </Flexbox>
                  <Flexbox marginRight={1} centerAnchor={true}>
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
