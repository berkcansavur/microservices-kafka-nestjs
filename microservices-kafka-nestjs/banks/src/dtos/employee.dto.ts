import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { TRANSACTION_TYPES } from "src/constants/banks.constants";
import { TransferType } from "src/types/bank.types";
import { EMPLOYEE_MODEL_TYPES } from "src/types/employee.types";

export class AddTransactionToEmployeeDTO {
  @IsNotEmpty()
  employeeType: EMPLOYEE_MODEL_TYPES;
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  employeeId: string;
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  customerId: string;
  @IsNotEmpty()
  transactionType: TRANSACTION_TYPES;
  @IsNotEmpty()
  transfer: TransferType;
}
