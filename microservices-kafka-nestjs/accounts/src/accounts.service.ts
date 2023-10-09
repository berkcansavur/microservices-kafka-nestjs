import { Injectable, Logger } from "@nestjs/common";
import { AccountsRepository } from "./accounts.repository";
import { AccountDTO, CreateAccountDTO } from "./dtos/account.dtos";
import { Account } from "./schemas/account.schema";

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);
  constructor(private readonly accountsRepository: AccountsRepository) {}

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
    const { accountsRepository, logger } = this;
    logger.debug("[AccountService getAccount]", { createAccountDTO });
    const createdAccount: Account = await accountsRepository.createAccount({
      createAccountDTO: createAccountDTO,
    });
    return createdAccount;
  }
}
