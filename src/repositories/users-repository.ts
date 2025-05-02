import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  register(data: Prisma.UserCreateInput): Promise<User>
}
