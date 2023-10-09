import { IsMongoId, IsNotEmpty, IsNumber } from "class-validator";
import { ActionLog, Balance } from "src/schemas/account.schema";
export class CreateAccountDTO {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  accountNumber: number;

  @IsNumber()
  interest: number;

  balance: Balance[];

  @IsNumber()
  @IsNotEmpty()
  status: number;

  actionLogs: ActionLog[];
}
