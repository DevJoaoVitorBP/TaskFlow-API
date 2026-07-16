import { FastifyInstance } from 'fastify'
import { authRoutes } from './auth.routes'
import { taskRoutes } from './task.routes'
import { dashboardRoutes } from './dashboard.routes'

export async function routes(app: FastifyInstance) {
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  await app.register(authRoutes)
  await app.register(taskRoutes)
  await app.register(dashboardRoutes)
}
