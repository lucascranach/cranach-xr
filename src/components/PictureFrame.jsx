import React, { useMemo, useRef, useState } from "react"
import { Image, Box, Text, Plane, useHelper, Helper } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useXRInputSourceState } from "@react-three/xr"
import * as THREE from "three"
import { SpotLightHelper } from "three"

import { calculateImageScale } from "../utils/calculateImageScale"

const PictureFrame = ({ imgSrc, ...props }) => {
  const imageRef = useRef()
  const lightsRef = useRef()

  const [isPointerOver, setIsPointerOver] = useState(false) // Track if ray pointer is over the image
  const [showMeasurements, setShowMeasurements] = useState(false) // Track visibility of measurements
  const [previousButtonState, setPreviousButtonState] = useState(false) // Track previous button state

  const imageScale = useMemo(() => {
    return calculateImageScale(props.data)
  }, [props.data])

  const frameSize = 0.025
  const measurementOpacity = 0.5

  const controller = useXRInputSourceState("controller", "right")

  useFrame(() => {
    if (controller && controller.inputSource.gamepad) {
      const isButtonPressed = controller.inputSource.gamepad.buttons[5].pressed

      // Show measurements only if the pointer is over the image and the button is pressed
      if (isPointerOver && isButtonPressed && !previousButtonState) {
        setShowMeasurements((prev) => !prev) // Toggle visibility
      }

      // Update the previous button state
      setPreviousButtonState(isButtonPressed)
    }
  })

  return (
    <group>
      {/* Main Image */}
      <Image
        scale={imageScale}
        url={props.data.images.overall.images[0].sizes.medium.src}
        onPointerOver={(e) => {
          // console.log("Ray pointer is on the image")
          setIsPointerOver(true) // Set pointer over state to true
          e.stopPropagation() // Prevent event bubbling
        }}
        onPointerOut={(e) => {
          // console.log("Ray pointer left the image")
          setIsPointerOver(false) // Set pointer over state to false
          e.stopPropagation() // Prevent event bubbling
        }}
      />
      {props.data.images.reverse && (
        <Image
          position={[0, 0, -0.052]}
          url={props.data.images.reverse.images[0].sizes.medium.src}
          scale={imageScale}
          rotation-y={Math.PI}
        />
      )}
      {/* Frame */}
      <pointLight position={[-2, 3, 0]} intensity={20} ref={lightsRef} />
      <Box
        args={[imageScale[0] + frameSize, imageScale[1] + frameSize, 0.05]}
        scale={[1, 1, 1]}
        position={[0, 0, -0.026]}
      >
        <meshStandardMaterial attach="material" color={"#434343"} />
      </Box>
      {/* Measurements */}
      {showMeasurements && (
        <>
          {/* Top Measurement */}
          <Text
            position={[0, imageScale[1] / 2 + 0.1, 0]} // Position above the image
            fontSize={0.05}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {(imageScale[0] * 100).toFixed(1)} cm
          </Text>

          {/* Left Measurement */}
          <Text
            position={[-imageScale[0] / 2 - 0.1, 0, 0]} // Position to the left of the image
            fontSize={0.05}
            color="white"
            rotation={[0, 0, Math.PI / 2]} // Rotate text vertically
            anchorX="center"
            anchorY="middle"
          >
            {(imageScale[1] * 100).toFixed(1)} cm
          </Text>

          {/* Top Plane */}
          <Plane
            args={[imageScale[0], 0.01]} // Width matches the image, height is small
            position={[0, imageScale[1] / 2 + 0.05, 0]} // Position above the image
          >
            <meshBasicMaterial
              color="white"
              transparent
              opacity={measurementOpacity}
            />
          </Plane>

          <Plane
            args={[0.01, 0.04]}
            position={[imageScale[0] / 2 + 0.005, imageScale[1] / 2 + 0.05, 0]}
          >
            <meshBasicMaterial
              color="white"
              transparent
              opacity={measurementOpacity}
            />
          </Plane>
          <Plane
            args={[0.01, 0.04]}
            position={[-imageScale[0] / 2 - 0.005, imageScale[1] / 2 + 0.05, 0]}
          >
            <meshBasicMaterial
              color="white"
              transparent
              opacity={measurementOpacity}
            />
          </Plane>
          {/* Left Plane */}
          <Plane
            args={[0.01, imageScale[1]]} // Width is small, height matches the image
            position={[-imageScale[0] / 2 - 0.05, 0, 0]} // Position to the left of the image
            rotation={[0, 0, 0]} // Rotate to align vertically
          >
            <meshBasicMaterial
              color="white"
              transparent
              opacity={measurementOpacity}
            />
          </Plane>
          <Plane
            args={[0.04, 0.01]}
            position={[-imageScale[0] / 2 - 0.05, imageScale[1] / 2 + 0.005, 0]}
          >
            <meshBasicMaterial
              color="white"
              transparent
              opacity={measurementOpacity}
            />
          </Plane>
          <Plane
            args={[0.04, 0.01]}
            position={[
              -imageScale[0] / 2 - 0.05,
              -imageScale[1] / 2 - 0.005,
              0,
            ]}
          >
            <meshBasicMaterial
              color="white"
              transparent
              opacity={measurementOpacity}
            />
          </Plane>
        </>
      )}
    </group>
  )
}
export default PictureFrame
