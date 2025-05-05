import { FastifyInstance } from 'fastify'
import { usersRoutes } from './users-routes'

export async function AppRoutes(app: FastifyInstance) {
  app.register(usersRoutes, { prefix: '/users' })
}
