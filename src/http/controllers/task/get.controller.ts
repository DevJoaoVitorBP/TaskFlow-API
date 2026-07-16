import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { getTaskByIdService } from '../../../services/task.service'

const getTaskParamsSchema = z.object({
  id: z.string().cuid('Invalid task ID'),
})

export async function getTaskController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = getTaskParamsSchema.parse(request.params)
  const userId = request.userId!

  const task = await getTaskByIdService(id, userId)

  return reply.status(200).send(task)
}
