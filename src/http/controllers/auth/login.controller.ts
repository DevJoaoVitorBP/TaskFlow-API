import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { loginUser } from '../../../services/auth.service'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function loginController(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = loginSchema.parse(request.body)
  const result = await loginUser(email, password)
  return reply.status(200).send(result)
}
