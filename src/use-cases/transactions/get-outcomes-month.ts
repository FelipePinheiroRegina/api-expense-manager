import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { TransactionsRepository } from '@/repositories/transactions-repository'
import { UsersRepository } from '@/repositories/users-repository'

interface GetOutcomesMonthUseCaseRequest {
  userId: string
  date: {
    start: Date
    end: Date
  }
}

interface GetOutcomesMonthUseCaseResponse {
  outcomesInCents: number
}

export class GetOutcomesMonthUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    date,
  }: GetOutcomesMonthUseCaseRequest): Promise<GetOutcomesMonthUseCaseResponse> {
    const nonExistsUser = !(await this.usersRepository.findById(userId))

    if (nonExistsUser) {
      throw new ResourceNotFoundError()
    }

    const outcomesInCents =
      await this.transactionsRepository.sumUserOutcomesByMonth(userId, date)

    return { outcomesInCents }
  }
}
