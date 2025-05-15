interface FindAllByUserIdResponse {
  transactions: TransactionDTO[]
  total: number
}
export interface TransactionsRepository {
  create(data: TransactionCreateDTO, userId: string): Promise<TransactionDTO>
  update(
    data: TransactionCreateDTO,
    transactionId: string,
  ): Promise<TransactionDTO>
  findById(transactionId: string): Promise<TransactionDTO | null>
  findByUserIdAndQtd(
    userId: string,
    qtd: number,
  ): Promise<TransactionDTO[] | null>
  findAllByUserId(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<FindAllByUserIdResponse | null>
  findAllOutcomesByMonth(
    userId: string,
    date: IntervalDate,
  ): Promise<TransactionDTO[] | null>
  deleteById(transactionId: string): Promise<TransactionDTO>
  sumUserIncomesByMonth(userId: string, date: IntervalDate): Promise<number>
  sumUserOutcomesByMonth(userId: string, date: IntervalDate): Promise<number>
  sumUserOutcomesByMonth(userId: string, date: IntervalDate): Promise<number>
  sumOutcomesByTransactionsIdsAndMonth(
    transactionsIds: string[],
    date: IntervalDate,
  ): Promise<number>
  findMostOutcomeByMonth(
    userId: string,
    date: IntervalDate,
  ): Promise<TransactionDTO | null>
}
