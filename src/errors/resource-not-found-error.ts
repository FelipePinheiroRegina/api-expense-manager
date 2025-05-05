export class ResourceNotFoundError extends Error {
  private statusCode: number

  constructor() {
    super('Resource not found.')
    this.statusCode = 404
  }

  getStatusCode() {
    return this.statusCode
  }
}
