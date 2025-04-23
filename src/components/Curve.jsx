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
import React, { useEffect, useMemo, useRef, useState } from "react"

const Curve = (props) => {
  const [playing, setPlaying] = useState(true)
  const {
    position,
    gap,
    midZ,
    progress: progressControl,
    toggleAnimation,
    rotationThreshold, // Added new control
  } = useControls({
    midZ: { value: 0, min: -100, max: 100, step: 0.1 },
    position: { x: 0, y: 0, z: 0 },
    gap: { value: 0.2, min: 0, max: 0.5, step: 0.01 },
    progress: { value: -1, min: 0, max: 1, step: 0.01 },
    rotationThreshold: { value: 0.5, min: 0, max: 2, step: 0.01 }, // Leva control for threshold
    toggleAnimation: {
      value: false,
      onChange: (value) => {
        setPlaying(value)
      },
    },
  })

  const [progress, setProgress] = useState(progressControl)

  useEffect(() => {
    setProgress(progressControl)
  }, [progressControl])

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

  const animatedPositions = useMemo(() => {
    const animatedPositions = []
    for (let i = 0; i < numChildren; i++) {
      const normalizedPosition = numChildren > 1 ? i / (numChildren - 1) : 0.5
      const adjustedProgress = progress
      const distance = (normalizedPosition + adjustedProgress) / 2
      const point = curve.getPointAt(Math.abs(distance % 1))
      animatedPositions.push(point)
    }
    return animatedPositions
  }, [curve, numChildren, progress])

  useFrame((state, delta) => {
    animatedPositions.forEach((pos, index) => {
      const group = groupRefs.current[index]?.current
      if (!group) return

      group.position.set(pos.x, pos.y, pos.z)

      const x = pos.x
      let targetRotation = 0
      // Invert the rotation angles
      if (x > rotationThreshold) {
        targetRotation = -Math.PI / 4 // Inverted: -45 degrees
      } else if (x < -rotationThreshold) {
        targetRotation = Math.PI / 4 // Inverted: 45 degrees
      } else {
        // Invert the interpolation range
        targetRotation = THREE.MathUtils.mapLinear(
          x,
          -rotationThreshold,
          rotationThreshold,
          Math.PI / 4, // Inverted start angle
          -Math.PI / 4 // Inverted end angle
        )
      }

      group.rotation.y = THREE.MathUtils.damp(
        group.rotation.y,
        targetRotation,
        8,
        delta
      )
    })

    if (playing) {
      setProgress((prevProgress) => (prevProgress + delta / 256) % 1)
    }
  })

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
          visible={false}
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
