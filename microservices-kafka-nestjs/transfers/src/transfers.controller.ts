import {
  Controller,
  Inject,
  Logger,
  OnModuleInit,
  UsePipes,
} from "@nestjs/common";
import { TransfersService } from "./transfers.service";
import { ClientKafka, MessagePattern } from "@nestjs/microservices";
import { ParseIncomingRequest } from "pipes/serialize-request-data.pipe";
import {
  CreateTransferDTO,
  CreateTransferIncomingRequestDTO,
} from "./dtos/transfer.dto";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";

@Controller("/transfers")
export class TransfersController implements OnModuleInit {
  private readonly logger = new Logger(TransfersController.name);
  constructor(
    private readonly transfersService: TransfersService,
    @Inject("BANK_SERVICE") private readonly bankClient: ClientKafka,
    @InjectMapper() private readonly TransferIncomingRequestMapper: Mapper,
  ) {}

  @MessagePattern("create-transfer-event")
  @UsePipes(new ParseIncomingRequest())
  async createTransfer(data: CreateTransferIncomingRequestDTO) {
    const { transfersService, TransferIncomingRequestMapper, logger } = this;
    logger.debug(
      `[AccountsController] creating account incoming request data: ${JSON.stringify(
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
    this.bankClient.emit("transfer-created-event", createdTransfer);
    return JSON.stringify(createdTransfer);
  }

  @MessagePattern("approve-transfer-event")
  @UsePipes(new ParseIncomingRequest())
  async handleTransferApproval(data: any) {
    console.log("handle transfer approval : ", data);
    const approvedTransfer = await this.transfersService.approveTransfer(data);
    return JSON.stringify(approvedTransfer);
  }
  onModuleInit() {
    this.bankClient.subscribeToResponseOf("transfer_approval");
  }
}
