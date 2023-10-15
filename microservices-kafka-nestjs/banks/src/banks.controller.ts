import { Controller, Logger, UsePipes } from "@nestjs/common";
import { BanksService } from "./banks.service";
import { MessagePattern } from "@nestjs/microservices";
import { ParseIncomingRequest } from "src/pipes/serialize-request-data.pipe";
import {
  CreateAccountDTO,
  CreateBankCustomerRepresentativeDTO,
  CreateBankDTO,
  CreateBankDepartmentDirectorDTO,
  CreateBankDirectorDTO,
  CreateCustomerDTO,
  CreateTransferDTO,
  MoneyTransferDTO,
  TransferDTO,
} from "./dtos/bank.dto";

@Controller("/banks")
export class BanksController {
  private readonly logger = new Logger(BanksController.name);
  constructor(private readonly bankService: BanksService) {}

  @MessagePattern("create-account-event")
  @UsePipes(new ParseIncomingRequest())
  async createAccountEvent(data: CreateAccountDTO) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleCreateAccount({
      createAccountDTO: data,
    });
  }
  @MessagePattern("create-customer-event")
  @UsePipes(new ParseIncomingRequest())
  async createCustomerEvent(data: CreateCustomerDTO) {
    const { logger, bankService } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    const customer = await bankService.handleCreateCustomer({
      createCustomerDTO: data,
    });
    return customer;
  }
  @MessagePattern("approve-transfer-event")
  @UsePipes(new ParseIncomingRequest())
  async approveTransferEvent(data: TransferDTO) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleApproveTransfer({
      transferDTO: data,
    });
  }
  @MessagePattern("create-transfer-across-accounts-event")
  @UsePipes(new ParseIncomingRequest())
  async createTransferEvent(data: CreateTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleCreateTransferAcrossAccounts({
      createTransferDTO: data,
    });
  }

  @MessagePattern("create-bank-director-event")
  @UsePipes(new ParseIncomingRequest())
  async createBankDirectorEvent(data: CreateBankDirectorDTO) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks createBankDirectorEvent Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleCreateBankDirector({
      createBankDirectorDTO: data,
    });
  }
  @MessagePattern("create-bank-department-director-event")
  @UsePipes(new ParseIncomingRequest())
  async createBankDepartmentDirectorEvent(
    data: CreateBankDepartmentDirectorDTO,
  ) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks createBankDirectorEvent Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleCreateBankDepartmentDirector({
      createBankDepartmentDirectorDTO: data,
    });
  }
  @MessagePattern("create-bank-customer-representative-event")
  @UsePipes(new ParseIncomingRequest())
  async createBankCustomerRepresentativeEvent(
    data: CreateBankCustomerRepresentativeDTO,
  ) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks createBankCustomerRepresentativeEvent Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleCreateBankCustomerRepresentative({
      createBankCustomerRepresentativeDTO: data,
    });
  }
  @MessagePattern("create-bank-event")
  @UsePipes(new ParseIncomingRequest())
  async createBankEvent(data: CreateBankDTO) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleCreateBank({
      createBankDTO: data,
    });
  }
  @MessagePattern("transfer-money-to-account-event")
  @UsePipes(new ParseIncomingRequest())
  async createMoneyTransferToAccountEvent(data: MoneyTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleCreateMoneyTransferToAccount({
      createTransferDTO: data,
    });
  }
}
