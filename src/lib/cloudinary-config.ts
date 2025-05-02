import { v2 as cloudinary } from 'cloudinary'
import { env } from '@/env'

cloudinary.config({
  cloud_name: env.API_CLOUD_NAME,
  api_key: env.API_CLOUD_KEY,
  api_secret: env.API_CLOUD_SECRET,
})

export { cloudinary }
