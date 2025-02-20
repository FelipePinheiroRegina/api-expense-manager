import fastifyOauth2 from '@fastify/oauth2'
import { env } from '@/env'
import { FastifyInstance } from 'fastify'

export async function githubOauthPlugin(app: FastifyInstance) {
  app.register(fastifyOauth2, {
    name: 'githubOAuth2',
    scope: [],
    credentials: {
      client: {
        id: env.CLIENT_ID,
        secret: env.CLIENT_SECRET,
      },
      auth: fastifyOauth2.GITHUB_CONFIGURATION,
    },
    startRedirectPath: '/auth/github',
    callbackUri: 'http://localhost:3000/auth/github/callback',
  })
}
