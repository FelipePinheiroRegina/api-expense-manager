import { TransactionsRepository } from '@/repositories/transactions-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { CategoriesRepository } from '@/repositories/categories-repository'
import { CategoriesOnTransactionsRepository } from '@/repositories/categories-on-transactions-repository'
interface UpdateTransactionUseCaseRequest {
  data: TransactionDTO
  transactionId: string
  categoriesId?: string[]
}

interface UpdateTransactionUseCaseResponse {
  transaction: TransactionDTO
  categories: CategoryDTO[]
  categoriesOnTransactions: CategoryOnTransactionDTO[]
}

export class UpdateTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private usersRepository: UsersRepository,
    private categoriesRepository: CategoriesRepository,
    private categoriesOnTransactionsRepository: CategoriesOnTransactionsRepository,
  ) {}

  async execute({
    data,
    transactionId,
    categoriesId,
  }: UpdateTransactionUseCaseRequest): Promise<UpdateTransactionUseCaseResponse> {
    const nonExistsTransaction =
      await this.transactionsRepository.findById(transactionId)

    const categories = (
      await Promise.all(
        (categoriesId ?? []).map((category) =>
          this.categoriesRepository.findById(category),
        ),
      )
    ).filter((cat) => cat != null)

    if (nonExistsTransaction) {
      throw new ResourceNotFoundError()
    }

    const transaction = await this.transactionsRepository.update(
      data,
      transactionId,
    )

    if (categories.length > 0) {
      const categoriesOnTransactionsInsert: CategoryOnTransactionDTO[] =
        categories.map((category) => {
          return {
            category_id: category.id,
            transaction_id: transaction.id,
          }
        })
    }

    const categoriesOnTransactions =
      await this.categoriesOnTransactionsRepository.updateMany(
        categoriesOnTransactionsInsert,
      )

    return { transaction, categories, categoriesOnTransactions }
  }
}
