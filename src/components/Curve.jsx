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
  const { start, end, mid, position, progress, gap } = useControls({
    start: { x: 16.6, y: 0, z: 0 },
    end: { x: 16, y: 0, z: 10 },
    mid: { x: 5, y: 0, z: 5 },
    position: { x: -12.5, y: 0.9, z: -4.68 },
    progress: { value: 0, min: 0, max: 1, step: 0.01 },
    gap: { value: 0.1, min: 0, max: 0.5, step: 0.01 },
  })

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
          start={[start.x, start.y, start.z]} // Starting point, can be an array or a vec3
          end={[end.x, end.y, end.z]} // Ending point, can be an array or a vec3
          mid={[mid.x, mid.y, mid.z]} // Optional control point, can be an array or a vec3
          color="red" // Default
          lineWidth={1} // In pixels (default)
          dashed={false} // Default
        />
      </group>
    </>
  )
}

export default Curve
