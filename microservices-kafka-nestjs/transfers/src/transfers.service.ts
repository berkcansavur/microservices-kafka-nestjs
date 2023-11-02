// src/transfers/transfers.service.ts
import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { TransfersRepository } from "./repositories/transfers.repository";
import {
  CreateMoneyTransferDTO,
  CreateTransferBetweenAccountsDTO,
  TransferDTO,
} from "./dtos/transfer.dto";
import { Transfer } from "./schemas/transfer.schema";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { TransferIsNotFoundException } from "./exceptions";
import { ClientKafka } from "@nestjs/microservices";
import { TransferCouldNotCreatedException } from "./exceptions/index";
import { TRANSFER_STATUSES } from "./constants/transfer.constants";
import { ITransferService } from "./interfaces/transfer-service.intrerface";
import { TransferStateFactory } from "src/factories/transfer-state.factory";

@Injectable()
export class TransfersService implements ITransferService, OnModuleInit {
  private readonly logger = new Logger(TransfersService.name);
  constructor(
    @Inject("TRANSFER_STATE_FACTORY")
    private readonly transferStateFactory: TransferStateFactory,
    @Inject("BANK_SERVICE") private readonly bankClient: ClientKafka,
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
    createTransferRequestDTO: CreateTransferBetweenAccountsDTO;
  }): Promise<TransferDTO> {
    const { transfersRepository, logger, transferStateFactory } = this;
    logger.debug(
      "[TransferService] createTransfer across accounts",
      createTransferRequestDTO,
    );
    const createdTransfer: Transfer = await transfersRepository.createTransfer({
      createMoneyTransferDTO: createTransferRequestDTO,
    });
    if (createdTransfer) {
      return (
        await transferStateFactory.getTransferState(TRANSFER_STATUSES.CREATED)
      ).created(createdTransfer);
    } else {
      throw new TransferCouldNotCreatedException(
        createTransferRequestDTO.userId,
      );
    }
  }
  async createMoneyTransferToAccount({
    moneyTransferDTO,
  }: {
    moneyTransferDTO: CreateMoneyTransferDTO;
  }): Promise<TransferDTO> {
    const { transfersRepository, logger, transferStateFactory } = this;
    logger.debug(
      "[TransferService] createTransfer to account",
      moneyTransferDTO,
    );
    const createdTransfer: Transfer = await transfersRepository.createTransfer({
      createMoneyTransferDTO: moneyTransferDTO,
    });
    if (createdTransfer) {
      return (
        await transferStateFactory.getTransferState(TRANSFER_STATUSES.CREATED)
      ).created(createdTransfer);
    }
  }
  async updateTransferStatusApproved({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO> {
    const { transferStateFactory } = this;
    const transfer: TransferDTO = await this.getTransfer({
      transferId: transferDTO._id.toString(),
    });
    return (
      await transferStateFactory.getTransferState(TRANSFER_STATUSES.APPROVED)
    ).approved(transfer);
  }
  async updateTransferStatusStarted({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO> {
    const { transferStateFactory } = this;
    const transfer: TransferDTO = await this.getTransfer({
      transferId: transferDTO._id.toString(),
    });
    return (
      await transferStateFactory.getTransferState(
        TRANSFER_STATUSES.TRANSFER_STARTED,
      )
    ).started(transfer);
  }
  async updateTransferStatusCancelled({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO> {
    const { transferStateFactory } = this;
    const transfer: TransferDTO = await this.getTransfer({
      transferId: transferDTO._id.toString(),
    });
    return (
      await transferStateFactory.getTransferState(TRANSFER_STATUSES.CANCELLED)
    ).cancelled(transfer);
  }
  async updateTransferStatusCompleted({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO> {
    const { transferStateFactory } = this;
    const transfer: TransferDTO = await this.getTransfer({
      transferId: transferDTO._id.toString(),
    });
    return (
      await transferStateFactory.getTransferState(TRANSFER_STATUSES.COMPLETED)
    ).completed(transfer);
  }
  async updateTransferStatusFailed({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO> {
    const { transferStateFactory } = this;
    const transfer: TransferDTO = await this.getTransfer({
      transferId: transferDTO._id.toString(),
    });
    return (
      await transferStateFactory.getTransferState(TRANSFER_STATUSES.FAILED)
    ).failed(transfer);
  }
  async updateTransferStatusApprovePending({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO> {
    const { transferStateFactory } = this;
    const transfer: TransferDTO = await this.getTransfer({
      transferId: transferDTO._id.toString(),
    });
    return (
      await transferStateFactory.getTransferState(
        TRANSFER_STATUSES.APPROVE_PENDING,
      )
    ).approvedPending(transfer);
  }
  async updateTransferStatusRejected({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO> {
    const { transferStateFactory } = this;
    const transfer: TransferDTO = await this.getTransfer({
      transferId: transferDTO._id.toString(),
    });
    return (
      await transferStateFactory.getTransferState(TRANSFER_STATUSES.REJECTED)
    ).rejected(transfer);
  }
}
