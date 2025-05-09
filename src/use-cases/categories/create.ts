import { InvalidParamsError } from '@/errors/invalid-params-error'
import { CategoriesRepository } from '@/repositories/categories-repository'

interface CreateCategoryUseCaseRequest {
  categories: CategoryCreateDTO[]
}

interface CreateCategoryUseCaseResponse {
  categories: CategoryDTO[]
}

export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    categories,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    if (categories.length === 0) {
      throw new InvalidParamsError()
    }

    for (const { name } of categories) {
      if (name.trim().length <= 2) {
        throw new InvalidParamsError()
      }
    }

    categories = categories.map((category) => ({
      name: category.name
        .trim()
        .toLowerCase()
        .split(' ')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    }))

    const createdCategories =
      await this.categoriesRepository.createMany(categories)

    return { categories: createdCategories }
  }
}
