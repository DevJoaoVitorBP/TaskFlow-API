import fastify from 'fastify'
import cors from '@fastify/cors'
import { ZodError } from 'zod'
import { AppError } from './utils/errors'
import { routes } from './http/routes'

export async function buildApp() {
  const app = fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  })

  await app.register(cors, {
    origin: true,
  })

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ error: error.message })
    }

    if (error instanceof ZodError) {
      return reply.status(422).send({
        error: 'Validation error',
        issues: error.flatten().fieldErrors,
      })
    }

    app.log.error(error)
    return reply.status(500).send({ error: 'Internal server error' })
  })

  await app.register(routes)

  return app
}
