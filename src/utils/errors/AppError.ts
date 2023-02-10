export default class Error {
  public readonly error: any
  public readonly statusCode: number

  constructor(error: any, statusCode = 400) {
    this.error = error
    this.statusCode = statusCode
  }
}
