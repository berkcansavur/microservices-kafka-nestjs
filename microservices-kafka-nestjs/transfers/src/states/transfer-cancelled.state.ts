import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import {
  TRANSFER_ACTIONS,
  TRANSFER_STATUSES,
} from "src/constants/transfer.constants";
import { TransferDTO } from "src/dtos/transfer.dto";
import {
  TransferIsNotFoundException,
  TransferStatusIsNotValidException,
} from "src/exceptions";
import { ITransferState } from "src/interfaces/transfer-state.interface";
import { TransferLogic } from "src/logic/transfer.logic";
import { TransfersRepository } from "src/repositories/transfers.repository";
import { Transfer } from "src/schemas/transfer.schema";

@Injectable()
export class TransferCanceledState implements ITransferState {
  private readonly logger = new Logger(TransferCanceledState.name);
  constructor(
    private readonly transfersRepository: TransfersRepository,
    @InjectMapper() private readonly TransferMapper: Mapper,
  ) {}
  created(transfer: Transfer): Promise<TransferDTO> {
    throw new Error(`Transfer already created ${JSON.stringify(transfer)}`);
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
  async cancelled(transferDTO: TransferDTO): Promise<TransferDTO> {
    const { transfersRepository, logger, TransferMapper } = this;
    logger.debug(
      `[TransferCreatedState] Update transfer statuses updated: ${JSON.stringify(
        transferDTO,
      )}`,
    );
    const transfer: Transfer = await transfersRepository.getTransfer({
      transferId: transferDTO._id.toString(),
    });
    if (!transfer) {
      throw new TransferIsNotFoundException({
        transferId: transferDTO._id.toString(),
      });
    }
    if (
      !TransferLogic.checkTransferStatus(transferDTO.status, [
        TRANSFER_STATUSES.APPROVE_PENDING,
        TRANSFER_STATUSES.CANCEL_PENDING,
      ])
    ) {
      throw new TransferStatusIsNotValidException({
        transferStatus: transferDTO.status,
      });
    }
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
  failed(transferDTO: TransferDTO): Promise<TransferDTO> {
    throw new Error(
      `Transfer status is invalid: ${JSON.stringify(transferDTO)}`,
    );
  }
}
