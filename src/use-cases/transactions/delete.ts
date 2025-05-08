import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { TransactionsRepository } from '@/repositories/transactions-repository'

interface DeleteTransactionUseCaseRequest {
  transactionId: string
}

interface DeleteTransactionUseCaseResponse {
  transactionDeleted: TransactionDTO
}

export class DeleteTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    transactionId,
  }: DeleteTransactionUseCaseRequest): Promise<DeleteTransactionUseCaseResponse> {
    const nonExistsTransaction =
      !(await this.transactionsRepository.findById(transactionId))

    if (nonExistsTransaction) {
      throw new ResourceNotFoundError()
    }

    const transactionDeleted =
      await this.transactionsRepository.deleteById(transactionId)

    return { transactionDeleted }
  }
}
