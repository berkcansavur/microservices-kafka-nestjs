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
    @Inject("BANK_SERVICE") private readonly bankClient: ClientKafka,
  ) {}
  async onModuleInit() {
    try {
      this.bankClient.subscribeToResponseOf("create-transfer-event");
      this.logger.debug("reate-transfer-event topic is subscribed");
      this.bankClient.subscribeToResponseOf("approve-transfer-event");
      this.logger.debug("approve-transfer-event topic is subscribed");
      this.bankClient.subscribeToResponseOf("create-account-event");
      this.logger.debug("create-account-event topic is subscribed");
      this.logger.debug(
        "Subscription of responses is successfully established.",
      );
    } catch (error) {
      this.logger.error("Subscription of responses is failed", error);
    }
  }
  sendCreateMoneyTransferRequest(createTransferRequestDTO: CreateTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] createMoneyTransferRequest: ${JSON.stringify(
        createTransferRequestDTO,
      )}`,
    );
    return this.bankClient.send("create-transfer-event", {
      createTransferRequestDTO,
    });
  }
  sendApproveTransferRequest(approveTransferDTO: IncomingTransferRequestDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] approveTransfer: ${JSON.stringify(approveTransferDTO)}`,
    );
    return this.bankClient.send("approve-transfer-event", {
      approveTransferDTO,
    });
  }
  sendCreateAccountRequest(createAccountRequestDTO: CreateAccountDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] createAccountRequest: ${JSON.stringify(
        createAccountRequestDTO,
      )}`,
    );
    return this.bankClient.send("create-account-event", {
      createAccountRequestDTO,
    });
  }
}
