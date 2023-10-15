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
    @Inject("ACCOUNT_SERVICE") private readonly accountClient: ClientKafka,
    private readonly transfersRepository: TransfersRepository,
    @InjectMapper() private readonly TransferMapper: Mapper,
  ) {}
  async onModuleInit() {
    this.bankClient.subscribeToResponseOf("transfer_approval");
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
  async createTransferAcrossAccounts({
    createTransferRequestDTO,
  }: {
    createTransferRequestDTO: CreateTransferDTO;
  }): Promise<TransferDTO> {
    const { transfersRepository, TransferMapper, logger } = this;
    logger.debug(
      "[TransferService] createTransfer across accounts",
      createTransferRequestDTO,
    );
    const createdTransfer: Transfer = await transfersRepository.createTransfer({
      createMoneyTransferDTO: createTransferRequestDTO,
    });
    if (createdTransfer) {
      const updateTransferStatusApprovePending: Transfer =
        await transfersRepository.updateTransferStatus({
          transferId: createdTransfer._id.toString(),
          status: TRANSFER_STATUSES.CREATED,
          action: TRANSFER_ACTIONS.CREATED,
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
  async createTransferToAccount({
    moneyTransferDTO,
  }: {
    moneyTransferDTO: CreateTransferDTO;
  }): Promise<TransferDTO> {
    const { transfersRepository, logger, TransferMapper } = this;
    logger.debug(
      "[TransferService] createTransfer to account",
      moneyTransferDTO,
    );
    const createdTransfer: Transfer = await transfersRepository.createTransfer({
      createMoneyTransferDTO: moneyTransferDTO,
    });
    if (createdTransfer) {
      const updateTransferStatusApprovePending: Transfer =
        await transfersRepository.updateTransferStatus({
          transferId: createdTransfer._id.toString(),
          status: TRANSFER_STATUSES.CREATED,
          action: TRANSFER_ACTIONS.CREATED,
          userId: createdTransfer.userId.toString(),
        });
      return TransferMapper.map<Transfer, TransferDTO>(
        updateTransferStatusApprovePending,
        Transfer,
        TransferDTO,
      );
    }
  }
  async updateTransferStatusApproved({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }) {
    const { transfersRepository, TransferMapper } = this;
    const approvedTransfer: Transfer =
      await transfersRepository.updateTransferStatus({
        transferId: transferDTO._id.toString(),
        status: TRANSFER_STATUSES.APPROVED,
        action: TRANSFER_ACTIONS.APPROVED,
        userId: transferDTO.userId,
      });
    return TransferMapper.map<Transfer, TransferDTO>(
      approvedTransfer,
      Transfer,
      TransferDTO,
    );
  }
  async updateTransferStatusStarted({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO> {
    const { transfersRepository, TransferMapper } = this;
    const startedTransfer: Transfer =
      await transfersRepository.updateTransferStatus({
        transferId: transferDTO._id.toString(),
        status: TRANSFER_STATUSES.TRANSFER_STARTED,
        action: TRANSFER_ACTIONS.TRANSFER_STARTED,
        userId: transferDTO.userId,
      });
    return TransferMapper.map<Transfer, TransferDTO>(
      startedTransfer,
      Transfer,
      TransferDTO,
    );
  }
  async updateTransferStatusCancelled({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO> {
    const { transfersRepository, TransferMapper } = this;
    const cancelledTransfer: Transfer =
      await transfersRepository.updateTransferStatus({
        transferId: transferDTO._id.toString(),
        status: TRANSFER_STATUSES.CANCELLED,
        action: TRANSFER_ACTIONS.CANCELLED,
        userId: transferDTO.userId,
      });
    return TransferMapper.map<Transfer, TransferDTO>(
      cancelledTransfer,
      Transfer,
      TransferDTO,
    );
  }
  async updateTransferStatusCompleted({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO> {
    const { transfersRepository, TransferMapper } = this;
    const completedTransfer: Transfer =
      await transfersRepository.updateTransferStatus({
        transferId: transferDTO._id.toString(),
        status: TRANSFER_STATUSES.COMPLETED,
        action: TRANSFER_ACTIONS.COMPLETED,
        userId: transferDTO.userId,
      });
    return TransferMapper.map<Transfer, TransferDTO>(
      completedTransfer,
      Transfer,
      TransferDTO,
    );
  }
  async updateTransferStatusFailed({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO> {
    const { transfersRepository, TransferMapper } = this;
    const failedTransfer: Transfer =
      await transfersRepository.updateTransferStatus({
        transferId: transferDTO._id.toString(),
        status: TRANSFER_STATUSES.FAILED,
        action: TRANSFER_ACTIONS.FAILURE,
        userId: transferDTO.userId,
      });
    return TransferMapper.map<Transfer, TransferDTO>(
      failedTransfer,
      Transfer,
      TransferDTO,
    );
  }
  async updateTransferStatusApprovePending({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO> {
    const { transfersRepository, TransferMapper } = this;
    const failedTransfer: Transfer =
      await transfersRepository.updateTransferStatus({
        transferId: transferDTO._id.toString(),
        status: TRANSFER_STATUSES.APPROVE_PENDING,
        action: TRANSFER_ACTIONS.TRANSFER_AWAITS,
        userId: transferDTO.userId,
      });
    return TransferMapper.map<Transfer, TransferDTO>(
      failedTransfer,
      Transfer,
      TransferDTO,
    );
  }
}
