import { FastifyInstance } from 'fastify'
import { AuthController } from '@/controllers/auth-controller'

export function authRoutes(app: FastifyInstance) {
  app.get('/github/callback', AuthController.github)
  app.post('/traditional', AuthController.traditional)
}
