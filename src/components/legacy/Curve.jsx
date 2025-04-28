import * as THREE from "three"
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
import React, { useMemo, useRef } from "react"

const Curve = (props) => {
  const { position, gap, midZ } = useControls({
    midZ: { value: -5, min: -100, max: 100, step: 0.1 },
    position: { x: 0, y: 0, z: -2.5 },
    gap: { value: 0.02, min: 0, max: 0.5, step: 0.01 },
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

  const groupRefs = useRef([])
  groupRefs.current = Array(numChildren)
    .fill()
    .map((_, i) => groupRefs.current[i] || React.createRef())

  const positions = useMemo(() => {
    const positions = []
    for (let i = 0; i < numChildren; i++) {
      const normalizedPosition = numChildren > 1 ? i / (numChildren - 1) : 0.5
      const point = curve.getPointAt(normalizedPosition)
      positions.push(point)
    }
    return positions
  }, [curve, numChildren])

  // Set positions statically, no rotation
  React.useEffect(() => {
    positions.forEach((pos, index) => {
      const group = groupRefs.current[index]?.current
      if (!group) return
      group.position.set(pos.x, pos.y, pos.z)
    })
  }, [positions])

  return (
    <>
      <group position={[position.x, 0, position.z]}>
        <QuadraticBezierLine
          start={new THREE.Vector3(start.x, 0, start.z)}
          mid={new THREE.Vector3(mid.x, 0, mid.z)}
          end={new THREE.Vector3(end.x, 0, end.z)}
          color="white"
          lineWidth={1}
          dashed={false}
        />

        {childrenArray.map((child, index) => {
          return (
            <group key={index} ref={groupRefs.current[index]}>
              {child}
            </group>
          )
        })}
      </group>
    </>
  )
}

export default Curve
