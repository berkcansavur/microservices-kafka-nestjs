import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import {
  CreateAccountDTO,
  CreateTransferDTO,
  IncomingTransferRequestDTO,
} from "./dtos/api.dtos";

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @Inject("TRANSFER_SERVICE") private readonly transferClient: ClientKafka,
    @Inject("ACCOUNT_SERVICE") private readonly accountClient: ClientKafka,
  ) {}
  async onModuleInit() {
    this.transferClient.subscribeToResponseOf("create-transfer-event");
    this.transferClient.subscribeToResponseOf("approve-transfer-event");
    this.accountClient.subscribeToResponseOf("create-account-event");
  }
  createMoneyTransferRequest(createTransferRequestDTO: CreateTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] createMoneyTransferRequest: ${JSON.stringify(
        createTransferRequestDTO,
      )}`,
    );
    return this.transferClient.send("create-transfer-event", {
      createTransferRequestDTO,
    });
  }
  approveTransfer(approveTransferDTO: IncomingTransferRequestDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] approveTransfer: ${JSON.stringify(approveTransferDTO)}`,
    );
    return this.transferClient.send("approve-transfer-event", {
      approveTransferDTO,
    });
  }
  createAccountRequest(createAccountRequestDTO: CreateAccountDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] createAccountRequest: ${JSON.stringify(
        createAccountRequestDTO,
      )}`,
    );
    return this.accountClient.send("create-account-event", {
      createAccountRequestDTO,
    });
  }
}
