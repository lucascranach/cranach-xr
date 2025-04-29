import React, { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber" // Import useFrame and useThree

function DraggableCube() {
  const isDraggingRef = useRef(false)
  const meshRef = useRef(null)
  const { camera } = useThree() // Get the camera object

  // Use useFrame to update rotation on each frame
  useFrame(() => {
    // Only update lookAt if dragging and the mesh exists
    if (isDraggingRef.current && meshRef.current) {
      // Make the cube look at the camera's position
      meshRef.current.lookAt(camera.position)
    }
  })

  return (
    <mesh
      ref={meshRef}
      onPointerDown={(e) => {
        // Stop propagation to prevent other interactions like OrbitControls
        e.stopPropagation()
        if (isDraggingRef.current || !meshRef.current) {
          return
        }
        isDraggingRef.current = true
        // Access the mesh's position via meshRef.current
        // Keep the existing drag logic, but lookAt will override rotation
        // meshRef.current.position.copy(e.point) // Dragging might conflict with lookAt, consider how you want interaction
        // Optional: Change cursor style while dragging
        e.target.setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => {
        e.stopPropagation()
        if (!isDraggingRef.current || !meshRef.current) {
          return
        }
        // Access the mesh's position via meshRef.current
        meshRef.current.position.copy(e.point) // Dragging might conflict with lookAt
      }}
      onPointerUp={(e) => {
        e.stopPropagation()
        isDraggingRef.current = false
        // Optional: Release pointer capture
        e.target.releasePointerCapture(e.pointerId)
      }}
      // Optional: Add onPointerOut/Leave to handle cases where the pointer leaves the object while dragging
      onPointerOut={(e) => {
        if (isDraggingRef.current) {
          // Decide how to handle this: stop dragging? continue?
          // For now, let's stop dragging if the pointer leaves the object while pressed.
          isDraggingRef.current = false
          e.target.releasePointerCapture(e.pointerId)
        }
      }}
    >
      <boxGeometry args={[0.2, 0.2, 0.2]} /> // Give the box some size
      <meshStandardMaterial color="orange" /> // Give it a material
    </mesh>
  )
}
export default DraggableCube
