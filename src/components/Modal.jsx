import React, { useEffect } from "react"
import { Root, Container, Text } from "@react-three/uikit"
import { Card } from "@react-three/uikit-apfel"

const Modal = ({ headline, data, ...props }) => {
  return (
    <>
      <Card
        borderRadius={1}
        padding={4}
        gap={1}
        flexDirection="column"
        width={50}
      >
        <Text fontSize={3.2}>{data.metadata.title}</Text>
        <Text fontSize={2} opacity={0.9}>
          {data.description}
        </Text>
      </Card>
    </>
  )
}

export default Modal
