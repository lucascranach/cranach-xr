import React, { useMemo, useRef, useState } from "react"
import { Image, Box, Html, Text3D, Text, Line } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

import { calculateImageScale } from "../utils/calculateImageScale"

const PictureFrame = ({ imgSrc, ...props }) => {
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
  return (
    <group>
      <Image
        scale={imageScale}
        url={props.data.images.overall.images[0].sizes.medium.src}
      />
      <Box
        args={[imageScale[0] + 0.1, imageScale[1] + 0.1, 0.05]}
        scale={[1, 1, 1]}
        position={[0, 0, -0.026]}
      >
        <meshBasicMaterial color="black" />
      </Box>
      {props.data.images.reverse && (
        <Image
          position={[0, 0, -0.052]}
          url={props.data.images.reverse.images[0].sizes.medium.src}
          scale={imageScale}
          rotation-y={Math.PI}
        />
      )}
    </group>
  )
}

export default PictureFrame
