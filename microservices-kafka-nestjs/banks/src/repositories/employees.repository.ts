import { Inject, Injectable } from "@nestjs/common";
import { EmployeeModelFactory } from "src/factories/employee-model.factory";
import {
  CreateBankCustomerRepresentativeDTO,
  CreateBankDepartmentDirectorDTO,
  CreateBankDirectorDTO,
} from "src/dtos/bank.dto";
import {
  BankCustomerRepresentativeDocument,
  BankDepartmentDirectorDocument,
  BankDirectorDocument,
  PrivateCustomer,
} from "src/schemas/employee-schema";
import { EMPLOYEE_MODEL_TYPES } from "src/types/employee.types";

@Injectable()
export class EmployeesRepository {
  constructor(
    @Inject("EMPLOYEE_MODEL_FACTORY")
    private readonly employeeModelsFactory: EmployeeModelFactory,
  ) {}
  async getEmployee({
    employeeId,
    employeeModelType,
  }: {
    employeeId: string;
    employeeModelType: EMPLOYEE_MODEL_TYPES;
  }): Promise<
    | BankDepartmentDirectorDocument
    | BankCustomerRepresentativeDocument
    | BankDirectorDocument
  > {
    const { employeeModelsFactory } = this;
    const employeeModel =
      await employeeModelsFactory.getEmployeeModel(employeeModelType);
    return employeeModel.findOne({ _id: employeeId }).lean().exec();
  }
  async createEmployee({
    employeeModelType,
    createEmployeeDTO,
  }: {
    employeeModelType: EMPLOYEE_MODEL_TYPES;
    createEmployeeDTO:
      | CreateBankDirectorDTO
      | CreateBankCustomerRepresentativeDTO
      | CreateBankDepartmentDirectorDTO;
  }): Promise<
    | BankDepartmentDirectorDocument
    | BankCustomerRepresentativeDocument
    | BankDirectorDocument
  > {
    const { employeeModelsFactory } = this;
    const employeeModel =
      await employeeModelsFactory.getEmployeeModel(employeeModelType);
    return (
      await employeeModel.create({
        ...createEmployeeDTO,
      })
    ).toObject();
  }
  async addCustomerToCustomerRepresentative({
    customerRepresentativeId,
    customer,
  }: {
    customerRepresentativeId: string;
    customer: PrivateCustomer;
  }): Promise<BankCustomerRepresentativeDocument> {
    const { employeeModelsFactory } = this;
    const employeeModel = await employeeModelsFactory.getEmployeeModel(
      EMPLOYEE_MODEL_TYPES.BANK_CUSTOMER_REPRESENTATIVE,
    );
    const updatedCustomerRepresentative = await employeeModel
      .findOneAndUpdate(
        {
          _id: customerRepresentativeId,
        },
        {
          $push: {
            customers: {
              ...customer,
            },
          },
        },
        { new: true },
      )
      .lean()
      .exec();
    return updatedCustomerRepresentative;
  }
}
