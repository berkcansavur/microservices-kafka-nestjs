import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  TransferDTO,
  CreateAccountDTO,
  CreateTransferDTO,
} from "src/dtos/bank.dto";
import { BanksRepository } from "./repositories/banks.repository";
import { ClientKafka } from "@nestjs/microservices";
@Injectable()
export class BanksService implements OnModuleInit {
  private readonly logger = new Logger(BanksService.name);
  constructor(
    @Inject("ACCOUNT_SERVICE") private readonly accountClient: ClientKafka,
    @Inject("TRANSFER_SERVICE") private readonly transferClient: ClientKafka,
    private readonly banksRepository: BanksRepository,
  ) {}

  async onModuleInit() {
    try {
      this.accountClient.subscribeToResponseOf("account_availability_result");
      this.logger.debug("account_availability_result topic is subscribed");
      this.accountClient.subscribeToResponseOf("create_account");
      this.logger.debug("create_account toic is subscribed");
      this.transferClient.subscribeToResponseOf("handle_create_transfer");
      this.logger.debug("handle_create_transfer topic is subscribed");
    } catch (error) {
      this.logger.error("Subscribtion of events are failed : ", error);
    }
  }
  async handleApproveTransfer({ transferDTO }: { transferDTO: TransferDTO }) {
    const { logger, accountClient } = this;
    logger.debug("[BanksService] handle approve transfer DTO : ", transferDTO);
    return accountClient.send("account_availability_result", { transferDTO });
  }
  async handleCreateAccount({
    createAccountDTO,
  }: {
    createAccountDTO: CreateAccountDTO;
  }): Promise<any> {
    const { logger, accountClient } = this;
    logger.debug("[BanksService] create account DTO: ", createAccountDTO);
    return accountClient.send("create_account", { createAccountDTO });
  }
  async handleCreateTransfer({
    createTransferDTO,
  }: {
    createTransferDTO: CreateTransferDTO;
  }): Promise<any> {
    const { logger, transferClient } = this;
    logger.debug("[BanksService] create transfer DTO: ", createTransferDTO);
    return transferClient.send("handle_create_transfer", { createTransferDTO });
  }
}
