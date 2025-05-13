export interface CategoriesRepository {
  findById(categoryId: string): Promise<CategoryDTO | null>
  getAll(): Promise<{ categories: CategoryDTO[]; total: number } | null>
  create(data: CategoryCreateDTO): Promise<CategoryDTO>
  createMany(data: CategoryCreateDTO[]): Promise<CategoryDTO[]>
  update(categoryId: string, data: CategoryCreateDTO): Promise<CategoryDTO>
  delete(categoryId: string): Promise<CategoryDTO>
}
