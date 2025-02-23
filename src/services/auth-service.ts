import bcrypt from 'bcrypt'
import { UserRepositories } from '@/repositories/user-repositories'
import { AppError } from '@/errors/app-error'
import { generateToken } from '@/lib/json-web-token'
interface IUserAuth {
  email: string
  password: string
}

export async function authService({
  email,
  password,
}: IUserAuth): Promise<{ access_token: string }> {
  if (!email || !password) {
    throw new AppError('email, password are required', 411)
  }

  const bringUser = await UserRepositories.findByEmail({ email })

  if (!bringUser) {
    throw new AppError('user not found', 404)
  }

  const validate = await bcrypt.compare(password, bringUser.password_hash)

  if (!validate) {
    throw new AppError('email or password invalid', 401)
  }

  const access_token = generateToken(bringUser.id)
  return { access_token }
}
