import { FastifyTypedInstance } from '@/@types/fastify-typed-instance'
import { UserController } from '@/controllers/user-controller'
import { AppError } from '@/errors/app-error'
import { z } from 'zod'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { env } from '@/env'

cloudinary.config({
  cloud_name: env.API_CLOUD_NAME,
  api_key: env.API_CLOUD_KEY,
  api_secret: env.API_CLOUD_SECRET,
})

export const schemaUserRegister = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export type TschemaUserRegister = z.infer<typeof schemaUserRegister>

export function userRoutes(app: FastifyTypedInstance) {
  app.post(
    '/register',
    {
      schema: {
        tags: ['user'],
        description: 'Route to create a new user',
        body: schemaUserRegister,
        response: {
          201: z.null(),
        },
      },
      errorHandler: async (error) => {
        throw new AppError('bad request', error.statusCode)
      },
    },
    UserController.register,
  )

  app.post('/upload/avatar', async (req, reply) => {
    const data = await req.file()

    if (data === undefined) {
      return reply.status(400).send()
    }

    const uploadPromise = new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'avatars',
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        },
      )

      data.file.pipe(uploadStream)
    })

    try {
      const results = await uploadPromise
      const optimizeUrl = cloudinary.url(results.public_id, {
        transformation: [
          {
            fetch_format: 'auto',
            quality: 'auto',
          },
          {
            width: 128,
            height: 128,
          },
        ],
      })
      console.log(optimizeUrl)
      reply.send(results)
    } catch (error) {
      console.error(error)
      reply.status(500).send()
    }
  })

  app.post('/destroy/avatar', async (req, reply) => {
    await cloudinary.uploader.destroy('avatars/avatars/fe-blue.jpg')
    reply.send('apagado')
  })
}
