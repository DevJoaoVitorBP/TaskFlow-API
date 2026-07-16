import { FastifyInstance } from 'fastify'
import { authRoutes } from './auth.routes'
import { taskRoutes } from './task.routes'
import { dashboardRoutes } from './dashboard.routes'

export async function routes(app: FastifyInstance) {
  app.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Health check endpoint',
        description: 'Check if the API server is running and healthy. No authentication required.',
        response: {
          200: {
            description: 'Server is healthy',
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
        },
      },
    },
    async () => {
      return { status: 'ok', timestamp: new Date().toISOString() }
    },
  )

  await app.register(authRoutes)
  await app.register(taskRoutes)
  await app.register(dashboardRoutes)
}
