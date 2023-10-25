import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Logger } from "@nestjs/common";
import { AccountsRepository } from "src/accounts.repository";
import {
  ACCOUNT_ACTIONS,
  ACCOUNT_STATUS,
} from "src/constants/account.constants";
import { AccountDTO } from "src/dtos/account.dtos";
import { IAccountState } from "src/interfaces/account-state.interface";
import { Account } from "src/schemas/account.schema";

export class AccountCreatedState implements IAccountState {
  private readonly logger = new Logger(AccountCreatedState.name);
  constructor(
    private readonly accountsRepository: AccountsRepository,
    @InjectMapper() private readonly AccountMapper: Mapper,
  ) {}
  async created(account: Account): Promise<AccountDTO> {
    const { accountsRepository, logger, AccountMapper } = this;
    logger.debug(
      `[AccountCreatedState] Update account statuses created: ${JSON.stringify(
        account,
      )}`,
    );
    const updatedAccountStatusCreated: Account =
      await accountsRepository.updateAccountStatus({
        accountId: account._id.toString(),
        status: ACCOUNT_STATUS.CREATED,
        action: ACCOUNT_ACTIONS.CREATED,
        message: `Account is successfully created by ${account.userId}`,
        userId: account.userId.toString(),
      });
    return AccountMapper.map<Account, AccountDTO>(
      updatedAccountStatusCreated,
      Account,
      AccountDTO,
    );
  }
  async available(accountDTO: AccountDTO): Promise<AccountDTO> {
    throw new Error(`Account status is invalid: ${JSON.stringify(accountDTO)}`);
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
