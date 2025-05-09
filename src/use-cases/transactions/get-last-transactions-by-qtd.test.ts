import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { it, expect, describe, beforeEach } from 'vitest'
import { GetLastTransactionsByQtdUseCase } from './get-last-transactions-by-qtd'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { randomUUID } from 'node:crypto'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let transactionsRepository: InMemoryTransactionsRepository
let getLastTransactionsByQtd: GetLastTransactionsByQtdUseCase

describe('Get Last Transactions By Qtd Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    transactionsRepository = new InMemoryTransactionsRepository()

    getLastTransactionsByQtd = new GetLastTransactionsByQtdUseCase(
      transactionsRepository,
      usersRepository,
    )
  })

  it('should be able to get last transactions by qtd provided', async () => {
    const user = await usersRepository.register({
      name: 'user-1',
      email: 'user@1.com',
    })

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

    const { transactions } = await getLastTransactionsByQtd.execute({
      userId: user.id,
      qtd: 10,
    })

    expect(transactions).toHaveLength(10)

    if (transactions) {
      transactions.forEach((transaction) => {
        expect(transaction.user_id).toBe(user.id)
      })

      for (let i = 0; i < transactions.length - 1; i++) {
        expect(transactions[i].created_at.getTime()).toBeLessThanOrEqual(
          transactions[i + 1].created_at.getTime(),
        )
      }
    }
  })

  it('should be able to limit the get if the user sends a qtd greater than 20', async () => {
    const user = await usersRepository.register({
      name: 'user-1',
      email: 'user@1.com',
    })

    for (let c = 1; c <= 25; c++) {
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

    const { transactions } = await getLastTransactionsByQtd.execute({
      userId: user.id,
      qtd: 25,
    })

    expect(transactions).toHaveLength(20)
  })

  it('should not be able to get last transactions by qtd provided without valid user id', async () => {
    await expect(() =>
      getLastTransactionsByQtd.execute({
        userId: 'non-exists-id',
        qtd: 10,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
