import React, { useRef, useState, Suspense, memo } from "react"
import * as THREE from "three"
import {
  XR,
  createXRStore,
  XROrigin,
  useXRControllerLocomotion,
  DefaultXRController,
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

const Scene = () => {
  const originRef = useRef(null)

  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <button onClick={() => store.enterAR()}>Enter AR</button>
      <Suspense fallback={null}>
        <Canvas>
          <XR store={store}>
            <XROrigin ref={originRef} />
            <XRLocomotion originRef={originRef} />
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
