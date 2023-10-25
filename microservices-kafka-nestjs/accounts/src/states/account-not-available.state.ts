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

export class AccountNotAvailableState implements IAccountState {
  private readonly logger = new Logger(AccountNotAvailableState.name);
  constructor(
    private readonly accountsRepository: AccountsRepository,
    @InjectMapper() private readonly AccountMapper: Mapper,
  ) {}
  async created(account: Account): Promise<AccountDTO> {
    throw new Error(`Account status is invalid: ${JSON.stringify(account)}`);
  }
  async available(accountDTO: AccountDTO): Promise<AccountDTO> {
    throw new Error(`Account status is invalid: ${JSON.stringify(accountDTO)}`);
  }
  async inTransaction(accountDTO: AccountDTO): Promise<AccountDTO> {
    throw new Error(`Account status is invalid: ${JSON.stringify(accountDTO)}`);
  }
  async notAvailable(accountDTO: AccountDTO): Promise<AccountDTO> {
    const { logger, accountsRepository, AccountMapper } = this;
    logger.debug(
      `[AccountNotAvailableState] Update account statuses not available: ${JSON.stringify(
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
        ACCOUNT_STATUS.AVAILABLE,
      ])
    ) {
      throw new AccountStatusIsNotValidException({
        accountStatus: accountDTO.status,
      });
    }
    const notAvailableAccount: Account =
      await accountsRepository.updateAccountStatus({
        accountId: accountDTO._id.toString(),
        status: ACCOUNT_STATUS.NOT_AVAILABLE,
        action: ACCOUNT_ACTIONS.ACCOUNT_STATUS_UPDATED,
        message: `Account is set not available by ${account.userId}`,
        userId: accountDTO.userId.toString(),
      });
    return AccountMapper.map<Account, AccountDTO>(
      notAvailableAccount,
      Account,
      AccountDTO,
    );
  }
  async banned(accountDTO: AccountDTO): Promise<AccountDTO> {
    throw new Error(`Account status is invalid: ${JSON.stringify(accountDTO)}`);
  }
  async deleted(accountDTO: AccountDTO): Promise<AccountDTO> {
    throw new Error(`Account status is invalid: ${JSON.stringify(accountDTO)}`);
  }
}
