/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger, Scope } from "@nestjs/common";
import { ITransferState } from "../interfaces/transfer-state.interface";
import { TransferDTO } from "../dtos/transfer.dto";
import { TransfersRepository } from "src/repositories/transfers.repository";
import { Transfer } from "src/schemas/transfer.schema";

import {
  TRANSFER_ACTIONS,
  TRANSFER_STATUSES,
} from "src/constants/transfer.constants";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";

@Injectable({ scope: Scope.REQUEST })
export class TransferCreatedState implements ITransferState {
  private readonly logger = new Logger(TransferCreatedState.name);
  constructor(
    private readonly transfersRepository: TransfersRepository,
    @InjectMapper() private readonly TransferMapper: Mapper,
  ) {}
  async created(transfer: Transfer): Promise<TransferDTO> {
    const { transfersRepository, logger, TransferMapper } = this;
    logger.debug(
      `[TransferCreatedState] Update transfer statuses updated: ${JSON.stringify(
        transfer,
      )}`,
    );
    const updateTransferStatusCreated: Transfer =
      await transfersRepository.updateTransferStatus({
        transferId: transfer._id.toString(),
        status: TRANSFER_STATUSES.CREATED,
        action: TRANSFER_ACTIONS.CREATED,
        userId: transfer.userId.toString(),
      });
    return TransferMapper.map<Transfer, TransferDTO>(
      updateTransferStatusCreated,
      Transfer,
      TransferDTO,
    );
  }
  approved(transferDTO: TransferDTO): Promise<TransferDTO> {
    throw new Error(
      `Transfer status is invalid: ${JSON.stringify(transferDTO)}`,
    );
  }
  approvedPending(transferDTO: TransferDTO): Promise<TransferDTO> {
    throw new Error(
      `Transfer status is invalid: ${JSON.stringify(transferDTO)}`,
    );
  }
  started(transferDTO: TransferDTO): Promise<TransferDTO> {
    throw new Error(
      `Transfer status is invalid: ${JSON.stringify(transferDTO)}`,
    );
  }
  completed(transferDTO: TransferDTO): Promise<TransferDTO> {
    throw new Error(
      `Transfer status is invalid: ${JSON.stringify(transferDTO)}`,
    );
  }
  cancelledPending(transferDTO: TransferDTO): Promise<TransferDTO> {
    throw new Error(
      `Transfer status is invalid: ${JSON.stringify(transferDTO)}`,
    );
  }
  cancelled(transferDTO: TransferDTO): Promise<TransferDTO> {
    throw new Error(
      `Transfer status is invalid: ${JSON.stringify(transferDTO)}`,
    );
  }
  failed(transferDTO: TransferDTO): Promise<TransferDTO> {
    throw new Error(
      `Transfer status is invalid: ${JSON.stringify(transferDTO)}`,
    );
  }
  rejected(transferDTO: TransferDTO): Promise<TransferDTO> {
    throw new Error(
      `Transfer status is invalid: ${JSON.stringify(transferDTO)}`,
    );
  }
}
