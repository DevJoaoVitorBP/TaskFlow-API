import { FastifyInstance } from 'fastify'
import { authenticate, requireAuth } from '../middlewares'
import { completeTaskController } from '../controllers/task/complete.controller'
import { createTaskController } from '../controllers/task/create.controller'
import { deleteTaskController } from '../controllers/task/delete.controller'
import { getTaskController } from '../controllers/task/get.controller'
import { listTasksController } from '../controllers/task/list.controller'
import { updateTaskController } from '../controllers/task/update.controller'

export async function taskRoutes(app: FastifyInstance) {
  // Todas as rotas de tarefas requerem autenticação
  app.post('/tasks', { preHandler: [authenticate, requireAuth] }, createTaskController)
  app.get('/tasks', { preHandler: [authenticate, requireAuth] }, listTasksController)
  app.get('/tasks/:id', { preHandler: [authenticate, requireAuth] }, getTaskController)
  app.put('/tasks/:id', { preHandler: [authenticate, requireAuth] }, updateTaskController)
  app.delete('/tasks/:id', { preHandler: [authenticate, requireAuth] }, deleteTaskController)
  app.patch('/tasks/:id/complete', { preHandler: [authenticate, requireAuth] }, completeTaskController)
}
