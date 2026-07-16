import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { registerUser } from '../../../services/auth.service'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must have at least 6 characters'),
})

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerSchema.parse(request.body)
  const user = await registerUser(name, email, password)
  return reply.status(201).send({ user })
}
