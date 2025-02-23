import { FastifyTypedInstance } from '@/@types/fastify-typed-instance'
import fp from 'fastify-plugin'
import fastifyOauth2 from '@fastify/oauth2'
import { env } from '@/env'

async function githubOauthFunction(app: FastifyTypedInstance) {
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

  app.get(
    '/login/github',
    {
      schema: {
        tags: ['auth'],
        description: 'Route to redirect user to login of the github',
      },
    },
    (req, reply) => {
      app.githubOAuth2.generateAuthorizationUri(
        req,
        reply,
        (err, authorizationEndpoint) => {
          if (err) console.error(err)
          reply.redirect(authorizationEndpoint)
        },
      )
    },
  )
}

export const githubOauthPlugin = fp(githubOauthFunction)
