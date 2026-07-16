import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createTaskService } from '../../../services/task.service'

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must not exceed 255 characters'),
  description: z.string().max(1000, 'Description must not exceed 1000 characters').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
})

export async function createTaskController(request: FastifyRequest, reply: FastifyReply) {
  const { title, description, priority } = createTaskSchema.parse(request.body)
  const userId = request.userId!

  const task = await createTaskService(userId, {
    title,
    description,
    priority: priority as any,
  })

  return reply.status(201).send(task)
}
