import { TransactionsRepository } from '../transactions-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public transactions: TransactionDTO[] = []

  async create(data: TransactionCreateDTO, userId: string) {
    const transaction = {
      id: randomUUID(),
      title: data.title,
      type: data.type,
      amount_in_cents: data.amount_in_cents,
      description: data.description ?? null,

      user_id: userId,

      created_at: new Date(),
      updated_at: new Date(),
    }

    this.transactions.push(transaction)

    return transaction
  }

  async update(data: TransactionCreateDTO, transactionId: string) {
    const index = this.transactions.findIndex((t) => t.id === transactionId)

    this.transactions[index] = {
      ...this.transactions[index],
      ...data,
    }

    return this.transactions[index]
  }

  async findById(transactionId: string) {
    const transaction = this.transactions.find((t) => t.id === transactionId)
    return transaction ?? null
  }

  async deleteById(transactionId: string) {
    const index = this.transactions.findIndex((t) => t.id === transactionId)
    const [deletedTransaction] = this.transactions.splice(index, 1)
    return deletedTransaction
  }
}
