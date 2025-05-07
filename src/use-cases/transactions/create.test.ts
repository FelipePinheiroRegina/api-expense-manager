import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { it, expect, describe, beforeEach } from 'vitest'
import { CreateTransactionUseCase } from './create'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { InMemoryCategoriesOnTransactionsRepository } from '@/repositories/in-memory/in-memory-categories-on-transactions-repository'
import { randomUUID } from 'node:crypto'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let categoriesRepository: InMemoryCategoriesRepository
let transactionsRepository: InMemoryTransactionsRepository
let categoriesOnTransactionsRepository: InMemoryCategoriesOnTransactionsRepository
let createTransactionUseCase: CreateTransactionUseCase

describe('Create Transaction Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    transactionsRepository = new InMemoryTransactionsRepository()
    categoriesOnTransactionsRepository =
      new InMemoryCategoriesOnTransactionsRepository()

    createTransactionUseCase = new CreateTransactionUseCase(
      transactionsRepository,
      usersRepository,
      categoriesRepository,
      categoriesOnTransactionsRepository,
    )
  })

  it('should be able to create a transaction', async () => {
    const userId = randomUUID()
    usersRepository.users.push({
      id: userId,
      name: 'John Doe',
      email: 'jhon@email.com',
      password_hash: null,
      avatar: null,
      provider: null,
      provider_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const categoryId1 = randomUUID()
    const categoryId2 = randomUUID()
    const categoryId3 = randomUUID()
    const newCategories = [
      {
        id: categoryId1,
        name: 'Food',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: categoryId2,
        name: 'Sport',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: categoryId3,
        name: 'Business',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]
    categoriesRepository.categories.push(...newCategories)

    const newTransaction: TransactionCreateDTO = {
      title: 'Transaction-1',
      amount_in_cents: Math.round(100 * 100),
      type: 'INCOME',
      description: null,
    }

    const { transaction, categories, categoriesOnTransactions } =
      await createTransactionUseCase.execute({
        data: newTransaction,
        userId,
        categoriesId: [categoryId1, categoryId2, categoryId3],
      })

    expect(transaction).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Transaction-1',
        type: 'INCOME',
        amount_in_cents: 10000,
        description: null,
        user_id: userId,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )

    expect(categories).toHaveLength(3)
    expect(categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: categoryId1, name: 'Food' }),
        expect.objectContaining({ id: categoryId2, name: 'Sport' }),
        expect.objectContaining({ id: categoryId3, name: 'Business' }),
      ]),
    )

    expect(categoriesOnTransactions).toHaveLength(3)
    categoriesOnTransactions.forEach((catOnTran) => {
      expect(catOnTran).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          category_id: expect.any(String),
          transaction_id: transaction.id,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        }),
      )
    })
  })

  it('should not be able to create a transaction without valid user', async () => {
    const newTransaction: TransactionCreateDTO = {
      title: 'Transaction-1',
      amount_in_cents: Math.round(100 * 100),
      type: 'INCOME',
      description: null,
    }

    await expect(() =>
      createTransactionUseCase.execute({
        data: newTransaction,
        userId: 'non-existent-id',
        categoriesId: ['non-existent-id', 'non-existent-id', 'non-existent-id'],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a transaction without valid categories', async () => {
    const userId = randomUUID()
    usersRepository.users.push({
      id: userId,
      name: 'John Doe',
      email: 'jhon@email.com',
      password_hash: null,
      avatar: null,
      provider: null,
      provider_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const newTransaction: TransactionCreateDTO = {
      title: 'Transaction-1',
      amount_in_cents: Math.round(100 * 100),
      type: 'INCOME',
      description: null,
    }

    await expect(() =>
      createTransactionUseCase.execute({
        data: newTransaction,
        userId,
        categoriesId: ['non-existent-id', 'non-existent-id', 'non-existent-id'],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  //   it('should not be able to register twice same email', async () => {
  //     await registerUseCase.execute({
  //       name: 'John Doe',
  //       email: 'jho@email.com',
  //       password: '123456',
  //     })

  //     await expect(() =>
  //       registerUseCase.execute({
  //         name: 'John Doe',
  //         email: 'jho@email.com',
  //         password: '123456',
  //       }),
  //     ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  //   })
})
