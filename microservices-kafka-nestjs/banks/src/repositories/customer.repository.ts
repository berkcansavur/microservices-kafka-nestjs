import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ACCOUNT_ACTIONS } from "src/constants/banks.constants";
import { createCustomerDTOWithCustomerNumber } from "src/dtos/bank.dto";
import { CustomerAuth, CustomerAuthDocument } from "src/schemas/auth.schema";
import {
  Customer,
  CustomerDocument,
  PrivateCustomerRepresentative,
} from "src/schemas/customers.schema";

@Injectable()
export class CustomersRepository {
  constructor(
    @InjectModel(Customer.name) private CustomerModel: Model<CustomerDocument>,
    @InjectModel(CustomerAuth.name)
    private CustomerAuthModel: Model<CustomerAuthDocument>,
  ) {}
  async getCustomer({
    customerId,
  }: {
    customerId: string;
  }): Promise<CustomerDocument> {
    const { CustomerModel } = this;
    const customer = await CustomerModel.findOne({ _id: customerId });
    return customer;
  }
  async findCustomerByEmail({
    email,
  }: {
    email: string;
  }): Promise<CustomerDocument> {
    const { CustomerModel } = this;
    const customer = await CustomerModel.findOne({ email: email });
    return customer;
  }
  async filterCustomersByQuery({
    query,
  }: {
    query: string;
  }): Promise<CustomerDocument> {
    const { CustomerModel } = this;
    const searchQuery = {
      $or: [
        { customerName: { $regex: new RegExp(query, "i") } }, // İsimde eşleşme (case insensitive)
        { customerSurname: { $regex: new RegExp(query, "i") } }, // Soyisimde eşleşme (case insensitive)
        { email: { $regex: new RegExp(query, "i") } }, // Emailde eşleşme (case insensitive)
        { customerNumber: parseInt(query) || 0 }, // Müşteri numarasında eşleşme (sayı ise)
      ],
    };
    const customer = await CustomerModel.findOne(searchQuery);
    return customer;
  }
  async createCustomer({
    createCustomerDTOWithCustomerNumber,
  }: {
    createCustomerDTOWithCustomerNumber: createCustomerDTOWithCustomerNumber;
  }): Promise<CustomerDocument> {
    const { CustomerModel } = this;
    return CustomerModel.create({ ...createCustomerDTOWithCustomerNumber });
  }
  async setCustomersAccessToken({
    _id,
    accessToken,
  }: {
    _id: string;
    accessToken: string;
  }): Promise<CustomerDocument> {
    const { CustomerModel } = this;
    return await CustomerModel.findOneAndUpdate(
      { _id },
      { accessToken },
      { new: true },
    );
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
    const customer = await CustomerModel.findOne({
      _id: customerId,
    })
      .select("accounts")
      .lean()
      .exec();
    if (!customer) {
      return [];
    }
    const { accounts } = customer;
    return accounts;
  }
  async addAccount({
    customerId,
    accountId,
    action,
    message,
  }: {
    customerId: string;
    accountId: string;
    action: ACCOUNT_ACTIONS;
    message?: string;
  }) {
    const { CustomerModel } = this;
    return CustomerModel.findOneAndUpdate(
      { _id: customerId },
      {
        $push: {
          accounts: accountId,
        },
        $addToSet: {
          actionLogs: {
            action,
            ...(message ? { message } : undefined),
            user: customerId,
          },
        },
      },
      { new: true },
    )
      .lean()
      .exec();
  }
  async registerCustomerRepresentativeToCustomer({
    customerId,
    customerRepresentative,
  }: {
    customerId: string;
    customerRepresentative: PrivateCustomerRepresentative;
  }): Promise<Customer> {
    const { CustomerModel } = this;
    const updatedCustomer = await CustomerModel.findOneAndUpdate(
      { _id: customerId },
      {
        customerRepresentative: customerRepresentative,
      },
      { new: true },
    )
      .lean()
      .exec();
    return updatedCustomer;
  }
}
