import { IsMongoId, IsNotEmpty, IsNumber } from "class-validator";
import { Types } from "mongoose";
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
export class CreateAccountIncomingRequestDTO {
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
  _id: Types.ObjectId;

  @IsMongoId()
  userId: Types.ObjectId;

  @IsNumber()
  accountNumber: number;

  @IsNumber()
  interest: number;

  balance: Balance[];

  @IsNumber()
  @IsNotEmpty()
  status: number;

  actionLogs: ActionLog[];
}
