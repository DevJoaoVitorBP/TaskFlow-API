import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { updateTaskService } from '../../../services/task.service'

const updateTaskSchema = z.object({
  id: z.string().cuid('Invalid task ID'),
})

const updateTaskBodySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters')
    .optional(),
  description: z.string().max(1000, 'Description must not exceed 1000 characters').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
})

export async function updateTaskController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = updateTaskSchema.parse(request.params)
  const data = updateTaskBodySchema.parse(request.body)
  const userId = request.userId!

  const task = await updateTaskService(id, userId, data as Parameters<typeof updateTaskService>[2])

  return reply.status(200).send(task)
}
