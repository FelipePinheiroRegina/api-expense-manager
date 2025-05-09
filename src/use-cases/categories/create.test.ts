import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { CreateCategoryUseCase } from './create'
import { InvalidParamsError } from '@/errors/invalid-params-error'

let categoriesRepository: InMemoryCategoriesRepository
let createCategoryUseCase: CreateCategoryUseCase

describe('Create Category Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    createCategoryUseCase = new CreateCategoryUseCase(categoriesRepository)
  })

  it('should be able to create categories', async () => {
    const { categories } = await createCategoryUseCase.execute({
      categories: [{ name: 'Food' }, { name: 'Sport' }, { name: 'Health' }],
    })

    expect(categories).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        name: 'Food',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
      expect.objectContaining({
        id: expect.any(String),
        name: 'Sport',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
      expect.objectContaining({
        id: expect.any(String),
        name: 'Health',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    ])
  })

  it('should be able to transform names from lowercase to capitalize and remove blanks', async () => {
    const { categories } = await createCategoryUseCase.execute({
      categories: [
        { name: '   food   ' },
        { name: '   sport  bet ' },
        { name: '   health  ' },
      ],
    })

    for (const category of categories) {
      expect(category.name).toBe(category.name.trim())
      expect(category.name.charAt(0)).toBe(
        category.name.charAt(0).toUpperCase(),
      )
    }
  })

  it('should not be able to create categories with empty array/empty names inside array/names less than 2', async () => {
    await expect(() =>
      createCategoryUseCase.execute({
        categories: [],
      }),
    ).rejects.toBeInstanceOf(InvalidParamsError)

    await expect(() =>
      createCategoryUseCase.execute({
        categories: [{ name: '' }, { name: '     ' }, { name: '       ' }],
      }),
    ).rejects.toBeInstanceOf(InvalidParamsError)

    await expect(() =>
      createCategoryUseCase.execute({
        categories: [{ name: 'ja' }, { name: 'va' }],
      }),
    ).rejects.toBeInstanceOf(InvalidParamsError)
  })
})
