import { Controller, Logger, UsePipes } from "@nestjs/common";
import { TransfersService } from "./transfers.service";
import { MessagePattern } from "@nestjs/microservices";
import { ParseIncomingRequest } from "pipes/serialize-request-data.pipe";
import {
  CreateTransferDTO,
  CreateTransferIncomingRequestDTO,
  TransferDTO,
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

  @MessagePattern("create-transfer-event")
  @UsePipes(new ParseIncomingRequest())
  async createTransfer(data: CreateTransferIncomingRequestDTO) {
    const { transfersService, TransferIncomingRequestMapper, logger } = this;
    logger.debug(
      `[TransfersController] creating account incoming request data: ${JSON.stringify(
        data,
      )}`,
    );
    const formattedRequestData: CreateTransferDTO =
      TransferIncomingRequestMapper.map<
        CreateTransferIncomingRequestDTO,
        CreateTransferDTO
      >(data, CreateTransferIncomingRequestDTO, CreateTransferDTO);
    const createdTransfer = await transfersService.createTransfer({
      createTransferRequestDTO: formattedRequestData,
    });
    return JSON.stringify(createdTransfer);
  }

  @MessagePattern("approve-transfer-event")
  @UsePipes(new ParseIncomingRequest())
  async handleTransferApproval(data: TransferDTO) {
    const { transfersService, logger } = this;
    logger.debug(
      `[TransfersController] transfer approval incoming request data: ${JSON.stringify(
        data,
      )}`,
    );
    const approvedTransfer = await transfersService.approveTransfer({
      transferApprovalDTO: data,
    });
    return JSON.stringify(approvedTransfer);
  }
}
