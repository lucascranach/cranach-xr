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

export const Experience = (props) => {
  const artworksData = useAtomValue(artworksAtom)

  return (
    <>
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
                  onClick={(e) => {
                    console.log("Clicked on artwork:", e)
                    console.log("Clicked on artwork:", data)
                  }}
                >
                  <Flexbox margin={0} centerAnchor={true} key={data.id}>
                    <Draggable playerRef={props.originRef}>
                      <group key={index} position={[0, 0, 0]}>
                        <PictureFrame key={index} data={data} index={index} />
                      </group>
                    </Draggable>
                  </Flexbox>

                  <Flexbox centerAnchor={true} marginRight={1}>
                    <Root>
                      <Modal data={data} />
                    </Root>
                  </Flexbox>
                </group>
              )
          )}
        </Flex>
      </group>
      {/* <group rotation={[0, Math.PI, 0]} position={[0, 1.5, 0]}>
        <Curve>
          {artworksData.map(
            (data, index) =>
              index < 10 && (
                <>
                  <Box args={[0.05, 2, 0.05]} position={[0, 0, 0]}>
                    <meshBasicMaterial color="red" />
                  </Box>

                  <group key={index} position={[0, 0, 0]}>
                    <Draggable playerRef={props.originRef}>
                      <PictureFrame key={index} data={data} index={index} />
                    </Draggable>
                  </group>
                </>
              )
          )}
        </Curve>
      </group> */}
      {/* <Curve>
        {Array.from({ length: 10 }, (_, index) => (
          <Plane key={index} args={[1, 1]} rotation={[Math.PI / -2, 0, 0]}>
            <meshBasicMaterial color="red" />
          </Plane>
        ))}
      </Curve> */}
    </>
  )
}
