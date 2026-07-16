import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { completeTaskService } from '../../../services/task.service'

const completeTaskParamsSchema = z.object({
  id: z.string().cuid('Invalid task ID'),
})

export async function completeTaskController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = completeTaskParamsSchema.parse(request.params)
  const userId = request.userId!

  const task = await completeTaskService(id, userId)

  return reply.status(200).send(task)
}
