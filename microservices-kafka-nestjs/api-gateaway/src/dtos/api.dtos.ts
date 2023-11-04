import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsMongoId,
  IsNotEmpty,
  Min,
  IsEmail,
  Length,
  IsEmpty,
} from "class-validator";
import { USER_TYPES } from "types/app-types";

export class LoginUserDTO {
  @ApiProperty({
    description: "User type",
    required: true,
    example: "DOLLAR",
  })
  @IsString()
  @IsEmpty()
  userType: USER_TYPES;

  @ApiProperty({
    description: "user email",
    required: true,
    example: "DOLLAR",
  })
  @IsEmail()
  @IsEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    description: "user password",
    required: true,
    example: "DOLLAR",
  })
  @IsString()
  @IsEmpty()
  password: string;
}
export class CreateTransferDTO {
  @ApiProperty({
    description: "Currency type of the inserted money.",
    required: true,
    example: "DOLLAR",
  })
  @IsString()
  currencyType: string;

  @ApiProperty({
    description: "User Id of the user",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  userId: string;

  @ApiProperty({
    description: "Account Id of the moneys retrieved account  ",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  fromAccount: string;

  @ApiProperty({
    description: "Account Id of the moneys transferred account  ",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  toAccount: string;

  @ApiProperty({
    description: "Amount of the money that transferred to toAccount",
    required: true,
    example: 500,
  })
  @IsNumber()
  amount: number;
}
export class IncomingTransferRequestDTO {
  @ApiProperty({
    description: "Transfers id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  _id: string;

  @ApiProperty({
    description: "Currency type of the transfer",
    required: true,
    example: "DOLLAR",
  })
  @IsString()
  currencyType: string;

  @ApiProperty({
    description: "Transfer status to be approve",
    required: false,
    example: 200,
  })
  @IsNumber()
  status: string;

  @ApiProperty({
    description: "User id of the action",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  userId: string;

  @ApiProperty({
    description: "Account id of fromAccount",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  fromAccount: string;

  @ApiProperty({
    description: "Account id of toAccount",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  toAccount: string;

  @ApiProperty({
    description: "Amount of the money that transferred to toAccount",
    required: true,
    example: 500,
  })
  @IsNumber()
  amount: number;
}
export class MoneyTransferDTO {
  @ApiProperty({
    description: "Currency type of the transfer",
    required: true,
    example: "DOLLAR",
  })
  @IsNotEmpty()
  @IsString()
  currencyType: string;

  @ApiProperty({
    description: "Amount of the money that transferred to toAccount",
    required: true,
    example: 500,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: "Serial no array of the inserted money",
    required: true,
    example: [123123123, 879123014, 383819209],
  })
  @IsNotEmpty()
  serials: number[];

  @ApiProperty({
    description: "User id of the action",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiProperty({
    description: "Account id of toAccount",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsNotEmpty()
  @IsMongoId()
  toAccount: string;
}
export class CreateBankDTO {
  @ApiProperty({
    description: "Created banks name",
    required: true,
    example: "ING Bank",
  })
  @IsNotEmpty()
  @IsString()
  bankName: string;
}
export class CreateDirectorDTO {
  @ApiProperty({
    description: "Bank directors name",
    required: true,
    example: "James",
  })
  @IsNotEmpty()
  @IsString()
  directorName: string;

  @ApiProperty({
    description: "Bank directors surname",
    required: true,
    example: "Miller",
  })
  @IsNotEmpty()
  @IsString()
  directorSurname: string;

  @ApiProperty({
    description: "Bank directors age",
    required: true,
    example: 32,
  })
  @IsNotEmpty()
  @IsNumber()
  directorAge: number;

  @ApiProperty({
    description: "Bank directors email address",
    required: true,
    example: "test@test.com",
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Bank directors password",
    required: true,
    example: "password",
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;
}
export class CreateCustomerRepresentativeDTO {
  @ApiProperty({
    description: "Bank customer representatives name",
    required: true,
    example: "James",
  })
  @IsNotEmpty()
  @IsString()
  customerRepresentativeName: string;

  @ApiProperty({
    description: "Bank customer representatives surname",
    required: true,
    example: "Miller",
  })
  @IsNotEmpty()
  @IsString()
  customerRepresentativeSurname: string;

  @ApiProperty({
    description: "Bank customer representatives age",
    required: true,
    example: 32,
  })
  @IsNotEmpty()
  @IsNumber()
  customerRepresentativeAge: number;

  @ApiProperty({
    description: "Bank customer representatives email address",
    required: true,
    example: "test@test.com",
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Bank customer representatives password",
    required: true,
    example: "password",
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;
}

export class CreateAccountDTO {
  @ApiProperty({
    description: "Accounts owner id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiProperty({
    description: "Accounts name",
    required: true,
    example: "Berkcan's ING Bank Account",
  })
  @IsNotEmpty()
  @IsString()
  accountName: string;

  @ApiProperty({
    description: "Accounts enum type",
    required: true,
    example: "BANK_ACCOUNT",
  })
  @IsNotEmpty()
  @IsString()
  accountType: string;

  @ApiProperty({
    description: "Bank related with the accounts branch enum key",
    required: true,
    example: "KOSUYOLU_BRANCH",
  })
  @IsNotEmpty()
  @IsString()
  bankBranchCode: string;

  @ApiProperty({
    description: "Interest percentage of the account",
    required: true,
    example: 12,
  })
  @IsNumber()
  interest?: number;
}
export class CreateDepartmentDirectorDTO {
  @ApiProperty({
    description: "Bank department director name",
    required: true,
    example: "James",
  })
  @IsNotEmpty()
  @IsString()
  departmentDirectorName: string;

  @ApiProperty({
    description: "Bank department directors surname",
    required: true,
    example: "Miller",
  })
  @IsNotEmpty()
  @IsString()
  departmentDirectorSurname: string;

  @ApiProperty({
    description: "Bank department directors age",
    required: true,
    example: 32,
  })
  @IsNotEmpty()
  @IsNumber()
  departmentDirectorAge: number;

  @ApiProperty({
    description: "Bank department directors department",
    required: true,
    example: "Purchasing Department",
  })
  @IsNotEmpty()
  @IsString()
  department: string;

  @ApiProperty({
    description: "Bank department directors email address",
    required: true,
    example: "test@test.com",
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Bank department directors password",
    required: true,
    example: "password",
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;
}
export class AccountDTO {
  @ApiProperty({
    description: "Accounts id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  _id: string;

  @ApiProperty({
    description: "Accounts user id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  userId?: string;

  @ApiProperty({
    description: "Accounts name",
    required: true,
    example: "Berkcan's ING Bank Account",
  })
  @IsString()
  accountName?: string;

  @ApiProperty({
    description: "16 digit accounts number",
    required: true,
    example: 1292890029912329,
  })
  @IsNumber()
  accountNumber?: number;

  @ApiProperty({
    description: "Interest percentage of the account",
    required: true,
    example: 12,
  })
  @IsNumber()
  interest?: number;

  @ApiProperty({
    description: "Accounts balance array",
    required: true,
  })
  balance?: any;

  @ApiProperty({
    description: "Account status",
    required: false,
    example: 200,
  })
  @IsNumber()
  @IsNotEmpty()
  status?: number;

  @ApiProperty({
    description: "Accounts actions array",
    required: true,
  })
  actionLogs?: any;
}
export class CreateCustomerDTO {
  @ApiProperty({
    description: "Customers name",
    required: true,
    example: "James",
  })
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @ApiProperty({
    description: "Customers surname",
    required: true,
    example: "Even",
  })
  @IsNotEmpty()
  @IsString()
  customerSurname: string;

  @ApiProperty({
    description: "Customers age",
    required: true,
    example: 19,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(18)
  customerAge: number;

  @ApiProperty({
    description: "Customers email",
    required: true,
    example: "berkcansavurrr@gmail.com",
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Customers social security number",
    required: true,
    example: 11111111111,
  })
  @IsNotEmpty()
  @IsNumber()
  @Length(11)
  customerSocialSecurityNumber: number;

  @ApiProperty({
    description: "Customer password",
    required: true,
    example: "examplepassword",
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;
}

export class AddCustomerToRepresentativeDTO {
  @ApiProperty({
    description: "Customers id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  customerId: string;

  @ApiProperty({
    description: "Customer representatives id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  customerRepresentativeId: string;
}
export class CreateEmployeeRegistrationToBankDTO {
  @ApiProperty({
    description: "Employees type",
    required: true,
    example: "BANK_CUSTOMER_REPRESENTATIVE",
  })
  employeeType: USER_TYPES;

  @ApiProperty({
    description: "Employees id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  employeeId: string;

  @ApiProperty({
    description: "Banks id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  bankId: string;
}
export class GetCustomersAccountsDTO {
  @ApiProperty({
    description: "Customers id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  customerId: string;
}
export class GetCustomersTransfersDTO {
  @ApiProperty({
    description: "Customers id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  customerId: string;
}
export class GetUserProfileDTO {
  @ApiProperty({
    description: "Users Type",
    required: true,
    example: "CUSTOMER",
  })
  @IsMongoId()
  userType: string;
  @ApiProperty({
    description: "Users id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  userId: string;
}
export class GetTransferDTO {
  @ApiProperty({
    description: "Transfers id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  transferId: string;

  @ApiProperty({
    description: "Employees id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  employeeId: string;
}
export class GetEmployeesCustomerTransactionsDTO {
  @ApiProperty({
    description: "Employee Type",
    required: true,
    example: "BANK_CUSTOMER_REPRESENTATIVE",
  })
  @IsNotEmpty()
  employeeType: USER_TYPES;

  @ApiProperty({
    description: "Employees id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsNotEmpty()
  @IsMongoId()
  employeeId: string;

  @ApiProperty({
    description: "Customers id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;
}
