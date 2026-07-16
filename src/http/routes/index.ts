import { FastifyInstance } from 'fastify'

export async function routes(app: FastifyInstance) {
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })
}
