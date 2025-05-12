import { it, expect, describe, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { UpdateCategoryUseCase } from './update'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InvalidParamsError } from '@/errors/invalid-params-error'

let categoriesRepository: InMemoryCategoriesRepository
let updateCategoryUseCase: UpdateCategoryUseCase

describe('Update Category Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    updateCategoryUseCase = new UpdateCategoryUseCase(categoriesRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to update a category and she must be capitalize', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    const createCategories: CategoryCreateDTO[] = [
      { name: 'Food' },
      { name: 'Health' },
      { name: 'Gym' },
    ]
    const categories = await categoriesRepository.createMany(createCategories)
    const categoryFood = categories.find((category) => category.name === 'Food')

    const data = {
      name: 'food updated',
    }

    vi.setSystemTime(new Date(2022, 0, 21, 5, 0, 0))

    const categoryId = String(categoryFood?.id)
    const { category } = await updateCategoryUseCase.execute({
      categoryId,
      data,
    })

    expect(category).toEqual(
      expect.objectContaining({
        id: categoryId,
        name: 'Food Updated',
        created_at: new Date('2022-01-20T11:00:00.000Z'),
        updated_at: new Date('2022-01-21T08:00:00.000Z'),
      }),
    )
  })

  it('should not be able to update a category without a valid categoryId', async () => {
    const data = {
      name: 'food updated',
    }

    await expect(() =>
      updateCategoryUseCase.execute({
        categoryId: 'non-exists-id',
        data,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update a category without a valid name', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    const createCategories: CategoryCreateDTO[] = [
      { name: 'Food' },
      { name: 'Health' },
      { name: 'Gym' },
    ]
    const categories = await categoriesRepository.createMany(createCategories)
    const categoryFood = categories.find((category) => category.name === 'Food')

    const data = {
      name: ' ',
    }

    vi.setSystemTime(new Date(2022, 0, 21, 5, 0, 0))

    const categoryId = String(categoryFood?.id)

    await expect(() =>
      updateCategoryUseCase.execute({
        categoryId,
        data,
      }),
    ).rejects.toBeInstanceOf(InvalidParamsError)
  })
})
