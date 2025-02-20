import { FastifyRequest, FastifyReply } from 'fastify'
import { app } from '@/app'
import { AppError } from '@/errors/app-error'
import { z } from 'zod'
import { authService } from '@/services/auth-service'

export class AuthController {
  static async github(request: FastifyRequest, reply: FastifyReply) {
    const { access_token } = (
      await app.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
    ).token

    reply.setCookie('access_token', access_token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias - clean code
    })

    reply.status(200).send()
  }

  static async traditional(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      email: z.string(),
      password: z.string().min(6),
    })

    const data = bodySchema.safeParse(request.body)

    if (!data.success) {
      throw new AppError('e-mail and password are required', 411)
    }

    const { email, password } = data.data

    const { access_token } = await authService({ email, password })

    reply.setCookie('access_token', access_token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias - clean code
    })

    reply.status(200).send()
  }
}
