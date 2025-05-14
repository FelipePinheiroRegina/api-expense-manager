import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { CategoriesOnTransactionsRepository } from '@/repositories/categories-on-transactions-repository'
import { CategoriesRepository } from '@/repositories/categories-repository'
import { TransactionsRepository } from '@/repositories/transactions-repository'
import { UsersRepository } from '@/repositories/users-repository'

interface GetMostExpensiveTransactionByMonthUseCaseRequest {
  userId: string
  date: IntervalDate
}

interface GetMostExpensiveTransactionByMonthUseCaseResponse {
  transaction: TransactionDTO | null
  categories: CategoryDTO[]
}

export class GetMostExpensiveTransactionByMonthUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private usersRepository: UsersRepository,
    private categoriesOnTransactionsRepository: CategoriesOnTransactionsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    userId,
    date,
  }: GetMostExpensiveTransactionByMonthUseCaseRequest): Promise<GetMostExpensiveTransactionByMonthUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const transaction = await this.transactionsRepository.findMostByMonth(
      userId,
      date,
    )

    if (!transaction) {
      return {
        transaction: null,
        categories: [],
      }
    }

    const categoriesOnTransactions =
      await this.categoriesOnTransactionsRepository.findManyByTransactionId(
        transaction.id,
      )

    const categoriesIds = categoriesOnTransactions.map(
      (item) => item.category_id,
    )

    const categories =
      await this.categoriesRepository.findManyByIds(categoriesIds)

    return { transaction, categories }
  }
}
