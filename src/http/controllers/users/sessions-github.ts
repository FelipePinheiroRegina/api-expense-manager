import { FastifyReply, FastifyRequest } from 'fastify'
import { app } from '@/app'
import { apiGithub } from '@/lib/axios'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InvalidToken } from '@/errors/invalid-token-error'
import { makeRegisterProviderUseCase } from '@/use-cases/factories/users/make-register-provider-use-case'
import { env } from '@/env'

export interface UserGithub {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  user_view_type: string
  site_admin: boolean
  name: string | null
  company: string | null
  blog: string
  location: string | null
  email: string | null
  hireable: boolean | null
  bio: string | null
  twitter_username: string | null
  notification_email: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
  private_gists: number
  total_private_repos: number
  owned_private_repos: number
  disk_usage: number
  collaborators: number
  two_factor_authentication: boolean
  plan: {
    name: string
    space: number
    collaborators: number
    private_repos: number
  }
}

export interface EmailGithub {
  email: string
  primary: boolean
  verified: boolean
  visibility: 'private' | 'public' | null
}

export type EmailsGithub = EmailGithub[]

export async function sessionsGithub(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const githubToken = (
      await app.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
    ).token.access_token

    if (!githubToken) {
      throw new InvalidToken()
    }

    const { data: userGithub } = await apiGithub.get<UserGithub>('user', {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    })

    const { data: emailsGithub } = await apiGithub.get<EmailsGithub>(
      'user/emails',
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
      },
    )

    if (!userGithub || !emailsGithub?.[0].email) {
      throw new ResourceNotFoundError()
    }

    const registerProviderUseCase = makeRegisterProviderUseCase()

    const { user } = await registerProviderUseCase.execute({
      email: emailsGithub[0].email,
      name: userGithub.name ?? userGithub.login,
      password: null,
      avatar: userGithub.avatar_url,
      provider: 'github',
      provider_id: userGithub.id.toString(),
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

    reply.setCookie('access_token', access_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    })

    reply.redirect(env.FRONTEND_URL)
  } catch (error) {
    if (error instanceof InvalidToken) {
      const statusCode = error.getStatusCode()
      return reply.status(statusCode).send({ message: error.message })
    }

    if (error instanceof ResourceNotFoundError) {
      const statusCode = error.getStatusCode()
      return reply.status(statusCode).send({ message: error.message })
    }

    throw error
  }
}
