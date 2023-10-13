import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Types } from "mongoose";
import { CURRENCY_TYPES } from "src/constants/account.constants";
import { ActionLog, Balance } from "src/schemas/account.schema";
export class CreateAccountDTO {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  accountNumber: number;

  @IsNumber()
  interest: number;

  balance: Balance[];

  @IsNumber()
  @IsNotEmpty()
  status: number;

  actionLogs: ActionLog[];
}
export class CreateAccountIncomingRequestDTO {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  accountNumber: number;

  @IsNumber()
  interest?: number;
}
export class CreateMoneyTransferDTO {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  transferId: string;

  @IsMongoId()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  fromAccountId: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  toAccountId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  currencyType: CURRENCY_TYPES;
}
export class TransferDTO {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  _id: string;

  @IsNotEmpty()
  @IsString()
  currencyType: CURRENCY_TYPES;

  @IsNotEmpty()
  @IsNumber()
  status: number;

  @IsMongoId()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  fromAccount: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  toAccount: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
export class IncomingCreateMoneyTransferDTO {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  _id: string;

  @IsNotEmpty()
  @IsString()
  currencyType: string;

  @IsNotEmpty()
  @IsNumber()
  status: number;

  @IsMongoId()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  fromAccountId: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  toAccountId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class AccountDTO {
  @IsMongoId()
  _id: Types.ObjectId;

  @IsMongoId()
  userId: Types.ObjectId;

  @IsNumber()
  accountNumber: number;

  @IsNumber()
  interest: number;

  balance: Balance[];

  @IsNumber()
  @IsNotEmpty()
  status: number;

  actionLogs: ActionLog[];
}
