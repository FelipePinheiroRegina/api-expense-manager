import { UsersRepository } from '@/repositories/users-repository'

interface RegisterProviderUseCaseRequest {
  provider: string
  provider_id: string
  name: string
  email: string
  password: string | null
  avatar: string | null
}

interface RegisterProviderUseCaseResponse {
  user: UserDTO
}

export class RegisterProviderUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    provider,
    provider_id,
    avatar,
  }: RegisterProviderUseCaseRequest): Promise<RegisterProviderUseCaseResponse> {
    const emailAlreadyExists = await this.usersRepository.findByEmail(email)

    if (emailAlreadyExists) {
      return { user: emailAlreadyExists }
    }

    const user = await this.usersRepository.register({
      name,
      email,
      password_hash: password,
      avatar,
      provider,
      provider_id,
    })

    return { user }
  }
}
