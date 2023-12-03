// const createBankAppErrorResponse  = (exception:)

import { HttpStatus } from "@nestjs/common";
import { BaseCustomException } from "./base-custom.exception";

const createBankAppErrorResponse = (exception: BankAppException) => {
  const error = exception?.constructor.name;
  const { code, message, data, errorData } = exception;

  return {
    code,
    error,
    message,
    data,
    errorData,
  };
};

export class BankAppException extends BaseCustomException {
  constructor(
    public readonly message: string,
    public readonly code: number,
    public readonly statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly data?: unknown,
    public readonly errorData?: unknown,
  ) {
    super(message, code, statusCode, data);

    this.name = "BankAppException";
    Object.setPrototypeOf(this, BankAppException.prototype);
  }
  public createErrorResponse() {
    return createBankAppErrorResponse(this);
  }
}
