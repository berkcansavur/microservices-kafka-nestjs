import { Injectable, Logger } from "@nestjs/common";
import { EmployeesRepository } from "./repositories/employees.repository";
import {
  CreateBankCustomerRepresentativeDTO,
  CreateBankDepartmentDirectorDTO,
  CreateBankDirectorDTO,
} from "./dtos/bank.dto";
import {
  BankCustomerRepresentative,
  BankDepartmentDirector,
  BankDirector,
  PrivateCustomer,
} from "./schemas/employee-schema";
import { BanksLogic } from "./logic/banks.logic";
import { EMPLOYEE_MODEL_TYPES } from "./types/employee.types";
import { IEmployeeServiceInterface } from "./interfaces/employee-service.interface";
import {
  EmployeeCouldNotCreatedException,
  EmployeeCouldNotUpdatedException,
  EmployeeIsNotFoundException,
} from "./exceptions";
import { Customer } from "./schemas/customers.schema";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";

@Injectable()
export class EmployeesService implements IEmployeeServiceInterface {
  private readonly logger = new Logger(EmployeesService.name);
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
      });
    if (!BanksLogic.isObjectValid(updatedCustomerRepresentative)) {
      throw new EmployeeCouldNotUpdatedException({
        data: { customerRepresentativeId },
      });
    }
    return updatedCustomerRepresentative;
  }
}
