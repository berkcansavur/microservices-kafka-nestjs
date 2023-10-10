import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import {
  CreateAccountDTO,
  CreateTransferDTO,
  IncomingTransferRequestDTO,
} from "./dtos/api.dtos";

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @Inject("TRANSFER_SERVICE") private readonly transferClient: ClientKafka,
    @Inject("ACCOUNT_SERVICE") private readonly accountClient: ClientKafka,
  ) {}
  createMoneyTransferRequest(createTransferRequestDTO: CreateTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] createMoneyTransferRequest: ${JSON.stringify(
        createTransferRequestDTO,
      )}`,
    );
    this.transferClient.emit("create-transfer-event", {
      createTransferRequestDTO,
    });
  }
  approveTransfer(approveTransferDTO: IncomingTransferRequestDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] approveTransfer: ${JSON.stringify(approveTransferDTO)}`,
    );
    this.transferClient.emit("approve-transfer-event", {
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
    this.accountClient.emit("create-account-event", {
      createAccountRequestDTO,
    });
  }
}
