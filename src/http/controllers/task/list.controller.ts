import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getTasksService } from '../../../services/task.service'

const listTasksQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.string().optional(),
    priority: z.string().optional(),
    title: z.string().optional(),
    createdAfter: z.string().datetime().optional(),
    createdBefore: z.string().datetime().optional(),
  })
  .transform(data => ({
    ...data,
    status: data.status ? data.status.split(',').map(v => v.trim().toUpperCase()) : undefined,
    priority: data.priority ? data.priority.split(',').map(v => v.trim().toUpperCase()) : undefined,
  }))

export async function listTasksController(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.userId!

  const { page, limit, status, priority, title, createdAfter, createdBefore } =
    listTasksQuerySchema.parse(request.query)

  const result = await getTasksService(userId, page, limit, {
    status,
    priority,
    title,
    createdAfter: createdAfter ? new Date(createdAfter) : undefined,
    createdBefore: createdBefore ? new Date(createdBefore) : undefined,
  })

  return reply.status(200).send(result)
}
