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
} from "./schemas/employee-schema";
import { BanksLogic } from "./logic/banks.logic";
import { EMPLOYEE_MODEL_TYPES } from "./types/employee.types";
import { IEmployeeServiceInterface } from "./interfaces/employee-service.interface";

@Injectable()
export class EmployeesService implements IEmployeeServiceInterface {
  private readonly logger = new Logger(EmployeesService.name);
  constructor(private readonly employeesRepository: EmployeesRepository) {}
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
      throw new Error("Employee could not be created");
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
      throw new Error("Employee could not be created");
    }
    return employee;
  }
}
