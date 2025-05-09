import { it, expect, describe, beforeEach } from 'vitest'
import { GetAllTransactionsUseCase } from './get-all-transactions'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { randomUUID } from 'node:crypto'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidParamsError } from '@/errors/invalid-params-error'

let transactionsRepository: InMemoryTransactionsRepository
let usersRepository: InMemoryUsersRepository
let getAllTransactionsUseCase: GetAllTransactionsUseCase

describe('Get All Transactions Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    usersRepository = new InMemoryUsersRepository()
    getAllTransactionsUseCase = new GetAllTransactionsUseCase(
      transactionsRepository,
      usersRepository,
    )
  })

  it('should be able to get all transactions by userId, paged', async () => {
    const user = await usersRepository.register({
      name: 'user-1',
      email: 'user@1.com',
    })

    for (let c = 1; c <= 32; c++) {
      transactionsRepository.transactions.push({
        id: randomUUID(),
        title: `Transaction-${c}`,
        amount_in_cents: c * 10000,
        type: 'INCOME',
        description: null,
        user_id: user.id,
        created_at: new Date(Date.now() + c * 1000),
        updated_at: new Date(),
      })
    }

    const user2 = await usersRepository.register({
      name: 'user-2',
      email: 'user@2.com',
    })
    for (let c = 1; c <= 10; c++) {
      transactionsRepository.transactions.push({
        id: randomUUID(),
        title: `Transaction-${c}`,
        amount_in_cents: c * 10000,
        type: 'INCOME',
        description: null,
        user_id: user2.id,
        created_at: new Date(Date.now() + c * 1000),
        updated_at: new Date(),
      })
    }

    const { transactions, total } = await getAllTransactionsUseCase.execute({
      userId: user.id,
      page: 4,
    })

    expect(total).toBe(32)
    expect(transactions?.length).toBe(2)
    expect(transactions).toEqual([
      expect.objectContaining({
        title: 'Transaction-31',
        user_id: user.id,
      }),
      expect.objectContaining({
        title: 'Transaction-32',
        user_id: user.id,
      }),
    ])
  })

  it('should not be able to get all transactions without valid userId', async () => {
    await expect(() =>
      getAllTransactionsUseCase.execute({
        userId: 'non-exists-id',
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to get all transactions passing page less than 1', async () => {
    const user = await usersRepository.register({
      name: 'user-1',
      email: 'user@1.com',
    })

    for (let c = 1; c <= 10; c++) {
      transactionsRepository.transactions.push({
        id: randomUUID(),
        title: `Transaction-${c}`,
        amount_in_cents: c * 10000,
        type: 'INCOME',
        description: null,
        user_id: user.id,
        created_at: new Date(Date.now() + c * 1000),
        updated_at: new Date(),
      })
    }
    await expect(() =>
      getAllTransactionsUseCase.execute({
        userId: user.id,
        page: 0,
      }),
    ).rejects.toBeInstanceOf(InvalidParamsError)
  })
})
