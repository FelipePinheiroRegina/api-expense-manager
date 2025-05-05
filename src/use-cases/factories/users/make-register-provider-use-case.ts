import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterProviderUseCase } from '@/use-cases/users/register-provider'

export function makeRegisterProviderUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const registerProviderUseCase = new RegisterProviderUseCase(
    prismaUsersRepository,
  )

  return registerProviderUseCase
}
