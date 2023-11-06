import {
  CreateMoneyTransferDTO,
  CreateTransferBetweenAccountsDTO,
  TransferDTO,
} from "src/dtos/transfer.dto";

export interface ITransferService {
  getTransfer({ transferId }: { transferId: string }): Promise<TransferDTO>;
  createTransferAcrossAccounts({
    createTransferRequestDTO,
  }: {
    createTransferRequestDTO: CreateTransferBetweenAccountsDTO;
  }): Promise<TransferDTO>;
  createMoneyTransferToAccount({
    moneyTransferDTO,
  }: {
    moneyTransferDTO: CreateMoneyTransferDTO;
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
  updateTransferStatusDeleted({
    transferId,
  }: {
    transferId: string;
  }): Promise<TransferDTO>;
}
