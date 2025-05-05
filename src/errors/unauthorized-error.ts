export class UnauthorizedError extends Error {
  private statusCode: number

  constructor() {
    super('Unauthorized access.')
    this.statusCode = 401
  }

  getStatusCode() {
    return this.statusCode
  }
}
