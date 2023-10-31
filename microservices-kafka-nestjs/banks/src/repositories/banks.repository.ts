import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Bank, BankDocument } from "../schemas/banks.schema";
import { Model } from "mongoose";
import { CreateBankDTO } from "src/dtos/bank.dto";
import { BANK_ACTIONS } from "src/constants/banks.constants";
@Injectable()
export class BanksRepository {
  constructor(@InjectModel(Bank.name) private BankModel: Model<BankDocument>) {}

  async getBank({ bankId }: { bankId: string }): Promise<BankDocument> {
    const { BankModel } = this;
    return BankModel.findOne({ _id: bankId }).lean().exec();
  }
  async createBank({
    createBankDTO,
  }: {
    createBankDTO: CreateBankDTO;
  }): Promise<BankDocument> {
    const { BankModel } = this;
    return (await BankModel.create({ ...createBankDTO })).toObject();
  }
  async addEmployeeToBank({
    employeeId,
    bankId,
    action,
    message,
  }: {
    employeeId: string;
    bankId: string;
    action: BANK_ACTIONS;
    message?: string;
  }): Promise<BankDocument> {
    const { BankModel } = this;
    return await BankModel.findByIdAndUpdate(
      { _id: bankId },
      {
        $push: {
          employees: employeeId,
        },
        $addToSet: {
          actionLogs: {
            action,
            ...(message ? { message } : undefined),
            user: employeeId,
          },
        },
      },
      { new: true },
    );
  }
}
