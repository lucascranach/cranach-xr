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
} from "@react-three/drei"
import { useControls, Leva } from "leva"
import { Experience } from "./Experience"
import Curve from "./Curve"

const store = createXRStore()

const Scene = () => {
  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <button onClick={() => store.enterAR()}>Enter AR</button>
      <Canvas>
        <XR store={store}>
          <XROrigin />
          <OrbitControls />

          <Grid position={[0, -0.01, 0]} />

          <Curve>
            <Experience />
          </Curve>
        </XR>
      </Canvas>
    </>
  )
}

export default Scene
