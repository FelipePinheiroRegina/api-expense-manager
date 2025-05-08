export class RelationsAlreadyExistsError extends Error {
  private statusCode: number

  constructor() {
    super('Relations already exists.')
    this.statusCode = 409
  }

  getStatusCode() {
    return this.statusCode
  }
}
