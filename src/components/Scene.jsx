import React, { useRef, useState, Suspense, useEffect } from "react"
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
  Text,
  SpotLight,
  Plane,
  useHelper,
  PositionalAudio,
} from "@react-three/drei"
import { useControls, Leva } from "leva"
import { Experience } from "./Experience"

const store = createXRStore({
  controller: {
    left: false,
    right: true,
    rayPointer: true,
    teleportPointer: true,
  },
  hand: { teleportPointer: true },
  frameRate: "high",
})

const XRLocomotion = ({ originRef, position }) => {
  const controller = useXRInputSourceState("controller", "right")
  const [isPressed, setIsPressed] = useState(false)
  const [speed, setSpeed] = useState(2) // Default speed is 2

  useFrame(() => {
    if (controller) {
      const { object } = controller
      if (object) {
        const buttonPressed = controller.inputSource.gamepad.buttons[5].pressed
        if (buttonPressed && !isPressed) {
          // console.log("Button 5 pressed")
          setSpeed(5) // Increase speed to 4 when button 5 is clicked
          setIsPressed(true)
        } else if (!buttonPressed && isPressed) {
          setSpeed(1) // Reset speed to 2 when button 5 is released
          setIsPressed(false)
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

const url = "./sounds/cda-vr-ambient.mp3"

function Sound({ url }) {
  const sound = useRef()
  const { camera } = useThree()
  const [listener] = useState(() => new THREE.AudioListener())
  const buffer = useLoader(THREE.AudioLoader, url)
  useEffect(() => {
    sound.current.setBuffer(buffer)
    sound.current.setRefDistance(1)
    sound.current.setLoop(true)
    sound.current.play()
    camera.add(listener)
    return () => camera.remove(listener)
  }, [])
  return <positionalAudio ref={sound} args={[listener]} />
}

const Scene = () => {
  const [position, setPosition] = useState(new THREE.Vector3())
  const [ready, setReady] = useState(false)

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
            {/* <CustomInput originRef={originRef} position={position} /> */}
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
            {/* <mesh rotation={[0, 10, 0]}>
              <boxGeometry attach="geometry" args={[1, 1, 1]} />
              <meshStandardMaterial attach="material" color={"#6be092"} />
            </mesh> */}
            <OrbitControls />
            {/* <Grid position={[0, 0.01, 0]} /> */}
            <group position={[4.4, 0, -1]}>
              <Experience originRef={originRef} />
              {ready && (
                <PositionalAudio url={url} loop distance={1} autoplay />
              )}
            </group>
          </XR>
        </Canvas>
      </Suspense>
    </>
  )
}
export default Scene
