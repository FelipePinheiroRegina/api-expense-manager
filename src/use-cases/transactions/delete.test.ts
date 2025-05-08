import { it, expect, describe, beforeEach } from 'vitest'
import { DeleteTransactionUseCase } from './delete'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { randomUUID } from 'node:crypto'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'

let transactionsRepository: InMemoryTransactionsRepository
let deleteTransactionUseCase: DeleteTransactionUseCase

describe('Delete Transaction Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    deleteTransactionUseCase = new DeleteTransactionUseCase(
      transactionsRepository,
    )
  })

  it('should be able to delete a transaction', async () => {
    const transactionId = randomUUID()
    transactionsRepository.transactions.push({
      id: transactionId,
      title: 'Transaction-1',
      amount_in_cents: Math.round(100 * 100),
      type: 'INCOME',
      description: null,

      user_id: randomUUID(),

      created_at: new Date(),
      updated_at: new Date(),
    })

    const { transactionDeleted } = await deleteTransactionUseCase.execute({
      transactionId,
    })

    const checkTransactionNonExists =
      await transactionsRepository.findById(transactionId)
    expect(checkTransactionNonExists).toEqual(null)

    expect(transactionDeleted).toEqual(
      expect.objectContaining({ id: transactionId }),
    )
  })

  it('should not be able to delete a transaction without id', async () => {
    transactionsRepository.transactions.push({
      id: 'transaction-1',
      title: 'Transaction-1',
      amount_in_cents: Math.round(100 * 100),
      type: 'INCOME',
      description: null,

      user_id: randomUUID(),

      created_at: new Date(),
      updated_at: new Date(),
    })

    await expect(() =>
      deleteTransactionUseCase.execute({
        transactionId: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
