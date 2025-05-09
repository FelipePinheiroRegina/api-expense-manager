export interface CategoriesRepository {
  findById(categoryId: string): Promise<CategoryDTO | null>
  create(data: CategoryCreateDTO): Promise<CategoryDTO>
  createMany(data: CategoryCreateDTO[]): Promise<CategoryDTO[]>
}
