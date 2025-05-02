import { OAuth2Namespace } from '@fastify/oauth2'

declare module 'fastify' {
  interface FastifyInstance {
    githubOAuth2: OAuth2Namespace
  }
  interface FastifyRequest {
    user: {
      id: string
      iat: number // Data de criação do token (em Unix timestamp)
      exp: number // Data de expiração do token (em Unix timestamp)
    }
  }
}
