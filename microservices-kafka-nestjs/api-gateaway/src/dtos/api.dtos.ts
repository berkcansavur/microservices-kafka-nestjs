import {
  IsString,
  IsNumber,
  IsMongoId,
  IsNotEmpty,
  Min,
  IsEmail,
  Length,
} from "class-validator";
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
export class CreateAccountDTO {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsString()
  accountName: string;

  @IsNotEmpty()
  @IsNumber()
  accountNumber: number;

  @IsNumber()
  interest?: number;
}
export class AccountDTO {
  @IsMongoId()
  _id: string;

  @IsMongoId()
  userId: string;

  @IsString()
  accountName: string;

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
export class CreateCustomerDTO {
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsNotEmpty()
  @IsString()
  customerSurname: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(18)
  customerAge: number;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  customerEmail: string;

  @IsNotEmpty()
  @IsNumber()
  @Length(11)
  customerSocialSecurityNumber: number;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;
}
