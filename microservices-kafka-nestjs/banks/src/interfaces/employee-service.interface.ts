import {
  CreateBankCustomerRepresentativeDTO,
  CreateBankDepartmentDirectorDTO,
  CreateBankDirectorDTO,
} from "src/dtos/bank.dto";
import {
  BankCustomerRepresentative,
  BankDepartmentDirector,
  BankDirector,
} from "src/schemas/employee-schema";
import { EMPLOYEE_MODEL_TYPES } from "src/types/employee.types";

export interface IEmployeeServiceInterface {
  createEmployee({
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
  >;
  getEmployee({
    employeeType,
    employeeId,
  }: {
    employeeType: EMPLOYEE_MODEL_TYPES;
    employeeId: string;
  }): Promise<
    BankDirector | BankDepartmentDirector | BankCustomerRepresentative
  >;
}
