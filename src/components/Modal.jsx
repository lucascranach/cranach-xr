import React, { useEffect } from "react"
import { Root, Container, Text } from "@react-three/uikit"
import { Card } from "@react-three/uikit-apfel"

const Modal = ({ headline, data, ...props }) => {
  return (
    <>
      <Card
        borderRadius={32}
        padding={32}
        gap={8}
        flexDirection="column"
        width={200}
      >
        <Text fontSize={16}>{data.metadata.title}</Text>
        <Text fontSize={10} opacity={0.7}>
          {data.description}
        </Text>
      </Card>
    </>
  )
}

export default Modal
