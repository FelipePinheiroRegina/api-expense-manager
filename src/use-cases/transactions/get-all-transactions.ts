import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { TransactionsRepository } from '../../repositories/transactions-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { InvalidParamsError } from '@/errors/invalid-params-error'

interface GetAllTransactionsUseCaseRequest {
  userId: string
  page: number
}

interface GetAllTransactionsUseCaseResponse {
  transactions: TransactionDTO[] | null
  total: number | null
  page: number
  pageSize: number
}

export class GetAllTransactionsUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    page,
  }: GetAllTransactionsUseCaseRequest): Promise<GetAllTransactionsUseCaseResponse> {
    const userExists = await this.usersRepository.findById(userId)
    if (!userExists) {
      throw new ResourceNotFoundError()
    }

    if (page < 1) {
      throw new InvalidParamsError()
    }

    const pageSize = 10
    const data = await this.transactionsRepository.findAllByUserId(
      userId,
      page,
      pageSize,
    )

    return {
      transactions: data?.transactions ?? null,
      total: data?.total ?? null,
      page,
      pageSize,
    }
  }
}
