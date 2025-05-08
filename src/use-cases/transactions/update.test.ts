import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { it, expect, describe, beforeEach } from 'vitest'
import { UpdateTransactionUseCase } from './update'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { InMemoryCategoriesOnTransactionsRepository } from '@/repositories/in-memory/in-memory-categories-on-transactions-repository'
import { randomUUID } from 'node:crypto'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { RelationsAlreadyExistsError } from '@/errors/relations-already-exists-error'

let usersRepository: InMemoryUsersRepository
let categoriesRepository: InMemoryCategoriesRepository
let transactionsRepository: InMemoryTransactionsRepository
let categoriesOnTransactionsRepository: InMemoryCategoriesOnTransactionsRepository
let updateTransactionUseCase: UpdateTransactionUseCase

describe('Update Transaction Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    transactionsRepository = new InMemoryTransactionsRepository()
    categoriesOnTransactionsRepository =
      new InMemoryCategoriesOnTransactionsRepository()

    updateTransactionUseCase = new UpdateTransactionUseCase(
      transactionsRepository,
      usersRepository,
      categoriesRepository,
      categoriesOnTransactionsRepository,
    )
  })

  it('should be able to update a transaction without remove categories and without add categories', async () => {
    const transactionId = randomUUID()
    transactionsRepository.transactions.push({
      id: transactionId,
      title: 'Transaction-1',
      amount_in_cents: Math.round(100 * 100),
      type: 'INCOME',
      description: null,

      user_id: randomUUID(),

      created_at: new Date(),
      updated_at: new Date(),
    })

    const updateTransaction = {
      title: 'Transaction-updated',
      amount_in_cents: Math.round(500 * 100),
      type: 'OUTCOME',
      description: 'Transaction-updated',
    }

    const { transaction } = await updateTransactionUseCase.execute({
      data: updateTransaction,
      transactionId,
    })

    expect(transaction).toEqual(
      expect.objectContaining({
        id: expect.stringMatching(transactionId),
        title: 'Transaction-updated',
        type: 'OUTCOME',
        amount_in_cents: 50000,
        description: 'Transaction-updated',
      }),
    )
  })

  it('should be able to update a transaction, add and remove some categories', async () => {
    const transactionId = randomUUID()
    transactionsRepository.transactions.push({
      id: transactionId,
      title: 'Transaction-1',
      amount_in_cents: Math.round(100 * 100),
      type: 'INCOME',
      description: null,

      user_id: randomUUID(),

      created_at: new Date(),
      updated_at: new Date(),
    })

    const updateTransaction = {
      title: 'Transaction-updated',
      amount_in_cents: Math.round(500 * 100),
      type: 'OUTCOME',
      description: 'Transaction-updated',
    }

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

    const { transaction, categoriesOnTransactionsUpdatedAfterAddition } =
      await updateTransactionUseCase.execute({
        data: updateTransaction,
        transactionId,
        addCategoriesId: [categoryId1, categoryId2, categoryId3],
      })

    expect(transaction).toEqual(
      expect.objectContaining({
        id: expect.stringMatching(transactionId),
        title: 'Transaction-updated',
        type: 'OUTCOME',
        amount_in_cents: 50000,
        description: 'Transaction-updated',
      }),
    )

    expect(categoriesOnTransactionsUpdatedAfterAddition).toEqual([
      expect.objectContaining({
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        category_id: expect.any(String),
        transaction_id: expect.any(String),
      }),
      expect.objectContaining({
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        category_id: expect.any(String),
        transaction_id: expect.any(String),
      }),
      expect.objectContaining({
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        category_id: expect.any(String),
        transaction_id: expect.any(String),
      }),
    ])

    const { categoriesOnTransactionsUpdatedAfterRemoval } =
      await updateTransactionUseCase.execute({
        transactionId,
        removeCategoriesId: [categoryId1, categoryId2, categoryId3],
      })

    expect(categoriesOnTransactionsUpdatedAfterRemoval).toHaveLength(0)
  })

  it('should not be able to update a transaction without id', async () => {
    transactionsRepository.transactions.push({
      id: randomUUID(),
      title: 'Transaction-1',
      amount_in_cents: Math.round(100 * 100),
      type: 'INCOME',
      description: null,

      user_id: randomUUID(),

      created_at: new Date(),
      updated_at: new Date(),
    })

    await expect(() =>
      updateTransactionUseCase.execute({
        transactionId: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update a transaction categories without an array valid ids', async () => {
    const transactionId = randomUUID()
    transactionsRepository.transactions.push({
      id: transactionId,
      title: 'Transaction-1',
      amount_in_cents: Math.round(100 * 100),
      type: 'INCOME',
      description: null,

      user_id: randomUUID(),

      created_at: new Date(),
      updated_at: new Date(),
    })

    await expect(() =>
      updateTransactionUseCase.execute({
        transactionId,
        addCategoriesId: ['non-exists-id', 'non-exists-id'],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to add the same relation twice', async () => {
    const transactionId = randomUUID()
    transactionsRepository.transactions.push({
      id: transactionId,
      title: 'Transaction-1',
      amount_in_cents: Math.round(100 * 100),
      type: 'INCOME',
      description: null,

      user_id: randomUUID(),

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

    await updateTransactionUseCase.execute({
      transactionId,
      addCategoriesId: [categoryId1, categoryId2, categoryId3],
    })

    await expect(() =>
      updateTransactionUseCase.execute({
        transactionId,
        addCategoriesId: [categoryId1, categoryId2, categoryId3],
      }),
    ).rejects.toBeInstanceOf(RelationsAlreadyExistsError)
  })
})
