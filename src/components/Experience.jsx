import React from "react"

export const Experience = () => {
  return (
    <>
      <mesh position={[0, 0, 0]} castShadow visible={true}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="cornflowerblue" />
      </mesh>
    </>
  )
}
