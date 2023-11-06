export interface ITransfers {
  items: Array<ITransferItem>;
}
export interface ITransferItem {
  _id: string;
  userId: string;
  status: number;
  currencyType: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
}
