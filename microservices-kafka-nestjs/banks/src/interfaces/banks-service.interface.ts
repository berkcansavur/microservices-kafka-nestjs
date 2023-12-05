import { CreateBankDTO } from "src/dtos/bank.dto";
import { Bank } from "src/schemas/banks.schema";

export interface IBankServiceInterface {
  // handleApproveTransfer({
  //   transferId,
  // }: {
  //   transferId: string;
  // }): Promise<TransferType>;
  // handleCreateTransferAcrossAccounts({
  //   createTransferDTO,
  // }: {
  //   createTransferDTO: CreateTransferDTO;
  // }): Promise<TransferType>;
  // handleCreateMoneyTransferToAccount({
  //   createTransferDTO,
  // }: {
  //   createTransferDTO: MoneyTransferDTO;
  // }): Promise<TransferType>;
  handleCreateBank({
    createBankDTO,
  }: {
    createBankDTO: CreateBankDTO;
  }): Promise<Bank>;
}
