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
import { USER_TYPES } from "src/constants/banks.constants";
import { PrivateCustomerRepresentative } from "src/schemas/customers.schema";

export class CustomerDTO {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  _id: string;

  @IsNotEmpty()
  @IsString()
  customerFullName: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(18)
  customerAge: number;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @Length(11)
  customerSocialSecurityNumber: number;

  @IsNotEmpty()
  @IsNumber()
  @Length(8)
  customerNumber: number;

  accounts: object[];

  customerRepresentative?: PrivateCustomerRepresentative;

  bank?: object;

  customerActions: object[];

  @IsString()
  accessToken?: string;
}
export class EmployeeDTO {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  _id: string;

  @IsNotEmpty()
  @IsString()
  employeeFullName: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(18)
  employeeAge: number;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  actionLogs: object[];

  bank?: object;

  transactions: object[];

  @IsString()
  accessToken?: string;
}
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
  email: string;

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
  email: string;

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

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;
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

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;
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

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;
}
export class CreateBankDTO {
  @IsNotEmpty()
  @IsString()
  bankName: string;
}
export class DeleteTransfersDTO {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  transferIds: string[];

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;
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
  employeeType: USER_TYPES;

  @IsMongoId()
  employeeId: string;

  @IsMongoId()
  bankId: string;
}
export class GetCustomersAccountsDTO {
  @IsMongoId()
  customerId: string;
}
export class GetUserProfileDTO {
  @IsNotEmpty()
  userType: USER_TYPES;

  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}
export class GetTransferDTO {
  @IsMongoId()
  transferId: string;
  @IsMongoId()
  employeeId: string;
}
export class PrivateAccountDTO {
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

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

  actionLogs: object[];

  @IsNumber()
  interest?: number;

  @IsNotEmpty()
  @IsNumber()
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
export class GetEmployeesCustomerTransactionsDTO {
  @IsNotEmpty()
  employeeType: USER_TYPES;

  @IsNotEmpty()
  @IsMongoId()
  employeeId: string;

  @IsNotEmpty()
  @IsMongoId()
  customerId: string;
}
export class GetEmployeeDTO {
  @IsNotEmpty()
  employeeType: USER_TYPES;

  @IsNotEmpty()
  @IsMongoId()
  employeeId: string;
}
export class AccountIdDTO {
  @IsNotEmpty()
  @IsMongoId()
  accountId: string;
}
