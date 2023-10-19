import { Types } from "mongoose";
export type TransferActionLogType = {
  action: number;
  message?: string;
  occurredAt: Date;
  user: string;
};
export type TransferType = {
  _id: Types.ObjectId;
  currencyType: string;
  status: number;
  userId: Types.ObjectId;
  fromAccount: string;
  toAccount: string;
  actionLogs: TransferActionLogType[];
  createdAt: Date;
  updatedAt: Date;
  approvedAt: Date;
};
