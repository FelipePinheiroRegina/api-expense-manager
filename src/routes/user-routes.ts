import { FastifyInstance } from 'fastify'
import { UserController } from '@/controllers/user-controller'

export function userRoutes(app: FastifyInstance) {
  app.post('/register', UserController.register)
}
