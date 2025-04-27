import React, { useRef, useState, Suspense, memo } from "react"
import * as THREE from "three"
import { XR, createXRStore, XROrigin } from "@react-three/xr"
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
  controller: { left: false },
  hand: { left: false, right: false },
})

const Scene = () => {
  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <button onClick={() => store.enterAR()}>Enter AR</button>
      <Canvas>
        <XR store={store}>
          <XROrigin />
          {/* <Stage /> */}
          <OrbitControls />
          <Grid position={[0, 0.01, 0]} />
          <Experience />
          <Plane
            args={[7, 2]}
            rotation={[Math.PI / -2, 0, 0]}
            position={[0, 0, 0]}
          >
            <meshBasicMaterial color="#949494" />
          </Plane>
          <Box args={[7, 4, 0.2]} position={[0, 1, -1.1]}>
            <meshBasicMaterial color="#949494" />
          </Box>
        </XR>
      </Canvas>
    </>
  )
}

export default Scene
