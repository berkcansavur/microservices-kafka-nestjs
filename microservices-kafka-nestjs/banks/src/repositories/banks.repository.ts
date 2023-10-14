import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Bank, BankDocument } from "../schemas/banks.schema";
import { Model } from "mongoose";
import {
  CreateBankCustomerRepresentativeDTO,
  CreateBankDTO,
  CreateBankDepartmentDirectorDTO,
  CreateBankDirectorDTO,
  CreateCustomerDTOWithAccountNumber,
} from "src/dtos/bank.dto";
import { Customer, CustomerDocument } from "src/schemas/customers.schema";
import { CustomerAuth, CustomerAuthDocument } from "src/schemas/auth.schema";
import {
  BankDirector,
  BankDirectorDocument,
  BankCustomerRepresentative,
  BankCustomerRepresentativeDocument,
  BankDepartmentDirector,
  BankDepartmentDirectorDocument,
} from "src/schemas/employee-schema";

@Injectable()
export class BanksRepository {
  constructor(
    @InjectModel(Bank.name) private BankModel: Model<BankDocument>,
    @InjectModel(Customer.name) private CustomerModel: Model<CustomerDocument>,
    @InjectModel(CustomerAuth.name)
    private CustomerAuthModel: Model<CustomerAuthDocument>,
    @InjectModel(BankDirector.name)
    private BankDirectorModel: Model<BankDirectorDocument>,
    @InjectModel(BankDepartmentDirector.name)
    private BankDepartmentDirectorModel: Model<BankDirectorDocument>,
    @InjectModel(BankCustomerRepresentative.name)
    private CustomerRepresentativeModel: Model<BankCustomerRepresentativeDocument>,
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
  async createBankDirector({
    createBankDirectorDTO,
  }: {
    createBankDirectorDTO: CreateBankDirectorDTO;
  }): Promise<BankDirectorDocument> {
    const { BankDirectorModel } = this;
    return (
      await BankDirectorModel.create({
        ...createBankDirectorDTO,
      })
    ).toObject();
  }

  async createCustomerRepresentative({
    createBankCustomerRepresentativeDTO,
  }: {
    createBankCustomerRepresentativeDTO: CreateBankCustomerRepresentativeDTO;
  }): Promise<BankCustomerRepresentativeDocument> {
    const { CustomerRepresentativeModel } = this;
    return (
      await CustomerRepresentativeModel.create({
        ...createBankCustomerRepresentativeDTO,
      })
    ).toObject();
  }
  async createDepartmentDirector({
    createBankDepartmentDirectorDTO,
  }: {
    createBankDepartmentDirectorDTO: CreateBankDepartmentDirectorDTO;
  }): Promise<BankDepartmentDirectorDocument> {
    const { BankDepartmentDirectorModel } = this;
    return (
      await BankDepartmentDirectorModel.create({
        ...createBankDepartmentDirectorDTO,
      })
    ).toObject();
  }
  async createBank({
    createBankDTO,
  }: {
    createBankDTO: CreateBankDTO;
  }): Promise<BankDocument> {
    const { BankModel } = this;
    return (await BankModel.create({ ...createBankDTO })).toObject();
  }
}
