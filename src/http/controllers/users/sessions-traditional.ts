import { FastifyRequest, FastifyReply } from 'fastify'
import { UserSessionsTraditionalSchema } from '@/http/zod-schemas/users'
import { makeSessionsTraditionalUseCase } from '@/use-cases/factories/users/make-sessions-traditional-use-case'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { UnauthorizedError } from '@/errors/unauthorized-error'

export async function sessionsTraditional(
  request: FastifyRequest<{ Body: UserSessionsTraditionalSchema }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body

  try {
    const sessionsTraditionalUseCase = makeSessionsTraditionalUseCase()

    const { user } = await sessionsTraditionalUseCase.execute({
      email,
      password,
    })

    const access_token = await reply.jwtSign(
      {
        //role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return reply.status(201).send({ access_token })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      const statusCode = error.getStatusCode()
      return reply.status(statusCode).send({ message: error.message })
    }

    if (error instanceof UnauthorizedError) {
      const statusCode = error.getStatusCode()
      return reply.status(statusCode).send({ message: error.message })
    }

    throw error
  }
}
