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
  const { start, end, mid, position, progress } = useControls({
    start: { x: 0, y: 0, z: 0 },
    end: { x: 16, y: 0, z: 10 },
    mid: { x: 5, y: 0, z: 5 },
    position: { x: 0, y: 0, z: 0 },
    progress: { value: 0, min: 0, max: 1, step: 0.01 },
  })

  const [curvePositions, setCurvePositions] = useState([])

  const curveRef = useRef()
  // Use the start, mid, and end points from useControls to define the curve
  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(start.x, start.y, start.z),
      new THREE.Vector3(mid.x, mid.y, mid.z),
      new THREE.Vector3(end.x, end.y, end.z)
    )
  }, [start, mid, end])

  useEffect(() => {
    // Calculate curve positions for each child based on progress
    const newPositions = React.Children.map(children, (_, index) => {
      const childProgress = progress + index * 0.1 // Adjust spacing as needed
      const clampedProgress = Math.max(0, Math.min(1, childProgress)) // Ensure progress is within 0-1 range
      const newPosition = new THREE.Vector3()
      curve.getPoint(clampedProgress, newPosition)
      return newPosition
    })
    setCurvePositions(newPositions || [])
  }, [progress, curve, children])

  return (
    <>
      <group position={[position.x, position.y, position.z]}>
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, { position: curvePositions[index] })
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
