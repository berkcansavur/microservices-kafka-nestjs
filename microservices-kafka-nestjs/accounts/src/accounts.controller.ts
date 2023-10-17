import { Controller, Logger, UsePipes } from "@nestjs/common";
import { AccountService } from "./accounts.service";
import { MessagePattern } from "@nestjs/microservices";
import { ParseIncomingRequest } from "src/pipes/serialize-request-data.pipe";
import {
  AccountDTO,
  CreateAccountDTO,
  CreateAccountIncomingRequestDTO,
  CreateMoneyTransferDTO,
  TransferDTO,
} from "./dtos/account.dtos";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { EVENT_RESULTS } from "./constants/account.constants";
import { ActionLog } from "./schemas/account.schema";

@Controller("/accounts")
export class AccountsController {
  private readonly logger = new Logger(AccountsController.name);
  constructor(
    private readonly accountsService: AccountService,
    @InjectMapper() private readonly AccountIncomingRequestMapper: Mapper,
  ) {}

  @MessagePattern("handle_create_account")
  @UsePipes(new ParseIncomingRequest())
  async createAccount(data: CreateAccountIncomingRequestDTO) {
    const { accountsService, logger, AccountIncomingRequestMapper } = this;
    logger.debug(
      `[AccountsController] creating account incoming request data: ${JSON.stringify(
        data,
      )}`,
    );
    const formattedRequestData: CreateAccountDTO =
      AccountIncomingRequestMapper.map<
        CreateAccountIncomingRequestDTO,
        CreateAccountDTO
      >(data, CreateAccountIncomingRequestDTO, CreateAccountDTO);
    const account = await accountsService.createAccount({
      createAccountDTO: formattedRequestData,
    });
    const formattedAccount = JSON.stringify(account, null, 2);
    return formattedAccount;
  }
  @MessagePattern("account_availability_result")
  @UsePipes(new ParseIncomingRequest())
  async checkAccountAvailability(data: TransferDTO) {
    const { accountsService, logger } = this;
    logger.debug(
      `[AccountsController] checkAccountAvailability incoming request data: ${JSON.stringify(
        data,
      )}`,
    );
    const is_accounts_available = await accountsService.checkTransferApproval({
      transferDTO: data,
    });
    return is_accounts_available;
  }

  @MessagePattern("money_transfer_across_accounts_result")
  @UsePipes(new ParseIncomingRequest())
  async makeMoneyTransfer(data: TransferDTO) {
    const { accountsService, logger, AccountIncomingRequestMapper } = this;
    logger.debug(
      `[AccountsController] makeMoneyTransfer incoming request data: ${JSON.stringify(
        data,
      )}`,
    );
    const createMoneyTransferDTO: CreateMoneyTransferDTO =
      AccountIncomingRequestMapper.map<TransferDTO, CreateMoneyTransferDTO>(
        data,
        TransferDTO,
        CreateMoneyTransferDTO,
      );
    const transferResult: EVENT_RESULTS =
      await accountsService.handleTransferAcrossAccounts({
        createMoneyTransferDTO,
      });
    return transferResult;
  }
  @MessagePattern("get_account")
  @UsePipes(new ParseIncomingRequest())
  async getAccount(accountId: string) {
    const { accountsService, logger } = this;
    logger.debug(
      `[AccountsController] makeMoneyTransfer incoming request data: ${JSON.stringify(
        accountId,
      )}`,
    );
    const account: AccountDTO = await accountsService.getAccount({ accountId });
    return account;
  }
  @MessagePattern("get_account")
  @UsePipes(new ParseIncomingRequest())
  async getAccountsBalance(accountId: string) {
    const { accountsService, logger } = this;
    logger.debug(
      `[AccountsController] makeMoneyTransfer incoming request data: ${JSON.stringify(
        accountId,
      )}`,
    );
    const account: AccountDTO = await accountsService.getAccount({ accountId });
    return account;
  }
  @MessagePattern("get_accounts_last_actions")
  @UsePipes(new ParseIncomingRequest())
  async getAccountsLastActions(data: {
    actionCount: number;
    accountId: string;
  }) {
    const { accountsService, logger } = this;
    logger.debug(
      `[AccountsController] makeMoneyTransfer incoming request data: ${JSON.stringify(
        data.accountId,
      )}`,
    );
    const accountLogs: ActionLog[] =
      await accountsService.getAccountsLastActions({
        accountId: data.accountId,
        actionCount: data.actionCount,
      });
    return accountLogs;
  }
}
