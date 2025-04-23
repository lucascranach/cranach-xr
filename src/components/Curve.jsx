import { useControls } from "leva"
import {
  CurveModifier,
  Environment,
  Line,
  OrbitControls,
  QuadraticBezierLine,
  Text,
} from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import React, { useEffect, useMemo, useRef, useState } from "react"

import * as THREE from "three"

const Curve = (props) => {
  const { position, gap, midZ, progress } = useControls({
    midZ: { value: -0, min: -100, max: 100, step: 0.1 },
    position: { x: 0, y: 0, z: 0 },
    gap: { value: 0.25, min: 0, max: 0.5, step: 0.01 },
    progress: { value: 0, min: 0, max: 1, step: 0.01 },
  })

  const width = gap * 500

  const start = { x: width, z: 1 }
  const mid = { x: 0, z: midZ }
  const end = { x: -width, z: 1 }

  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(start.x, 0, start.z),
      new THREE.Vector3(mid.x, 0, mid.z),
      new THREE.Vector3(end.x, 0, end.z)
    )
  }, [start, mid, end])

  const childrenArray = React.Children.toArray(props.children)
  const numChildren = childrenArray.length

  const positions = useMemo(() => {
    const curveLength = curve.getLength()
    const halfCurveLength = curveLength / 2 // Calculate half the curve length
    const spacing = halfCurveLength / numChildren // Distribute children along half the curve

    const positions = []
    for (let i = 0; i < numChildren; i++) {
      const distance = i * spacing
      const point = curve.getPointAt(distance / curveLength) // Get point along the curve
      positions.push(point)
    }
    return positions
  }, [curve, numChildren])

  const animatedPositions = useMemo(() => {
    const animatedPositions = []
    for (let i = 0; i < numChildren; i++) {
      const distance = (i / numChildren / 2 + progress / 2) % 1 // Distribute children along half the curve
      const point = curve.getPointAt(distance) // Get point along the curve
      animatedPositions.push(point)
    }
    return animatedPositions
  }, [curve, numChildren, progress])

  return (
    <>
      <group position={[position.x, position.y, position.z]}>
        <QuadraticBezierLine
          start={new THREE.Vector3(start.x, 0, start.z)}
          mid={new THREE.Vector3(mid.x, 0, mid.z)}
          end={new THREE.Vector3(end.x, 0, end.z)}
          color="white"
          lineWidth={1}
          dashed={false}
        />

        {childrenArray.map((child, index) => (
          <group
            key={index}
            position={[
              animatedPositions[index].x,
              animatedPositions[index].y,
              animatedPositions[index].z,
            ]}
          >
            <Text position={[0, 2, 0]}>{index}</Text>
            {child}
          </group>
        ))}
      </group>
    </>
  )
}

export default Curve
