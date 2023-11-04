export interface IAccounts {}
export interface IAccountItem {
  _id: string;
  userId: string;
  accountName: string;
  accountType: string;
  accountNumber: number;
  interest: number;
  status: number;
  balance: Array<IBalanceItem>;
  actionLogs: Array<IActionLogItem>;
  createdAt: Date;
  updatedAt: Date;
}
export interface IBalanceItem {
  currencyType: string;
  amount: number;
}
export interface IActionLogItem {
  action: number;
  message: string;
  user: string;
  occurredAt: Date;
}
