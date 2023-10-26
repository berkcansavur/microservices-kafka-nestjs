import {
  CreateAccountDTO,
  CreateBankDTO,
  CreateCustomerDTO,
  CreateTransferDTO,
  MoneyTransferDTO,
  TransferDTO,
} from "src/dtos/bank.dto";
import { Bank } from "src/schemas/banks.schema";
import { Customer } from "src/schemas/customers.schema";
import { AccountType, TransferType } from "src/types/bank.types";

export interface IBankServiceInterface {
  handleApproveTransfer({ transferDTO }: { transferDTO: TransferDTO });
  handleCreateAccount({
    createAccountDTO,
  }: {
    createAccountDTO: CreateAccountDTO;
  }): Promise<AccountType>;
  handleCreateCustomer({
    createCustomerDTO,
  }: {
    createCustomerDTO: CreateCustomerDTO;
  }): Promise<Customer>;
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
