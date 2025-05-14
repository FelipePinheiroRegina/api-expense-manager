import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { it, expect, describe, beforeEach, vi, afterEach } from 'vitest'
import { GetMostExpensiveTransactionByMonthUseCase } from './get-most-expensive-transaction-by-month'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { randomUUID } from 'node:crypto'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InMemoryCategoriesOnTransactionsRepository } from '@/repositories/in-memory/in-memory-categories-on-transactions-repository'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { months } from '@/utils/constants/months-js'
import dayjs from 'dayjs'

let usersRepository: InMemoryUsersRepository
let transactionsRepository: InMemoryTransactionsRepository
let categoriesOnTransactionRepository: InMemoryCategoriesOnTransactionsRepository
let categoriesRepository: InMemoryCategoriesRepository
let getMostExpensiveTransactionByMonth: GetMostExpensiveTransactionByMonthUseCase

describe('Get Most Expensive Transaction By Month Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    transactionsRepository = new InMemoryTransactionsRepository()
    categoriesOnTransactionRepository =
      new InMemoryCategoriesOnTransactionsRepository()
    categoriesRepository = new InMemoryCategoriesRepository()

    getMostExpensiveTransactionByMonth =
      new GetMostExpensiveTransactionByMonthUseCase(
        transactionsRepository,
        usersRepository,
        categoriesOnTransactionRepository,
        categoriesRepository,
      )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get most expensive and categories by month', async () => {
    vi.setSystemTime(new Date(2025, months.January, 20, 8, 0, 0))
    const user = await usersRepository.register({
      name: 'user-1',
      email: 'user@1.com',
    })

    for (let c = 1; c <= 10; c++) {
      if (c === 5) {
        vi.setSystemTime(new Date(2025, months.March, 20, 8, 0, 0))
      }
      transactionsRepository.transactions.push({
        id: randomUUID(),
        title: `Transaction-${c}`,
        amount_in_cents: -((c + 50) * 100),
        type: 'OUTCOME',
        description: null,
        user_id: user.id,
        created_at: new Date(),
        updated_at: new Date(),
      })
    }

    categoriesRepository.categories.push({
      id: 'category-1',
      name: 'Food',
      created_at: new Date(),
      updated_at: new Date(),
    })

    categoriesRepository.categories.push({
      id: 'category-2',
      name: 'Health',
      created_at: new Date(),
      updated_at: new Date(),
    })

    const primaryRelation = transactionsRepository.transactions.map(
      (transaction) => {
        return {
          transaction_id: transaction.id,
          category_id: 'category-1',
        }
      },
    )
    categoriesOnTransactionRepository.createMany(primaryRelation)

    const secondaryRelation = transactionsRepository.transactions.map(
      (transaction) => {
        return {
          transaction_id: transaction.id,
          category_id: 'category-2',
        }
      },
    )
    categoriesOnTransactionRepository.createMany(secondaryRelation)

    const date = dayjs(new Date())
    const start = date.startOf('month').toDate()
    const end = date.endOf('month').subtract(1, 'day').toDate()

    const data = await getMostExpensiveTransactionByMonth.execute({
      userId: user.id,
      date: {
        start,
        end,
      },
    })

    expect(data.transaction?.created_at.getTime()).toBeGreaterThan(
      start.getTime(),
    )
    expect(data.transaction?.created_at.getTime()).toBeLessThan(end.getTime())
    expect(data.transaction?.amount_in_cents).toBe(-6000)
    expect(data?.transaction?.type).toBe('OUTCOME')

    expect(data.categories[0]).toEqual(
      expect.objectContaining({
        id: 'category-1',
        name: 'Food',
      }),
    )

    expect(data.categories[1]).toEqual(
      expect.objectContaining({
        id: 'category-2',
        name: 'Health',
      }),
    )
  })

  it('should not be able to get most expensive and categories without valid userId', async () => {
    const date = dayjs(new Date())
    const start = date.startOf('month').toDate()
    const end = date.endOf('month').subtract(1, 'day').toDate()

    await expect(() =>
      getMostExpensiveTransactionByMonth.execute({
        userId: 'non-exists-userId',
        date: {
          start,
          end,
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return { transaction: null, categories: [] } if user has no transactions', async () => {
    vi.setSystemTime(new Date(2025, months.January, 20, 8, 0, 0))
    const user = await usersRepository.register({
      name: 'user-1',
      email: 'user@1.com',
    })

    // all logic bellow belongs other user
    for (let c = 1; c <= 10; c++) {
      if (c === 5) {
        vi.setSystemTime(new Date(2025, months.March, 20, 8, 0, 0))
      }
      transactionsRepository.transactions.push({
        id: randomUUID(),
        title: `Transaction-${c}`,
        amount_in_cents: -((c + 50) * 100),
        type: 'OUTCOME',
        description: null,
        user_id: 'other-user',
        created_at: new Date(),
        updated_at: new Date(),
      })
    }
    categoriesRepository.categories.push({
      id: 'category-1',
      name: 'Food',
      created_at: new Date(),
      updated_at: new Date(),
    })
    categoriesRepository.categories.push({
      id: 'category-2',
      name: 'Health',
      created_at: new Date(),
      updated_at: new Date(),
    })
    const primaryRelation = transactionsRepository.transactions.map(
      (transaction) => {
        return {
          transaction_id: transaction.id,
          category_id: 'category-1',
        }
      },
    )
    categoriesOnTransactionRepository.createMany(primaryRelation)
    const secondaryRelation = transactionsRepository.transactions.map(
      (transaction) => {
        return {
          transaction_id: transaction.id,
          category_id: 'category-2',
        }
      },
    )
    categoriesOnTransactionRepository.createMany(secondaryRelation)

    const date = dayjs(new Date())
    const start = date.startOf('month').toDate()
    const end = date.endOf('month').subtract(1, 'day').toDate()

    const data = await getMostExpensiveTransactionByMonth.execute({
      userId: user.id,
      date: {
        start,
        end,
      },
    })

    expect(data.transaction).toBe(null)
    expect(data.categories).toHaveLength(0)
  })
})
