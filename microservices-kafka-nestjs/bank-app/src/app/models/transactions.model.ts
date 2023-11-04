import { ITransferItem } from "./transfers.model";

export interface ITransactions {
  item: Array<ITransactionItem>;
}
export interface ITransactionItem {
  transactionType: string;
  result: string;
  customer: string;
  transfer: ITransferItem;
  occurredAt: Date;
}
