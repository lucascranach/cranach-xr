import React, { useRef, useState, Suspense, useEffect, useMemo } from "react"
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

const store = createXRStore({
  controller: {
    left: false,
    // right: true,
    rayPointer: true,
    teleportPointer: true,
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
  const [ready, setReady] = useState(false)

  const originRef = useRef(null)

  const url = "./sounds/cda-vr-ambient.mp3"
  const teleSize = 360

  function handleClick() {
    setReady(true)
    store.enterVR()
  }

  const imgsrc =
    "https://lucascranach.org/imageserver-2022/AT_KHM_GG6905_FR001/01_Overall/AT_KHM_GG6905_FR001_2008-08_Overall-m.jpg"

  // const imgsrc = "./img/demo-m.jpg"

  const img2 = useMemo(() => {
    const result = document.createElement("img")
    result.crossOrigin = "anonymous" // Allow cross-origin requests
    result.src = imgsrc
    return result
  }, [])

  return (
    <>
      <button onClick={handleClick} className="xr-button">
        Enter VR
      </button>
      <Suspense fallback={null}>
        <Canvas>
          <XR store={store}>
            {/* <group position={[0, 1.6, -0.5]} >
              <XRLayer
                src={img2}
                pixelWidth={0.45799999999999996}
                pixelHeight={0.584}
                scale={[0.45799999999999996, 0.584, 1]}
                dpr={32}
              />
              <Image
                scale={[0.45799999999999996, 0.584, 1]}
                url={imgsrc}
                position={[-0.5, 0, 0]}
              />
            </group> */}

            <XRLocomotion originRef={originRef} position={position} />
            <TeleportTarget onTeleport={setPosition}>
              <mesh
                scale={[teleSize, 1, 10]}
                position={[teleSize / 2 - 4, -0.5, 0]}
              >
                <boxGeometry />
                <meshBasicMaterial color="black" />
              </mesh>
            </TeleportTarget>

            <Leva hidden />
            {/* <ambientLight intensity={1} /> */}

            <OrbitControls />
            {/* <Grid position={[0, 0.01, 0]} /> */}
            <group position={[4.4, 0, -1]}>
              <Experience originRef={originRef} />
              {/* {ready && (
                <PositionalAudio url={url} loop distance={1} autoplay />
              )} */}
            </group>
          </XR>
        </Canvas>
      </Suspense>
    </>
  )
}

export default Scene
