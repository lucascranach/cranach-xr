// filepath: /Users/calvinhnzr/Documents/Work/cranach/cranach-xr/src/components/Draggable.jsx
import React, { useRef } from "react"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"

function Draggable({ children }) {
  const isDraggingRef = useRef(false)
  const groupRef = useRef(null)
  const offsetRef = useRef(new THREE.Vector3())
  const { camera, scene } = useThree()

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        e.stopPropagation()
        if (isDraggingRef.current || !groupRef.current) return
        isDraggingRef.current = true
        e.target.setPointerCapture(e.pointerId)

        // Calculate offset in world space
        const groupWorldPos = groupRef.current.getWorldPosition(
          new THREE.Vector3()
        )
        offsetRef.current.copy(e.point).sub(groupWorldPos)
      }}
      onPointerMove={(e) => {
        e.stopPropagation()
        if (!isDraggingRef.current || !groupRef.current) return

        // Calculate new world position
        const newWorldPos = new THREE.Vector3()
          .copy(e.point)
          .sub(offsetRef.current)

        // Convert world position to parent's local space
        if (groupRef.current.parent) {
          groupRef.current.position.copy(
            groupRef.current.parent.worldToLocal(newWorldPos)
          )
        } else {
          groupRef.current.position.copy(newWorldPos)
        }
      }}
      onPointerUp={(e) => {
        e.stopPropagation()
        isDraggingRef.current = false
        e.target.releasePointerCapture(e.pointerId)
      }}
      onPointerOut={(e) => {
        if (isDraggingRef.current) {
          isDraggingRef.current = false
          e.target.releasePointerCapture(e.pointerId)
        }
      }}
    >
      {children}
    </group>
  )
}

export default Draggable
