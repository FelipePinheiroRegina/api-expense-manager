import { FastifyInstance } from 'fastify'
import { userRoutes } from './user-routes'
import { authRoutes } from './auth-routes'

export async function AppRoutes(app: FastifyInstance) {
  app.register(userRoutes, { prefix: '/user' })
  app.register(authRoutes, { prefix: '/auth' })
}
