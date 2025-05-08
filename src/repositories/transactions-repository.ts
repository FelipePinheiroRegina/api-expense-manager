export interface TransactionsRepository {
  create(data: TransactionCreateDTO, userId: string): Promise<TransactionDTO>

  update(
    data: TransactionCreateDTO,
    transactionId: string,
  ): Promise<TransactionDTO>

  findById(transactionId: string): Promise<TransactionDTO | null>

  deleteById(transactionId: string): Promise<TransactionDTO>
}
