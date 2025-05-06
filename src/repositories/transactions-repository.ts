import { Prisma, Transaction } from '@prisma/client'

export interface CreateTransaction {
  data: Prisma.TransactionCreateInput
  userId: string
}

export interface TransactionsRepository {
  create({ data, userId }: CreateTransaction): Promise<Transaction>
}
