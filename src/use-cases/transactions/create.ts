import { TransactionsRepository } from '@/repositories/transactions-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { CategoriesRepository } from '@/repositories/categories-repository'
import { CategoriesOnTransactionsRepository } from '@/repositories/categories-on-transactions-repository'
interface CreateTransactionUseCaseRequest {
  data: TransactionCreateDTO
  userId: string
  categoriesId: string[]
}

interface CreateTransactionUseCaseResponse {
  transaction: TransactionDTO
  categories: CategoryDTO[]
  categoriesOnTransactions: CategoryOnTransactionDTO[]
}

export class CreateTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private usersRepository: UsersRepository,
    private categoriesRepository: CategoriesRepository,
    private categoriesOnTransactionsRepository: CategoriesOnTransactionsRepository,
  ) {}

  async execute({
    data,
    userId,
    categoriesId,
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)
    const categories = (
      await Promise.all(
        categoriesId.map((category) =>
          this.categoriesRepository.findById(category),
        ),
      )
    ).filter((cat) => cat != null)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (categories.length === 0) {
      throw new ResourceNotFoundError()
    }

    const transaction = await this.transactionsRepository.create(data, userId)

    const categoriesOnTransactionsInsert: CategoryOnTransactionCreateDTO[] =
      categories.map((category) => {
        return {
          category_id: category.id,
          transaction_id: transaction.id,
        }
      })

    const categoriesOnTransactions =
      await this.categoriesOnTransactionsRepository.createMany(
        categoriesOnTransactionsInsert,
      )

    return { transaction, categories, categoriesOnTransactions }
  }
}
