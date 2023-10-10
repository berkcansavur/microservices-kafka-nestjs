import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Transfer, TransferDocument } from "../schemas/transfer.schema";
import { Model } from "mongoose";
import { CreateTransferDTO } from "../dtos/transfer.dto";
import {
  TRANSFER_ACTIONS,
  TRANSFER_STATUSES,
} from "../constants/transfer.constants";

@Injectable()
export class TransfersRepository {
  constructor(
    @InjectModel(Transfer.name) private TransferModel: Model<TransferDocument>,
  ) {}

  async createTransfer({
    createMoneyTransferDTO,
  }: {
    createMoneyTransferDTO: CreateTransferDTO;
  }): Promise<TransferDocument> {
    const { TransferModel } = this;

    const transfer = await TransferModel.create({
      currencyType: createMoneyTransferDTO.currencyType,
      amount: createMoneyTransferDTO.amount,
      userId: createMoneyTransferDTO.userId,
      fromAccount: createMoneyTransferDTO.fromAccount,
      toAccount: createMoneyTransferDTO.toAccount,
    });
    await transfer.save();
    return transfer.toObject();
  }

  async getTransfer({
    transferId,
  }: {
    transferId: string;
  }): Promise<TransferDocument> {
    const { TransferModel } = this;
    return TransferModel.findOne({ _id: transferId }).lean().exec();
  }

  async updateTransferStatus({
    transferId,
    status,
    action,
    message,
    userId,
  }: {
    transferId: string;
    status: TRANSFER_STATUSES;
    action: TRANSFER_ACTIONS;
    message?: string;
    userId: string;
  }): Promise<Transfer | null> {
    const { TransferModel } = this;
    return TransferModel.findOneAndUpdate(
      {
        _id: transferId,
      },
      {
        $set: {
          status: status,
        },
        $addToSet: {
          actionLogs: {
            action,
            ...(message ? { message } : undefined),
            user: userId,
          },
        },
      },
      { new: true },
    )
      .lean()
      .exec();
  }
}
