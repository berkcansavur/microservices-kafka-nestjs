import {
  Controller,
  Inject,
  Logger,
  OnModuleInit,
  UsePipes,
} from "@nestjs/common";
import { AccountService } from "./accounts.service";
import { ClientKafka, MessagePattern } from "@nestjs/microservices";
import { ParseIncomingRequest } from "pipes/serialize-request-data.pipe";
import {
  CreateAccountDTO,
  CreateAccountIncomingRequestDTO,
} from "./dtos/account.dtos";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";

@Controller("/accounts")
export class AccountsController implements OnModuleInit {
  private readonly logger = new Logger(AccountsController.name);
  constructor(
    private readonly accountsService: AccountService,
    @Inject("BANK_SERVICE") private readonly bankClient: ClientKafka,
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

  onModuleInit() {
    this.bankClient.subscribeToResponseOf("transfer_approval");
  }
}
