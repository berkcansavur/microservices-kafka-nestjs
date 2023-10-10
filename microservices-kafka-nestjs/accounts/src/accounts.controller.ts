import { Controller, Logger, UsePipes } from "@nestjs/common";
import { AccountService } from "./accounts.service";
import { MessagePattern } from "@nestjs/microservices";
import { ParseIncomingRequest } from "src/pipes/serialize-request-data.pipe";
import {
  CreateAccountDTO,
  CreateAccountIncomingRequestDTO,
  CreateMoneyTransferDTO,
  IncomingCreateMoneyTransferDTO,
  TransferDTO,
} from "./dtos/account.dtos";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";

@Controller("/accounts")
export class AccountsController {
  private readonly logger = new Logger(AccountsController.name);
  constructor(
    private readonly accountsService: AccountService,
    @InjectMapper() private readonly AccountIncomingRequestMapper: Mapper,
  ) {}

  @MessagePattern("create-account-event")
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
    return JSON.stringify(account);
  }
  @MessagePattern("money-transfer-across-accounts-result")
  async makeMoneyTransfer(data: IncomingCreateMoneyTransferDTO) {
    const { accountsService, logger, AccountIncomingRequestMapper } = this;
    logger.debug(
      `[AccountsController] makeMoneyTransfer incoming request data: ${JSON.stringify(
        data,
      )}`,
    );
    const createMoneyTransferDTO: CreateMoneyTransferDTO =
      AccountIncomingRequestMapper.map<
        IncomingCreateMoneyTransferDTO,
        CreateMoneyTransferDTO
      >(data, IncomingCreateMoneyTransferDTO, CreateMoneyTransferDTO);
    const transferResult = await accountsService.handleTransferAcrossAccounts({
      createMoneyTransferDTO,
    });
    return JSON.stringify(transferResult);
  }

  @MessagePattern("account_availability_check")
  @UsePipes(new ParseIncomingRequest())
  async checkAccountAvailability(data: IncomingCreateMoneyTransferDTO) {
    const { accountsService, logger, AccountIncomingRequestMapper } = this;
    logger.debug(
      `[AccountsController] checkAccountAvailability incoming request data: ${JSON.stringify(
        data,
      )}`,
    );
    const transferDTO: TransferDTO = AccountIncomingRequestMapper.map<
      IncomingCreateMoneyTransferDTO,
      TransferDTO
    >(data, IncomingCreateMoneyTransferDTO, TransferDTO);
    const approvalResult = await accountsService.checkTransferApproval({
      transferDTO,
    });
    return JSON.stringify(approvalResult);
  }
}
