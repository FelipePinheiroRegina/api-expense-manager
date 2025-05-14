import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { it, expect, describe, beforeEach, vi, afterEach } from 'vitest'
import { GetOutcomesMonthUseCase } from './get-outcomes-month'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { randomUUID } from 'node:crypto'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import dayjs from 'dayjs'
import { months } from '@/utils/constants/months-js'

let usersRepository: InMemoryUsersRepository
let transactionsRepository: InMemoryTransactionsRepository
let getOutcomesMonth: GetOutcomesMonthUseCase

describe('Get Outcomes Month Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    transactionsRepository = new InMemoryTransactionsRepository()

    getOutcomesMonth = new GetOutcomesMonthUseCase(
      transactionsRepository,
      usersRepository,
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get outcomes month', async () => {
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

    const date = dayjs(new Date())
    const start = date.startOf('month').toDate()
    const end = date.endOf('month').subtract(1, 'day').toDate()

    const { outcomesInCents } = await getOutcomesMonth.execute({
      userId: user.id,
      date: {
        start,
        end,
      },
    })

    expect(outcomesInCents).toBe(-34500)
  })

  it('should not be able to get outcomes month without valid userId', async () => {
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

    const date = dayjs(new Date())
    const start = date.startOf('month').toDate()
    const end = date.endOf('month').subtract(1, 'day').toDate()

    await expect(() =>
      getOutcomesMonth.execute({
        userId: 'non-exists-userId',
        date: {
          start,
          end,
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
