import { IAccountItem, IActionLogItem } from "./accounts.model";
import { ITransactionItem } from "./transactions.model";

export interface IUserProfile {
  userId: string;
  userName: string;
  userSurname: string;
  userFullName: string;
  userEmail: string;
  customerNumber?: number;
  customerSocialSecurityNumber?: number;
  customerRepresentative?: object | null;
  userAge: number;
  accounts?: IAccountItem[];
  customers?: object[];
  userActions?: IActionLogItem[];
  transactions?: ITransactionItem[];
  bank?: string | null;
  department?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
