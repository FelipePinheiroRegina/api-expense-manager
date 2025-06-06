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

  async findByUserIdAndQtd(userId: string, qtd: number) {
    const transactions = this.transactions.filter((t) => t.user_id === userId)

    if (transactions.length === 0) {
      return null
    }

    return transactions.slice(0, qtd)
  }

  async findAllByUserId(userId: string, page: number, pageSize: number) {
    const userTransactions = this.transactions.filter(
      (t) => t.user_id === userId,
    )

    if (userTransactions.length === 0) {
      return null
    }

    const total = userTransactions.length
    const start = (page - 1) * pageSize
    const end = start + pageSize

    const transactions = userTransactions.slice(start, end)

    return { transactions, total }
  }

  async deleteById(transactionId: string) {
    const index = this.transactions.findIndex((t) => t.id === transactionId)
    const [deletedTransaction] = this.transactions.splice(index, 1)
    return deletedTransaction
  }

  async sumUserIncomesByMonth(userId: string, date: IntervalDate) {
    const incomes = this.transactions.filter(
      (t) =>
        t.user_id === userId &&
        t.type === 'INCOME' &&
        t.created_at >= date.start &&
        t.created_at <= date.end,
    )

    const incomesInCents = incomes.reduce(
      (sum, income) => sum + income.amount_in_cents,
      0,
    )

    return incomesInCents
  }

  async sumUserOutcomesByMonth(userId: string, date: IntervalDate) {
    const outcomes = this.transactions.filter(
      (t) =>
        t.user_id === userId &&
        t.type === 'OUTCOME' &&
        t.created_at >= date.start &&
        t.created_at <= date.end,
    )

    const outcomesInCents = outcomes.reduce(
      (sum, income) => sum + income.amount_in_cents,
      0,
    )

    return outcomesInCents
  }

  async findMostOutcomeByMonth(userId: string, date: IntervalDate) {
    const outcomes = this.transactions.filter(
      (t) =>
        t.user_id === userId &&
        t.type === 'OUTCOME' &&
        t.created_at >= date.start &&
        t.created_at <= date.end,
    )

    if (outcomes.length === 0) return null

    const transaction = outcomes.reduce((max, outcome) => {
      return Math.abs(outcome.amount_in_cents) > Math.abs(max.amount_in_cents)
        ? outcome
        : max
    }, outcomes[0])

    return transaction
  }

  async findAllOutcomesByMonth(userId: string, date: IntervalDate) {
    const outcomes = this.transactions.filter(
      (t) =>
        t.user_id === userId &&
        t.type === 'OUTCOME' &&
        t.created_at >= date.start &&
        t.created_at <= date.end,
    )

    return outcomes.length > 0 ? outcomes : null
  }

  async sumOutcomesByTransactionsIdsAndMonth(
    transactionsIds: string[],
    date: IntervalDate,
  ) {
    const outcomes = this.transactions.filter(
      (t) =>
        transactionsIds.includes(t.id) &&
        t.type === 'OUTCOME' &&
        t.created_at >= date.start &&
        t.created_at <= date.end,
    )

    const outcomesInCents = outcomes.reduce(
      (sum, income) => sum + income.amount_in_cents,
      0,
    )

    return outcomesInCents
  }
}
