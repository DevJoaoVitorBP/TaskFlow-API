import { TaskPriority, TaskStatus } from '../../generated/prisma/enums'
import { prisma } from '../lib/prisma'

export async function createTask(data: {
  title: string
  description?: string
  priority: TaskPriority
  userId: string
}) {
  return prisma.task.create({
    data,
  })
}

export async function getTaskById(id: string, userId: string) {
  return prisma.task.findFirst({
    where: { id, userId },
  })
}

export async function getTasksByUserId(userId: string, page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit

  const [tasks, totalItems] = await Promise.all([
    prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.task.count({
      where: { userId },
    }),
  ])

  const totalPages = Math.ceil(totalItems / limit)

  return {
    data: tasks,
    page,
    totalPages,
    totalItems,
  }
}

export async function updateTask(
  id: string,
  userId: string,
  data: {
    title?: string
    description?: string
    priority?: TaskPriority
    status?: TaskStatus
  }
) {
  return prisma.task.updateMany({
    where: { id, userId },
    data,
  })
}

export async function deleteTask(id: string, userId: string) {
  return prisma.task.deleteMany({
    where: { id, userId },
  })
}

export async function completeTask(id: string, userId: string) {
  return prisma.task.updateMany({
    where: { id, userId },
    data: { status: 'DONE' as TaskStatus },
  })
}
