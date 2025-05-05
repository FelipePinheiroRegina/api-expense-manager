import { FastifyRequest, FastifyReply } from 'fastify'
import { makeRegisterUseCase } from '@/use-cases/factories/users/make-register-use-case'
import { UserRegisterSchema } from '@/http/zod-schemas/users'
import { EmailAlreadyExistsError } from '@/errors/email-already-exists-error'

export async function register(
  request: FastifyRequest<{ Body: UserRegisterSchema }>,
  reply: FastifyReply,
) {
  const { name, email, password } = request.body

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      name,
      email,
      password,
    })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      const statusCode = error.getStatusCode()
      return reply.status(statusCode).send({ message: error.message })
    }

    throw error
  }
}
