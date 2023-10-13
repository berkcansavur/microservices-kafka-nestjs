import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { TransferDTO } from "src/dtos/bank.dto";
import { BanksRepository } from "./repositories/banks.repository";
import { ClientKafka } from "@nestjs/microservices";
@Injectable()
export class BanksService implements OnModuleInit {
  private readonly logger = new Logger(BanksService.name);
  constructor(
    @Inject("ACCOUNT_SERVICE") private readonly accountClient: ClientKafka,
    private readonly banksRepository: BanksRepository,
  ) {}

  async onModuleInit() {
    try {
      this.accountClient.subscribeToResponseOf("account_availability_result");
      this.logger.debug("account_availability_result toic is subscribed");
    } catch (error) {
      this.logger.error(
        "Client can not subscribed needed event error: ",
        error,
      );
    }
  }
  async approveMoneyTransfer({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<any> {
    const { logger, accountClient } = this;
    logger.debug("[BanksService] approve money transfer: ", transferDTO);

    return accountClient.send("account_availability_result", { transferDTO });
  }
}
