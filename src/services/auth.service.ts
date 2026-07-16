import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { createUser, findUserByEmail } from '../repositories/user.repository'
import { AppError } from '../utils/errors'

export async function registerUser(name: string, email: string, password: string) {
  const existing = await findUserByEmail(email)
  if (existing) {
    throw new AppError('Email already in use', 409)
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await createUser({ name, email, password: hashedPassword })

  return { id: user.id, name: user.name, email: user.email }
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email)
  if (!user) {
    throw new AppError('Invalid credentials', 401)
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    throw new AppError('Invalid credentials', 401)
  }

  const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: '7d' })

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  }
}
