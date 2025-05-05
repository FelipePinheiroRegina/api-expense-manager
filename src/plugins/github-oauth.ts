import { FastifyTypedInstance } from '@/@types/fastify-typed-instance'
import fp from 'fastify-plugin'
import fastifyOauth2 from '@fastify/oauth2'
import { env } from '@/env'

async function githubOauthFunction(app: FastifyTypedInstance) {
  app.register(fastifyOauth2, {
    name: 'githubOAuth2',
    scope: ['read:user', 'user:email'],
    credentials: {
      client: {
        id: env.GITHUB_CLIENT_ID,
        secret: env.GITHUB_CLIENT_SECRET,
      },
      auth: fastifyOauth2.GITHUB_CONFIGURATION,
    },
    startRedirectPath: '/users/sessions/github',
    callbackUri: 'http://localhost:3000/users/sessions/github/callback',
    tags: ['users'],
  })
}

export const githubOauthPlugin = fp(githubOauthFunction)
