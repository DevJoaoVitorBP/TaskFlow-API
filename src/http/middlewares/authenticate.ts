import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../../config/env'

interface JwtPayload {
  sub: string
  iat: number
  exp: number
}

/**
 * Middleware de autenticação JWT
 * Extrai o token do header Authorization e valida sua assinatura e expiração
 * Se o token for válido, anexa o userId ao request para uso posterior
 * Se inválido ou expirado, retorna 401 Unauthorized
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    reply.status(401).send({
      error: 'Missing authorization header',
      code: 'MISSING_AUTH_HEADER',
    })
    return
  }

  if (!authHeader.startsWith('Bearer ')) {
    reply.status(401).send({
      error: 'Invalid authorization format. Expected: Bearer <token>',
      code: 'INVALID_AUTH_FORMAT',
    })
    return
  }

  const token = authHeader.slice(7).trim()

  if (!token) {
    reply.status(401).send({
      error: 'Empty token provided',
      code: 'EMPTY_TOKEN',
    })
    return
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload

    // Anexa o userId ao request para uso em controllers e serviços
    request.userId = payload.sub

    // Adiciona informações úteis ao request (opcional)
    request.tokenExpiry = new Date(payload.exp * 1000)
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      reply.status(401).send({
        error: 'Token has expired',
        code: 'TOKEN_EXPIRED',
        expiresAt: error.expiredAt,
      })
      return
    }

    if (error instanceof jwt.JsonWebTokenError) {
      reply.status(401).send({
        error: 'Invalid token signature or format',
        code: 'INVALID_TOKEN',
      })
      return
    }

    reply.status(401).send({
      error: 'Token validation failed',
      code: 'TOKEN_VALIDATION_FAILED',
    })
  }
}
