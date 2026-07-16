import { getDashboardStats } from '../repositories/dashboard.repository'

export async function getDashboardStatsService(userId: string) {
  const stats = await getDashboardStats(userId)
  return stats
}
