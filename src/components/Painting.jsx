import React, { useMemo, useRef, useState } from "react"
import { Image, Box, Html, Text3D, Text, Line } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

import { SizeMeasurement } from "./SizeMeasurement"

import { calculatePaintingDimensions } from "../utils/calculatePaintingDimensions"

const imageUrl = `/img/painting-01.jpg`

const Painting = (props) => {
  const meshRef = useRef()
  const imageRef = useRef()

  const [targetRotation, setTargetRotation] = useState(0)
  const [isRotating, setIsRotating] = useState(false)

  function handleClick(event) {
    setTargetRotation(targetRotation + Math.PI)
    setIsRotating(true)
  }

  useFrame((state, delta) => {
    if (isRotating && imageRef.current) {
      // Calculate the next rotation using lerp for smooth animation
      const currentRotation = imageRef.current.rotation.y
      const step = THREE.MathUtils.lerp(
        currentRotation,
        targetRotation,
        0.08 // Adjust this value to control animation speed (0.01-0.1)
      )

      imageRef.current.rotation.y = step

      // Stop the animation when we're close enough to the target
      if (Math.abs(targetRotation - step) < 0.01) {
        imageRef.current.rotation.y = targetRotation
        setIsRotating(false)
      }
    }
  })

  // in cm
  const height = props.data.structuredDimension.height
  const width = props.data.structuredDimension.width

  // aspect ratio
  const dimensions = [
    props.data.images.overall.images[0].sizes.medium.dimensions.width / 100,
    props.data.images.overall.images[0].sizes.medium.dimensions.height / 100,
  ]

  const imageScale = useMemo(() => {
    let calculatedWidth = width ? width / 100 : null // Convert cm to meters
    let calculatedHeight = height ? height / 100 : null // Convert cm to meters

    if (!calculatedWidth && calculatedHeight) {
      calculatedWidth = calculatedHeight * (dimensions[0] / dimensions[1])
    } else if (calculatedWidth && !calculatedHeight) {
      calculatedHeight = calculatedWidth * (dimensions[1] / dimensions[0])
    } else if (!calculatedWidth && !calculatedHeight) {
      calculatedWidth = dimensions[0] || 0.4
      calculatedHeight = dimensions[1] || 0.5
    }

    return [calculatedWidth, calculatedHeight]
  }, [width, height, dimensions])

  console.log(props.index, imageScale)

  console.log(props.data)

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
      <group onClick={handleClick} ef={imageRef}>
        <Image
          scale={imageScale}
          url={props.data.images.overall.images[0].sizes.medium.src}
        />
        {/* <Image
            url={"/img/painting-01-back.jpg"}
            scale={[0.4, 0.5]}
            rotation-y={Math.PI}
          /> */}
      </group>
    )
  }

  return (
    <>
      <group>
        <PaintingInfo />
        <SizeMeasurement imageScale={imageScale} />
        <PaintingImage />
      </group>
    </>
  )
}

export default Painting
