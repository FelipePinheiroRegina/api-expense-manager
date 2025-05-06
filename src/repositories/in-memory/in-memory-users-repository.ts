import { randomUUID } from 'node:crypto'
import { UsersRepository } from '../users-repository'
import { Prisma, User } from '@prisma/client'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async register(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash ?? null,
      avatar: data.avatar ?? null,
      provider: data.provider ?? null,
      provider_id: data.provider_id ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.users.push(user)

    return user
  }

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email) ?? null
  }
}
