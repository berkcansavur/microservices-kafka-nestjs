import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";

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
  fromAccountId: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  toAccountId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
export class CreateAccountDTO {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  accountNumber: number;

  @IsNumber()
  interest: number;
}
export class CreateTransferDTO {
  @IsString()
  currencyType: string;

  @IsMongoId()
  userId: string;

  @IsMongoId()
  fromAccount: string;

  @IsMongoId()
  toAccount: string;

  @IsNumber()
  amount: number;
}
export class MoneyTransferDTO {
  @IsString()
  currencyType: string;

  @IsNumber()
  amount: number;

  @IsMongoId()
  userId: string;

  @IsMongoId()
  toAccount: string;
}
export class IncomingTransferDTO {
  @IsMongoId()
  id: string;

  @IsString()
  currencyType: string;

  @IsNumber()
  amount: string;

  @IsNumber()
  status: string;

  @IsMongoId()
  userId: string;

  @IsMongoId()
  fromAccount: string;

  @IsMongoId()
  toAccount: string;
}
