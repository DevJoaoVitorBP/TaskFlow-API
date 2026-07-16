import { vi } from 'vitest'

export const mockPrismaClient = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  task: {
    create: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    updateMany: vi.fn(),
    deleteMany: vi.fn(),
  },
}

export type MockPrismaClient = typeof mockPrismaClient
