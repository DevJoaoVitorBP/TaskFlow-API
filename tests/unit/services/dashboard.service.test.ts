import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as dashboardService from '../../../src/services/dashboard.service'
import * as dashboardRepository from '../../../src/repositories/dashboard.repository'

// Mock das dependências
vi.mock('../../../src/repositories/dashboard.repository')

const mockUserId = 'user-123'

describe('DashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getDashboardStatsService', () => {
    it('should return correct statistics with tasks', async () => {
      const mockStats = {
        totalTasks: 10,
        completedTasks: 7,
        pendingTasks: 3,
        completionRate: 70.0,
      }

      vi.mocked(dashboardRepository.getDashboardStats).mockResolvedValueOnce(mockStats)

      const result = await dashboardService.getDashboardStatsService(mockUserId)

      expect(result).toEqual(mockStats)
      expect(result.totalTasks).toBe(10)
      expect(result.completedTasks).toBe(7)
      expect(result.pendingTasks).toBe(3)
      expect(result.completionRate).toBe(70.0)
      expect(dashboardRepository.getDashboardStats).toHaveBeenCalledWith(mockUserId)
    })

    it('should return zero statistics for user without tasks', async () => {
      const mockStats = {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        completionRate: 0,
      }

      vi.mocked(dashboardRepository.getDashboardStats).mockResolvedValueOnce(mockStats)

      const result = await dashboardService.getDashboardStatsService(mockUserId)

      expect(result).toEqual(mockStats)
      expect(result.totalTasks).toBe(0)
      expect(result.completedTasks).toBe(0)
      expect(result.pendingTasks).toBe(0)
      expect(result.completionRate).toBe(0)
    })
  })
})
