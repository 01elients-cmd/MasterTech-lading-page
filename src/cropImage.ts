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
  aspectRatio: number = 4/3,
  maxDimension: number = 1920,
  quality: number = 0.92
): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return ''
  }

  // Preserve high resolution up to maxDimension (default 1920px for HD displays)
  let targetWidth = pixelCrop.width;
  let targetHeight = pixelCrop.height;

  if (maxDimension > 0 && (targetWidth > maxDimension || targetHeight > maxDimension)) {
    if (targetWidth > targetHeight) {
      targetHeight = Math.round((targetHeight * maxDimension) / targetWidth);
      targetWidth = maxDimension;
    } else {
      targetWidth = Math.round((targetWidth * maxDimension) / targetHeight);
      targetHeight = maxDimension;
    }
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Use high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

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

  // High quality JPEG (0.92 for crystal-clear HD imagery)
  return canvas.toDataURL('image/jpeg', quality)
}
