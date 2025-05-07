import { randomUUID } from 'crypto'
import { CategoriesOnTransactionsRepository } from '../categories-on-transactions-repository'

export class InMemoryCategoriesOnTransactionsRepository
  implements CategoriesOnTransactionsRepository
{
  public categoriesOnTransactions: CategoryOnTransactionDTO[] = []

  async createMany(data: CategoryOnTransactionCreateDTO[]) {
    const categoriesAndTransactions: CategoryOnTransactionDTO[] = data.map(
      (catOnTran) => {
        return {
          id: randomUUID(),
          created_at: new Date(),
          updated_at: new Date(),
          ...catOnTran,
        }
      },
    )

    this.categoriesOnTransactions.push(...categoriesAndTransactions)

    return categoriesAndTransactions
  }

  async findByIdTransaction(transactionId: string) {
    const categoriesOnTransactions = this.categoriesOnTransactions.filter(
      (c) => c.transaction_id === transactionId,
    )

    return categoriesOnTransactions
  }
}
