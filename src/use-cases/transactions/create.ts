import bcrypt from 'bcryptjs'
import { Transaction } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { EmailAlreadyExistsError } from '@/errors/email-already-exists-error'

interface CreateTransactionUseCaseRequest {
  name: string
  email: string
  password: string
}

interface CreateTransactionUseCaseResponse {
  transaction: Transaction
}

export class CreateTransactionUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const emailAlreadyExists = await this.usersRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError()
    }

    const password_hash = await bcrypt.hash(password, 6)

    const user = await this.usersRepository.register({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
