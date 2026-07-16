import { TaskPriority, TaskStatus } from '../../generated/prisma/enums'
import {
  completeTask,
  createTask,
  deleteTask,
  getTaskById,
  getTasksByUserId,
  updateTask,
} from '../repositories/task.repository'
import { AppError } from '../utils/errors'

export async function createTaskService(
  userId: string,
  data: {
    title: string
    description?: string
    priority: TaskPriority
  },
) {
  const task = await createTask({
    ...data,
    userId,
  })

  return task
}

export async function getTaskByIdService(id: string, userId: string) {
  const task = await getTaskById(id, userId)

  if (!task) {
    throw new AppError('Task not found', 404)
  }

  return task
}

export async function getTasksService(
  userId: string,
  page: number = 1,
  limit: number = 10,
  filters?: {
    status?: string[]
    priority?: string[]
    title?: string
    createdAfter?: Date
    createdBefore?: Date
  },
) {
  const result = await getTasksByUserId(userId, page, limit, filters)
  return result
}

export async function updateTaskService(
  id: string,
  userId: string,
  data: {
    title?: string
    description?: string
    priority?: TaskPriority
    status?: TaskStatus
  },
) {
  // Verifica se a tarefa existe e pertence ao usuário
  const task = await getTaskById(id, userId)
  if (!task) {
    throw new AppError('Task not found', 404)
  }

  // Executa a atualização
  const result = await updateTask(id, userId, data)

  // Retorna a tarefa atualizada
  if (result.count === 0) {
    throw new AppError('Failed to update task', 500)
  }

  const updatedTask = await getTaskById(id, userId)
  return updatedTask
}

export async function deleteTaskService(id: string, userId: string) {
  // Verifica se a tarefa existe e pertence ao usuário
  const task = await getTaskById(id, userId)
  if (!task) {
    throw new AppError('Task not found', 404)
  }

  // Executa a exclusão
  const result = await deleteTask(id, userId)

  if (result.count === 0) {
    throw new AppError('Failed to delete task', 500)
  }

  return { message: 'Task deleted successfully' }
}

export async function completeTaskService(id: string, userId: string) {
  // Verifica se a tarefa existe e pertence ao usuário
  const task = await getTaskById(id, userId)
  if (!task) {
    throw new AppError('Task not found', 404)
  }

  // Marca a tarefa como concluída
  const result = await completeTask(id, userId)

  if (result.count === 0) {
    throw new AppError('Failed to complete task', 500)
  }

  const completedTask = await getTaskById(id, userId)
  return completedTask
}
