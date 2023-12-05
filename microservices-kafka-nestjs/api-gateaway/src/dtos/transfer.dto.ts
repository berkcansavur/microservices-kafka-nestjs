import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";
import {
  EMPLOYEE_MODEL_TYPES,
  TRANSACTION_TYPES,
  TransferType,
} from "types/app-types";

export class TransferDTO {
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
  fromAccount?: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  toAccount: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class AddTransactionToEmployeeDTO {
  @IsNotEmpty()
  employeeType: EMPLOYEE_MODEL_TYPES;
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  employeeId: string;
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  customerId: string;
  @IsNotEmpty()
  transactionType: TRANSACTION_TYPES;
  @IsNotEmpty()
  transfer: TransferType;
}
