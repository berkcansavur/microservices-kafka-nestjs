export type AccountType = {
  _id: string;
  userId: string;
  accountName: string;
  accountType: string;
  accountNumber: number;
  interest: number;
  balance: any;
  status: number;
  actionLogs: any;
  createdAt: Date;
  updatedAt: Date;
  approvedAt: Date;
};

export type TransferType = {
  _id: string;
  currencyType: string;
  status: number;
  userId: string;
  fromAccount?: string;
  toAccount: string;
  amount: number;
};
export type CustomerType = {
  _id: string;
  customerName: string;
  customerSurname: string;
  customerNumber: number;
  customerAge: number;
  customerEmail: string;
  customerSocialSecurityNumber: number;
  password: string;
  accounts: string[];
  customerActions: any[];
  createdAt: Date;
  updatedAt: Date;
  approvedAt: Date;
};
