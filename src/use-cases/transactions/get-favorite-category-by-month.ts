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

    const allTransactionsTypeOutcomes =
      await this.transactionsRepository.findAllOutcomesByMonth(userId, date)

    if (!allTransactionsTypeOutcomes) {
      return {
        name: null,
        outcomesInCents: 0,
      }
    }

    const allTransactionsTypeOutcomesIds = allTransactionsTypeOutcomes.map(
      (transaction) => transaction.id,
    )

    const favorite =
      await this.categoriesOnTransactionsRepository.findFavoriteByTransactionsIds(
        allTransactionsTypeOutcomesIds,
        date,
      )

    const favoriteTransactionsIds = favorite.relations.map(
      (relation) => relation.transaction_id,
    )

    const [category, outcomesInCents] = await Promise.all([
      this.categoriesRepository.findById(favorite.id),
      this.transactionsRepository.sumOutcomesByTransactionsIdsAndMonth(
        favoriteTransactionsIds,
        date,
      ),
    ])

    return { name: category?.name ?? '', outcomesInCents }
  }
}
