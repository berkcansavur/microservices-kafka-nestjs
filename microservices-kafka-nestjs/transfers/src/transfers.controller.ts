import { Controller, UsePipes } from "@nestjs/common";
import { TransfersService } from "./transfers.service";
import { MessagePattern } from "@nestjs/microservices";
import { ParseIncomingRequest } from "src/pipes/serialize-request-data.pipe";
import {
  CreateTransferDTO,
  CreateTransferIncomingRequestDTO,
  TransferDTO,
} from "./dtos/transfer.dto";

@Controller("/transfers")
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @MessagePattern("handle_create_transfer_across_accounts")
  @UsePipes(new ParseIncomingRequest())
  async createTransferAcrossAccounts(data: CreateTransferIncomingRequestDTO) {
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
  async createTransferToAccount(data: CreateTransferDTO) {
    const { transfersService } = this;
    const createdTransfer = await transfersService.createTransferToAccount({
      moneyTransferDTO: data,
    });
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
}
