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
export enum EMPLOYEE_ACTIONS {
  CREATED = "CREATED",
  BANK_REGISTRATION = "BANK_REGISTRATION",
  CUSTOMER_ASSIGNMENT = "CUSTOMER_ASSIGNMENT",
  TRANSFER_APPROVAL_SUCCESS = "TRANSFER_APPROVAL_SUCCESS",
  TRANSFER_APPROVAL_FAIL = "TRANSFER_APPROVAL_FAIL",
}
