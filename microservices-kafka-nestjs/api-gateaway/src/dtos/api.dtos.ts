import { ApiProperty } from "@nestjs/swagger";
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

  @ApiProperty({
    description: "Bank directors id",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsNotEmpty()
  @IsMongoId()
  bankManager: string;

  @ApiProperty({
    description: "Bank customer representatives ids array",
    required: true,
    examples: ["6530a356aaf92d72d1f0f367", "6530a356aaf92d72d1f0f367"],
  })
  @IsNotEmpty()
  @IsMongoId()
  customerRepresentatives: object[];

  @ApiProperty({
    description: "Bank department directors ids array",
    required: true,
    examples: ["6530a356aaf92d72d1f0f367", "6530a356aaf92d72d1f0f367"],
  })
  @IsNotEmpty()
  @IsMongoId()
  departmentDirectors: object[];
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
  customerEmail: string;

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
