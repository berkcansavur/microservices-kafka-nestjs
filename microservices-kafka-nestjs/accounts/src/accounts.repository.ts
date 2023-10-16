import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Account, AccountDocument } from "./schemas/account.schema";
import { Model } from "mongoose";
import { CreateAccountDTO } from "./dtos/account.dtos";
import {
  ACCOUNT_ACTIONS,
  ACCOUNT_STATUS,
  CURRENCY_TYPES,
} from "./constants/account.constants";

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
    return await AccountModel.findOne({ _id: accountId }).lean().exec();
  }
  async GetAccountsCurrencyBalance({
    accountId,
    currencyType,
  }: {
    accountId: string;
    currencyType: CURRENCY_TYPES;
  }): Promise<number | null> {
    const { AccountModel } = this;
    const account = await AccountModel.findOne(
      {
        _id: accountId,
        "balance.currencyType": currencyType,
      },
      {
        _id: 0,
        "balance.$": 1,
      },
    )
      .lean()
      .exec();

    return account?.balance?.[0]?.amount ?? null;
  }

  async addAction({
    accountId,
    action,
    message,
    userId,
  }: {
    accountId: string;
    action: ACCOUNT_ACTIONS;
    message?: string;
    userId?: string;
  }): Promise<Account | null> {
    const { AccountModel } = this;
    return await AccountModel.findOneAndUpdate(
      {
        _id: accountId,
      },
      {
        $push: {
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
    return await AccountModel.findOneAndUpdate(
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
  async updatesOnAccountBalance({
    accountId,
    action,
    amount,
    message,
    currencyType,
  }: {
    accountId: string;
    amount: number;
    action: ACCOUNT_ACTIONS;
    message?: string;
    currencyType: CURRENCY_TYPES;
  }): Promise<Account | null> {
    const { AccountModel } = this;
    return await AccountModel.findOneAndUpdate(
      {
        _id: accountId,
        "balance.currencyType": currencyType,
      },
      {
        $set: {
          "balance.$.amount": amount,
        },
        $push: {
          actionLogs: {
            action,
            ...(message ? { message } : undefined),
          },
        },
      },
      {
        new: true,
      },
    )
      .lean()
      .exec();
  }
  async updateAccountBalance({
    accountId,
    amount,
    currencyType,
  }: {
    accountId: string;
    amount: number;
    currencyType: CURRENCY_TYPES;
  }): Promise<Account | null> {
    const { AccountModel } = this;

    const existingAccount = await AccountModel.findOne({
      _id: accountId,
    });

    if (!existingAccount) {
      return null;
    }
    const existingBalance = existingAccount.balance.find(
      (balance) => balance.currencyType === currencyType,
    );

    if (existingBalance) {
      const updatedAccount = await AccountModel.findOneAndUpdate(
        {
          _id: accountId,
          "balance.currencyType": currencyType,
        },
        {
          $inc: {
            "balance.$.amount": amount,
          },
        },
        {
          new: true,
        },
      )
        .lean()
        .exec();

      return updatedAccount;
    } else {
      const updatedAccount = await AccountModel.findOneAndUpdate(
        {
          _id: accountId,
        },
        {
          $push: {
            balance: {
              currencyType,
              amount,
            },
          },
        },
        {
          new: true,
        },
      )
        .lean()
        .exec();

      return updatedAccount;
    }
  }
}
