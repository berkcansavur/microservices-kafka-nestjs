import { EMPLOYEE_MODEL_TYPES, TRANSACTION_TYPES } from "types/app-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsMongoId, IsString } from "class-validator";

export class EmployeeTransactionDTO {
  @ApiProperty({
    description: "Employee Model type",
    required: true,
    example: "getBankDirectorModel",
  })
  @IsString()
  @IsEmpty()
  employeeType: EMPLOYEE_MODEL_TYPES;

  @ApiProperty({
    description: "Id of the employee",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  employeeId: string;

  @ApiProperty({
    description: "Id of the customer",
    required: true,
    example: "6530a356aaf92d72d1f0f367",
  })
  @IsMongoId()
  customerId: string;

  @ApiProperty({
    description: "Transaction type",
    required: true,
    example: "ATM",
  })
  @IsString()
  @IsEmpty()
  transactionType: TRANSACTION_TYPES;
}
