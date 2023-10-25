import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Logger } from "@nestjs/common";
import { AccountsRepository } from "src/accounts.repository";
import {
  ACCOUNT_ACTIONS,
  ACCOUNT_STATUS,
} from "src/constants/account.constants";
import { AccountDTO } from "src/dtos/account.dtos";
import {
  AccountIsNotFoundException,
  AccountStatusIsNotValidException,
} from "src/exceptions";
import { IAccountState } from "src/interfaces/account-state.interface";
import { AccountLogic } from "src/logic/account.logic";
import { Account } from "src/schemas/account.schema";

export class AccountAvailableState implements IAccountState {
  private readonly logger = new Logger(AccountAvailableState.name);
  constructor(
    private readonly accountsRepository: AccountsRepository,
    @InjectMapper() private readonly AccountMapper: Mapper,
  ) {}
  async created(account: Account): Promise<AccountDTO> {
    throw new Error(`Account status is invalid: ${JSON.stringify(account)}`);
  }
  async available(accountDTO: AccountDTO): Promise<AccountDTO> {
    const { logger, accountsRepository, AccountMapper } = this;
    logger.debug(
      `[AccountAvailableState] Update account statuses available: ${JSON.stringify(
        accountDTO,
      )}`,
    );
    const account: Account = await accountsRepository.getAccount({
      accountId: accountDTO._id.toString(),
    });
    if (!account) {
      throw new AccountIsNotFoundException({
        accountId: accountDTO._id.toString(),
      });
    }
    if (
      !AccountLogic.checkAccountStatus(accountDTO.status, [
        ACCOUNT_STATUS.CREATED,
        ACCOUNT_STATUS.IN_TRANSACTION,
        ACCOUNT_STATUS.NOT_AVAILABLE,
        ACCOUNT_STATUS.BANNED,
      ])
    ) {
      throw new AccountStatusIsNotValidException({
        accountStatus: accountDTO.status,
      });
    }
    const availableAccount: Account =
      await accountsRepository.updateAccountStatus({
        accountId: accountDTO._id.toString(),
        status: ACCOUNT_STATUS.AVAILABLE,
        action: ACCOUNT_ACTIONS.ACCOUNT_STATUS_UPDATED,
        message: `Account is set available by ${account.userId}`,
        userId: accountDTO.userId.toString(),
      });
    return AccountMapper.map<Account, AccountDTO>(
      availableAccount,
      Account,
      AccountDTO,
    );
  }
  async inTransaction(accountDTO: AccountDTO): Promise<AccountDTO> {
    throw new Error(`Account status is invalid: ${JSON.stringify(accountDTO)}`);
  }
  async notAvailable(accountDTO: AccountDTO): Promise<AccountDTO> {
    throw new Error(`Account status is invalid: ${JSON.stringify(accountDTO)}`);
  }
  async banned(accountDTO: AccountDTO): Promise<AccountDTO> {
    throw new Error(`Account status is invalid: ${JSON.stringify(accountDTO)}`);
  }
  async deleted(accountDTO: AccountDTO): Promise<AccountDTO> {
    throw new Error(`Account status is invalid: ${JSON.stringify(accountDTO)}`);
  }
}
