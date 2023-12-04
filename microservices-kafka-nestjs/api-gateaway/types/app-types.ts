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
export enum USER_TYPES {
  BANK_DIRECTOR = "BANK_DIRECTOR",
  BANK_DEPARTMENT_DIRECTOR = "BANK_DEPARTMENT_DIRECTOR",
  BANK_CUSTOMER_REPRESENTATIVE = "BANK_CUSTOMER_REPRESENTATIVE",
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}
export enum EMPLOYEE_MODEL_TYPES {
  BANK_DIRECTOR = "getBankDirectorModel",
  BANK_DEPARTMENT_DIRECTOR = "getBankDepartmentDirectorModel",
  BANK_CUSTOMER_REPRESENTATIVE = "getBankCustomerRepresentativeModel",
}
export enum ACCOUNT_TYPES {
  INVESTMENT_ACCOUNT = "Investment Account",
  DEPOSIT_ACCOUNT = "Deposit Account",
  INTEREST_ACCOUNT = "Interest Account",
  EXCHANGE_ACCOUNT = "Exchange Account",
  BANK_ACCOUNT = "Bank Account",
}
export enum BANK_BRANCH_CODE {
  SUADIYE_BRANCH = 34009800,
  CANAKKALE_BRANCH = 17006713,
  BORNOVA_BRANCH = 35004039,
  BESIKTAS_BRANCH = 34001670,
  BALMUMCU_BRANCH = 34001680,
  KOSUYOLU_BRANCH = 34003210,
}
export enum EVENT_RESULTS {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}
export enum TRANSFER_STATUSES {
  CREATED = 100,
  APPROVE_PENDING = 110,
  APPROVED = 200,
  TRANSFER_STARTED = 320,
  COMPLETED = 600,
  CANCEL_PENDING = 690,
  CANCELLED = 700,
  FAILED = 800,
}
export type TransferType = {
  _id: string;
  currencyType: string;
  status: number;
  userId: string;
  fromAccount?: string;
  toAccount: string;
  amount: number;
};
export enum TRANSACTION_TYPES {
  ATM = "ATM",
  CASH = "CASH",
  CHEQUE = "CHEQUE",
  CARD = "CARD",
  ELECTRONIC_CHEQUE = "ELECTRONIC_CHEQUE",
  INTER_BANK_TRANSFER = "INTER_BANK_TRANSFER",
  SAME_BANK_TRANSFER = "SAME_BANK_TRANSFER",
  OTHERS = "OTHERS",
}
