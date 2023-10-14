import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { createCustomerDTOWithCustomerNumber } from "src/dtos/bank.dto";
import { CustomerAuth, CustomerAuthDocument } from "src/schemas/auth.schema";
import { Customer, CustomerDocument } from "src/schemas/customers.schema";

@Injectable()
export class CustomersRepository {
  constructor(
    @InjectModel(Customer.name) private CustomerModel: Model<CustomerDocument>,
    @InjectModel(CustomerAuth.name)
    private CustomerAuthModel: Model<CustomerAuthDocument>,
  ) {}
  async createCustomer({
    createCustomerDTOWithCustomerNumber,
  }: {
    createCustomerDTOWithCustomerNumber: createCustomerDTOWithCustomerNumber;
  }): Promise<CustomerDocument> {
    const { CustomerModel } = this;
    return CustomerModel.create({ ...createCustomerDTOWithCustomerNumber });
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
  async getAccountById({
    customerId,
    accountId,
  }: {
    customerId: string;
    accountId: string;
  }): Promise<Customer> {
    const { CustomerModel } = this;
    return CustomerModel.findOne({
      _id: customerId,
      accounts: { $in: [accountId] },
    })
      .lean()
      .exec();
  }
  async getAccountIds({ customerId }: { customerId: string }) {
    const { CustomerModel } = this;
    const customerIds = await CustomerModel.findOne({
      _id: customerId,
    })
      .select("accounts")
      .lean()
      .exec();
    if (!customerIds) {
      return [];
    }
    return customerIds;
  }
}
