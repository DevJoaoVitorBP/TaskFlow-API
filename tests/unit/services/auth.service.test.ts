import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as authService from '../../../src/services/auth.service'
import * as userRepository from '../../../src/repositories/user.repository'
import { mockPrismaClient } from '../../mocks/prisma'
import { AppError } from '../../../src/utils/errors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock das dependências
vi.mock('../../../src/repositories/user.repository')
vi.mock('bcryptjs')
vi.mock('jsonwebtoken')

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(userRepository.findUserByEmail).mockResolvedValueOnce(null)
      vi.mocked(bcrypt.hash).mockResolvedValueOnce('hashed-password' as never)
      vi.mocked(userRepository.createUser).mockResolvedValueOnce(mockUser)

      const result = await authService.registerUser('John Doe', 'john@example.com', 'password123')

      expect(result).toEqual({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
      })
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith('john@example.com')
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
      expect(userRepository.createUser).toHaveBeenCalled()
    })

    it('should throw error when email already exists', async () => {
      const existingUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(userRepository.findUserByEmail).mockResolvedValueOnce(existingUser)

      try {
        await authService.registerUser('John Doe', 'john@example.com', 'password123')
        throw new Error('Should have thrown AppError')
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        expect((error as AppError).message).toBe('Email already in use')
        expect((error as AppError).statusCode).toBe(409)
      }
    })
  })

  describe('loginUser', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2a$10$encrypted_password_hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(userRepository.findUserByEmail).mockResolvedValueOnce(mockUser)
      vi.mocked(bcrypt.compare).mockResolvedValueOnce(true as never)
      vi.mocked(jwt.sign).mockReturnValueOnce('jwt-token' as never)

      const result = await authService.loginUser('john@example.com', 'password123')

      expect(result).toHaveProperty('token')
      expect(result.token).toBe('jwt-token')
      expect(result.user).toEqual({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
      })
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith('john@example.com')
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password)
      expect(jwt.sign).toHaveBeenCalled()
    })

    it('should throw error when password is incorrect', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2a$10$invalid_hash_that_wont_match',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(userRepository.findUserByEmail).mockResolvedValueOnce(mockUser)
      vi.mocked(bcrypt.compare).mockResolvedValueOnce(false as never)

      try {
        await authService.loginUser('john@example.com', 'wrongpassword')
        throw new Error('Should have thrown AppError')
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        expect((error as AppError).message).toBe('Invalid credentials')
        expect((error as AppError).statusCode).toBe(401)
      }
    })

    it('should throw error when user does not exist', async () => {
      vi.mocked(userRepository.findUserByEmail).mockResolvedValueOnce(null)

      try {
        await authService.loginUser('nonexistent@example.com', 'password123')
        throw new Error('Should have thrown AppError')
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        expect((error as AppError).message).toBe('Invalid credentials')
        expect((error as AppError).statusCode).toBe(401)
      }
    })
  })
})

