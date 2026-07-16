import { FastifyInstance } from 'fastify'
import { authenticate, requireAuth } from '../middlewares'
import { getDashboardStatsController } from '../controllers/dashboard/stats.controller'

export async function dashboardRoutes(app: FastifyInstance) {
  app.get(
    '/dashboard',
    {
      preHandler: [authenticate, requireAuth],
      schema: {
        tags: ['Dashboard'],
        summary: 'Get dashboard statistics',
        description:
          'Retrieve task statistics for the authenticated user including total tasks, completed tasks, pending tasks, and completion rate percentage.',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Dashboard statistics retrieved successfully',
            type: 'object',
            properties: {
              totalTasks: {
                type: 'integer',
                description: 'Total number of tasks',
              },
              completedTasks: {
                type: 'integer',
                description: 'Number of completed tasks',
              },
              pendingTasks: {
                type: 'integer',
                description: 'Number of pending (TODO or IN_PROGRESS) tasks',
              },
              completionRate: {
                type: 'number',
                description: 'Task completion rate as percentage (0-100)',
              },
            },
          },
        },
      },
    },
    getDashboardStatsController,
  )
}
