// src/transfers/transfers.service.ts
import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { TransfersRepository } from "./repositories/transfers.repository";
import { CreateTransferDTO, TransferDTO } from "./dtos/transfer.dto";
import { Transfer } from "./schemas/transfer.schema";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { TransferIsNotFoundException } from "./exceptions";
import { ClientKafka } from "@nestjs/microservices";
import { TransferCouldNotCreatedException } from "./exceptions/index";
import {
  TRANSFER_ACTIONS,
  TRANSFER_STATUSES,
} from "./constants/transfer.constants";

@Injectable()
export class TransfersService implements OnModuleInit {
  private readonly logger = new Logger(TransfersService.name);
  constructor(
    @Inject("BANK_SERVICE") private readonly bankClient: ClientKafka,
    private readonly transfersRepository: TransfersRepository,
    @InjectMapper() private readonly TransferMapper: Mapper,
  ) {}
  async onModuleInit() {
    this.bankClient.subscribeToResponseOf("transfer_approval");
    await this.bankClient.connect();
  }

  async getTransfer({
    transferId,
  }: {
    transferId: string;
  }): Promise<TransferDTO> {
    const { logger, transfersRepository, TransferMapper } = this;
    logger.debug("[TransferService getTransfer]", { transferId });

    const transfer: Transfer = await transfersRepository.getTransfer({
      transferId,
    });

    if (!transfer) {
      throw new TransferIsNotFoundException({ transferId });
    }
    return TransferMapper.map<Transfer, TransferDTO>(
      transfer,
      Transfer,
      TransferDTO,
    );
  }
  async createTransfer({
    createTransferRequestDTO,
  }: {
    createTransferRequestDTO: CreateTransferDTO;
  }): Promise<TransferDTO> {
    const { transfersRepository, TransferMapper, logger } = this;
    logger.debug("[TransferService createTransfer]", createTransferRequestDTO);
    const createdTransfer: Transfer = await transfersRepository.createTransfer({
      createMoneyTransferDTO: createTransferRequestDTO,
    });
    if (createdTransfer) {
      const updateTransferStatusApprovePending: Transfer =
        await transfersRepository.updateTransferStatus({
          transferId: createdTransfer._id.toString(),
          status: TRANSFER_STATUSES.APPROVE_PENDING,
          action: TRANSFER_ACTIONS.APPROVE_PENDING,
          userId: createdTransfer.userId.toString(),
        });
      return TransferMapper.map<Transfer, TransferDTO>(
        updateTransferStatusApprovePending,
        Transfer,
        TransferDTO,
      );
    } else {
      throw new TransferCouldNotCreatedException(
        createTransferRequestDTO.userId,
      );
    }
  }

  async approveTransfer({
    transferApprovalDTO,
  }: {
    transferApprovalDTO: TransferDTO;
  }): Promise<any> {
    const { logger, bankClient, transfersRepository } = this;

    const transfer: Transfer = await transfersRepository.getTransfer({
      transferId: transferApprovalDTO._id.toString(),
    });

    if (!transfer) {
      throw new TransferIsNotFoundException({
        transferId: transferApprovalDTO._id,
      });
    }
    logger.debug("[TransferService approveTransfer]", transferApprovalDTO);

    const approvedTransferEventData = bankClient.send("transfer_approval", {
      transferApprovalDTO,
    });

    return approvedTransferEventData;
  }
}
