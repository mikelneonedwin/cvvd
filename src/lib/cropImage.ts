export async function getCroppedImageDataUrl(options: {
  imageSrc: string
  crop: { x: number; y: number; width: number; height: number }
  outputSize?: number
  mimeType?: 'image/jpeg' | 'image/png'
  quality?: number
}): Promise<string> {
  const {
    imageSrc,
    crop,
    outputSize = 512,
    mimeType = 'image/jpeg',
    quality = 0.92,
  } = options

  const image = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = outputSize
  canvas.height = outputSize

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not create canvas context for image crop')
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, outputSize, outputSize)

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputSize,
    outputSize,
  )

  return canvas.toDataURL(mimeType, quality)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () =>
      reject(new Error('Failed to load image for cropping')),
    )
    image.crossOrigin = 'anonymous'
    image.src = src
  })
}
