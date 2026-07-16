import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/testdb',
      JWT_SECRET: 'test-secret-key-for-testing-purposes-only-min32chars',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'generated/',
        'tests/',
        '**/*.d.ts',
        '**/types/',
        '**/mocks/',
        '**/config/env.ts',
        '**/lib/prisma.ts',
        '**/lib/swagger.ts',
        'src/http/**',
        'src/app.ts',
        'src/server.ts',
        'src/repositories/**',
      ],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
    include: ['tests/**/*.{test,spec}.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
