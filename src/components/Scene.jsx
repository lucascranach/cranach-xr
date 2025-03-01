import React, { useRef, useState, Suspense, memo } from "react"
import * as THREE from "three"
import { XR, createXRStore } from "@react-three/xr"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { CameraControls, Grid } from "@react-three/drei"
import { useControls, Leva } from "leva"
import { Experience } from "./Experience"

const store = createXRStore()

const Scene = () => {
  const { gridSize, ...gridConfig } = useControls({
    gridSize: [100, 100],
    cellSize: { value: 1.2, min: 0, max: 10, step: 0.6 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: "#6f6f6f",
    sectionSize: { value: 1.2 * 5, min: 0, max: 10, step: 0.6 },
    sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    sectionColor: "#cd4d4d",
    fadeDistance: { value: 400, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true,
  })

  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <Canvas shadows>
        <XR store={store}>
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
          <Grid position={[0, -0.01, 0]} args={gridSize} {...gridConfig} />
          <Experience />
        </XR>
      </Canvas>
    </>
  )
}

export default Scene
