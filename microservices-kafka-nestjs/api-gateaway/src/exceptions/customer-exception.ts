import { HttpStatus } from "@nestjs/common";
import { BankAppException } from "src/core/exceptions/bank-app.exception";

export class CustomerIsNotFoundException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Customer is not found",
      5001,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "CustomerIsNotFoundException",
    );
    this.name = "CustomerIsNotFoundException";
    Object.setPrototypeOf(this, CustomerIsNotFoundException.prototype);
  }
}
export class CustomerCouldNotCreatedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Customer could not created ",
      2000,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "CustomerCouldNotCreatedException",
    );
    this.name = "CustomerCouldNotCreatedException";
    Object.setPrototypeOf(this, CustomerCouldNotCreatedException.prototype);
  }
}
export class CustomerCouldNotUpdatedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Customer could not updated.",
      2100,
      HttpStatus.BAD_REQUEST,
      JSON.stringify(data),
      "CustomerCouldNotUpdatedException",
    );
    this.name = "CustomerCouldNotUpdatedException";
    Object.setPrototypeOf(this, CustomerCouldNotUpdatedException.prototype);
  }
}
export class CustomerHasNotRepresentativeException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Customer has not representative information. ",
      4000,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "CustomerHasNotRepresentativeException",
    );
    this.name = "CustomerHasNotRepresentativeException";
    Object.setPrototypeOf(
      this,
      CustomerHasNotRepresentativeException.prototype,
    );
  }
}
