import { FastifyInstance } from 'fastify'
import { authenticate, requireAuth } from '../middlewares'
import { completeTaskController } from '../controllers/task/complete.controller'
import { createTaskController } from '../controllers/task/create.controller'
import { deleteTaskController } from '../controllers/task/delete.controller'
import { getTaskController } from '../controllers/task/get.controller'
import { listTasksController } from '../controllers/task/list.controller'
import { updateTaskController } from '../controllers/task/update.controller'

const taskSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    description: { type: ['string', 'null'] },
    status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'] },
    priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    userId: { type: 'string' },
  },
}

export async function taskRoutes(app: FastifyInstance) {
  // Create a new task
  app.post(
    '/tasks',
    {
      preHandler: [authenticate, requireAuth],
      schema: {
        tags: ['Tasks'],
        summary: 'Create a new task',
        description:
          'Create a new task for the authenticated user. Title is required, description and priority are optional.',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Task title',
            },
            description: {
              type: 'string',
              maxLength: 1000,
              description: 'Task description (optional)',
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH'],
              description: 'Task priority level (default: MEDIUM)',
            },
          },
        },
        response: {
          201: {
            description: 'Task created successfully',
            ...taskSchema,
          },
        },
      },
    },
    createTaskController
  )

  // List all tasks with filters and pagination
  app.get(
    '/tasks',
    {
      preHandler: [authenticate, requireAuth],
      schema: {
        tags: ['Tasks'],
        summary: 'List user tasks',
        description:
          'Get paginated list of tasks for the authenticated user with optional filters by status, priority, title, and date range.',
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              minimum: 1,
              description: 'Page number for pagination',
            },
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              description: 'Number of items per page',
            },
            status: {
              type: 'string',
              description: 'Filter by status (comma-separated: TODO,IN_PROGRESS,DONE)',
            },
            priority: {
              type: 'string',
              description: 'Filter by priority (comma-separated: LOW,MEDIUM,HIGH)',
            },
            title: {
              type: 'string',
              description: 'Search by task title (case-insensitive partial match)',
            },
            createdAfter: {
              type: 'string',
              format: 'date-time',
              description: 'Filter tasks created after this date',
            },
            createdBefore: {
              type: 'string',
              format: 'date-time',
              description: 'Filter tasks created before this date',
            },
          },
        },
        response: {
          200: {
            description: 'List of tasks retrieved successfully',
            type: 'object',
            properties: {
              tasks: {
                type: 'array',
                items: taskSchema,
              },
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'integer' },
                  limit: { type: 'integer' },
                  totalItems: { type: 'integer' },
                  totalPages: { type: 'integer' },
                  hasNextPage: { type: 'boolean' },
                  hasPrevPage: { type: 'boolean' },
                },
              },
            },
          },
        },
      },
    },
    listTasksController
  )

  // Get a single task by ID
  app.get(
    '/tasks/:id',
    {
      preHandler: [authenticate, requireAuth],
      schema: {
        tags: ['Tasks'],
        summary: 'Get task details',
        description: 'Retrieve detailed information about a specific task by ID.',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {
              type: 'string',
              description: 'Task ID (CUID)',
            },
          },
        },
        response: {
          200: {
            description: 'Task retrieved successfully',
            ...taskSchema,
          },
        },
      },
    },
    getTaskController
  )

  // Update a task
  app.put(
    '/tasks/:id',
    {
      preHandler: [authenticate, requireAuth],
      schema: {
        tags: ['Tasks'],
        summary: 'Update a task',
        description:
          'Update one or more fields of a task. All fields are optional. Only provided fields will be updated.',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {
              type: 'string',
              description: 'Task ID (CUID)',
            },
          },
        },
        body: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Task title',
            },
            description: {
              type: 'string',
              maxLength: 1000,
              description: 'Task description',
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH'],
              description: 'Task priority level',
            },
            status: {
              type: 'string',
              enum: ['TODO', 'IN_PROGRESS', 'DONE'],
              description: 'Task status',
            },
          },
        },
        response: {
          200: {
            description: 'Task updated successfully',
            ...taskSchema,
          },
        },
      },
    },
    updateTaskController
  )

  // Delete a task
  app.delete(
    '/tasks/:id',
    {
      preHandler: [authenticate, requireAuth],
      schema: {
        tags: ['Tasks'],
        summary: 'Delete a task',
        description: 'Permanently delete a task. This action cannot be undone.',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {
              type: 'string',
              description: 'Task ID (CUID)',
            },
          },
        },
        response: {
          200: {
            description: 'Task deleted successfully',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    deleteTaskController
  )

  // Mark a task as complete
  app.patch(
    '/tasks/:id/complete',
    {
      preHandler: [authenticate, requireAuth],
      schema: {
        tags: ['Tasks'],
        summary: 'Mark task as complete',
        description:
          'Mark a task as DONE. This is a convenience endpoint that sets status to DONE.',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {
              type: 'string',
              description: 'Task ID (CUID)',
            },
          },
        },
        response: {
          200: {
            description: 'Task marked as complete successfully',
            ...taskSchema,
          },
        },
      },
    },
    completeTaskController
  )
}
