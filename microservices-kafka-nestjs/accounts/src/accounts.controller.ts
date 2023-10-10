import {
  Controller,
  Inject,
  Logger,
  OnModuleInit,
  UsePipes,
} from "@nestjs/common";
import { AccountService } from "./accounts.service";
import { ClientKafka, EventPattern } from "@nestjs/microservices";
import { ParseIncomingRequest } from "pipes/serialize-request-data.pipe";

@Controller("/accounts")
export class AccountsController implements OnModuleInit {
  private readonly logger = new Logger(AccountsController.name);
  constructor(
    private readonly accountsService: AccountService,
    @Inject("BANK_SERVICE") private readonly bankClient: ClientKafka,
  ) {}
  @EventPattern("create-account-event")
  @UsePipes(new ParseIncomingRequest())
  async createAccount(data: any) {
    const { accountsService, logger } = this;
    logger.debug(
      `[AccountsController] creating account incoming request data: ${JSON.stringify(
        data.createAccountRequestDTO,
      )}`,
    );
    return await accountsService.createAccount({
      createAccountDTO: data.createAccountRequestDTO,
    });
  }
  onModuleInit() {
    this.bankClient.subscribeToResponseOf("transfer_approval");
  }
}
