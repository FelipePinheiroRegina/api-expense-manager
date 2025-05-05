export class InvalidToken extends Error {
  private statusCode: number

  constructor() {
    super('Invalid token.')
    this.statusCode = 401
  }

  getStatusCode() {
    return this.statusCode
  }
}
