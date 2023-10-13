import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Bank, BankDocument } from "../schemas/banks.schema";
import { Model } from "mongoose";
import { CreateCustomerDTOWithAccountNumber } from "src/dtos/bank.dto";
import { Customer, CustomerDocument } from "src/schemas/customers.schema";
import { CustomerAuth, CustomerAuthDocument } from "src/schemas/auth.schema";

@Injectable()
export class BanksRepository {
  constructor(
    @InjectModel(Bank.name) private BankModel: Model<BankDocument>,
    @InjectModel(Customer.name) private CustomerModel: Model<CustomerDocument>,
    @InjectModel(CustomerAuth.name)
    private CustomerAuthModel: Model<CustomerDocument>,
  ) {}

  async getBank({ bankId }: { bankId: string }): Promise<BankDocument> {
    const { BankModel } = this;
    return BankModel.findOne({ _id: bankId }).lean().exec();
  }
  async createCustomer({
    createCustomerDTOWithAccountNumber,
  }: {
    createCustomerDTOWithAccountNumber: CreateCustomerDTOWithAccountNumber;
  }): Promise<CustomerDocument> {
    const { CustomerModel } = this;
    return CustomerModel.create({ createCustomerDTOWithAccountNumber });
  }
  async createCustomerAuth({
    customerNumber,
    password,
  }: {
    customerNumber: number;
    password: string;
  }): Promise<CustomerAuthDocument> {
    const { CustomerAuthModel } = this;
    return (
      await CustomerAuthModel.create({ customerNumber, password })
    ).toObject();
  }
}
