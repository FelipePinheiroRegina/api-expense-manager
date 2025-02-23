import { AuthController } from '@/controllers/auth-controller'
import { z } from 'zod'
import { FastifyTypedInstance } from '@/@types/fastify-typed-instance'
import { AppError } from '@/errors/app-error'

export const schemaUserTraditionalLogin = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type TschemaUserTraditionalLogin = z.infer<
  typeof schemaUserTraditionalLogin
>

export function authRoutes(app: FastifyTypedInstance) {
  app.get(
    '/github/callback',
    {
      schema: {
        tags: ['auth'],
        description:
          'Route to login with your github account. This feature is about delegating the login functionality to third-party software, which, when successfully carried out, calls the callback route, passing a cookie to the backend to save in the reply headers and redirecting the user to the address / of the app',
      },
    },
    AuthController.github,
  )

  app.post(
    '/traditional',
    {
      schema: {
        tags: ['auth'],
        description: 'Route to traditional login',
        body: schemaUserTraditionalLogin,
        response: {
          201: z.null(),
        },
      },
      errorHandler: (error) => {
        throw new AppError(error.message, error.statusCode)
      },
    },
    AuthController.traditional,
  )
}
