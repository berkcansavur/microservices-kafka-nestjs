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
  PrivateTransfer,
} from "src/schemas/employee-schema";
import {
  EMPLOYEE_ACTIONS,
  EMPLOYEE_MODEL_TYPES,
} from "src/types/employee.types";
import {
  TRANSACTION_RESULTS,
  TRANSACTION_TYPES,
} from "src/constants/banks.constants";

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
    action,
    message,
  }: {
    customerRepresentativeId: string;
    customer: PrivateCustomer;
    action: EMPLOYEE_ACTIONS;
    message?: string;
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
          $addToSet: {
            actionLogs: {
              action,
              ...(message ? { message } : undefined),
              user: customerRepresentativeId,
            },
          },
        },
        { new: true },
      )
      .lean()
      .exec();
    return updatedCustomerRepresentative;
  }
  async setBankToEmployee({
    employeeType,
    employeeId,
    bankId,
    action,
    message,
  }: {
    employeeType: EMPLOYEE_MODEL_TYPES;
    employeeId: string;
    bankId: string;
    action: EMPLOYEE_ACTIONS;
    message?: string;
  }): Promise<
    | BankDepartmentDirectorDocument
    | BankCustomerRepresentativeDocument
    | BankDirectorDocument
  > {
    const { employeeModelsFactory } = this;
    const employeeModel =
      await employeeModelsFactory.getEmployeeModel(employeeType);
    const updatedEmployee = await employeeModel
      .findOneAndUpdate(
        { _id: employeeId },
        {
          bank: bankId,
          $addToSet: {
            actionLogs: {
              action,
              ...(message ? { message } : undefined),
              user: employeeId,
            },
          },
        },
        { new: true },
      )
      .lean()
      .exec();
    return updatedEmployee;
  }
  async addTransactionToEmployee({
    employeeType,
    employeeId,
    customerId,
    transactionType,
    transfer,
    result,
    action,
    message,
  }: {
    employeeType: EMPLOYEE_MODEL_TYPES;
    employeeId: string;
    customerId: string;
    transactionType: TRANSACTION_TYPES;
    transfer?: PrivateTransfer;
    result?: TRANSACTION_RESULTS;
    action: EMPLOYEE_ACTIONS;
    message?: string;
  }): Promise<
    | BankDepartmentDirectorDocument
    | BankCustomerRepresentativeDocument
    | BankDirectorDocument
  > {
    const { employeeModelsFactory } = this;
    const employeeModel =
      await employeeModelsFactory.getEmployeeModel(employeeType);
    const updatedEmployee = await employeeModel
      .findOneAndUpdate(
        { _id: employeeId },
        {
          $push: {
            transactions: {
              transactionType: transactionType,
              ...(result ? { result } : undefined),
              customer: customerId,
              ...(transfer ? { transfer } : undefined),
            },
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
      )
      .lean()
      .exec();
    return updatedEmployee;
  }
  async updateEmployeesTransactionResult({
    employeeType,
    employeeId,
    transfer,
    result,
    action,
    message,
  }: {
    employeeType: EMPLOYEE_MODEL_TYPES;
    employeeId: string;
    transfer?: PrivateTransfer;
    result?: TRANSACTION_RESULTS;
    action: EMPLOYEE_ACTIONS;
    message?: string;
  }): Promise<
    | BankDepartmentDirectorDocument
    | BankCustomerRepresentativeDocument
    | BankDirectorDocument
  > {
    const { employeeModelsFactory } = this;
    const employeeModel =
      await employeeModelsFactory.getEmployeeModel(employeeType);
    const updatedEmployee = await employeeModel
      .findOneAndUpdate(
        { _id: employeeId, "transactions.transfer._id": transfer._id },
        {
          $set: {
            "transactions.$.result": result,
            "transactions.$.transfer": transfer,
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
      )
      .lean()
      .exec();
    return updatedEmployee;
  }
  async getEmployeesTransactions({
    employeeType,
    employeeId,
    userId,
  }: {
    employeeType: EMPLOYEE_MODEL_TYPES;
    employeeId: string;
    userId: string;
  }) {
    const { employeeModelsFactory } = this;
    const employeeModel =
      await employeeModelsFactory.getEmployeeModel(employeeType);
    const employee = await employeeModel.findOne({ _id: employeeId });

    const { transactions } = employee;
    const employeeTransactions = transactions.filter(
      (transaction) => transaction.customer === userId,
    );
    return employeeTransactions;
  }
}
