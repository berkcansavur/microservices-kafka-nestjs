import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { AccountsRepository } from "./accounts.repository";
import {
  AccountDTO,
  CreateAccountDTO,
  CreateMoneyTransferDTO,
  TransferDTO,
} from "./dtos/account.dtos";
import { Account } from "./schemas/account.schema";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import {
  ACCOUNT_ACTIONS,
  AVAILABILITY_RESULT,
  CURRENCY_TYPES,
  EVENT_RESULTS,
} from "./constants/account.constants";
import { AccountLogic } from "./logic/account.logic";
import { TransferCouldNotCompletedException } from "./exceptions/index";
import { Utils } from "./utils/utils";

@Injectable()
export class AccountService implements OnModuleInit {
  private readonly logger = new Logger(AccountService.name);
  private readonly utils: Utils;
  constructor(
    private readonly accountsRepository: AccountsRepository,
    @InjectMapper() private readonly AccountsMapper: Mapper,
  ) {}
  async onModuleInit() {
    // this.bankClient.subscribeToResponseOf("transfer_approval");
    // await this.bankClient.connect();
  }
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
    const { accountsRepository, logger, AccountsMapper } = this;
    logger.debug("[AccountService createAccount]", { createAccountDTO });
    const createdAccount: Account = await accountsRepository.createAccount({
      createAccountDTO: createAccountDTO,
    });
    if (!createdAccount) {
      throw new Error("Account is not created");
    }
    return AccountsMapper.map<Account, AccountDTO>(
      createdAccount,
      Account,
      AccountDTO,
    );
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
    const { accountsRepository, logger, AccountsMapper } = this;
    logger.debug("[AccountService] updateBalanceOfAccount", {
      accountId,
      amount,
      currencyType,
      transactionPerformerId,
    });
    if (actionType === ACCOUNT_ACTIONS.MONEY_TRANSFERRED_TO_ACCOUNT) {
      const updatedAccount = await accountsRepository.updateAccountBalance({
        accountId,
        amount: amount,
        action: actionType,
        message: `User ${transactionPerformerId} transferred money to your account.`,
        currencyType: currencyType,
      });
      return AccountsMapper.map<Account, AccountDTO>(
        updatedAccount,
        Account,
        AccountDTO,
      );
    }
    if (actionType === ACCOUNT_ACTIONS.MONEY_TRANSFERRED_FROM_ACCOUNT) {
      const updatedAccount = await accountsRepository.updateAccountBalance({
        accountId,
        amount: -amount,
        action: actionType,
        message: `Money has been transferred from your account to account.`,
        currencyType: currencyType,
      });
      return AccountsMapper.map<Account, AccountDTO>(
        updatedAccount,
        Account,
        AccountDTO,
      );
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
            message: `Transfer Id: ${transferId}`,
            transactionPerformerId: userId,
          });
        }
      })
      .catch(() => {
        throw new TransferCouldNotCompletedException();
      });
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
            accountId: toAccountId,
            action: ACCOUNT_ACTIONS.TRANSFER_COMPLETED,
            message: `Transfer Id: ${transferId}`,
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
}
