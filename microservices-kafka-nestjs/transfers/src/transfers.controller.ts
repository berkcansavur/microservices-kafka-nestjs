import { Controller, Logger, UsePipes } from "@nestjs/common";
import { TransfersService } from "./transfers.service";
import { MessagePattern } from "@nestjs/microservices";
import { ParseIncomingRequest } from "src/pipes/serialize-request-data.pipe";
import {
  CreateMoneyTransferDTO,
  CreateTransferBetweenAccountsDTO,
  TransferDTO,
} from "./dtos/transfer.dto";

@Controller("/transfers")
export class TransfersController {
  private readonly logger = new Logger(TransfersController.name);
  constructor(private readonly transfersService: TransfersService) {}

  @MessagePattern("handle_create_transfer_across_accounts")
  @UsePipes(new ParseIncomingRequest())
  async createTransferAcrossAccounts(data: CreateTransferBetweenAccountsDTO) {
    const { transfersService } = this;
    const createdTransfer = await transfersService.createTransferAcrossAccounts(
      {
        createTransferRequestDTO: data,
      },
    );
    const formattedTransfer = JSON.stringify(createdTransfer, null, 2);
    return formattedTransfer;
  }
  @MessagePattern("handle_create_transfer_to_account")
  @UsePipes(new ParseIncomingRequest())
  async createTransferToAccount(data: CreateMoneyTransferDTO) {
    const { transfersService } = this;
    const createdTransfer = await transfersService.createMoneyTransferToAccount(
      {
        moneyTransferDTO: data,
      },
    );
    const formattedTransfer = JSON.stringify(createdTransfer, null, 2);
    return formattedTransfer;
  }
  @MessagePattern("handle_start_transfer")
  @UsePipes(new ParseIncomingRequest())
  async startTransfer(data: TransferDTO) {
    const { transfersService } = this;
    const startedTransfer = await transfersService.updateTransferStatusStarted({
      transferDTO: data,
    });
    const formattedTransfer = JSON.stringify(startedTransfer, null, 2);
    return formattedTransfer;
  }
  @MessagePattern("handle_approve_transfer")
  @UsePipes(new ParseIncomingRequest())
  async approveTransfer(data: TransferDTO) {
    const { transfersService } = this;
    const approvedTransfer =
      await transfersService.updateTransferStatusApproved({
        transferDTO: data,
      });
    const formattedTransfer = JSON.stringify(approvedTransfer, null, 2);
    return formattedTransfer;
  }
  @MessagePattern("handle_cancel_transfer")
  @UsePipes(new ParseIncomingRequest())
  async cancelTransfer(data: TransferDTO) {
    const { transfersService } = this;
    const cancelledTransfer =
      await transfersService.updateTransferStatusCancelled({
        transferDTO: data,
      });
    const formattedTransfer = JSON.stringify(cancelledTransfer, null, 2);
    return formattedTransfer;
  }
  @MessagePattern("handle_complete_transfer")
  @UsePipes(new ParseIncomingRequest())
  async completeTransfer(data: TransferDTO) {
    const { transfersService } = this;
    const completedTransfer =
      await transfersService.updateTransferStatusCompleted({
        transferDTO: data,
      });
    const formattedTransfer = JSON.stringify(completedTransfer, null, 2);
    return formattedTransfer;
  }
  @MessagePattern("handle_failure_transfer")
  @UsePipes(new ParseIncomingRequest())
  async failureTransfer(data: TransferDTO) {
    const { transfersService } = this;
    const failedTransfer = await transfersService.updateTransferStatusFailed({
      transferDTO: data,
    });
    const formattedTransfer = JSON.stringify(failedTransfer, null, 2);
    return formattedTransfer;
  }
  @MessagePattern("handle_approve_pending_transfer")
  @UsePipes(new ParseIncomingRequest())
  async approvePendingTransfer(data: TransferDTO) {
    const { transfersService } = this;
    const failedTransfer =
      await transfersService.updateTransferStatusApprovePending({
        transferDTO: data,
      });
    const formattedTransfer = JSON.stringify(failedTransfer, null, 2);
    return formattedTransfer;
  }
  @MessagePattern("handle_reject_transfer")
  @UsePipes(new ParseIncomingRequest())
  async rejectTransfer(data: TransferDTO) {
    const { transfersService } = this;
    const rejectedTransfer =
      await transfersService.updateTransferStatusRejected({
        transferDTO: data,
      });
    const formattedTransfer = JSON.stringify(rejectedTransfer, null, 2);
    return formattedTransfer;
  }
  @MessagePattern("handle_get_transfer")
  @UsePipes(new ParseIncomingRequest())
  async getTransfer(transferId: string) {
    const { transfersService, logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        transferId,
      )}`,
    );
    const failedTransfer = await transfersService.getTransfer({
      transferId: transferId,
    });
    const formattedTransfer = JSON.stringify(failedTransfer, null, 2);
    return formattedTransfer;
  }
  @MessagePattern("handle_get_customers_transfers")
  @UsePipes(new ParseIncomingRequest())
  async getCustomersTransfer(customerId: string) {
    const { transfersService, logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        customerId,
      )}`,
    );
    const transfers = await transfersService.getCustomersTransfers({
      customerId,
    });
    return transfers;
  }
  @MessagePattern("handle_delete_transfer_records")
  @UsePipes(new ParseIncomingRequest())
  async deleteTransferRecords(transferIds: string[]) {
    const { transfersService, logger } = this;
    logger.debug(
      `[deleteTransferRecords] transferIds: ${JSON.stringify(transferIds)}`,
    );
    const transfers = await transfersService.handleDeleteTransfers({
      transferIds,
    });
    return transfers;
  }
}
