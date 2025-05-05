import React, { useRef, useState, Suspense, memo } from "react"
import * as THREE from "three"
import {
  XR,
  createXRStore,
  XROrigin,
  useXRControllerLocomotion,
  useXRInputSourceState,
  DefaultXRController,
  useRayPointer,
} from "@react-three/xr"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
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
} from "@react-three/drei"
import { useControls, Leva } from "leva"
import { Experience } from "./Experience"

const store = createXRStore({
  controller: { left: false, right: true, rayPointer: true },
  hand: false,
  frameRate: "high",
})

const XRLocomotion = ({ originRef }) => {
  useXRControllerLocomotion(originRef)
  return null
}

const CustomInput = () => {
  const controller = useXRInputSourceState("controller", "right")
  const [isPressed, setIsPressed] = useState(false)

  useFrame(() => {
    if (controller) {
      const { object } = controller
      if (object) {
        // console.log(controller.inputSource.gamepad)
        // console.log(controller.inputSource.gamepad.buttons[5])
        // 5 = b
        const target = new THREE.Vector3()
        object.getWorldPosition(target)
      }
    }
  })

  return null
}

const Scene = () => {
  const originRef = useRef(null)

  // const state = useXRInputSourceState("controller", "right")
  // useFrame(() => state?.object?.getWorldPosition(target))
  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <Suspense fallback={null}>
        <Canvas>
          <XR store={store}>
            <XROrigin ref={originRef} />
            <XRLocomotion originRef={originRef} />
            <CustomInput />
            {/* <ambientLight intensity={1} /> */}
            {/* <mesh rotation={[0, 10, 0]}>
              <boxGeometry attach="geometry" args={[1, 1, 1]} />
              <meshStandardMaterial attach="material" color={"#6be092"} />
            </mesh> */}
            <OrbitControls />
            {/* <Grid position={[0, 0.01, 0]} /> */}
            <group position={[2.4, 0, -1]}>
              <Experience originRef={originRef} />
            </group>
          </XR>
        </Canvas>
      </Suspense>
    </>
  )
}

export default Scene
