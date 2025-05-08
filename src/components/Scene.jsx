import React, { useRef, useState, Suspense, useEffect, useMemo } from "react"
import { useAtom } from "jotai"
import * as THREE from "three"
import {
  XR,
  createXRStore,
  XROrigin,
  useXRControllerLocomotion,
  useXRInputSourceState,
  DefaultXRController,
  useRayPointer,
  TeleportTarget,
  XRLayer,
} from "@react-three/xr"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import {
  MapControls,
  Grid,
  Stage,
  OrthographicCamera,
  Center,
  OrbitControls,
  Box,
  Image,
  Text,
  SpotLight,
  Plane,
  useHelper,
  PositionalAudio,
  useTexture,
} from "@react-three/drei"
import { useControls, Leva } from "leva"
import { Experience } from "./Experience"
import { readyAtom } from "../store/atom"

const store = createXRStore({
  controller: {
    left: false,
    // right: true,
    rayPointer: true,
    // teleportPointer: true,
  },
  hand: { teleportPointer: true },
  frameRate: "high",
})

const XRLocomotion = ({ originRef, position }) => {
  const controller = useXRInputSourceState("controller", "right")
  const [speed, setSpeed] = useState(2) // Default speed is 2
  const [yHeight, setYHeight] = useState(0) // Default Z height adjustment

  useFrame(() => {
    if (controller) {
      const { object } = controller
      if (object) {
        // rb: 1
        // a: 4
        // b: 5
        const buttonRBPressed =
          controller.inputSource.gamepad.buttons[1].pressed
        const buttonAPressed = controller.inputSource.gamepad.buttons[4].pressed

        if (buttonAPressed) {
          console.log("Button 5 pressed")
          setSpeed(5) // Increase speed to 4 when button 5 is clicked
        } else if (!buttonAPressed) {
          setSpeed(1) // Reset speed to 2 when button 5 is released
        }

        if (buttonRBPressed) {
          setYHeight(2)
        } else if (!buttonRBPressed) {
          setYHeight(0)
        }
        if (originRef.current) {
          originRef.current.position.y = yHeight
        }
      }
    }
  })

  useXRControllerLocomotion(
    originRef,
    {
      speed: speed,
    },
    {
      type: "smooth",
      speed: -3,
    }
  )
  return <XROrigin ref={originRef} position={position} />
}

const Scene = () => {
  const [position, setPosition] = useState(new THREE.Vector3())
  const [ready, setReady] = useAtom(readyAtom)

  const originRef = useRef(null)

  const teleSize = 360

  function handleClick() {
    setReady(true)
    store.enterVR()
  }

  return (
    <>
      <button onClick={handleClick} className="xr-button">
        Enter VR
      </button>
      <Suspense fallback={null}>
        <Canvas>
          <XR store={store}>
            <XRLocomotion originRef={originRef} position={position} />
            {/* <TeleportTarget onTeleport={setPosition}>
              <mesh
                scale={[teleSize, 1, 10]}
                position={[teleSize / 2 - 4, -0.5, 0]}
              >
                <boxGeometry />
                <meshBasicMaterial color="black" />
              </mesh>
            </TeleportTarget> */}

            <Leva hidden />
            {/* <ambientLight intensity={1} /> */}

            <OrbitControls />
            {/* <Grid position={[0, 0.01, 0]} /> */}

            {ready && <MovingBox originRef={originRef} />}
            <group position={[4.4, 0, -1]}>
              <Experience originRef={originRef} />
            </group>
          </XR>
        </Canvas>
      </Suspense>
    </>
  )
}

export default Scene

const MovingBox = ({ originRef }) => {
  const url = "./sounds/cda-vr-ambient.mp3"
  const boxRef = useRef(null)

  useFrame(() => {
    if (originRef.current && boxRef.current) {
      const playerPosition = new THREE.Vector3()
      originRef.current.getWorldPosition(playerPosition)

      boxRef.current.position.x = playerPosition.x // Sync box's x position with player's x position
    }
  })

  return (
    <group ref={boxRef} position={[0, 0, -1]}>
      <PositionalAudio url={url} loop distance={2} autoplay />
      {/* <Box args={[1, 1, 1]}>
        <meshBasicMaterial color={"red"} transparent opacity={0.5} />
      </Box> */}
    </group>
  )
}
