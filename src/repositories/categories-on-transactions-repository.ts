export interface CategoriesOnTransactionsRepository {
  createMany(
    data: CategoryOnTransactionCreateDTO[],
  ): Promise<CategoryOnTransactionDTO[]>
  findByIdTransaction(
    transactionId: string,
  ): Promise<CategoryOnTransactionDTO[] | null>
}
