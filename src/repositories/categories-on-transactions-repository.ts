export interface Favorite {
  id: string
  relations: CategoryOnTransactionDTO[]
  count: number
}
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

  findFavoriteByTransactionsIds(
    transactionsIds: string[],
    date: IntervalDate,
  ): Promise<Favorite>

  deleteManyByTransactionIdAndCategoryId(
    data: CategoryOnTransactionCreateDTO[],
  ): Promise<CategoryOnTransactionDTO[] | null>
}
