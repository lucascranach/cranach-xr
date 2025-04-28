import React, { useEffect } from "react"
import { Root, Container, Text } from "@react-three/uikit"
import { Card } from "@react-three/uikit-default"
import { trimText } from "../utils/trimText"
const Modal = ({ data, ...props }) => {
  return (
    <>
      <Container
        flexDirection="column"
        width={100}
        // backgroundColor={"white"}
        gap={4}
        paddingLeft={3}
      >
        <Text fontSize={5} color={"black"} fontWeight={700}>
          {data.metadata.title}
        </Text>
        <Text fontSize={5} opacity={0.9} color={"black"}>
          {trimText(data.description, 300)}
        </Text>
      </Container>
    </>
  )
}

export default Modal
