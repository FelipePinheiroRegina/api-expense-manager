import { CategoriesRepository } from '@/repositories/categories-repository'
interface GetAllCategoriesUseCaseResponse {
  categories: CategoryDTO[] | null
  total: number | null
}

export class GetAllCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(): Promise<GetAllCategoriesUseCaseResponse> {
    const data = await this.categoriesRepository.getAll()

    return {
      categories: data?.categories ?? null,
      total: data?.total ?? null,
    }
  }
}
