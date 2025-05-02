// import { UserRepositories } from '@/repositories/users-repository'
// import { AppError } from '@/errors/app-error'
// import { MultipartFile } from '@fastify/multipart'
// import { z } from 'zod'
// import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'
// import { cloudinary } from '@/lib/cloudinary-config'
// import { Readable } from 'node:stream'

// const validateFile = z.object({
//   mimetype: z.enum(['image/jpeg', 'image/png', 'image/webp']),
//   fieldname: z.literal('avatar'),
//   type: z.literal('file'),
//   file: z.instanceof(Readable),
// })

// export async function uploadAvatarService(data: MultipartFile | undefined) {
//   const result = validateFile.safeParse(data)
//   if (!result.success) {
//     throw new AppError(`${result.error?.issues[0].message}`, 400)
//   }

//   const { file } = result.data
//   const uploadPromise = new Promise<UploadApiResponse>((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: 'avatars',
//       },
//       (
//         error: UploadApiErrorResponse | undefined,
//         result: UploadApiResponse | undefined,
//       ) => {
//         if (error) {
//           reject(error)
//         } else if (result) {
//           resolve(result)
//         }
//       },
//     )

//     file.pipe(uploadStream)
//   })

//   try {
//     //await cloudinary.uploader.destroy('avatars/fmxtzyiis4kjpbxh0vb2')
//     const results = await uploadPromise
//     const optimizeUrl = cloudinary.url(results.public_id, {
//       transformation: [
//         {
//           fetch_format: 'auto',
//           quality: 'auto',
//         },
//         {
//           width: 128,
//           height: 128,
//         },
//       ],
//     })
//     console.log(optimizeUrl)
//   } catch (error) {
//     console.error(error)
//     throw new AppError('Could not upload', 500)
//   }
// }
