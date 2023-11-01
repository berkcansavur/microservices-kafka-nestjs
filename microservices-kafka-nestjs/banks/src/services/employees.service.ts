import { Injectable, Logger } from "@nestjs/common";
import { EmployeesRepository } from "../repositories/employees.repository";
import {
  CreateBankCustomerRepresentativeDTO,
  CreateBankDepartmentDirectorDTO,
  CreateBankDirectorDTO,
} from "../dtos/bank.dto";
import {
  BankCustomerRepresentative,
  BankDepartmentDirector,
  BankDirector,
  PrivateCustomer,
  PrivateTransfer,
} from "../schemas/employee-schema";
import { BanksLogic } from "../logic/banks.logic";
import {
  EMPLOYEE_ACTIONS,
  EMPLOYEE_MODEL_TYPES,
  EMPLOYEE_TYPES,
} from "../types/employee.types";
import { IEmployeeServiceInterface } from "../interfaces/employee-service.interface";
import {
  EmployeeCouldNotCreatedException,
  EmployeeCouldNotUpdatedException,
  EmployeeIsNotFoundException,
} from "../exceptions";
import { Customer } from "../schemas/customers.schema";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Utils } from "src/utils/utils";
import {
  TRANSACTION_RESULTS,
  TRANSACTION_TYPES,
} from "src/constants/banks.constants";
import { Transaction } from "kafkajs";

@Injectable()
export class EmployeesService implements IEmployeeServiceInterface {
  private readonly logger = new Logger(EmployeesService.name);
  private readonly utils = new Utils();
  constructor(
    private readonly employeesRepository: EmployeesRepository,
    @InjectMapper() private readonly BankMapper: Mapper,
  ) {}
  async createEmployee({
    employeeType,
    createEmployeeDTO,
  }: {
    employeeType: EMPLOYEE_MODEL_TYPES;
    createEmployeeDTO:
      | CreateBankDirectorDTO
      | CreateBankDepartmentDirectorDTO
      | CreateBankCustomerRepresentativeDTO;
  }): Promise<
    BankDirector | BankDepartmentDirector | BankCustomerRepresentative
  > {
    const { logger, employeesRepository } = this;
    logger.debug("[EmployeesService] createEmployee DTO: ", createEmployeeDTO);
    const employee = (await employeesRepository.createEmployee({
      employeeModelType: employeeType,
      createEmployeeDTO: createEmployeeDTO,
    })) as BankDirector | BankDepartmentDirector | BankCustomerRepresentative;
    if (!BanksLogic.isObjectValid(employee)) {
      throw new EmployeeCouldNotCreatedException({
        message: { employeeType, createEmployeeDTO },
      });
    }
    return employee;
  }
  async getEmployee({
    employeeType,
    employeeId,
  }: {
    employeeType: EMPLOYEE_MODEL_TYPES;
    employeeId: string;
  }): Promise<
    BankDirector | BankDepartmentDirector | BankCustomerRepresentative
  > {
    const { logger, employeesRepository } = this;
    logger.debug("[EmployeesService] getEmployee : ", employeeId);
    const employee = (await employeesRepository.getEmployee({
      employeeId,
      employeeModelType: employeeType,
    })) as BankDirector | BankDepartmentDirector | BankCustomerRepresentative;
    if (!BanksLogic.isObjectValid(employee)) {
      throw new EmployeeIsNotFoundException({
        message: { employeeType, employeeId },
      });
    }
    return employee;
  }
  async addCustomerToCustomerRepresentative({
    customerRepresentativeId,
    customer,
  }: {
    customerRepresentativeId: string;
    customer: Customer;
  }): Promise<BankCustomerRepresentative> {
    const { logger, employeesRepository, BankMapper } = this;
    const mappedCustomer = BankMapper.map<Customer, PrivateCustomer>(
      customer,
      Customer,
      PrivateCustomer,
    );
    logger.debug(
      "[EmployeesService] addCustomerToCustomerRepresentative : ",
      customerRepresentativeId,
      customer,
    );
    const updatedCustomerRepresentative =
      await employeesRepository.addCustomerToCustomerRepresentative({
        customerRepresentativeId,
        customer: mappedCustomer,
        action: EMPLOYEE_ACTIONS.CUSTOMER_ASSIGNMENT,
      });
    if (!BanksLogic.isObjectValid(updatedCustomerRepresentative)) {
      throw new EmployeeCouldNotUpdatedException({
        data: { customerRepresentativeId },
      });
    }
    return updatedCustomerRepresentative;
  }
  async createBankRegistrationToUser({
    employeeType,
    employeeId,
    bankId,
  }: {
    employeeType: EMPLOYEE_TYPES;
    employeeId: string;
    bankId: string;
  }): Promise<
    BankDirector | BankDepartmentDirector | BankCustomerRepresentative
  > {
    const { logger, employeesRepository, utils } = this;
    const employeeModelType = utils.getEmployeeModelType(employeeType);
    logger.debug(
      "[EmployeesService] createBankRegistrationToUser : ",
      employeeType,
      employeeId,
      bankId,
    );
    const updatedEmployee = await employeesRepository.setBankToEmployee({
      employeeType: employeeModelType,
      employeeId,
      bankId,
      action: EMPLOYEE_ACTIONS.BANK_REGISTRATION,
    });
    return updatedEmployee;
  }
  // async approveTransfer() {
  //   const { employeesRepository } = this;
  //   const updatedCustomerRepresentative = await employeesRepository
  // }
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
    action?: EMPLOYEE_ACTIONS;
    message?: string;
  }): Promise<
    BankDirector | BankDepartmentDirector | BankCustomerRepresentative
  > {
    const { employeesRepository } = this;
    try {
      const updatedEmployee =
        await employeesRepository.addTransactionToEmployee({
          employeeType,
          employeeId,
          customerId,
          transactionType,
          transfer,
          result,
          action,
          message,
        });
      return updatedEmployee;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getEmployeesCustomerTransactions({
    employeeType,
    employeeId,
    customerId,
  }: {
    employeeType: EMPLOYEE_TYPES;
    employeeId: string;
    customerId: string;
  }): Promise<Transaction[]> {
    const { employeesRepository, utils, logger } = this;
    logger.debug(
      "[EmployeesService] getEmployeesCustomerTransactions : ",
      employeeType,
      employeeId,
      customerId,
    );
    const employeeModelType = utils.getEmployeeModelType(employeeType);
    const transactions: Transaction[] =
      await employeesRepository.getEmployeesTransactions({
        employeeType: employeeModelType,
        employeeId,
        userId: customerId,
      });
    logger.debug("[EmployeesService] transactions : ", transactions);
    return transactions;
  }
}
