import { AccountDTO } from "src/dtos/account.dtos";
import { Account } from "src/schemas/account.schema";

export interface IAccountState {
  created(account: Account): Promise<AccountDTO>;
  banned(accountDTO: AccountDTO): Promise<AccountDTO>;
  available(accountDTO: AccountDTO): Promise<AccountDTO>;
  notAvailable(accountDTO: AccountDTO): Promise<AccountDTO>;
  inTransaction(accountDTO: AccountDTO): Promise<AccountDTO>;
  deleted(accountDTO: AccountDTO): Promise<AccountDTO>;
}
