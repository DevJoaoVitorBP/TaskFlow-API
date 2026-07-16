import { FastifyInstance } from 'fastify'
import { authRoutes } from './auth.routes'

export async function routes(app: FastifyInstance) {
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  await app.register(authRoutes)
}
