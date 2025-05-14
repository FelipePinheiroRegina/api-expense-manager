import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { it, expect, describe, beforeEach, vi, afterEach } from 'vitest'
import { GetFavoriteCategoryByMonthUseCase } from './get-favorite-category-by-month'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { randomUUID } from 'node:crypto'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import dayjs from 'dayjs'
import { months } from '@/utils/constants/months-js'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { InMemoryCategoriesOnTransactionsRepository } from '@/repositories/in-memory/in-memory-categories-on-transactions-repository'

let usersRepository: InMemoryUsersRepository
let transactionsRepository: InMemoryTransactionsRepository
let categoriesRepository: InMemoryCategoriesRepository
let categoriesOnTransactionsRepository: InMemoryCategoriesOnTransactionsRepository
let getFavoriteCategoryMonth: GetFavoriteCategoryByMonthUseCase

describe('Get Favorite Category By Month Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    transactionsRepository = new InMemoryTransactionsRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    categoriesOnTransactionsRepository =
      new InMemoryCategoriesOnTransactionsRepository()

    getFavoriteCategoryMonth = new GetFavoriteCategoryByMonthUseCase(
      transactionsRepository,
      usersRepository,
      categoriesOnTransactionsRepository,
      categoriesRepository,
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get favorite category and total spent by month', async () => {
    vi.setSystemTime(new Date(2025, months.January, 20, 8, 0, 0))
    const user = await usersRepository.register({
      name: 'user-1',
      email: 'user@1.com',
    })

    for (let c = 1; c <= 10; c++) {
      transactionsRepository.transactions.push({
        id: randomUUID(),
        title: `Transaction-${c}`,
        amount_in_cents: (c + 50) * 100,
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

    const relation = transactionsRepository.transactions.map(
      (transaction, index) => {
        if (index > 7) {
          return {
            transaction_id: transaction.id,
            category_id: 'category-2',
          }
        }
        return {
          transaction_id: transaction.id,
          category_id: 'category-1',
        }
      },
    )
    categoriesOnTransactionsRepository.createMany(relation)

    const date = dayjs(new Date())
    const start = date.startOf('month').toDate()
    const end = date.endOf('month').subtract(1, 'day').toDate()

    const { name, outcomesInCents } = await getFavoriteCategoryMonth.execute({
      userId: user.id,
      date: {
        start,
        end,
      },
    })

    expect(name).toBe('Food')
    expect(outcomesInCents).toBe(-100)
  })
})
