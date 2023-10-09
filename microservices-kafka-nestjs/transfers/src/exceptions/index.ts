import { HttpStatus } from '@nestjs/common';
import { BankAppException } from 'src/core/excepions/bank-app.exception';

export class TransferIsNotFoundException extends BankAppException {
  constructor(data?: string | object) {
    super(
      'Transfer is not found',
      5001,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      'TransferIsNotFoundException',
    );
    this.name = 'TransferIsNotFoundException';
    Object.setPrototypeOf(this, TransferIsNotFoundException.prototype);
  }
}
export class TransferStatusIsNotValidException extends BankAppException {
  constructor(data?: string | object) {
    super(
      'Transfer status is not valid',
      19005,
      HttpStatus.NOT_FOUND,
      JSON.stringify(data),
      'TransferStatusIsNotValidException',
    );

    this.name = 'TransferStatusIsNotValidException';
    Object.setPrototypeOf(this, TransferStatusIsNotValidException.prototype);
  }
}
export class InvalidEventResultCode extends BankAppException {
  constructor(data?: string | object) {
    super(
      'Invalid event result code',
      19006,
      HttpStatus.BAD_REQUEST,
      JSON.stringify(data),
      'InvalidEventResultCode',
    );

    this.name = 'InvalidEventResultCode';
    Object.setPrototypeOf(this, InvalidEventResultCode.prototype);
  }
}
export class TransferCouldNotCreatedException extends BankAppException {
  constructor(data?: string | object) {
    super(
      'Transfer could not created',
      5002,
      HttpStatus.BAD_REQUEST,
      JSON.stringify(data),
      'TransferIsNotFoundException',
    );
    this.name = 'TransferCouldNotCreatedException';
    Object.setPrototypeOf(this, TransferCouldNotCreatedException.prototype);
  }
}
