import { FastifyRequest, FastifyReply } from 'fastify'
import { getDashboardStatsService } from '../../../services/dashboard.service'

export async function getDashboardStatsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { userId } = request
  const stats = await getDashboardStatsService(userId)

  return reply.code(200).send(stats)
}
