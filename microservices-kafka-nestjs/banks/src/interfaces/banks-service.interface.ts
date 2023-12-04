import {
  CreateAccountDTO,
  CreateBankDTO,
  CreateTransferDTO,
  MoneyTransferDTO,
} from "src/dtos/bank.dto";
import { Bank } from "src/schemas/banks.schema";
import { AccountType, TransferType } from "src/types/bank.types";

export interface IBankServiceInterface {
  handleApproveTransfer({
    transferId,
  }: {
    transferId: string;
  }): Promise<TransferType>;
  handleCreateAccount({
    createAccountDTO,
  }: {
    createAccountDTO: CreateAccountDTO;
  }): Promise<AccountType>;
  handleCreateTransferAcrossAccounts({
    createTransferDTO,
  }: {
    createTransferDTO: CreateTransferDTO;
  }): Promise<TransferType>;
  handleCreateMoneyTransferToAccount({
    createTransferDTO,
  }: {
    createTransferDTO: MoneyTransferDTO;
  }): Promise<TransferType>;
  handleCreateBank({
    createBankDTO,
  }: {
    createBankDTO: CreateBankDTO;
  }): Promise<Bank>;
}
