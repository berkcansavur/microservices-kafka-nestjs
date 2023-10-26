import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IEmployeeModel } from "src/interfaces/employee-model.interface";
import {
  BankCustomerRepresentative,
  BankCustomerRepresentativeDocument,
  BankDepartmentDirector,
  BankDepartmentDirectorDocument,
  BankDirector,
  BankDirectorDocument,
} from "src/schemas/employee-schema";

@Injectable()
export class EmployeeModels implements IEmployeeModel {
  constructor(
    @InjectModel(BankDirector.name)
    private BankDirectorModel: Model<BankDirectorDocument>,
    @InjectModel(BankDepartmentDirector.name)
    private BankDepartmentDirectorModel: Model<BankDepartmentDirectorDocument>,
    @InjectModel(BankCustomerRepresentative.name)
    private BankCustomerRepresentativeModel: Model<BankCustomerRepresentativeDocument>,
  ) {}
  async getBankDirectorModel(): Promise<Model<BankDirectorDocument>> {
    return this.BankDirectorModel;
  }
  async getBankDepartmentDirectorModel(): Promise<
    Model<BankDepartmentDirectorDocument>
  > {
    return this.BankDepartmentDirectorModel;
  }
  async getBankCustomerRepresentativeModel(): Promise<
    Model<BankCustomerRepresentativeDocument>
  > {
    return this.BankCustomerRepresentativeModel;
  }
}
