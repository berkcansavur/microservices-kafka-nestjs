import { Controller, Logger, UsePipes } from "@nestjs/common";
import { BanksService } from "./banks.service";
import { MessagePattern } from "@nestjs/microservices";
import { ParseIncomingRequest } from "pipes/serialize-request-data.pipe";
import { TransferDTO } from "./dtos/bank.dto";

@Controller("/banks")
export class BanksController {
  private readonly logger = new Logger(BanksController.name);
  constructor(private readonly bankService: BanksService) {}

  @MessagePattern("transfer_approval")
  @UsePipes(new ParseIncomingRequest())
  async approveTransfer(data: TransferDTO) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    const transferApproval = await this.bankService.approveMoneyTransfer({
      transferDTO: data,
    });
    return JSON.stringify(transferApproval);
  }
}
