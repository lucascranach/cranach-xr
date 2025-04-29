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
  Plane,
} from "@react-three/drei"
import { useControls, Leva } from "leva"
import { Experience } from "./Experience"

const store = createXRStore({
  controller: { left: false, right: true, rayPointer: true },
  hand: false,
  frameRate: "high"
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
            {/* <Stage /> */}
            <OrbitControls />
            {/* <Grid position={[0, 0.01, 0]} /> */}
            <group position={[0, 0, -1]}>
              <Experience originRef={originRef} />
            </group>
            {/* <group position={[2.6, 0, 0]}>
              <Plane
                args={[7, 2]}
                rotation={[Math.PI / -2, 0, 0]}
                position={[0, 0, 0]}
              >
                <meshBasicMaterial color="#949494" />
              </Plane>
              <Box args={[7, 4, 0.2]} position={[0, 2, -1.1]}>
                <meshBasicMaterial color="#949494" />
              </Box>
            </group> */}
          </XR>
        </Canvas>
      </Suspense>
    </>
  )
}

export default Scene
