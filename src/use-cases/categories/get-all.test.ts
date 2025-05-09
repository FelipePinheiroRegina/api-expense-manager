import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { GetAllCategoriesUseCase } from './get-all'

let categoriesRepository: InMemoryCategoriesRepository
let getAllCategories: GetAllCategoriesUseCase

describe('Get All Categories Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    getAllCategories = new GetAllCategoriesUseCase(categoriesRepository)
  })

  it('should be able to get categories', async () => {
    const createCategories: CategoryCreateDTO[] = [
      { name: 'Food' },
      { name: 'Health' },
      { name: 'Gym' },
    ]
    categoriesRepository.createMany(createCategories)

    const { categories, total } = await getAllCategories.execute()

    expect(categories).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        name: 'Food',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
      expect.objectContaining({
        id: expect.any(String),
        name: 'Health',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
      expect.objectContaining({
        id: expect.any(String),
        name: 'Gym',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    ])
    expect(total).toBe(3)
  })
})
