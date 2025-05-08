import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { TransactionsRepository } from '@/repositories/transactions-repository'
import { UsersRepository } from '@/repositories/users-repository'

interface GetLastTransactionsByQtdUseCaseRequest {
  userId: string
  qtd: number
}

interface GetLastTransactionsByQtdUseCaseResponse {
  transactions: TransactionDTO[] | null
}

export class GetLastTransactionsByQtdUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    qtd,
  }: GetLastTransactionsByQtdUseCaseRequest): Promise<GetLastTransactionsByQtdUseCaseResponse> {
    const nonExistsUser = !(await this.usersRepository.findById(userId))

    if (nonExistsUser) {
      throw new ResourceNotFoundError()
    }

    const validQtd = qtd > 20 ? 20 : qtd

    const transactions = await this.transactionsRepository.findByUserIdAndQtd(
      userId,
      validQtd,
    )

    return { transactions }
  }
}
