import { HttpStatus } from "@nestjs/common";
import { BankAppException } from "src/core/exceptions/bank-app.exception";

export class BankIsNotFoundException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Bank is not found",
      5001,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "BankIsNotFoundException",
    );
    this.name = "BankIsNotFoundException";
    Object.setPrototypeOf(this, BankIsNotFoundException.prototype);
  }
}
export class InvalidBankBranchCodeException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Invalid bank branch code.",
      5002,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "InvalidBankBranchCodeException",
    );
    this.name = "InvalidBankBranchCodeException";
    Object.setPrototypeOf(this, InvalidBankBranchCodeException.prototype);
  }
}
export class BankCouldNotCreatedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Bank could not created ",
      2000,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "BankCouldNotCreatedException",
    );
    this.name = "BankCouldNotCreatedException";
    Object.setPrototypeOf(this, BankCouldNotCreatedException.prototype);
  }
}
export class BankCouldNotUpdatedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Bank could not updated.",
      2100,
      HttpStatus.BAD_REQUEST,
      JSON.stringify(data),
      "BankCouldNotUpdatedException",
    );
    this.name = "BankCouldNotUpdatedException";
    Object.setPrototypeOf(this, BankCouldNotUpdatedException.prototype);
  }
}
export class MoneyTransferCouldNotSucceedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Money transfer could not succeed",
      3001,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "MoneyTransferCouldNotSucceedException",
    );
    this.name = "MoneyTransferCouldNotSucceedException";
    Object.setPrototypeOf(
      this,
      MoneyTransferCouldNotSucceedException.prototype,
    );
  }
}
export class AccountCouldNotCreatedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Account could not created ",
      4000,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "AccountCouldNotCreatedException",
    );
    this.name = "AccountCouldNotCreatedException";
    Object.setPrototypeOf(this, AccountCouldNotCreatedException.prototype);
  }
}
export class AccountCouldNotAddedToCustomerException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Account could not added to customer",
      4010,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "AccountCouldNotAddedToCustomerException",
    );
    this.name = "AccountCouldNotAddedToCustomerException";
    Object.setPrototypeOf(
      this,
      AccountCouldNotAddedToCustomerException.prototype,
    );
  }
}
export class InvalidAccountTypeException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Invalid account type",
      4020,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "InvalidAccountTypeException",
    );
    this.name = "InvalidAccountTypeException";
    Object.setPrototypeOf(this, InvalidAccountTypeException.prototype);
  }
}
export class InvalidTransferStatusException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Invalid transfer status",
      4020,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "InvalidTransferStatusException",
    );
    this.name = "InvalidTransferStatusException";
    Object.setPrototypeOf(this, InvalidTransferStatusException.prototype);
  }
}
export class TransferCouldNotRejectedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      "Transfer could not rejected",
      4020,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      "TransferCouldNotRejectedException",
    );
    this.name = "TransferCouldNotRejectedException";
    Object.setPrototypeOf(this, TransferCouldNotRejectedException.prototype);
  }
}
