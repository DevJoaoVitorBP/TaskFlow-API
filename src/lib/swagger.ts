import { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export async function setupSwagger(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'TaskFlow API',
        description:
          'REST API for task management built with Fastify, TypeScript, and Prisma. Complete task management system with user authentication, task CRUD operations, and dashboard statistics.',
        version: '1.0.0',
        contact: {
          name: 'TaskFlow Support',
        },
        license: {
          name: 'ISC',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
        {
          url: 'https://api.taskflow.com',
          description: 'Production server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT Authorization header using Bearer scheme',
          },
        },
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'User unique identifier (CUID)',
                example: 'clh1a2b3c4d5e6f7g8h9i0jk',
              },
              name: {
                type: 'string',
                description: 'User full name',
                example: 'João Silva',
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'User email address',
                example: 'joao@example.com',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'User creation timestamp',
                example: '2026-07-16T10:30:00.000Z',
              },
            },
          },
          Task: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'Task unique identifier (CUID)',
                example: 'clh2a2b3c4d5e6f7g8h9i0jk',
              },
              title: {
                type: 'string',
                description: 'Task title (1-255 characters)',
                example: 'Complete project documentation',
              },
              description: {
                type: 'string',
                nullable: true,
                description: 'Task description (optional, max 1000 characters)',
                example: 'Need to write comprehensive documentation for the API',
              },
              status: {
                type: 'string',
                enum: ['TODO', 'IN_PROGRESS', 'DONE'],
                description: 'Current task status',
                example: 'IN_PROGRESS',
              },
              priority: {
                type: 'string',
                enum: ['LOW', 'MEDIUM', 'HIGH'],
                description: 'Task priority level',
                example: 'HIGH',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Task creation timestamp',
                example: '2026-07-16T10:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Task last update timestamp',
                example: '2026-07-16T15:30:00.000Z',
              },
              userId: {
                type: 'string',
                description: 'ID of the user who owns the task',
                example: 'clh1a2b3c4d5e6f7g8h9i0jk',
              },
            },
          },
          AuthResponse: {
            type: 'object',
            properties: {
              user: {
                $ref: '#/components/schemas/User',
              },
              token: {
                type: 'string',
                description: 'JWT access token for authenticated requests',
                example:
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbGgxYTJiM2M0ZDVlNmY3ZzhoOWkwamsiLCJpYXQiOjE2ODczMjAwMDAsImV4cCI6MTY4NzQwNjQwMH0.rBLtOKC9K2GH2nZ6qM3pZ9L8qZ9L8qZ9L8qZ9L8qZ9L8',
              },
            },
          },
          DashboardStats: {
            type: 'object',
            properties: {
              totalTasks: {
                type: 'integer',
                description: 'Total number of tasks',
                example: 25,
              },
              completedTasks: {
                type: 'integer',
                description: 'Number of completed tasks',
                example: 15,
              },
              pendingTasks: {
                type: 'integer',
                description: 'Number of pending (TODO or IN_PROGRESS) tasks',
                example: 10,
              },
              completionRate: {
                type: 'number',
                description: 'Task completion rate as percentage (0-100)',
                example: 60.0,
              },
            },
          },
          TasksListResponse: {
            type: 'object',
            properties: {
              tasks: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Task',
                },
                description: 'Array of tasks for the current page',
              },
              pagination: {
                type: 'object',
                properties: {
                  page: {
                    type: 'integer',
                    description: 'Current page number',
                    example: 1,
                  },
                  limit: {
                    type: 'integer',
                    description: 'Items per page',
                    example: 10,
                  },
                  totalItems: {
                    type: 'integer',
                    description: 'Total number of items',
                    example: 25,
                  },
                  totalPages: {
                    type: 'integer',
                    description: 'Total number of pages',
                    example: 3,
                  },
                  hasNextPage: {
                    type: 'boolean',
                    description: 'Whether there is a next page',
                    example: true,
                  },
                  hasPrevPage: {
                    type: 'boolean',
                    description: 'Whether there is a previous page',
                    example: false,
                  },
                },
              },
            },
          },
          Error: {
            type: 'object',
            properties: {
              error: {
                type: 'string',
                description: 'Error message',
                example: 'Invalid credentials',
              },
              code: {
                type: 'string',
                description: 'Error code for programmatic handling',
                example: 'INVALID_CREDENTIALS',
              },
            },
          },
          ValidationError: {
            type: 'object',
            properties: {
              error: {
                type: 'string',
                example: 'Validation error',
              },
              issues: {
                type: 'object',
                description: 'Field validation errors',
                example: {
                  email: ['Invalid email address'],
                  password: ['Password must have at least 6 characters'],
                },
              },
            },
          },
        },
      },
      tags: [
        {
          name: 'Health',
          description: 'System health endpoints',
        },
        {
          name: 'Authentication',
          description: 'User authentication endpoints',
        },
        {
          name: 'Tasks',
          description: 'Task management endpoints (require JWT authorization)',
        },
        {
          name: 'Dashboard',
          description: 'Dashboard and statistics endpoints (require JWT authorization)',
        },
      ],
    },
  })

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    logoUrl: 'https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png',
  })
}
