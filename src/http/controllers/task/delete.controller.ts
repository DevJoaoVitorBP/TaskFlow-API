import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { deleteTaskService } from '../../../services/task.service'

const deleteTaskParamsSchema = z.object({
  id: z.string().cuid('Invalid task ID'),
})

export async function deleteTaskController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = deleteTaskParamsSchema.parse(request.params)
  const userId = request.userId!

  const result = await deleteTaskService(id, userId)

  return reply.status(200).send(result)
}
