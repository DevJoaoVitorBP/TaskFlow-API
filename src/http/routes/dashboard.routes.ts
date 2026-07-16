import { FastifyInstance } from 'fastify'
import { authenticate, requireAuth } from '../middlewares'
import { getDashboardStatsController } from '../controllers/dashboard/stats.controller'

export async function dashboardRoutes(app: FastifyInstance) {
  app.get(
    '/dashboard',
    { preHandler: [authenticate, requireAuth] },
    getDashboardStatsController
  )
}
