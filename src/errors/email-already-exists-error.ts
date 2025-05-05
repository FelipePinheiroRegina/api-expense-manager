export class EmailAlreadyExistsError extends Error {
  private statusCode: number

  constructor() {
    super('E-mail already exists.')
    this.statusCode = 409
  }

  getStatusCode() {
    return this.statusCode
  }
}
