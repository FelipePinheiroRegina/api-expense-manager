import { Transaction } from '@prisma/client'
import {
  CreateTransaction,
  TransactionsRepository,
} from '../transactions-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public transactions: Transaction[] = []
  async create({ data, userId }: CreateTransaction) {
    const transaction: Transaction = {
      id: randomUUID(),
      title: data.title,
      type: data.type,
      amount: data.amount,
      description: data.description ?? null,

      user_id: userId,

      created_at: new Date(),
      updated_at: new Date(),
    }

    this.transactions.push(transaction)

    return transaction
  }
}
