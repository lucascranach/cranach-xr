import React, { useMemo, useRef, useState } from "react"
import { Image, Box, Html, Text3D, Text, Line } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

import { SizeMeasurement } from "./SizeMeasurement"

import { calculateImageScale } from "../utils/calculateImageScale"

const Painting = (props) => {
  const imageRef = useRef()
  const [rotation, setRotation] = useState(0)

  const imageScale = useMemo(() => {
    return calculateImageScale(props.data)
  }, [props.data])

  function handerClick(e) {
    console.log(props.data.inventoryNumber)
    console.log(imageScale)
    console.log(e)
  }

  const PaintingInfo = () => {
    return (
      <group>
        <group position={[0, 0.8, 0]} scale={0.1}>
          <Text
            font={"./fonts/IBMPlex-Mono/IBMPlexMono-Medium.ttf"}
          >{`${props.data.inventoryNumber} \n ${props.index} \n`}</Text>
        </group>
        <group scale={0.04} position={[-0.75, 0.5, 0]}>
          <Text maxWidth={12}>{props.data.dimensions}</Text>
        </group>
      </group>
    )
  }

  const PaintingImage = () => {
    return (
      <group ref={imageRef}>
        <Image
          scale={imageScale}
          url={props.data.images.overall.images[0].sizes.medium.src}
        />
        {props.data.images.reverse && (
          <Image
            url={props.data.images.reverse.images[0].sizes.medium.src}
            scale={imageScale}
            rotation-y={Math.PI}
          />
        )}
      </group>
    )
  }

  return (
    <>
      <group
        // rotation={[0, Math.PI / 4, 0]}
        onClick={handerClick}
      >
        {/* <PaintingInfo /> */}
        {/* <SizeMeasurement imageScale={imageScale} /> */}
        <PaintingImage />
      </group>
    </>
  )
}

export default Painting
