import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
} from "class-validator";
import { Types } from "mongoose";
import { EMPLOYEE_TYPES } from "src/types/employee.types";

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

  @IsNotEmpty()
  @IsString()
  accountType: string;

  @IsNotEmpty()
  @IsString()
  bankBranchCode: string;

  @IsNotEmpty()
  @IsString()
  accountName: string;

  @IsNumber()
  interest: number;
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
export class createCustomerDTOWithCustomerNumber {
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
  @Length(8)
  customerNumber: number;

  @IsNotEmpty()
  @IsNumber()
  @Length(11)
  customerSocialSecurityNumber: number;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;
}
export class CreateBankDirectorDTO {
  @IsNotEmpty()
  @IsString()
  directorName: string;

  @IsNotEmpty()
  @IsString()
  directorSurname: string;

  @IsNotEmpty()
  @IsNumber()
  directorAge: number;
}
export class CreateBankCustomerRepresentativeDTO {
  @IsNotEmpty()
  @IsString()
  customerRepresentativeName: string;

  @IsNotEmpty()
  @IsString()
  customerRepresentativeSurname: string;

  @IsNotEmpty()
  @IsNumber()
  customerRepresentativeAge: number;
}
export class CreateBankDepartmentDirectorDTO {
  @IsNotEmpty()
  @IsString()
  departmentDirectorName: string;

  @IsNotEmpty()
  @IsString()
  departmentDirectorSurname: string;

  @IsNotEmpty()
  @IsNumber()
  departmentDirectorAge: number;

  @IsNotEmpty()
  @IsString()
  department: string;
}
export class CreateBankDTO {
  @IsNotEmpty()
  @IsString()
  bankName: string;
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
  @IsNotEmpty()
  @IsString()
  currencyType: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  serials: number[];

  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
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
export class AddCustomerToRepresentativeDTO {
  @IsMongoId()
  customerId: string;

  @IsMongoId()
  customerRepresentativeId: string;
}
export class CreateEmployeeRegistrationToBankDTO {
  @IsNotEmpty()
  employeeType: EMPLOYEE_TYPES;

  @IsMongoId()
  employeeId: string;

  @IsMongoId()
  bankId: string;
}
export class GetCustomersAccountsDTO {
  @IsMongoId()
  customerId: string;
}
export class PrivateAccountDTO {
  @IsNotEmpty()
  @IsString()
  accountName: string;

  @IsNotEmpty()
  @IsNumber()
  accountNumber: number;

  @IsNotEmpty()
  @IsString()
  accountType: string;

  balance: object[];

  @IsNumber()
  interest?: number;

  @IsNumber()
  @IsNotEmpty()
  status: number;
}
export class AccountDTO {
  @IsNotEmpty()
  @IsMongoId()
  _id: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  accountNumber: number;

  @IsNotEmpty()
  @IsString()
  accountType: string;

  @IsNotEmpty()
  @IsString()
  accountName: string;

  @IsNumber()
  interest: number;

  balance: object[];

  @IsNumber()
  @IsNotEmpty()
  status: number;

  actionLogs: object[];
}
