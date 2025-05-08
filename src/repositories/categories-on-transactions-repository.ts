export interface CategoriesOnTransactionsRepository {
  createMany(
    data: CategoryOnTransactionCreateDTO[],
  ): Promise<CategoryOnTransactionDTO[]>

  findByTransactionIdAndCategoryId(
    transactionId: string,
    categoryId: string,
  ): Promise<CategoryOnTransactionDTO | null>

  deleteManyByTransactionIdAndCategoryId(
    data: CategoryOnTransactionCreateDTO[],
  ): Promise<CategoryOnTransactionDTO[] | null>
}
