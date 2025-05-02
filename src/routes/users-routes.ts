import { FastifyTypedInstance } from '@/@types/fastify-typed-instance'
import { register } from '@/controllers/users/register'
import { z } from 'zod'

export const schemaUserRegister = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export type SchemaUserRegister = z.infer<typeof schemaUserRegister>

export const schemaUploadAvatar = z.object({
  'content-type': z.string().includes('multipart/form-data'),
})

export function userRoutes(app: FastifyTypedInstance) {
  app.post(
    '/register',
    {
      schema: {
        tags: ['users'],
        summary: 'Route to create a new user',
        description: 'Route to create a new user',
        body: schemaUserRegister,
        response: {
          201: z.null(),
        },
      },
    },
    register,
  )

  // app.post(
  //   '/upload/avatar',
  //   {
  //     schema: {
  //       tags: ['user'],
  //       summary: 'Avatar upload',
  //       description:
  //         'Upload an avatar image to cloudinary. This resource expects a multipart/formdata with the ( key: avatar ) and the ( value: file) of type png, jpeg, webp. Max a 5 MB',
  //       response: {
  //         201: z.object({
  //           message: z.literal('Upload successfully'),
  //         }),
  //         400: z.object({
  //           message: z.string(),
  //         }),
  //       },
  //     },
  //   },
  //   UserController.uploadAvatar,
  // )
}
