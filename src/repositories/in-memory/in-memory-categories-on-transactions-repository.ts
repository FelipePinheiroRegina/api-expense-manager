import { CategoriesOnTransactionsRepository } from '../categories-on-transactions-repository'

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
}
