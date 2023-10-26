import {
  AVAILABILITY_RESULT,
  CURRENCY_TYPES,
  EVENT_RESULTS,
} from "src/constants/account.constants";
import {
  AccountDTO,
  CreateAccountDTO,
  CreateMoneyTransferDTO,
  TransferDTO,
} from "src/dtos/account.dtos";
import { ActionLog, Balance } from "src/schemas/account.schema";

export interface IAccountService {
  getAccount({ accountId }: { accountId: string }): Promise<AccountDTO>;
  createAccount({
    createAccountDTO,
  }: {
    createAccountDTO: CreateAccountDTO;
  }): Promise<AccountDTO>;
  handleTransferAcrossAccounts({
    createMoneyTransferDTO,
  }: {
    createMoneyTransferDTO: CreateMoneyTransferDTO;
  }): Promise<EVENT_RESULTS>;
  checkTransferApproval({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<AVAILABILITY_RESULT>;
  getAccountBalance({ accountId }: { accountId: string }): Promise<Balance[]>;
  getAccountsBalanceOfCurrencyType({
    accountId,
    currencyType,
  }: {
    accountId: string;
    currencyType: CURRENCY_TYPES;
  }): Promise<Balance>;
  getAccountsLastBalanceActions({
    accountId,
    actionCount,
  }: {
    accountId: string;
    actionCount: number;
  }): Promise<ActionLog[]>;
}
