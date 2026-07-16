import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as taskService from '../../../src/services/task.service'
import * as taskRepository from '../../../src/repositories/task.repository'
import { TaskPriority, TaskStatus } from '../../../generated/prisma/enums'
import { AppError } from '../../../src/utils/errors'

// Mock das dependências
vi.mock('../../../src/repositories/task.repository')

const mockUserId = 'user-123'
const mockTaskId = 'task-456'

const createMockTask = (overrides = {}) => ({
  id: mockTaskId,
  title: 'Test Task',
  description: 'Test Description',
  priority: 'MEDIUM' as TaskPriority,
  status: 'TODO' as TaskStatus,
  userId: mockUserId,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

describe('TaskService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createTaskService', () => {
    it('should create a task successfully', async () => {
      const mockTask = createMockTask()

      vi.mocked(taskRepository.createTask).mockResolvedValueOnce(mockTask)

      const result = await taskService.createTaskService(mockUserId, {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'MEDIUM' as TaskPriority,
      })

      expect(result).toEqual(mockTask)
      expect(taskRepository.createTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'MEDIUM',
        userId: mockUserId,
      })
    })
  })

  describe('getTaskByIdService', () => {
    it('should get a task by id successfully', async () => {
      const mockTask = createMockTask()

      vi.mocked(taskRepository.getTaskById).mockResolvedValueOnce(mockTask)

      const result = await taskService.getTaskByIdService(mockTaskId, mockUserId)

      expect(result).toEqual(mockTask)
      expect(taskRepository.getTaskById).toHaveBeenCalledWith(mockTaskId, mockUserId)
    })

    it('should throw error when task does not exist', async () => {
      vi.mocked(taskRepository.getTaskById).mockResolvedValueOnce(null)

      await expect(
        taskService.getTaskByIdService(mockTaskId, mockUserId)
      ).rejects.toThrow(AppError)

      try {
        await taskService.getTaskByIdService(mockTaskId, mockUserId)
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        expect((error as AppError).message).toBe('Task not found')
        expect((error as AppError).statusCode).toBe(404)
      }
    })
  })

  describe('getTasksService', () => {
    it('should list tasks successfully', async () => {
      const mockTasks = [
        createMockTask(),
        createMockTask({ id: 'task-789', title: 'Another Task' }),
      ]

      const mockResult = {
        data: mockTasks,
        page: 1,
        totalPages: 1,
        totalItems: 2,
      }

      vi.mocked(taskRepository.getTasksByUserId).mockResolvedValueOnce(mockResult)

      const result = await taskService.getTasksService(mockUserId, 1, 10)

      expect(result).toEqual(mockResult)
      expect(result.data).toHaveLength(2)
      expect(taskRepository.getTasksByUserId).toHaveBeenCalledWith(mockUserId, 1, 10, undefined)
    })
  })

  describe('updateTaskService', () => {
    it('should update a task successfully', async () => {
      const mockTask = createMockTask()
      const updatedTask = createMockTask({ title: 'Updated Task' })

      vi.mocked(taskRepository.getTaskById)
        .mockResolvedValueOnce(mockTask)
        .mockResolvedValueOnce(updatedTask)
      vi.mocked(taskRepository.updateTask).mockResolvedValueOnce({ count: 1 })

      const result = await taskService.updateTaskService(mockTaskId, mockUserId, {
        title: 'Updated Task',
      })

      expect(result).toEqual(updatedTask)
      expect(taskRepository.updateTask).toHaveBeenCalledWith(
        mockTaskId,
        mockUserId,
        { title: 'Updated Task' }
      )
    })

    it('should throw error when task does not exist', async () => {
      vi.mocked(taskRepository.getTaskById).mockResolvedValueOnce(null)

      await expect(
        taskService.updateTaskService(mockTaskId, mockUserId, { title: 'Updated' })
      ).rejects.toThrow(AppError)
    })

    it('should throw error when update fails', async () => {
      const mockTask = createMockTask()

      vi.mocked(taskRepository.getTaskById).mockResolvedValueOnce(mockTask)
      vi.mocked(taskRepository.updateTask).mockResolvedValueOnce({ count: 0 })

      try {
        await taskService.updateTaskService(mockTaskId, mockUserId, { title: 'Updated' })
        throw new Error('Should have thrown AppError')
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        expect((error as AppError).message).toBe('Failed to update task')
        expect((error as AppError).statusCode).toBe(500)
      }
    })
  })

  describe('deleteTaskService', () => {
    it('should delete a task successfully', async () => {
      const mockTask = createMockTask()

      vi.mocked(taskRepository.getTaskById).mockResolvedValueOnce(mockTask)
      vi.mocked(taskRepository.deleteTask).mockResolvedValueOnce({ count: 1 })

      const result = await taskService.deleteTaskService(mockTaskId, mockUserId)

      expect(result).toEqual({ message: 'Task deleted successfully' })
      expect(taskRepository.deleteTask).toHaveBeenCalledWith(mockTaskId, mockUserId)
    })

    it('should throw error when task does not exist', async () => {
      vi.mocked(taskRepository.getTaskById).mockResolvedValueOnce(null)

      await expect(
        taskService.deleteTaskService(mockTaskId, mockUserId)
      ).rejects.toThrow(AppError)
    })

    it('should throw error when delete fails', async () => {
      const mockTask = createMockTask()

      vi.mocked(taskRepository.getTaskById).mockResolvedValueOnce(mockTask)
      vi.mocked(taskRepository.deleteTask).mockResolvedValueOnce({ count: 0 })

      try {
        await taskService.deleteTaskService(mockTaskId, mockUserId)
        throw new Error('Should have thrown AppError')
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        expect((error as AppError).message).toBe('Failed to delete task')
        expect((error as AppError).statusCode).toBe(500)
      }
    })
  })

  describe('completeTaskService', () => {
    it('should mark a task as completed successfully', async () => {
      const mockTask = createMockTask()
      const completedTask = createMockTask({ status: 'DONE' as TaskStatus })

      vi.mocked(taskRepository.getTaskById)
        .mockResolvedValueOnce(mockTask)
        .mockResolvedValueOnce(completedTask)
      vi.mocked(taskRepository.completeTask).mockResolvedValueOnce({ count: 1 })

      const result = await taskService.completeTaskService(mockTaskId, mockUserId)

      expect(result.status).toBe('DONE')
      expect(taskRepository.completeTask).toHaveBeenCalledWith(mockTaskId, mockUserId)
    })

    it('should throw error when user tries to access another users task', async () => {
      vi.mocked(taskRepository.getTaskById).mockResolvedValueOnce(null)

      await expect(
        taskService.completeTaskService(mockTaskId, 'other-user-id')
      ).rejects.toThrow(AppError)

      try {
        await taskService.completeTaskService(mockTaskId, 'other-user-id')
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        expect((error as AppError).message).toBe('Task not found')
        expect((error as AppError).statusCode).toBe(404)
      }
    })

    it('should throw error when complete task fails', async () => {
      const mockTask = createMockTask()

      vi.mocked(taskRepository.getTaskById).mockResolvedValueOnce(mockTask)
      vi.mocked(taskRepository.completeTask).mockResolvedValueOnce({ count: 0 })

      try {
        await taskService.completeTaskService(mockTaskId, mockUserId)
        throw new Error('Should have thrown AppError')
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        expect((error as AppError).message).toBe('Failed to complete task')
        expect((error as AppError).statusCode).toBe(500)
      }
    })
  })
})
