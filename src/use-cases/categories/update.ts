import { CategoriesRepository } from '@/repositories/categories-repository'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InvalidParamsError } from '@/errors/invalid-params-error'

interface UpdateCategoryUseCaseRequest {
  categoryId: string
  data: CategoryCreateDTO
}

interface UpdateCategoryUseCaseResponse {
  category: CategoryDTO
}

export class UpdateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    categoryId,
    data,
  }: UpdateCategoryUseCaseRequest): Promise<UpdateCategoryUseCaseResponse> {
    const nonExistsCategory =
      !(await this.categoriesRepository.findById(categoryId))

    if (nonExistsCategory) {
      throw new ResourceNotFoundError()
    }

    if (data.name.trim().length <= 2) {
      throw new InvalidParamsError()
    }

    const name = data.name
      .trim()
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    const category = await this.categoriesRepository.update(categoryId, {
      name,
    })

    return { category }
  }
}
