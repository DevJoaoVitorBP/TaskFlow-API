import { FastifyInstance } from 'fastify'
import { loginController } from '../controllers/auth/login.controller'
import { registerController } from '../controllers/auth/register.controller'

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', registerController)
  app.post('/auth/login', loginController)
}
