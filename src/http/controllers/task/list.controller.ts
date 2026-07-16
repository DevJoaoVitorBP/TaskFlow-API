import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getTasksService } from '../../../services/task.service'

const listTasksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

export async function listTasksController(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.userId!

  const { page, limit } = listTasksQuerySchema.parse(request.query)

  const result = await getTasksService(userId, page, limit)

  return reply.status(200).send(result)
}
