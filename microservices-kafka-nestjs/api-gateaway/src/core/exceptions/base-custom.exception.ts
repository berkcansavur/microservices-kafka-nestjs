import { HttpException, HttpStatus } from "@nestjs/common";

export abstract class BaseCustomException extends HttpException {
  constructor(
    public message: string,
    public code: number,
    public statusCode: HttpStatus,
    public data?: unknown,
  ) {
    super(message, statusCode);
    Object.setPrototypeOf(this, new.target.prototype);
  }
  protected abstract createErrorResponse(): any;

  public getErrorResponse() {
    return this.createErrorResponse();
  }
}
