export interface CategoriesOnTransactionsRepository {
  createMany(
    data: CategoryOnTransactionCreateDTO[],
  ): Promise<CategoryOnTransactionDTO[]>

  findByTransactionIdAndCategoryId(
    transactionId: string,
    categoryId: string,
  ): Promise<CategoryOnTransactionDTO | null>

  findManyByTransactionId(
    transactionId: string,
  ): Promise<CategoryOnTransactionDTO[]>

  deleteManyByTransactionIdAndCategoryId(
    data: CategoryOnTransactionCreateDTO[],
  ): Promise<CategoryOnTransactionDTO[] | null>
}
