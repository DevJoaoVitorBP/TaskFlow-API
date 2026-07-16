import { prisma } from '../lib/prisma'

export async function getDashboardStats(userId: string) {
  // Consulta otimizada: agrupa todas as contagens em uma única query
  const [totalTasks, completedTasks, pendingTasks] = await Promise.all([
    // Total de tarefas do usuário
    prisma.task.count({
      where: { userId },
    }),
    // Tarefas concluídas (status = DONE)
    prisma.task.count({
      where: { userId, status: 'DONE' },
    }),
    // Tarefas pendentes (status = TODO ou IN_PROGRESS)
    prisma.task.count({
      where: { userId, status: { in: ['TODO', 'IN_PROGRESS'] } },
    }),
  ])

  // Calcula a taxa de conclusão
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate: Math.round(completionRate * 100) / 100, // Arredonda para 2 casas decimais
  }
}
