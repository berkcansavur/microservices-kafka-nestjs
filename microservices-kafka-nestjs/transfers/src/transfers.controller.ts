import {
  Controller,
  Inject,
  Logger,
  OnModuleInit,
  UsePipes,
} from "@nestjs/common";
import { TransfersService } from "./transfers.service";
import { ClientKafka, EventPattern } from "@nestjs/microservices";
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

  @EventPattern("create-transfer-event")
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
    return await transfersService.createTransfer({
      createTransferRequestDTO: formattedRequestData,
    });
  }

  @EventPattern("approve-transfer-event")
  handleTransferApproval(data: any) {
    console.log("handle transfer approval : ", data);
    this.transfersService.approveTransfer(data);
  }
  onModuleInit() {
    this.bankClient.subscribeToResponseOf("transfer_approval");
  }
}
