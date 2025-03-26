import React, { useRef, useState, Suspense, memo } from "react"
import * as THREE from "three"
import { XR, createXRStore, XROrigin } from "@react-three/xr"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { CameraControls, Grid } from "@react-three/drei"
import { useControls, Leva } from "leva"
import { Experience } from "./Experience"

const store = createXRStore()

const Scene = () => {
  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <button onClick={() => store.enterAR()}>Enter AR</button>
      <Canvas shadows>
        <XR store={store}>
          <XROrigin />
          <CameraControls />
          <ambientLight intensity={Math.PI / 2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            decay={0}
            intensity={Math.PI}
          />
          <pointLight
            position={[-10, -10, -10]}
            decay={0}
            intensity={Math.PI}
          />
          <Grid position={[0, -0.01, 0]} />
          <Experience />
        </XR>
      </Canvas>
    </>
  )
}

export default Scene
