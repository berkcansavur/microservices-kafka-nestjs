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
export class TransferApprovedState implements ITransferState {
  private readonly logger = new Logger(TransferApprovedState.name);
  constructor(
    private readonly transfersRepository: TransfersRepository,
    @InjectMapper() private readonly TransferMapper: Mapper,
  ) {}
  created(transfer: Transfer): Promise<TransferDTO> {
    throw new Error(`Transfer status is invalid: ${JSON.stringify(transfer)}`);
  }
  async approved(transferDTO: TransferDTO): Promise<TransferDTO> {
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
        TRANSFER_STATUSES.CREATED,
        TRANSFER_STATUSES.APPROVE_PENDING,
      ])
    ) {
      throw new TransferStatusIsNotValidException({
        transferStatus: transferDTO.status,
      });
    }
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
  deleted(transferDTO: TransferDTO): Promise<TransferDTO> {
    throw new Error(
      `Transfer status is invalid: ${JSON.stringify(transferDTO)}`,
    );
  }
}
