export type AccountType = {
  _id: string;
  userId: string;
  accountNumber: number;
  interest: number;
  balance: Balance[];
  status: number;
  actionLogs: ActionLog[];
  createdAt: Date;
  updatedAt: Date;
  approvedAt: Date;
};
export type Balance = {
  currencyType: string;
  amount?: number;
};
export type ActionLog = {
  action: number;
  message?: string;
  user?: string;
  occurredAt: Date;
};
export enum EMPLOYEE_MODEL_TYPES {
  BANK_DIRECTOR = "getBankDirectorModel",
  BANK_DEPARTMENT_DIRECTOR = "getBankDepartmentDirectorModel",
  BANK_CUSTOMER_REPRESENTATIVE = "getBankCustomerRepresentativeModel",
}
