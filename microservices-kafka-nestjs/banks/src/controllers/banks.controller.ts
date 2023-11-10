import { Controller, Logger, UsePipes } from "@nestjs/common";
import { BanksService } from "../services/banks.service";
import { MessagePattern } from "@nestjs/microservices";
import { ParseIncomingRequest } from "src/pipes/serialize-request-data.pipe";
import {
  AccountIdDTO,
  AddCustomerToRepresentativeDTO,
  CreateAccountDTO,
  CreateBankDTO,
  CreateCustomerDTO,
  CreateEmployeeRegistrationToBankDTO,
  CreateTransferDTO,
  DeleteTransfersDTO,
  GetCustomersAccountsDTO,
  GetTransferDTO,
  GetUserProfileDTO,
  MoneyTransferDTO,
} from "../dtos/bank.dto";
import { CustomerIdDTO } from "src/dtos/auth.dto";

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
  async approveTransferEvent(data: GetTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleApproveTransfer({
      transferId: data.transferId,
      employeeId: data.employeeId,
    });
  }
  @MessagePattern("reject-transfer-event")
  @UsePipes(new ParseIncomingRequest())
  async rejectTransferEvent(data: GetTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleRejectTransfer({
      transferId: data.transferId,
      employeeId: data.employeeId,
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
  @MessagePattern("add-customer-to-banks-customer-representative-event")
  @UsePipes(new ParseIncomingRequest())
  async AddCustomerToCustomerRepresentative(
    data: AddCustomerToRepresentativeDTO,
  ) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks AddCustomerToCustomerRepresentative Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleAddCustomerToCustomerRepresentative({
      customerId: data.customerId,
      customerRepresentativeId: data.customerRepresentativeId,
    });
  }
  @MessagePattern("create-employee-registration-to-bank-event")
  @UsePipes(new ParseIncomingRequest())
  async createEmployeeRegistrationToBank(
    data: CreateEmployeeRegistrationToBankDTO,
  ) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleCreateEmployeeRegistrationToBank({
      employeeType: data.employeeType,
      employeeId: data.employeeId,
      bankId: data.bankId,
    });
  }
  @MessagePattern("get-customer-accounts-event")
  @UsePipes(new ParseIncomingRequest())
  async getCustomersAccounts(data: GetCustomersAccountsDTO) {
    const { logger, bankService } = this;
    logger.debug(
      `[BanksController] Banks getCustomersAccounts Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    const customer = await bankService.getCustomersAccounts({
      customerId: data.customerId,
    });
    return customer;
  }
  @MessagePattern("get-user-profile-event")
  @UsePipes(new ParseIncomingRequest())
  async getUserProfile(data: GetUserProfileDTO) {
    const { logger, bankService } = this;
    logger.debug(
      `[BanksController] Banks getUserProfile Incoming Data: `,
      data,
    );
    const user = await bankService.getUserProfile({
      userType: data.userType,
      userId: data.userId,
    });
    logger.debug(`[BanksController] User: `, user);
    const amuser = JSON.stringify(user);
    return JSON.parse(amuser);
  }
  @MessagePattern("get-customers-transfers-event")
  @UsePipes(new ParseIncomingRequest())
  async getCustomersTransfers(data: CustomerIdDTO) {
    const { logger, bankService } = this;
    logger.debug("[getCustomersTransfers] data: CustomerIdDTO: ", data);
    const transfers = await bankService.getCustomersTransfers({
      customerId: data.customerId,
    });
    return transfers;
  }
  @MessagePattern("delete-transfer-records-event")
  @UsePipes(new ParseIncomingRequest())
  async deleteTransferRecords(data: DeleteTransfersDTO) {
    const { logger, bankService } = this;
    logger.debug("[getCustomersTransfers] data: CustomerIdDTO: ", data);
    const transfers = await bankService.handleDeleteTransferRecords({
      transferIds: data.transferIds,
      customerId: data.customerId,
    });
    return transfers;
  }
  @MessagePattern("get-accounts-transfers-event")
  @UsePipes(new ParseIncomingRequest())
  async getAccountsTransfers(data: AccountIdDTO) {
    const { logger, bankService } = this;
    logger.debug("[getCustomersTransfers] data: CustomerIdDTO: ", data);
    const transfers = await bankService.handleGetAccountsTransfers({
      fromAccount: data.accountId,
    });
    return transfers;
  }
}
