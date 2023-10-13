import { Controller, Logger, UsePipes } from "@nestjs/common";
import { BanksService } from "./banks.service";
import { MessagePattern } from "@nestjs/microservices";
import { ParseIncomingRequest } from "pipes/serialize-request-data.pipe";
import {
  CreateAccountDTO,
  CreateTransferDTO,
  MoneyTransferDTO,
  TransferDTO,
} from "./dtos/bank.dto";

@Controller("/banks")
export class BanksController {
  private readonly logger = new Logger(BanksController.name);
  constructor(private readonly bankService: BanksService) {}

  @MessagePattern("create-account-event")
  @UsePipes(new ParseIncomingRequest())
  async createAccountEvent(data: CreateAccountDTO) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleCreateAccount({
      createAccountDTO: data,
    });
  }
  @MessagePattern("approve-transfer-event")
  @UsePipes(new ParseIncomingRequest())
  async approveTransferEvent(data: TransferDTO) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleApproveTransfer({
      transferDTO: data,
    });
  }
  @MessagePattern("create-transfer-across-accounts-event")
  @UsePipes(new ParseIncomingRequest())
  async createTransferEvent(data: CreateTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleCreateTransferAcrossAccounts({
      createTransferDTO: data,
    });
  }

  @MessagePattern("transfer-money-to-account-event")
  @UsePipes(new ParseIncomingRequest())
  async createMoneyTransferToAccountEvent(data: MoneyTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleCreateMoneyTransferToAccount({
      moneyTransferDTO: data,
    });
  }
}
