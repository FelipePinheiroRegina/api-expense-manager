import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { UnauthorizedError } from '@/errors/unauthorized-error'
import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import bcryptjs from 'bcryptjs'

interface SessionsTraditionalUseCaseRequest {
  email: string
  password: string
}

interface SessionsTraditionalUseCaseResponse {
  user: User
}

export class SessionsTraditionalUseCase {
  constructor(private userRepositories: UsersRepository) {}

  async execute({
    email,
    password,
  }: SessionsTraditionalUseCaseRequest): Promise<SessionsTraditionalUseCaseResponse> {
    const user = await this.userRepositories.findByEmail(email)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const passwordMatches = await bcryptjs.compare(password, user.password_hash)

    if (!passwordMatches) {
      throw new UnauthorizedError()
    }

    return { user }
  }
}
