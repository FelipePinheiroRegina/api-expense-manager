import { FastifyRequest, FastifyReply } from 'fastify'
import { makeRegisterUseCase } from '@/use-cases/factories/users/make-register-use-case'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  // const bodySchema = z.object({
  //   name: z.string(),
  //   email: z.string(),
  //   password: z.string().min(6),
  // })

  // const { name, email, password } = bodySchema.parse(request.body)

  // const registerUseCase = makeRegisterUseCase()

  // const { user } = await registerUseCase.execute({
  //   name,
  //   email,
  //   password,
  // })

  return reply.status(201).send({ user })
}
