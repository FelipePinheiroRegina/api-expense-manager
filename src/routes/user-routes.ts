import { FastifyTypedInstance } from '@/@types/fastify-typed-instance'
import { UserController } from '@/controllers/user-controller'
import { z } from 'zod'

export const schemaBodyRegisterUser = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export type TSBodyRegisterUser = z.infer<typeof schemaBodyRegisterUser>

export function userRoutes(app: FastifyTypedInstance) {
  app.post(
    '/register',
    {
      schema: {
        tags: ['users'],
        description: 'Route to create a new user',
        body: schemaBodyRegisterUser,
      },
    },
    UserController.register,
  )
}
