/**
 * Calculates the image scale based on painting data.
 *
 * @param {object} paintingData - The data object containing painting dimensions and image information.
 * @returns {[number, number]} - An array containing the calculated width and height.
 */
export const calculateImageScale = (paintingData) => {
  const height = paintingData.structuredDimension?.height
  const width = paintingData.structuredDimension?.width

  const dimensions = [
    paintingData.images.overall.images[0].sizes.medium.dimensions.width / 100,
    paintingData.images.overall.images[0].sizes.medium.dimensions.height / 100,
  ]

  let calculatedWidth = width ? width / 100 : null // Convert cm to meters
  let calculatedHeight = height ? height / 100 : null // Convert cm to meters

  if (!calculatedWidth && calculatedHeight) {
    calculatedWidth = calculatedHeight * (dimensions[0] / dimensions[1])
  } else if (calculatedWidth && !calculatedHeight) {
    calculatedHeight = calculatedWidth * (dimensions[1] / dimensions[0])
  } else if (!calculatedWidth && !calculatedHeight) {
    calculatedWidth = dimensions[0] || 0.4
    calculatedHeight = dimensions[1] || 0.5
  }

  return [calculatedWidth, calculatedHeight]
}
