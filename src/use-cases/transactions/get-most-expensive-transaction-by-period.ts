import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { TransactionsRepository } from '@/repositories/transactions-repository'
import { UsersRepository } from '@/repositories/users-repository'

interface GetMostExpensiveTransactionByPeriodUseCaseRequest {
  userId: string
  date: IntervalDate
}

interface GetMostExpensiveTransactionByPeriodUseCaseResponse {
  transactions: TransactionDTO[]
}

export class GetMostExpensiveTransactionByPeriodUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private transactionsRepository: TransactionsRepository,
  ) {}

  async execute({
    userId,
    date,
  }: GetMostExpensiveTransactionByPeriodUseCaseRequest): Promise<GetMostExpensiveTransactionByPeriodUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }
  }
}
