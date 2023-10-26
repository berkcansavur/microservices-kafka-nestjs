import {
  BankDepartmentDirector,
  BankDirector,
  BankCustomerRepresentative,
} from "src/schemas/employee-schema";

export type EmployeeTypes = {
  bankDirector: BankDirector;
  bankDepartmentDirector: BankDepartmentDirector;
  bankCustomerRepresentative: BankCustomerRepresentative;
};
export enum EMPLOYEE_MODEL_TYPES {
  BANK_DIRECTOR = "getBankDirectorModel",
  BANK_DEPARTMENT_DIRECTOR = "getBankDepartmentDirectorModel",
  BANK_CUSTOMER_REPRESENTATIVE = "getBankCustomerRepresentativeModel",
}
