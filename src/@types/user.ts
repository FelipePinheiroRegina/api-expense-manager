export interface IUserDB {
  id: string
  name: string
  email: string
  password_hash: string
  createdAt: Date
  updatedAt: Date
}

export interface IUser {
  id?: string
  name?: string
  email?: string
  password?: string
}
