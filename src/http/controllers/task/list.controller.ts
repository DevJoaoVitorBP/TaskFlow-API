import { FastifyReply, FastifyRequest } from 'fastify'
import { getTasksService } from '../../../services/task.service'

export async function listTasksController(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.userId!

  const tasks = await getTasksService(userId)

  return reply.status(200).send(tasks)
}
