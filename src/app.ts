import fastify from 'fastify'
import cors from '@fastify/cors'
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

  await app.register(routes)

  return app
}
