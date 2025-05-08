import { TransactionsRepository } from '@/repositories/transactions-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { CategoriesRepository } from '@/repositories/categories-repository'
import { CategoriesOnTransactionsRepository } from '@/repositories/categories-on-transactions-repository'
import { RelationsAlreadyExistsError } from '@/errors/relations-already-exists-error'
interface UpdateTransactionUseCaseRequest {
  data?: TransactionCreateDTO
  transactionId: string
  addCategoriesId?: string[]
  removeCategoriesId?: string[]
}

interface UpdateTransactionUseCaseResponse {
  transaction: TransactionDTO | null
  categoriesOnTransactionsUpdatedAfterRemoval: CategoryOnTransactionDTO[]
  categoriesOnTransactionsUpdatedAfterAddition: CategoryOnTransactionDTO[]
  categories: CategoryDTO[]
}

export class UpdateTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private usersRepository: UsersRepository,
    private categoriesRepository: CategoriesRepository,
    private categoriesOnTransactionsRepository: CategoriesOnTransactionsRepository,
  ) {}

  async execute({
    data,
    transactionId,
    addCategoriesId,
    removeCategoriesId,
  }: UpdateTransactionUseCaseRequest): Promise<UpdateTransactionUseCaseResponse> {
    const nonExistsTransaction =
      !(await this.transactionsRepository.findById(transactionId))

    if (nonExistsTransaction) {
      throw new ResourceNotFoundError()
    }

    let transaction: TransactionDTO | null = null

    if (data) {
      transaction = await this.transactionsRepository.update(
        data,
        transactionId,
      )
    }

    const categoriesOnTransactionsUpdatedAfterRemoval: CategoryOnTransactionDTO[] =
      []
    const categoriesOnTransactionsUpdatedAfterAddition: CategoryOnTransactionDTO[] =
      []
    const categories: CategoryDTO[] = []

    if (removeCategoriesId) {
      const arrayToRemove: CategoryOnTransactionCreateDTO[] =
        removeCategoriesId.map((removeId) => {
          return {
            transaction_id: transactionId,
            category_id: removeId,
          }
        })

      const updatedCategoriesOnTransactions =
        await this.categoriesOnTransactionsRepository.deleteManyByTransactionIdAndCategoryId(
          arrayToRemove,
        )

      if (updatedCategoriesOnTransactions) {
        categoriesOnTransactionsUpdatedAfterRemoval.push(
          ...updatedCategoriesOnTransactions,
        )
      }
    }

    if (addCategoriesId) {
      const existingCategories = (
        await Promise.all(
          addCategoriesId.map((category) =>
            this.categoriesRepository.findById(category),
          ),
        )
      ).filter((cat) => cat != null)

      if (existingCategories.length === 0) {
        throw new ResourceNotFoundError()
      }

      const categoriesOnTransactionsInsert: CategoryOnTransactionCreateDTO[] =
        existingCategories.map((category) => {
          return {
            category_id: category.id,
            transaction_id: transactionId,
          }
        })

      for (const relation of categoriesOnTransactionsInsert) {
        const alreadyExistsRelations =
          await this.categoriesOnTransactionsRepository.findByTransactionIdAndCategoryId(
            relation.transaction_id,
            relation.category_id,
          )

        if (alreadyExistsRelations) {
          throw new RelationsAlreadyExistsError()
        }
      }

      const updatedCategoriesOnTransactions =
        await this.categoriesOnTransactionsRepository.createMany(
          categoriesOnTransactionsInsert,
        )

      categoriesOnTransactionsUpdatedAfterAddition.push(
        ...updatedCategoriesOnTransactions,
      )
      categories.push(...existingCategories)
    }

    return {
      transaction,
      categories,
      categoriesOnTransactionsUpdatedAfterAddition,
      categoriesOnTransactionsUpdatedAfterRemoval,
    }
  }
}
