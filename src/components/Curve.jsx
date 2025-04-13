import { useControls } from "leva"
import {
  CurveModifier,
  Environment,
  Line,
  OrbitControls,
  QuadraticBezierLine,
} from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import React, { useEffect, useMemo, useRef, useState } from "react"

import * as THREE from "three"

const Curve = ({ children }) => {
  const { width, position, progress, gap, midZ } = useControls({
    width: { value: 1, min: 0, max: 20, step: 0.1 },
    midZ: { value: 1, min: -20, max: 20, step: 0.1 },
    position: { x: 0, y: 0, z: 0 },
    progress: { value: 0, min: -1, max: 1, step: 0.01 },
    gap: { value: 0.1, min: 0, max: 0.5, step: 0.01 },
  })

  const start = { x: width, z: 1 }
  const mid = { x: 0, z: midZ }
  const end = { x: -width, z: 1 }

  return (
    <>
      <group position={[position.x, position.y, position.z]}>
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            index: index,
            progress: progress,
            gap: gap,
            start: start,
            end: end,
            mid: mid,
          })
        })}

        <QuadraticBezierLine
          start={[start.x, 0, start.z]} // Starting point, can be an array or a vec3
          end={[end.x, 0, end.z]} // Ending point, can be an array or a vec3
          mid={[mid.x, 0, mid.z]} // Optional control point, can be an array or a vec3
          color="red" // Default
          lineWidth={1} // In pixels (default)
          dashed={false} // Default
        />
      </group>
    </>
  )
}

export default Curve
