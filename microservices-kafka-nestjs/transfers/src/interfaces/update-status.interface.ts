import { TransferDTO } from "src/dtos/transfer.dto";

export interface IUpdateStatus {
  updateTransferStatusApproved({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO>;
  updateTransferStatusStarted({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO>;
  updateTransferStatusCancelled({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO>;
  updateTransferStatusCompleted({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO>;
  updateTransferStatusFailed({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO>;
  updateTransferStatusApprovePending({
    transferDTO,
  }: {
    transferDTO: TransferDTO;
  }): Promise<TransferDTO>;
}
