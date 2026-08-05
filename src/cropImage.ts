export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  aspectRatio: number = 4/3
): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return ''
  }

  // Scale down maximum dimension to max 800px to ensure tiny payload size (~50KB per image)
  const MAX_DIMENSION = 800;
  let targetWidth = pixelCrop.width;
  let targetHeight = pixelCrop.height;

  if (targetWidth > MAX_DIMENSION || targetHeight > MAX_DIMENSION) {
    if (targetWidth > targetHeight) {
      targetHeight = Math.round((targetHeight * MAX_DIMENSION) / targetWidth);
      targetWidth = MAX_DIMENSION;
    } else {
      targetWidth = Math.round((targetWidth * MAX_DIMENSION) / targetHeight);
      targetHeight = MAX_DIMENSION;
    }
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  )

  // As Base64 string (~50KB - 80KB)
  return canvas.toDataURL('image/jpeg', 0.75)
}
