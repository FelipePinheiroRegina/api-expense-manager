export interface UsersRepository {
  findById(userId: string): Promise<UserDTO | null>
  findByEmail(email: string): Promise<UserDTO | null>
  register(data: UserCreateDTO): Promise<UserDTO>
}
