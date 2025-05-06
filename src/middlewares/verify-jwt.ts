import { FastifyRequest, FastifyReply } from 'fastify'

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify({ onlyCookie: true })
  } catch {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
