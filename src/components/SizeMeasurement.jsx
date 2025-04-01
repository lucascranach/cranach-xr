import React, { useMemo } from "react"
import { Line, Text } from "@react-three/drei"
import * as THREE from "three"
import { useControls } from "leva"

export const SizeMeasurement = ({ imageScale }) => {
  const lineHeight = 0.02 // Length of the angled lines

  const {
    lineWidth,
    dashSize,
    dashScale,
    color,
    markerColor,
    dashed,
    fontSize,
  } = useControls({
    lineWidth: { value: 2, min: 1, max: 10, step: 1 },
    dashSize: { value: 1, min: 0.1, max: 5, step: 0.1 },
    dashScale: { value: 100, min: 10, max: 500, step: 10 },
    color: "#ffffff",
    markerColor: "#ffffff",
    dashed: false,
    fontSize: { value: 0.05, min: 0.01, max: 0.2, step: 0.01 },
  })

  const linePoints = useMemo(() => {
    return [
      [imageScale[0] / 2, imageScale[1] / 2, 0],
      [imageScale[0] / 2, -imageScale[1] / 2, 0],
    ]
  }, [imageScale])

  const horizontalLinePoints = useMemo(() => {
    return [
      [-imageScale[0] / 2, imageScale[1] / 2, 0],
      [imageScale[0] / 2, imageScale[1] / 2, 0],
    ]
  }, [imageScale])

  const angledLinePointsHorizontalLeft = useMemo(() => {
    return [
      [-imageScale[0] / 2, imageScale[1] / 2, 0],
      [-imageScale[0] / 2, imageScale[1] / 2 + lineHeight, 0],
    ]
  }, [imageScale, lineHeight])

  const angledLinePointsHorizontalRight = useMemo(() => {
    return [
      [imageScale[0] / 2, imageScale[1] / 2, 0],
      [imageScale[0] / 2, imageScale[1] / 2 + lineHeight, 0],
    ]
  }, [imageScale, lineHeight])

  const angledLinePointsVerticalTop = useMemo(() => {
    return [
      [imageScale[0] / 2, imageScale[1] / 2, 0],
      [imageScale[0] / 2 + lineHeight, imageScale[1] / 2, 0],
    ]
  }, [imageScale, lineHeight])

  const angledLinePointsVerticalBottom = useMemo(() => {
    return [
      [imageScale[0] / 2, -imageScale[1] / 2, 0],
      [imageScale[0] / 2 + lineHeight, -imageScale[1] / 2, 0],
    ]
  }, [imageScale, lineHeight])

  const widthTextPosition = [0, imageScale[1] / 2 + fontSize, 0] // Position above the horizontal line
  const heightTextPosition = [imageScale[0] / 2 + fontSize + 0.05, 0, 0] // Position to the left of the vertical line// Position to the left of the vertical line

  return (
    <group>
      <group name="width" position={[0, 0.05, 0]}>
        <Line
          points={horizontalLinePoints}
          color={color}
          dashed={dashed}
          dashSize={dashSize}
          dashScale={dashScale}
          segments
          lineWidth={lineWidth}
        />
        <Text
          position={widthTextPosition}
          color={color}
          fontSize={fontSize}
          anchorX="center"
          anchorY="bottom"
        >
          Width
        </Text>
        <Line
          points={angledLinePointsHorizontalLeft}
          color={markerColor}
          lineWidth={lineWidth}
          position={[0, -lineHeight / 2, 0]}
        />
        <Line
          points={angledLinePointsHorizontalRight}
          color={markerColor}
          lineWidth={lineWidth}
          position={[0, -lineHeight / 2, 0]}
        />
      </group>
      <group name="height" position={[0.05, 0, 0]}>
        <Line
          points={linePoints}
          color={color}
          lineWidth={lineWidth}
          dashed={dashed}
          dashSize={dashSize}
          dashScale={dashScale}
          segments
        />
        <Text
          position={heightTextPosition}
          color={color}
          fontSize={fontSize}
          anchorX="center"
          anchorY="bottom"
          rotation={[0, 0, Math.PI / 2]}
        >
          Height
        </Text>
        <Line
          points={angledLinePointsVerticalTop}
          color={markerColor}
          lineWidth={lineWidth}
          position={[-lineHeight / 2, 0, 0]}
        />
        <Line
          points={angledLinePointsVerticalBottom}
          color={markerColor}
          lineWidth={lineWidth}
          position={[-lineHeight / 2, 0, 0]}
        />
      </group>
    </group>
  )
}
