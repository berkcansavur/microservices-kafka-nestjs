import { TransferDTO } from "src/dtos/transfer.dto";
import { Transfer } from "src/schemas/transfer.schema";

export interface ITransferState {
  created(transfer: Transfer): Promise<TransferDTO>;
  approved(transferDTO: TransferDTO): Promise<TransferDTO>;
  approvedPending(transferDTO: TransferDTO): Promise<TransferDTO>;
  started(transferDTO: TransferDTO): Promise<TransferDTO>;
  completed(transferDTO: TransferDTO): Promise<TransferDTO>;
  cancelledPending(transferDTO: TransferDTO): Promise<TransferDTO>;
  cancelled(transferDTO: TransferDTO): Promise<TransferDTO>;
  failed(transferDTO: TransferDTO): Promise<TransferDTO>;
  rejected(transferDTO: TransferDTO): Promise<TransferDTO>;
}
