import { Model } from "mongoose";
import {
  BankCustomerRepresentativeDocument,
  BankDepartmentDirectorDocument,
  BankDirectorDocument,
} from "src/schemas/employee-schema";

export interface IEmployeeModel {
  getBankDirectorModel(): Promise<Model<BankDirectorDocument>>;
  getBankDepartmentDirectorModel(): Promise<
    Model<BankDepartmentDirectorDocument>
  >;
  getBankCustomerRepresentativeModel(): Promise<
    Model<BankCustomerRepresentativeDocument>
  >;
}
