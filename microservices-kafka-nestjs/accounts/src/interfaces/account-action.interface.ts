import { AccountDTO } from "src/dtos/account.dtos";
import { CURRENCY_TYPES } from "../constants/account.constants";
export interface IAccountAction {
  moneyTransferFromAccount(
    accountId: string,
    transactionPerformerId: string,
    amount: number,
    currencyType: CURRENCY_TYPES,
    transferId: string,
  ): Promise<AccountDTO>;
  moneyTransferToAccount(
    accountId: string,
    transactionPerformerId: string,
    amount: number,
    currencyType: CURRENCY_TYPES,
    transferId: string,
  ): Promise<AccountDTO>;
}
