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

  deleteById(transactionId: string): Promise<TransactionDTO>
  sumUserIncomesByMonth(
    userId: string,
    date: { start: Date; end: Date },
  ): Promise<number>
}
