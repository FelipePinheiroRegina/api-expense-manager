export class InvalidParamsError extends Error {
  private statusCode: number

  constructor() {
    super('Invalid params.')
    this.statusCode = 400
  }

  getStatusCode() {
    return this.statusCode
  }
}
