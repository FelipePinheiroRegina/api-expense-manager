import bcrypt from 'bcrypt'
import { UserRepositories } from '@/repositories/user-repositories'
import { AppError } from '@/errors/app-error'
import { TschemaUserRegister } from '@/routes/user-routes'

export async function userRegisterService({
  name,
  email,
  password,
}: TschemaUserRegister) {
  const emailAlreadyExists = await UserRepositories.findByEmail({ email })

  if (emailAlreadyExists) {
    throw new AppError('Email already exists', 409)
  }

  const password_hash = await bcrypt.hash(password, 6)

  await UserRepositories.register({ name, email, password_hash })
}
