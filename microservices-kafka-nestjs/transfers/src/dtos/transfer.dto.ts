import { Types } from "mongoose";
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TransferDTO {
  @IsMongoId()
  _id: Types.ObjectId;

  @IsString()
  currencyType: string;

  @IsNumber()
  status: number;

  @IsMongoId()
  userId: string;

  @IsMongoId()
  fromAccount?: string;

  @IsMongoId()
  toAccount: string;

  @IsNumber()
  amount: number;
}

export class CreateTransferBetweenAccountsDTO {
  @IsString()
  @IsNotEmpty()
  currencyType: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  fromAccount: string;

  @IsMongoId()
  @IsNotEmpty()
  toAccount: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
export class CreateMoneyTransferDTO {
  @IsNotEmpty()
  @IsString()
  currencyType: string;

  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsMongoId()
  toAccount: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class ReturnTransferDTO {
  @IsMongoId()
  id: string;

  @IsString()
  currencyType: string;

  @IsNumber()
  status: number;

  @IsMongoId()
  userId: string;

  @IsMongoId()
  fromAccount: string;

  @IsMongoId()
  toAccount: string;

  @IsNumber()
  amount: number;
}

export class CreateTransferRequestDTO {
  @IsString()
  currencyType: string;

  @IsMongoId()
  userId: string;

  @IsString()
  fromAccount: string;

  @IsString()
  toAccount: string;

  @IsNumber()
  amount: number;
}
export class CompleteTransferRequestDTO {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  userId: string;
}
