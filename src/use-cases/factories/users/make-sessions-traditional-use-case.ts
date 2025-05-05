import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { SessionsTraditionalUseCase } from '@/use-cases/users/sessions-traditional'

export function makeSessionsTraditionalUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const sessionsTraditionalUseCase = new SessionsTraditionalUseCase(
    prismaUsersRepository,
  )

  return sessionsTraditionalUseCase
}
