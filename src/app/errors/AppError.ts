export default class AppError extends Error {
  public status_code: number;
  constructor(status_code: number, message: string, stack = "") {
    super(message);
    this.status_code = status_code;

    if (stack) this.stack = stack;
    // this.constructor -> makes the stack trace specific, only error that comes fromt he error constructor
    else Error.captureStackTrace(this, this.constructor);
  }
}
