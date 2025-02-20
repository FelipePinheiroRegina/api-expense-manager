import { FastifyRequest, FastifyReply } from 'fastify'
import { userRegisterService } from '@/services/user/user-register-service'
import { z } from 'zod'

export class UserController {
  static async register(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string().min(6),
    })

    const { name, email, password } = bodySchema.parse(request.body)

    await userRegisterService({ name, email, password })

    return reply.status(201).send()
  }
}
