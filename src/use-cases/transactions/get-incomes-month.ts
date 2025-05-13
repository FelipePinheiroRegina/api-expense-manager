import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { TransactionsRepository } from '@/repositories/transactions-repository'
import { UsersRepository } from '@/repositories/users-repository'

interface GetIncomesMonthUseCaseRequest {
  userId: string
  date: {
    start: Date
    end: Date
  }
}

interface GetIncomesMonthUseCaseResponse {
  incomesInCents: number
}

export class GetIncomesMonthUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    date,
  }: GetIncomesMonthUseCaseRequest): Promise<GetIncomesMonthUseCaseResponse> {
    const nonExistsUser = !(await this.usersRepository.findById(userId))

    if (nonExistsUser) {
      throw new ResourceNotFoundError()
    }

    const incomesInCents =
      await this.transactionsRepository.sumUserIncomesByMonth(userId, date)

    return { incomesInCents }
  }
}
