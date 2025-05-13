import { CategoriesRepository } from '@/repositories/categories-repository'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'

interface DeleteCategoryUseCaseRequest {
  categoryId: string
}

interface DeleteCategoryUseCaseResponse {
  category: CategoryDTO
}

export class DeleteCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    categoryId,
  }: DeleteCategoryUseCaseRequest): Promise<DeleteCategoryUseCaseResponse> {
    const nonExistsCategory =
      !(await this.categoriesRepository.findById(categoryId))

    if (nonExistsCategory) {
      throw new ResourceNotFoundError()
    }

    const category = await this.categoriesRepository.delete(categoryId)

    return { category }
  }
}
