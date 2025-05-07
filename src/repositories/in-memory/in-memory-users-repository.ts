import { randomUUID } from 'node:crypto'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: UserDTO[] = []

  async register(data: UserCreateDTO) {
    const user: UserDTO = {
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

  async findById(userId: string) {
    return this.users.find((user) => user.id === userId) ?? null
  }
}
