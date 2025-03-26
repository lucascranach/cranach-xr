/**
 * Calculates the real-life dimensions of a painting based on available data
 * @param {Object} structuredDimension - Object containing height and width in centimeters
 * @param {Array} imageDimensions - Array [width, height] representing image dimensions/aspect ratio
 * @returns {Object} - The calculated dimensions {width, height, aspectRatio} in the appropriate scale for Three.js
 */
export const calculatePaintingDimensions = (
  structuredDimension,
  imageDimensions
) => {
  // Extract values - dimensions are in centimeters
  const { height: recordedHeightCm, width: recordedWidthCm } =
    structuredDimension || {}
  const [imageWidth, imageHeight] = imageDimensions || []

  // Scale factor to convert cm to appropriate Three.js units (1cm = 0.01 units)
  const cmToUnits = 0.01

  // Calculate image aspect ratio if both dimensions exist
  const imageAspectRatio =
    imageWidth && imageHeight ? imageWidth / imageHeight : null

  let finalWidth, finalHeight, aspectRatio

  // Case 1: Both height and width are provided in cm
  if (recordedHeightCm && recordedWidthCm) {
    finalHeight = recordedHeightCm * cmToUnits
    finalWidth = recordedWidthCm * cmToUnits
    aspectRatio = finalWidth / finalHeight
  }
  // Case 2: Only height is provided, calculate width using aspect ratio
  else if (recordedHeightCm && imageAspectRatio) {
    finalHeight = recordedHeightCm * cmToUnits
    finalWidth = finalHeight * imageAspectRatio
    aspectRatio = imageAspectRatio
  }
  // Case 3: Only width is provided, calculate height using aspect ratio
  else if (recordedWidthCm && imageAspectRatio) {
    finalWidth = recordedWidthCm * cmToUnits
    finalHeight = finalWidth / imageAspectRatio
    aspectRatio = imageAspectRatio
  }
  // Case 4: No metadata dimensions, use image dimensions with a default scale
  else if (imageAspectRatio) {
    // Default to 50cm height if no real dimensions are available
    finalHeight = 50 * cmToUnits
    finalWidth = finalHeight * imageAspectRatio
    aspectRatio = imageAspectRatio
  }
  // Case 5: No usable data at all
  else {
    console.warn("No dimension data available for painting")
    finalHeight = 50 * cmToUnits // Default fallback of 50cm
    finalWidth = 40 * cmToUnits // Default fallback of 40cm
    aspectRatio = finalWidth / finalHeight
  }

  return {
    width: finalWidth,
    height: finalHeight,
    aspectRatio,
  }
}
