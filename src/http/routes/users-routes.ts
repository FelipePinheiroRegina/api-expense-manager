import { FastifyTypedInstance } from '@/@types/fastify-typed-instance'
import { register } from '../controllers/users/register'
import {
  userRegisterSchema,
  userSessionsTraditionalSchema,
} from '../zod-schemas/users'
import { z } from 'zod'
import { sessionsTraditional } from '../controllers/users/sessions-traditional'
import { sessionsGithub } from '../controllers/users/sessions-github'

// export const schemaUploadAvatar = z.object({
//   'content-type': z.string().includes('multipart/form-data'),
// })

export function usersRoutes(app: FastifyTypedInstance) {
  app.post(
    '/register',
    {
      schema: {
        tags: ['users'],
        description: 'Route to register a new user',
        body: userRegisterSchema,
        response: {
          201: z.null(),
        },
      },
    },
    register,
  )

  app.post(
    '/sessions/traditional',
    {
      schema: {
        tags: ['users'],
        description: 'Route to traditional login with email and password',
        body: userSessionsTraditionalSchema,
        response: {
          201: z.null(),
        },
      },
    },
    sessionsTraditional,
  )

  app.get(
    '/sessions/github/callback',
    {
      schema: {
        tags: ['users'],
        description: 'Route to redirect after github login',
        response: {
          201: z.null(),
        },
      },
    },
    sessionsGithub,
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
