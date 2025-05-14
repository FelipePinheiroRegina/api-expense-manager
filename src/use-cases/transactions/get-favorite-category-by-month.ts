import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { CategoriesOnTransactionsRepository } from '@/repositories/categories-on-transactions-repository'
import { CategoriesRepository } from '@/repositories/categories-repository'
import { TransactionsRepository } from '@/repositories/transactions-repository'
import { UsersRepository } from '@/repositories/users-repository'

interface GetFavoriteCategoryByMonthUseCaseRequest {
  userId: string
  date: IntervalDate
}

interface GetFavoriteCategoryByMonthUseCaseResponse {
  name: string | null
  outcomesInCents: number
}

export class GetFavoriteCategoryByMonthUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private usersRepository: UsersRepository,
    private categoriesOnTransactionsRepository: CategoriesOnTransactionsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    userId,
    date,
  }: GetFavoriteCategoryByMonthUseCaseRequest): Promise<GetFavoriteCategoryByMonthUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const transaction =
      await this.transactionsRepository.findAllOutcomesByMonth(userId, date)

    if (!transaction) {
      return {
        name: null,
        outcomesInCents: 0,
      }
    }

    const transactionsIds = transaction.map((transaction) => transaction.id)

    const categoriesOnTransactions =
      await this.categoriesOnTransactionsRepository.findFavoriteByTransactionsIds(
        transactionsIds,
      )

    console.log(categoriesOnTransactions)

    return { name: 'Food', outcomesInCents: 0 }
  }
}
