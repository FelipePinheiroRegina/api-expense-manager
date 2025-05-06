import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { it, expect, describe, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { EmailAlreadyExistsError } from '@/errors/email-already-exists-error'

let usersRepository: InMemoryUsersRepository
let registerUseCase: RegisterUseCase

describe('Register User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(usersRepository)
  })

  it('should be able to register a user', async () => {
    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'jho@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to encrypt the user password', async () => {
    const password = '123456'

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'jho@email.com',
      password,
    })

    const passwordTurnedHash = password !== user.password_hash

    expect(passwordTurnedHash).toBe(true)
  })

  it('should not be able to register twice same email', async () => {
    await registerUseCase.execute({
      name: 'John Doe',
      email: 'jho@email.com',
      password: '123456',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email: 'jho@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })
})
