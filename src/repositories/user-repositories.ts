import { IUserDB } from '@/@types/user'
import { prisma } from '@/lib/prisma'

export class UserRepositories {
  static async register({
    name,
    email,
    password_hash,
  }: Pick<IUserDB, 'name' | 'email' | 'password_hash'>): Promise<void> {
    await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
    })
  }

  static async findByEmail({ email }: Pick<IUserDB, 'email'>) {
    return await prisma.user.findUnique({ where: { email } })
  }
}
