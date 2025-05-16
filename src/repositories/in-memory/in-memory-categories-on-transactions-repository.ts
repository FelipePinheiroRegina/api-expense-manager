import {
  CategoriesOnTransactionsRepository,
  Favorite,
} from '../categories-on-transactions-repository'
export class InMemoryCategoriesOnTransactionsRepository
  implements CategoriesOnTransactionsRepository
{
  public categoriesOnTransactions: CategoryOnTransactionDTO[] = []

  async createMany(data: CategoryOnTransactionCreateDTO[]) {
    const categoriesAndTransactions: CategoryOnTransactionDTO[] = data.map(
      (catOnTran) => {
        return {
          created_at: new Date(),
          updated_at: new Date(),
          ...catOnTran,
        }
      },
    )

    this.categoriesOnTransactions.push(...categoriesAndTransactions)

    return categoriesAndTransactions
  }

  async findByTransactionIdAndCategoryId(
    transactionId: string,
    categoryId: string,
  ) {
    const categoriesOnTransactions = this.categoriesOnTransactions.find(
      (c) => c.transaction_id === transactionId && c.category_id === categoryId,
    )

    return categoriesOnTransactions ?? null
  }

  async deleteManyByTransactionIdAndCategoryId(
    data: CategoryOnTransactionCreateDTO[],
  ) {
    const indicesToRemove: number[] = []

    data.forEach((dto) => {
      this.categoriesOnTransactions.forEach((item, index) => {
        const isMatch =
          item.category_id === dto.category_id &&
          item.transaction_id === dto.transaction_id

        if (isMatch) {
          indicesToRemove.push(index)
        }
      })
    })

    indicesToRemove
      .sort((a, b) => b - a)
      .forEach((index) => {
        this.categoriesOnTransactions.splice(index, 1)
      })

    return this.categoriesOnTransactions
  }

  async findManyByTransactionId(transactionId: string) {
    return this.categoriesOnTransactions.filter(
      (c) => c.transaction_id === transactionId,
    )
  }

  async findFavoriteByTransactionsIds(
    transactionsIds: string[],
    date: IntervalDate,
  ) {
    const relations = this.categoriesOnTransactions.filter(
      (relation) =>
        relation.created_at > date.start && relation.created_at < date.end,
    )

    const countRelations = relations.reduce<Favorite[]>((acc, catOnTran) => {
      if (transactionsIds.includes(catOnTran.transaction_id)) {
        const index = acc.findIndex((item) => item.id === catOnTran.category_id)

        if (index !== -1) {
          acc[index] = {
            id: acc[index].id,
            relations: [...acc[index].relations, catOnTran],
            count: acc[index].count + 1,
          }
        } else {
          acc.push({
            id: catOnTran.category_id,
            relations: [catOnTran],
            count: 1,
          })
        }
      }
      return acc
    }, [])

    const favorite = countRelations.reduce<Favorite>((max, current) => {
      return current.count > max.count ? current : max
    }, countRelations[0])

    return favorite
  }
}
