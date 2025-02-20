import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../errors/app-error'

export function errorHandler(
  err: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (err instanceof AppError) {
    return reply.status(err.statusCode).send({
      status: 'error',
      message: err.message,
    })
  }

  console.error(err)

  return reply.status(500).send({
    status: 'error',
    message: 'Internal Server Error',
  })
}
