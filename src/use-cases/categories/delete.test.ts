import { it, expect, describe, beforeEach } from 'vitest'
import { DeleteCategoryUseCase } from './delete'
import { randomUUID } from 'node:crypto'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'

let categoriesRepository: InMemoryCategoriesRepository
let deleteCategoryUseCase: DeleteCategoryUseCase

describe('Delete Category Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    deleteCategoryUseCase = new DeleteCategoryUseCase(categoriesRepository)
  })

  it('should be able to delete a category', async () => {
    const categoryId = randomUUID()
    categoriesRepository.categories.push({
      id: categoryId,
      name: 'Food',
      created_at: new Date(),
      updated_at: new Date(),
    })

    const { category } = await deleteCategoryUseCase.execute({
      categoryId,
    })

    const checkCategoryNonExists =
      await categoriesRepository.findById(categoryId)
    expect(checkCategoryNonExists).toEqual(null)

    expect(category).toEqual(expect.objectContaining({ id: categoryId }))
  })

  it('should not be able to delete a category without id', async () => {
    categoriesRepository.categories.push({
      id: 'category-1',
      name: 'Food',
      created_at: new Date(),
      updated_at: new Date(),
    })

    await expect(() =>
      deleteCategoryUseCase.execute({
        categoryId: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
