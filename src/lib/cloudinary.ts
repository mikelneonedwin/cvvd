import { v2 as cloudinary } from 'cloudinary'
import { env } from '../env'

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function uploadImageToCloudinary(
  fileBase64OrUrl: string,
  folder = 'cvvd/avatars',
): Promise<string> {
  const result = await cloudinary.uploader.upload(fileBase64OrUrl, {
    folder,
    resource_type: 'auto',
  })
  return result.secure_url
}

export { cloudinary }
