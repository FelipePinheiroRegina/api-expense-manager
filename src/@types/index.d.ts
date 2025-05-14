export {}

declare global {
  interface CategoryDTO {
    id: string
    name: string
    created_at: Date
    updated_at: Date
  }
  interface CategoryCreateDTO {
    name: string
  }
  interface CategoryOnTransactionDTO {
    transaction_id: string
    category_id: string
    created_at: Date
    updated_at: Date
  }
  interface CategoryOnTransactionCreateDTO {
    transaction_id: string
    category_id: string
  }
  interface UserDTO {
    name: string
    id: string
    created_at: Date
    updated_at: Date
    email: string
    provider_id: string | null
    avatar: string | null
    password_hash: string | null
    provider: string | null
  }
  interface UserCreateDTO {
    name: string
    email: string
    avatar?: string | null
    password_hash?: string | null
    provider?: string | null
    provider_id?: string | null
  }
  type TypeTransactionDTO = 'INCOME' | 'OUTCOME'
  interface TransactionDTO {
    id: string
    title: string
    description: string | null
    type: TypeTransaction
    amount_in_cents: number
    created_at: Date
    updated_at: Date
    user_id: string
  }
  interface TransactionCreateDTO {
    title: string
    description?: string | null
    type: TypeTransaction
    amount_in_cents: number
  }
  interface IntervalDate {
    start: Date
    end: Date
  }
}
