import { Inject, Injectable, Logger } from "@nestjs/common";
import { AccountsRepository } from "./accounts.repository";
import {
  AccountDTO,
  CreateAccountDTO,
  CreateMoneyTransferDTO,
  TransferDTO,
} from "./dtos/account.dtos";
import { Account, ActionLog, Balance } from "./schemas/account.schema";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import {
  ACCOUNT_ACTIONS,
  ACCOUNT_STATUS,
  AVAILABILITY_RESULT,
  CURRENCY_TYPES,
  EVENT_RESULTS,
} from "./constants/account.constants";
import { AccountLogic } from "./logic/account.logic";
import { AccountStateFactory } from "./factories/account-state-factory";
import {
  AccountCouldNotCreatedException,
  AccountIsNotFoundException,
  AccountLogsAreNotFoundException,
  AccountStatusCouldNotUpdatedException,
  AccountsBalanceCouldNotRetrievedException,
  TransferCouldNotCompletedException,
} from "./exceptions/index";

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);
  constructor(
    @Inject("ACCOUNT_STATE_FACTORY")
    private readonly accountStateFactory: AccountStateFactory,
    private readonly accountsRepository: AccountsRepository,
    @InjectMapper() private readonly AccountsMapper: Mapper,
  ) {}
  async getAccount({ accountId }: { accountId: string }): Promise<AccountDTO> {
    const { accountsRepository, logger } = this;
    logger.debug("[AccountService getAccount]", { accountId });

    const account: Account = await accountsRepository.getAccount({ accountId });
    return account;
  }
  async createAccount({
    createAccountDTO,
  }: {
    createAccountDTO: CreateAccountDTO;
  }): Promise<AccountDTO> {
    const { accountsRepository, logger, accountStateFactory } = this;
    logger.debug("[AccountService createAccount]", { createAccountDTO });
    try {
      const createdAccount: Account = await accountsRepository.createAccount({
        createAccountDTO: createAccountDTO,
      });
      if (!createdAccount) {
        throw new AccountCouldNotCreatedException(createAccountDTO);
      }
      const statusUpdatedCreatedAccount = await (
        await accountStateFactory.getAccountState(ACCOUNT_STATUS.CREATED)
      ).created(createdAccount);
      if (statusUpdatedCreatedAccount) {
        return (
          await accountStateFactory.getAccountState(ACCOUNT_STATUS.AVAILABLE)
        ).available(statusUpdatedCreatedAccount);
      } else {
        throw new AccountStatusCouldNotUpdatedException(
          statusUpdatedCreatedAccount._id,
        );
      }
    } catch (error) {
      throw new Error("Account is could not created");
    }
  }
  private async updateBalanceOfAccount({
    accountId,
    amount,
    currencyType,
    actionType,
    transactionPerformerId,
  }: {
    accountId: string;
    amount: number;
    currencyType: CURRENCY_TYPES;
    actionType: ACCOUNT_ACTIONS;
    transactionPerformerId: string;
  }): Promise<AccountDTO> {
    const { accountsRepository, logger, accountStateFactory } = this;
    logger.debug("[AccountService] updateBalanceOfAccount", {
      accountId,
      amount,
      currencyType,
      transactionPerformerId,
    });
    const account: Account = await accountsRepository.getAccount({ accountId });
    const updatedStateInTransaction = await (
      await accountStateFactory.getAccountState(ACCOUNT_STATUS.IN_TRANSACTION)
    ).inTransaction(account);
    if (!updatedStateInTransaction) {
      throw new AccountStatusCouldNotUpdatedException();
    }
    if (actionType === ACCOUNT_ACTIONS.MONEY_TRANSFERRED_TO_ACCOUNT) {
      const updatedAccount = await accountsRepository.updateAccountBalance({
        accountId,
        amount: amount,
        currencyType: currencyType,
      });
      const statusUpdatedAccount: AccountDTO = await (
        await accountStateFactory.getAccountState(ACCOUNT_STATUS.AVAILABLE)
      ).available(updatedAccount);
      return statusUpdatedAccount;
    }
    if (actionType === ACCOUNT_ACTIONS.MONEY_TRANSFERRED_FROM_ACCOUNT) {
      const updatedAccount = await accountsRepository.updateAccountBalance({
        accountId,
        amount: -amount,
        currencyType: currencyType,
      });
      const statusUpdatedAccount: AccountDTO = await (
        await accountStateFactory.getAccountState(ACCOUNT_STATUS.AVAILABLE)
      ).available(updatedAccount);
      return statusUpdatedAccount;
    }
  }
  async createAccountAction({
    accountId,
    transactionPerformerId,
    action,
    message,
  }: {
    accountId: string;
    transactionPerformerId: string;
    action: ACCOUNT_ACTIONS;
    message?: string;
  }): Promise<AccountDTO> {
    const { accountsRepository, logger, AccountsMapper } = this;
    logger.debug("[AccountService] createAccountAction", {
      accountId,
      transactionPerformerId,
      action,
      message,
    });
    const updatedAccount: Account = await accountsRepository.addAction({
      accountId,
      userId: transactionPerformerId,
      action,
      message,
    });
    return AccountsMapper.map<Account, AccountDTO>(
      updatedAccount,
      Account,
      AccountDTO,
    );
  }
  async handleTransferAcrossAccounts({
    createMoneyTransferDTO,
  }: {
    createMoneyTransferDTO: CreateMoneyTransferDTO;
  }): Promise<EVENT_RESULTS> {
    const {
      transferId,
      toAccountId,
      fromAccountId,
      userId,
      amount,
      currencyType,
    } = createMoneyTransferDTO;
    const { logger } = this;
    logger.debug("[AccountService] handleTransferAcrossAccounts", {
      toAccountId,
      fromAccountId,
      userId,
      amount,
      currencyType,
    });
    const updatedToAccount = await this.updateBalanceOfAccount({
      accountId: toAccountId,
      amount,
      currencyType,
      actionType: ACCOUNT_ACTIONS.MONEY_TRANSFERRED_TO_ACCOUNT,
      transactionPerformerId: userId,
    })
      .then(async (result) => {
        if (result) {
          await this.createAccountAction({
            accountId: toAccountId,
            action: ACCOUNT_ACTIONS.TRANSFER_COMPLETED,
            message: `${amount} ${currencyType}s is transferred to account by transfer: ${transferId}`,
            transactionPerformerId: userId,
          });
        }
      })
      .catch(() => {
        throw new TransferCouldNotCompletedException();
      });
    if (fromAccountId) {
      const updatedFromAccount = await this.updateBalanceOfAccount({
        accountId: fromAccountId,
        amount,
        currencyType,
        actionType: ACCOUNT_ACTIONS.MONEY_TRANSFERRED_FROM_ACCOUNT,
        transactionPerformerId: userId,
      })
        .then(async (result) => {
          if (result) {
            await this.createAccountAction({
              accountId: fromAccountId,
              action: ACCOUNT_ACTIONS.TRANSFER_COMPLETED,
              message: `${amount} ${currencyType}s is transferred from your account by transfer: ${transferId}`,
              transactionPerformerId: userId,
            });
          }
        })
        .catch(() => {
          throw new TransferCouldNotCompletedException();
        });
      if (updatedFromAccount !== null && updatedToAccount !== null) {
        return EVENT_RESULTS.SUCCESS;
      } else {
        return EVENT_RESULTS.FAILED;
      }
    }

    if (updatedToAccount !== null) {
      return EVENT_RESULTS.SUCCESS;
    } else {
      return EVENT_RESULTS.FAILED;
    }
  }
  async checkTransferApproval({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<AVAILABILITY_RESULT> {
    const { accountsRepository, logger } = this;
    logger.debug("[AccountService] handleTransferAcrossAccounts", {
      transferDTO,
    });
    const { amount, toAccount, fromAccount, currencyType } = transferDTO;
    const transferFromAccount: Account = await accountsRepository.getAccount({
      accountId: fromAccount,
    });
    const transferToAccount: Account = await accountsRepository.getAccount({
      accountId: toAccount,
    });
    const fromAccountsBalance: number =
      await accountsRepository.GetAccountsCurrencyBalance({
        accountId: fromAccount,
        currencyType: currencyType,
      });
    if (
      !AccountLogic.checkAccountAvailability({ account: transferToAccount }) &&
      AccountLogic.checkAccountAvailability({ account: transferFromAccount })
    ) {
      return AVAILABILITY_RESULT.ACCOUNT_IS_NOT_AVAILABLE;
    }
    if (
      !AccountLogic.checkAccountCurrencyBalanceIsAvailable({
        amount: amount,
        accountBalance: fromAccountsBalance,
      })
    ) {
      return AVAILABILITY_RESULT.ACCOUNT_IS_NOT_AVAILABLE;
    } else {
      return AVAILABILITY_RESULT.ACCOUNT_IS_AVAILABLE;
    }
  }
  async getAccountBalance({
    accountId,
  }: {
    accountId: string;
  }): Promise<Balance[]> {
    const { accountsRepository } = this;
    try {
      const account = await accountsRepository.getAccount({ accountId });
      if (!account) {
        throw new AccountIsNotFoundException({ message: accountId });
      }
      const balances = account.balance;
      return balances;
    } catch (error) {
      throw new AccountsBalanceCouldNotRetrievedException({ message: error });
    }
  }
  async getAccountsBalanceOfCurrencyType({
    accountId,
    currencyType,
  }: {
    accountId: string;
    currencyType: CURRENCY_TYPES;
  }): Promise<Balance> {
    const { accountsRepository } = this;
    try {
      const account = await accountsRepository.getAccount({ accountId });
      if (!account) {
        throw new AccountIsNotFoundException({ message: accountId });
      }
      const balances = account.balance;
      const balance = balances.find(
        (balance) => balance.currencyType === currencyType,
      );
      if (!balance) {
        throw new AccountsBalanceCouldNotRetrievedException({
          message: `${account.accountName} has no balance on this ${currencyType} currency type`,
        });
      }
      return balance;
    } catch (error) {
      throw new AccountsBalanceCouldNotRetrievedException({ message: error });
    }
  }
  async getAccountsLastBalanceActions({
    accountId,
    actionCount,
  }: {
    accountId: string;
    actionCount: number;
  }): Promise<ActionLog[]> {
    const { accountsRepository } = this;
    try {
      const account = await accountsRepository.getAccount({ accountId });
      if (!account) {
        throw new AccountIsNotFoundException({ message: accountId });
      }
      const actionLogs = account.actionLogs.slice(-actionCount).reverse();
      return actionLogs;
    } catch (error) {
      throw new AccountLogsAreNotFoundException({ message: error });
    }
  }
}
