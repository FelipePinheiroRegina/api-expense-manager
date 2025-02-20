import jwt from 'jsonwebtoken'
import { env } from '@/env'

export function generateToken(id: string) {
  return jwt.sign({ id }, env.SECRET_KEY_COOKIE, {
    expiresIn: '7d',
  })
}
