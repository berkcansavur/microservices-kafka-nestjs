import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Transfer, TransferDocument } from "../schemas/transfer.schema";
import { Model } from "mongoose";
import {
  TRANSFER_ACTIONS,
  TRANSFER_STATUSES,
} from "../constants/transfer.constants";
import { CreateTransferBetweenAccountsDTO } from "src/dtos/transfer.dto";
import { CreateMoneyTransferDTO } from "../dtos/transfer.dto";

@Injectable()
export class TransfersRepository {
  constructor(
    @InjectModel(Transfer.name) private TransferModel: Model<TransferDocument>,
  ) {}

  async createTransfer({
    createMoneyTransferDTO,
  }: {
    createMoneyTransferDTO:
      | CreateTransferBetweenAccountsDTO
      | CreateMoneyTransferDTO;
  }): Promise<TransferDocument> {
    const { TransferModel } = this;

    const transfer = await TransferModel.create({
      ...createMoneyTransferDTO,
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

  async getCustomersTransfers({
    customerId,
  }: {
    customerId: string;
  }): Promise<Transfer[] | null> {
    const { TransferModel } = this;
    const transfers: Transfer[] | null = await TransferModel.find({
      userId: customerId,
    });
    return transfers;
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
  async getTransfersByFromAccountId({
    fromAccount,
  }: {
    fromAccount: string;
  }): Promise<Transfer[] | null> {
    const { TransferModel } = this;
    const transfers: Transfer[] | null = await TransferModel.find({
      fromAccount: fromAccount,
    });
    return transfers;
  }
}
