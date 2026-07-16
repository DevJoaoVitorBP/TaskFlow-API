import { FastifyReply, FastifyRequest } from 'fastify'

/**
 * Middleware que valida se o usuário está autenticado
 * Deve ser usado APÓS o middleware authenticate() na cadeia
 * Retorna 401 se o userId não estiver presente no request
 */
export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (!request.userId) {
    reply.status(401).send({
      error: 'Unauthorized. Please provide a valid token.',
      code: 'UNAUTHORIZED',
    })
    return
  }
}
