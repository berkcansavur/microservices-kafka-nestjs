import { HttpStatus } from "@nestjs/common";
import { BankAppException } from "src/core/exceptions/bank-app.exception";

export class EmployeeIsNotFoundException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Employee is not found",
      1000,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "EmployeeIsNotFoundException",
    );
    this.name = "EmployeeIsNotFoundException";
    Object.setPrototypeOf(this, EmployeeIsNotFoundException.prototype);
  }
}
export class EmployeeCouldNotCreatedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Employee could not created ",
      1001,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "EmployeeCouldNotCreatedException",
    );
    this.name = "EmployeeCouldNotCreatedException";
    Object.setPrototypeOf(this, EmployeeCouldNotCreatedException.prototype);
  }
}
export class EmployeeCouldNotUpdatedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Employee could not updated ",
      1002,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "EmployeeCouldNotUpdatedException",
    );
    this.name = "EmployeeCouldNotUpdatedException";
    Object.setPrototypeOf(this, EmployeeCouldNotUpdatedException.prototype);
  }
}
