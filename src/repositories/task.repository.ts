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

export async function getTasksByUserId(
  userId: string,
  page: number = 1,
  limit: number = 10,
  filters?: {
    status?: string[]
    priority?: string[]
    title?: string
    createdAfter?: Date
    createdBefore?: Date
  }
) {
  const skip = (page - 1) * limit

  // Constrói o objeto 'where' dinamicamente com os filtros
  const where: any = { userId }

  // Filtro de status: se fornecido, filtra por um ou mais statuses
  if (filters?.status && filters.status.length > 0) {
    where.status = { in: filters.status }
  }

  // Filtro de priority: se fornecido, filtra por uma ou mais prioridades
  if (filters?.priority && filters.priority.length > 0) {
    where.priority = { in: filters.priority }
  }

  // Filtro de title: busca case-insensitive (contains)
  if (filters?.title) {
    where.title = { contains: filters.title, mode: 'insensitive' }
  }

  // Filtro de createdAt: suporta range (após e antes)
  if (filters?.createdAfter || filters?.createdBefore) {
    where.createdAt = {}
    if (filters.createdAfter) {
      where.createdAt.gte = filters.createdAfter
    }
    if (filters.createdBefore) {
      where.createdAt.lte = filters.createdBefore
    }
  }

  const [tasks, totalItems] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.task.count({
      where,
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
