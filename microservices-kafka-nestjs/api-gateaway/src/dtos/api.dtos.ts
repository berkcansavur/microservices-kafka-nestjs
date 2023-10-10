import { IsString, IsNumber, IsMongoId, IsNotEmpty } from "class-validator";
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
export class IncomingTransferRequestDTO {
  @IsMongoId()
  _id: string;

  @IsString()
  currencyType: string;

  @IsNumber()
  status: string;

  @IsMongoId()
  userId: string;

  @IsMongoId()
  fromAccount: string;

  @IsMongoId()
  toAccount: string;

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
  interest?: number;
}
export class AccountDTO {
  @IsMongoId()
  _id: string;

  @IsMongoId()
  userId: string;

  @IsNumber()
  accountNumber: number;

  @IsNumber()
  interest: number;

  balance: any;

  @IsNumber()
  @IsNotEmpty()
  status: number;

  actionLogs: any;
}
