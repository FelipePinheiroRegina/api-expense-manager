import { FastifyRequest, FastifyReply } from 'fastify'
import { userRegisterService } from '@/services/user/user-register-service'
import { TschemaUserRegister } from '@/routes/user-routes'
export class UserController {
  static async register(
    request: FastifyRequest<{ Body: TschemaUserRegister }>,
    reply: FastifyReply,
  ) {
    const { name, email, password } = request.body

    await userRegisterService({ name, email, password })

    return reply.status(201).send()
  }
}
