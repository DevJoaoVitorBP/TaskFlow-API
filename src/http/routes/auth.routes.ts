import { FastifyInstance } from 'fastify'
import { loginController } from '../controllers/auth/login.controller'
import { registerController } from '../controllers/auth/register.controller'

export async function authRoutes(app: FastifyInstance) {
  app.post(
    '/auth/register',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        description:
          'Create a new user account with email and password. Email must be unique. Password must be at least 6 characters.',
        body: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              description: 'User full name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address (must be unique)',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password (minimum 6 characters)',
            },
          },
        },
        response: {
          201: {
            description: 'User created successfully',
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  createdAt: { type: 'string' },
                },
              },
            },
          },
          400: {
            description: 'Email already registered',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    registerController,
  )

  app.post(
    '/auth/login',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'User login',
        description:
          'Authenticate user with email and password. Returns JWT token for subsequent authenticated requests.',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              description: 'User password',
            },
          },
        },
        response: {
          200: {
            description: 'Login successful',
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  createdAt: { type: 'string' },
                },
              },
              token: { type: 'string' },
            },
          },
          401: {
            description: 'Invalid email or password',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    loginController,
  )
}
