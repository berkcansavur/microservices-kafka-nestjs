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
