import { Inject, Injectable, Logger } from "@nestjs/common";
import { AccountsRepository } from "./accounts.repository";
import { AccountDTO, CreateAccountDTO } from "./dtos/account.dtos";
import { Account } from "./schemas/account.schema";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);
  constructor(
    @Inject("BANK_SERVICE") private readonly bankClient: ClientKafka,
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
    const { accountsRepository, logger, AccountsMapper } = this;
    logger.debug("[AccountService getAccount]", { createAccountDTO });
    const createdAccount: Account = await accountsRepository.createAccount({
      createAccountDTO: createAccountDTO,
    });
    return AccountsMapper.map<Account, AccountDTO>(
      createdAccount,
      Account,
      AccountDTO,
    );
  }
}
