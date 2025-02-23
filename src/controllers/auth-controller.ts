import { FastifyRequest, FastifyReply } from 'fastify'
import { app } from '@/app'
import { authService } from '@/services/auth-service'
import { TschemaUserTraditionalLogin } from '@/routes/auth-routes'

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

    reply.redirect('http://localhost:5173')
  }

  static async traditional(
    request: FastifyRequest<{ Body: TschemaUserTraditionalLogin }>,
    reply: FastifyReply,
  ) {
    const { email, password } = request.body
    const { access_token } = await authService({ email, password })

    reply.setCookie('access_token', access_token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias - clean code
    })

    reply.status(200).send()
  }
}
