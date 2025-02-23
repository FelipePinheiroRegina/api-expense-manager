import { FastifyTypedInstance } from '@/@types/fastify-typed-instance'
import { UserController } from '@/controllers/user-controller'
import { AppError } from '@/errors/app-error'
import { z } from 'zod'
import { v2 as cloudinary } from 'cloudinary'
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
        tags: ['users'],
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
    try {
      const data = await req.file()

      if (data === undefined) {
        return reply.status(400).send()
      }

      const buffer = await data.toBuffer()

      cloudinary.uploader
        .upload_stream(
          {
            public_id: `avatars/${data.filename}`,
            resource_type: 'image',
            folder: 'avatars',
          },
          (error, result) => {
            if (error) {
              return reply
                .status(500)
                .send({ error: 'Error uploading to Cloudinary' })
            }
            console.log(result)
            reply.send(result)
          },
        )
        .end(buffer)
    } catch (error) {
      console.error(error)
      reply.status(500).send({ error: 'Error processing file' })
    }
  })
}
