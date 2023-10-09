import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bank, BankDocument } from '../schemas/banks.schema';
import { Model } from 'mongoose';

@Injectable()
export class BanksRepository {
  constructor(@InjectModel(Bank.name) private BankModel: Model<BankDocument>) {}

  async getBank({ bankId }: { bankId: string }): Promise<BankDocument> {
    const { BankModel } = this;
    return BankModel.findOne({ _id: bankId }).lean().exec();
  }
}
