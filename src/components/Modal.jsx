import React, { useEffect } from "react"
import { Root, Container, Text } from "@react-three/uikit"
import { Card } from "@react-three/uikit-default"
import { trimText } from "../utils/trimText"
const Modal = ({ data, ...props }) => {
  return (
    <>
      <Card
        borderRadius={1}
        borderColor={"white"}
        padding={4}
        gap={1}
        flexDirection="column"
        width={50}
        backgroundColor={"white"}
        opacity={0.2}
      >
        <Text fontSize={3.2} color={"black"}>
          {data.metadata.title}
        </Text>
        <Text fontSize={2} opacity={0.9} color={"black"}>
          {trimText(data.description, 300)}
        </Text>
      </Card>
    </>
  )
}

export default Modal
