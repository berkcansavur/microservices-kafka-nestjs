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
export class CreateBankDTO {
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsNotEmpty()
  @IsMongoId()
  bankManager: string;

  @IsNotEmpty()
  @IsMongoId()
  customerRepresentatives: object[];

  @IsNotEmpty()
  @IsMongoId()
  departmentDirectors: object[];
}
export class CreateDirectorDTO {
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
export class CreateCustomerRepresentativeDTO {
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

export class CreateAccountDTO {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsString()
  accountName: string;

  @IsNotEmpty()
  @IsString()
  accountType: string;

  @IsNotEmpty()
  @IsString()
  bankBranchCode: string;

  @IsNumber()
  interest?: number;
}
export class CreateDepartmentDirectorDTO {
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
export class AccountDTO {
  @IsMongoId()
  _id: string;

  @IsMongoId()
  userId?: string;

  @IsString()
  accountName?: string;

  @IsNumber()
  accountNumber?: number;

  @IsNumber()
  interest?: number;

  balance?: any;

  @IsNumber()
  @IsNotEmpty()
  status?: number;

  actionLogs?: any;
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
