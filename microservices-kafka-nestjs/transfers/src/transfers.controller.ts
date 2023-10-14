import { Controller, Logger, UsePipes } from "@nestjs/common";
import { TransfersService } from "./transfers.service";
import { MessagePattern } from "@nestjs/microservices";
import { ParseIncomingRequest } from "pipes/serialize-request-data.pipe";
import {
  CreateTransferDTO,
  CreateTransferIncomingRequestDTO,
} from "./dtos/transfer.dto";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";

@Controller("/transfers")
export class TransfersController {
  private readonly logger = new Logger(TransfersController.name);
  constructor(
    private readonly transfersService: TransfersService,
    @InjectMapper() private readonly TransferIncomingRequestMapper: Mapper,
  ) {}

  @MessagePattern("handle_create_transfer_across_accounts")
  @UsePipes(new ParseIncomingRequest())
  async createTransferAcrossAccounts(data: CreateTransferIncomingRequestDTO) {
    const { transfersService, logger } = this;
    logger.debug(
      `[TransfersController] creating money transfer across accounts request data: ${JSON.stringify(
        data,
      )}`,
    );
    const createdTransfer = await transfersService.createTransferAcrossAccounts(
      {
        createTransferRequestDTO: data,
      },
    );
    return createdTransfer;
  }
  @MessagePattern("handle_create_transfer_to_account")
  @UsePipes(new ParseIncomingRequest())
  async createTransferToAccount(data: CreateTransferDTO) {
    const { transfersService, logger } = this;
    logger.debug(
      `[TransfersController] creating money transfer to account request data: ${JSON.stringify(
        data,
      )}`,
    );
    const createdTransfer = await transfersService.createTransferToAccount({
      moneyTransferDTO: data,
    });
    return createdTransfer;
  }
}
