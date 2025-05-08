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

  // it('should be able to update a transaction, add and remove some categories', async () => {
  //   const transactionId = randomUUID()
  //   transactionsRepository.transactions.push({
  //     id: transactionId,
  //     title: 'Transaction-1',
  //     amount_in_cents: Math.round(100 * 100),
  //     type: 'INCOME',
  //     description: null,

  //     user_id: randomUUID(),

  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   })

  //   const updateTransaction = {
  //     title: 'Transaction-updated',
  //     amount_in_cents: Math.round(500 * 100),
  //     type: 'OUTCOME',
  //     description: 'Transaction-updated',
  //   }

  //   const categoryId1 = randomUUID()
  //   const categoryId2 = randomUUID()
  //   const categoryId3 = randomUUID()
  //   const newCategories = [
  //     {
  //       id: categoryId1,
  //       name: 'Food',
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //     },
  //     {
  //       id: categoryId2,
  //       name: 'Sport',
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //     },
  //     {
  //       id: categoryId3,
  //       name: 'Business',
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //     },
  //   ]
  //   categoriesRepository.categories.push(...newCategories)

  //   const { transaction, categoriesOnTransactionsUpdatedAfterAddition } =
  //     await getLastTransactionsByQtd.execute({
  //       data: updateTransaction,
  //       transactionId,
  //       addCategoriesId: [categoryId1, categoryId2, categoryId3],
  //     })

  //   expect(transaction).toEqual(
  //     expect.objectContaining({
  //       id: expect.stringMatching(transactionId),
  //       title: 'Transaction-updated',
  //       type: 'OUTCOME',
  //       amount_in_cents: 50000,
  //       description: 'Transaction-updated',
  //     }),
  //   )

  //   expect(categoriesOnTransactionsUpdatedAfterAddition).toEqual([
  //     expect.objectContaining({
  //       created_at: expect.any(Date),
  //       updated_at: expect.any(Date),
  //       category_id: expect.any(String),
  //       transaction_id: expect.any(String),
  //     }),
  //     expect.objectContaining({
  //       created_at: expect.any(Date),
  //       updated_at: expect.any(Date),
  //       category_id: expect.any(String),
  //       transaction_id: expect.any(String),
  //     }),
  //     expect.objectContaining({
  //       created_at: expect.any(Date),
  //       updated_at: expect.any(Date),
  //       category_id: expect.any(String),
  //       transaction_id: expect.any(String),
  //     }),
  //   ])

  //   const { categoriesOnTransactionsUpdatedAfterRemoval } =
  //     await getLastTransactionsByQtd.execute({
  //       transactionId,
  //       removeCategoriesId: [categoryId1, categoryId2, categoryId3],
  //     })

  //   expect(categoriesOnTransactionsUpdatedAfterRemoval).toHaveLength(0)
  // })

  // it('should not be able to update a transaction without id', async () => {
  //   transactionsRepository.transactions.push({
  //     id: randomUUID(),
  //     title: 'Transaction-1',
  //     amount_in_cents: Math.round(100 * 100),
  //     type: 'INCOME',
  //     description: null,

  //     user_id: randomUUID(),

  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   })

  //   await expect(() =>
  //     getLastTransactionsByQtd.execute({
  //       transactionId: 'non-exists-id',
  //     }),
  //   ).rejects.toBeInstanceOf(ResourceNotFoundError)
  // })

  // it('should not be able to update a transaction categories without an array valid ids', async () => {
  //   const transactionId = randomUUID()
  //   transactionsRepository.transactions.push({
  //     id: transactionId,
  //     title: 'Transaction-1',
  //     amount_in_cents: Math.round(100 * 100),
  //     type: 'INCOME',
  //     description: null,

  //     user_id: randomUUID(),

  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   })

  //   await expect(() =>
  //     getLastTransactionsByQtd.execute({
  //       transactionId,
  //       addCategoriesId: ['non-exists-id', 'non-exists-id'],
  //     }),
  //   ).rejects.toBeInstanceOf(ResourceNotFoundError)
  // })

  // it('should not be able to add the same relation twice', async () => {
  //   const transactionId = randomUUID()
  //   transactionsRepository.transactions.push({
  //     id: transactionId,
  //     title: 'Transaction-1',
  //     amount_in_cents: Math.round(100 * 100),
  //     type: 'INCOME',
  //     description: null,

  //     user_id: randomUUID(),

  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   })

  //   const categoryId1 = randomUUID()
  //   const categoryId2 = randomUUID()
  //   const categoryId3 = randomUUID()
  //   const newCategories = [
  //     {
  //       id: categoryId1,
  //       name: 'Food',
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //     },
  //     {
  //       id: categoryId2,
  //       name: 'Sport',
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //     },
  //     {
  //       id: categoryId3,
  //       name: 'Business',
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //     },
  //   ]
  //   categoriesRepository.categories.push(...newCategories)

  //   await getLastTransactionsByQtd.execute({
  //     transactionId,
  //     addCategoriesId: [categoryId1, categoryId2, categoryId3],
  //   })

  //   await expect(() =>
  //     getLastTransactionsByQtd.execute({
  //       transactionId,
  //       addCategoriesId: [categoryId1, categoryId2, categoryId3],
  //     }),
  //   ).rejects.toBeInstanceOf(RelationsAlreadyExistsError)
  // })
})
