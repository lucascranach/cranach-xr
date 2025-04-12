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
          <MapControls rotation={[0, 0, 0]} enableRotate={false} minZoom={4} />
          <OrthographicCamera
            position={[0, 10, 0]}
            rotation={[0, Math.Pi / -2, 0]}
            zoom={40}
            enabled={true}
            makeDefault
          />
          {/* <Stage /> */}

          <Grid position={[0, -0.01, 0]} />
          {/* <Experience /> */}

          <Curve>
            <mesh>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial attach="material" color="red" />
            </mesh>
            <mesh>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial attach="material" color="blue" />
            </mesh>
          </Curve>
        </XR>
      </Canvas>
    </>
  )
}

export default Scene
