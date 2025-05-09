import { randomUUID } from 'node:crypto'
import { CategoriesRepository } from '../categories-repository'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public categories: CategoryDTO[] = []

  async findById(categoryId: string): Promise<CategoryDTO | null> {
    return (
      this.categories.find((category) => category.id === categoryId) || null
    )
  }

  async getAll() {
    const categories = this.categories
    const total = categories.length
    return { categories, total }
  }

  async create(data: CategoryCreateDTO) {
    const category: CategoryDTO = {
      id: randomUUID(),
      name: data.name,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.categories.push(category)
    return category
  }

  async createMany(data: CategoryCreateDTO[]) {
    const createdCategories = data.map((categoryData) => {
      const category: CategoryDTO = {
        id: randomUUID(),
        name: categoryData.name,
        created_at: new Date(),
        updated_at: new Date(),
      }
      this.categories.push(category)
      return category
    })

    return createdCategories
  }
}
