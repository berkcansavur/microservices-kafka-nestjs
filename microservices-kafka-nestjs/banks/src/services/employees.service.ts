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
  PrivateTransfer,
  Transaction,
} from "../schemas/employee-schema";
import { BanksLogic } from "../logic/banks.logic";
import {
  EMPLOYEE_ACTIONS,
  EMPLOYEE_MODEL_TYPES,
} from "../types/employee.types";
import { IEmployeeServiceInterface } from "../interfaces/employee-service.interface";
import {
  EmployeeCouldNotCreatedException,
  EmployeeIsNotFoundException,
  UserCouldNotValidatedException,
} from "../exceptions";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Utils } from "src/utils/utils";
import {
  TRANSACTION_RESULTS,
  TRANSACTION_TYPES,
  USER_TYPES,
} from "src/constants/banks.constants";
import { AuthenticatedUserDTO, UserProfileDTO } from "src/dtos/auth.dto";
import { CustomerRepresentativeService } from "./customer-representative.service";

@Injectable()
export class EmployeesService implements IEmployeeServiceInterface {
  private readonly logger = new Logger(EmployeesService.name);
  constructor(
    private readonly employeesRepository: EmployeesRepository,
    private readonly customerRepresentativeService: CustomerRepresentativeService,
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
    const hashedPassword = await Utils.hashPassword({
      password: createEmployeeDTO.password,
    });
    createEmployeeDTO.password = hashedPassword;
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
  async setEmployeesAccessToken({
    authenticatedUserDTO,
    userType,
  }: {
    authenticatedUserDTO: AuthenticatedUserDTO;
    userType: USER_TYPES;
  }): Promise<UserProfileDTO> {
    const { logger, employeesRepository, BankMapper } = this;
    logger.debug(
      "[setEmployeesAccessToken] authenticatedUserDTO:",
      authenticatedUserDTO,
    );
    const employeeModelType = Utils.getEmployeeModelType(userType);
    const { userId, access_token } = authenticatedUserDTO;
    const updatedEmployee = await employeesRepository.setEmployeesAccessToken({
      employeeModelType,
      _id: userId,
      accessToken: access_token,
    });
    if (updatedEmployee.accessToken.length < 5) {
      throw new UserCouldNotValidatedException({ data: authenticatedUserDTO });
    }
    return BankMapper.map<
      BankDirector | BankDepartmentDirector | BankCustomerRepresentative,
      UserProfileDTO
    >(
      updatedEmployee,
      BankDirector || BankDepartmentDirector || BankCustomerRepresentative,
      UserProfileDTO,
    );
  }
  async getEmployeeByEmail({
    employeeType,
    email,
  }: {
    employeeType: EMPLOYEE_MODEL_TYPES;
    email: string;
  }): Promise<
    BankDirector | BankDepartmentDirector | BankCustomerRepresentative
  > {
    const { logger, employeesRepository } = this;
    logger.debug("[EmployeesService] getEmployee : ", email);
    const employee = (await employeesRepository.findEmployeeByEmail({
      email,
      employeeModelType: employeeType,
    })) as BankDirector | BankDepartmentDirector | BankCustomerRepresentative;
    if (!BanksLogic.isObjectValid(employee)) {
      throw new EmployeeIsNotFoundException({
        message: { employeeType, email },
      });
    }
    return employee;
  }
  async createBankRegistrationToUser({
    employeeType,
    employeeId,
    bankId,
  }: {
    employeeType: USER_TYPES;
    employeeId: string;
    bankId: string;
  }): Promise<
    BankDirector | BankDepartmentDirector | BankCustomerRepresentative
  > {
    const { logger, employeesRepository } = this;
    const employeeModelType = Utils.getEmployeeModelType(employeeType);
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
  async addTransaction({
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
  async getEmployeesCustomerRelatedTransactions({
    employeeType,
    employeeId,
    customerId,
  }: {
    employeeType: USER_TYPES;
    employeeId: string;
    customerId: string;
  }): Promise<Transaction[]> {
    const { employeesRepository, logger } = this;
    logger.debug(
      "[EmployeesService] getEmployeesCustomerTransactions : ",
      employeeType,
      employeeId,
      customerId,
    );
    const employeeModelType = Utils.getEmployeeModelType(employeeType);
    const transactions: Transaction[] =
      await employeesRepository.getEmployeesCustomerRelatedTransactions({
        employeeType: employeeModelType,
        employeeId,
        userId: customerId,
      });
    logger.debug("[EmployeesService] transactions : ", transactions);
    return transactions;
  }
  async getEmployeesTransactions({
    employeeType,
    employeeId,
  }: {
    employeeType: USER_TYPES;
    employeeId: string;
  }): Promise<Transaction[]> {
    const { employeesRepository, logger } = this;
    logger.debug(
      "[EmployeesService] getEmployeesCustomerTransactions : ",
      employeeType,
      employeeId,
    );
    const employeeModelType = Utils.getEmployeeModelType(employeeType);
    const transactions: Transaction[] =
      await employeesRepository.getEmployeesTransactions({
        employeeType: employeeModelType,
        employeeId,
      });
    logger.debug("[EmployeesService] transactions : ", transactions);
    return transactions;
  }
  async updateEmployeesCustomerTransactionsResult({
    employeeType,
    transferId,
    employeeId,
    transfer,
    result,
    action,
  }: {
    employeeType: USER_TYPES;
    transferId: string;
    employeeId: string;
    transfer?: PrivateTransfer;
    result?: TRANSACTION_RESULTS;
    action?: EMPLOYEE_ACTIONS;
  }): Promise<Transaction> {
    const { employeesRepository, logger } = this;
    const employeeModelType = Utils.getEmployeeModelType(employeeType);
    const updatedEmployee =
      await employeesRepository.updateEmployeesTransactionResult({
        employeeType: employeeModelType,
        employeeId,
        transfer,
        result,
        action,
        message: `Transaction that has transfer ${transferId} of customer ${transfer.userId} is updated with transfer result ${result}`,
      });
    const transaction = updatedEmployee.transactions.find((transaction) => {
      transaction.transfer._id === transferId;
    });
    logger.debug(
      "[EmployeesService] updateEmployeesCustomerTransactionsResult : ",
      transaction,
    );
    return transaction;
  }
}
