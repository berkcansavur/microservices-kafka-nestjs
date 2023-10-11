import { Types } from "mongoose";
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TransferDTO {
  @IsMongoId()
  _id: Types.ObjectId;

  @IsString()
  currencyType: string;

  @IsNumber()
  status: number;

  @IsMongoId()
  userId: string;

  @IsMongoId()
  fromAccount: string;

  @IsMongoId()
  toAccount: string;

  @IsNumber()
  amount: number;
}

export class CreateTransferIncomingRequestDTO {
  @IsString()
  @IsNotEmpty()
  currencyType: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  fromAccount: string;

  @IsMongoId()
  @IsNotEmpty()
  toAccount: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
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

export class ReturnTransferDTO {
  @IsMongoId()
  id: string;

  @IsString()
  currencyType: string;

  @IsNumber()
  status: number;

  @IsMongoId()
  userId: string;

  @IsMongoId()
  fromAccount: string;

  @IsMongoId()
  toAccount: string;

  @IsNumber()
  amount: number;
}

export class CreateTransferRequestDTO {
  @IsString()
  currencyType: string;

  @IsMongoId()
  userId: string;

  // @IsMongoId()
  fromAccount: string;

  // @IsMongoId()
  toAccount: string;

  @IsNumber()
  amount: number;
}
export class TransferReportDTO {
  _id?: Types.ObjectId;
  transfer: string;
  createdAt: Date;
  updatedAt: Date;
}
export class CompleteTransferRequestDTO {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  userId: string;
}
export class SaveTransferReportRequestDTO {
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  userId: string;

  @IsNotEmpty()
  transferReport: TransferReportDTO;
}
export class GetTransferApproval {
  constructor(
    public readonly status: string,
    public readonly id: string,
  ) {}
  toString() {
    return JSON.stringify({
      id: this.id,
      status: this.status,
    });
  }
}
