import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { it, expect, describe, beforeEach, vi, afterEach } from 'vitest'
import { GetIncomesMonthUseCase } from './get-incomes-month'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { randomUUID } from 'node:crypto'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import dayjs from 'dayjs'

let usersRepository: InMemoryUsersRepository
let transactionsRepository: InMemoryTransactionsRepository
let getIncomesMonth: GetIncomesMonthUseCase

const months = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
}

describe('Get Incomes Moth Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    transactionsRepository = new InMemoryTransactionsRepository()

    getIncomesMonth = new GetIncomesMonthUseCase(
      transactionsRepository,
      usersRepository,
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get incomes month', async () => {
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
        amount_in_cents: (c + 50) * 100,
        type: 'INCOME',
        description: null,
        user_id: user.id,
        created_at: new Date(),
        updated_at: new Date(),
      })
    }

    const date = dayjs(new Date())
    const start = date.startOf('month').toDate()
    const end = date.endOf('month').subtract(1, 'day').toDate()

    const { incomesInCents } = await getIncomesMonth.execute({
      userId: user.id,
      date: {
        start,
        end,
      },
    })

    expect(incomesInCents).toBe(34500)
  })

  it('should not be able to get incomes month without valid userId', async () => {
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
        amount_in_cents: (c + 50) * 100,
        type: 'INCOME',
        description: null,
        user_id: user.id,
        created_at: new Date(),
        updated_at: new Date(),
      })
    }

    const date = dayjs(new Date())
    const start = date.startOf('month').toDate()
    const end = date.endOf('month').subtract(1, 'day').toDate()

    await expect(() =>
      getIncomesMonth.execute({
        userId: 'non-exists-userId',
        date: {
          start,
          end,
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
