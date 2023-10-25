import { HttpStatus } from "@nestjs/common";
import { BankAppException } from "src/core/excepions/bank-app.exception";

export class AccountIsNotFoundException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Account is not found",
      5001,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "AccountIsNotFoundException",
    );
    this.name = "AccountIsNotFoundException";
    Object.setPrototypeOf(this, AccountIsNotFoundException.prototype);
  }
}
export class AccountStatusIsNotValidException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Account status is not valid",
      19005,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "AccountStatusIsNotValidException",
    );

    this.name = "AccountStatusIsNotValidException";
    Object.setPrototypeOf(this, AccountStatusIsNotValidException.prototype);
  }
}
export class AccountStatusCouldNotUpdatedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Account status is not valid",
      19015,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "AccountStatusCouldNotUpdatedException",
    );

    this.name = "AccountStatusCouldNotUpdatedException";
    Object.setPrototypeOf(
      this,
      AccountStatusCouldNotUpdatedException.prototype,
    );
  }
}
export class InvalidEventResultCode extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Invalid event result code",
      19006,
      HttpStatus.BAD_REQUEST,
      JSON.stringify(data),
      "InvalidEventResultCode",
    );

    this.name = "InvalidEventResultCode";
    Object.setPrototypeOf(this, InvalidEventResultCode.prototype);
  }
}
export class AccountCouldNotCreatedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Account could not created",
      5002,
      HttpStatus.BAD_REQUEST,
      JSON.stringify(data),
      "AccountCouldNotCreatedException",
    );
    this.name = "AccountCouldNotCreatedException";
    Object.setPrototypeOf(this, AccountCouldNotCreatedException.prototype);
  }
}
export class AccountNotApprovedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Account could not approved",
      6000,
      HttpStatus.BAD_REQUEST,
      JSON.stringify(data),
      "AccountNotApprovedException",
    );
    this.name = "AccountNotApprovedException";
    Object.setPrototypeOf(this, AccountNotApprovedException.prototype);
  }
}
export class TransferCouldNotCompletedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Transfer could not completed",
      7000,
      HttpStatus.BAD_REQUEST,
      JSON.stringify(data),
      "TransferCouldNotCompletedException",
    );
    this.name = "TransferCouldNotCompletedException";
    Object.setPrototypeOf(this, TransferCouldNotCompletedException.prototype);
  }
}
export class AccountIsNotAvailableException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Account is not available",
      7400,
      HttpStatus.BAD_REQUEST,
      JSON.stringify(data),
      "AccountIsNotAvailableException",
    );
    this.name = "AccountIsNotAvailableException";
    Object.setPrototypeOf(this, AccountIsNotAvailableException.prototype);
  }
}
export class AccountLogsAreNotFoundException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Account actions are could not be found",
      8000,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "AccountLogsAreNotFoundException",
    );
    this.name = "AccountLogsAreNotFoundException";
    Object.setPrototypeOf(this, AccountLogsAreNotFoundException.prototype);
  }
}
export class AccountsBalanceCouldNotRetrievedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Account balance is could not retrieved",
      8100,
      HttpStatus.BAD_REQUEST,
      JSON.stringify(data),
      "AccountsBalanceCouldNotRetrievedException",
    );
    this.name = "AccountsBalanceCouldNotRetrievedException";
    Object.setPrototypeOf(
      this,
      AccountsBalanceCouldNotRetrievedException.prototype,
    );
  }
}
export class AccountActionCouldNotAddedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Account action is could not added",
      8200,
      HttpStatus.BAD_REQUEST,
      JSON.stringify(data),
      "AccountActionCouldNotAddedException",
    );
    this.name = "AccountActionCouldNotAddedException";
    Object.setPrototypeOf(this, AccountActionCouldNotAddedException.prototype);
  }
}
