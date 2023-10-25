import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Logger } from "@nestjs/common";
import { AccountsRepository } from "src/accounts.repository";
import {
  ACCOUNT_ACTIONS,
  CURRENCY_TYPES,
} from "src/constants/account.constants";
import { AccountDTO } from "src/dtos/account.dtos";
import { AccountActionIsNotValidException } from "src/exceptions";
import { IAccountAction } from "src/interfaces/account-action.interface";
import { Account } from "src/schemas/account.schema";

export class MoneyTransferredToAccountAction implements IAccountAction {
  private readonly logger = new Logger(MoneyTransferredToAccountAction.name);
  constructor(
    private readonly accountsRepository: AccountsRepository,
    @InjectMapper() private readonly AccountsMapper: Mapper,
  ) {}
  moneyTransferFromAccount(
    accountId: string,
    transactionPerformerId: string,
    amount: number,
    currencyType: CURRENCY_TYPES,
    transferId: string,
  ): Promise<AccountDTO> {
    throw new AccountActionIsNotValidException({
      accountId,
      transactionPerformerId,
      amount,
      currencyType,
      transferId,
    });
  }
  async moneyTransferToAccount(
    accountId: string,
    transactionPerformerId: string,
    amount: number,
    currencyType: CURRENCY_TYPES,
    transferId: string,
  ): Promise<AccountDTO> {
    const { accountsRepository, logger, AccountsMapper } = this;
    logger.debug("[MoneyTransferredToAccountAction] moneyTransferToAccount", {
      accountId,
      transactionPerformerId,
      amount,
      currencyType,
      transferId,
    });
    const updatedAccount: Account = await accountsRepository.addAction({
      accountId,
      userId: transactionPerformerId,
      action: ACCOUNT_ACTIONS.MONEY_TRANSFERRED_TO_ACCOUNT,
      message: `${amount} ${currencyType}s is transferred to account by transfer: ${transferId}`,
    });
    return AccountsMapper.map<Account, AccountDTO>(
      updatedAccount,
      Account,
      AccountDTO,
    );
  }
}
