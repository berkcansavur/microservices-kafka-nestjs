import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Account, AccountDocument } from "./schemas/account.schema";
import { Model } from "mongoose";
import { CreateAccountDTO } from "./dtos/account.dtos";
import { ACCOUNT_ACTIONS, ACCOUNT_STATUS } from "./constants/account.constants";

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectModel(Account.name) private AccountModel: Model<AccountDocument>,
  ) {}

  async createAccount({
    createAccountDTO,
  }: {
    createAccountDTO: CreateAccountDTO;
  }): Promise<AccountDocument> {
    const { AccountModel } = this;
    return await (
      await AccountModel.create({
        ...createAccountDTO,
      })
    ).toObject();
  }
  async getAccount({
    accountId,
  }: {
    accountId: string;
  }): Promise<Account | null> {
    const { AccountModel } = this;
    return AccountModel.findOne({ _id: accountId }).lean().exec();
  }
  async updateAccountStatus({
    accountId,
    status,
    action,
    message,
    userId,
  }: {
    accountId: string;
    status: ACCOUNT_STATUS;
    action: ACCOUNT_ACTIONS;
    message?: string;
    userId: string;
  }): Promise<Account | null> {
    const { AccountModel } = this;
    return AccountModel.findOneAndUpdate(
      {
        _id: accountId,
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
