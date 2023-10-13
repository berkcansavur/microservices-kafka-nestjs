import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  TransferDTO,
  CreateAccountDTO,
  CreateTransferDTO,
  MoneyTransferDTO,
  CreateCustomerDTO,
} from "src/dtos/bank.dto";
import { BanksRepository } from "./repositories/banks.repository";
import { ClientKafka } from "@nestjs/microservices";
import { Utils } from "../utils/utils";
import { Customer } from "./schemas/customers.schema";
@Injectable()
export class BanksService implements OnModuleInit {
  private readonly logger = new Logger(BanksService.name);
  private readonly utils = new Utils();
  constructor(
    @Inject("ACCOUNT_SERVICE") private readonly accountClient: ClientKafka,
    @Inject("TRANSFER_SERVICE") private readonly transferClient: ClientKafka,
    private readonly banksRepository: BanksRepository,
  ) {}

  async onModuleInit() {
    try {
      this.accountClient.subscribeToResponseOf("account_availability_result");
      this.logger.debug("account_availability_result topic is subscribed");
      this.accountClient.subscribeToResponseOf("handle_create_account");
      this.logger.debug("handle_create_account topic is subscribed");
      this.transferClient.subscribeToResponseOf(
        "handle_create_transfer_across_accounts",
      );
      this.logger.debug(
        "handle_create_transfer_across_accounts topic is subscribed",
      );
      this.transferClient.subscribeToResponseOf(
        "handle_create_transfer_to_account",
      );
      this.accountClient.subscribeToResponseOf(
        "money_transfer_across_accounts_result",
      );
      this.logger.debug(
        "money_transfer_across_accounts_result topic is subscribed.",
      );
      this.logger.debug(
        "handle_create_transfer_to_account topic is subscribed",
      );
    } catch (error) {
      this.logger.error("Subscription of events are failed : ", error);
    }
  }
  async handleApproveTransfer({ transferDTO }: { transferDTO: TransferDTO }) {
    const { logger, accountClient } = this;
    logger.debug("[BanksService] handle approve transfer DTO : ", transferDTO);
    return accountClient.send("account_availability_result", { transferDTO });
  }
  async handleCreateAccount({
    createAccountDTO,
  }: {
    createAccountDTO: CreateAccountDTO;
  }): Promise<any> {
    const { logger, accountClient, utils } = this;
    logger.debug("[BanksService] create account DTO: ", createAccountDTO);
    let accountNumber = utils.generateRandomNumber();
    const bankBranchCode = utils.getBanksBranchCode(
      createAccountDTO.bankBranchCode,
    );
    const accountType = utils.getAccountType(createAccountDTO.accountType);
    createAccountDTO.accountType = accountType;
    if (bankBranchCode === null) {
      throw new Error("Bank Branch Code is not found");
    }
    accountNumber = parseInt(
      bankBranchCode.toString() + accountNumber.toString(),
    );
    const createAccountDTOWithAccountNumber = {
      ...createAccountDTO,
      accountNumber: accountNumber,
    };
    logger.debug(
      "[BanksService] createAccountDTOWithAccountNumber: ",
      createAccountDTO,
    );
    return accountClient.send("handle_create_account", {
      createAccountDTOWithAccountNumber,
    });
  }
  async handleCreateCustomer({
    createCustomerDTO,
  }: {
    createCustomerDTO: CreateCustomerDTO;
  }) {
    const { logger, banksRepository, utils } = this;
    logger.debug("[BanksService] create customer DTO: ", createCustomerDTO);
    const customerNumber = utils.generateRandomNumber();
    const customerAuth = await banksRepository.createCustomerAuth({
      customerNumber,
      password: createCustomerDTO.password,
    });
    if (!customerAuth) {
      throw new Error("Customer authentication failed");
    }
    const createCustomerDTOWithAccountNumber = {
      ...createCustomerDTO,
      customerNumber,
    };
    const customer: Customer = await banksRepository.createCustomer({
      createCustomerDTOWithAccountNumber,
    });
    if (!customer) {
      throw new Error("Customer could not be created");
    }
    return `Created customers Customer Number is : ${customerAuth.customerNumber}`;
  }
  async handleCreateTransferAcrossAccounts({
    createTransferDTO,
  }: {
    createTransferDTO: CreateTransferDTO;
  }): Promise<any> {
    const { logger, transferClient, accountClient } = this;
    logger.debug(
      "[BanksService] create transfer across accounts DTO: ",
      createTransferDTO,
    );
    try {
      const transfer = await transferClient
        .send("handle_create_transfer_across_accounts", {
          createTransferDTO,
        })
        .toPromise();
      logger.debug("returned transfer", transfer);
      const result = await accountClient
        .send("money_transfer_across_accounts_result", {
          createTransfer: createTransferDTO,
        })
        .toPromise();
      logger.debug("update accounts balance result: ", result);
      return result;
    } catch (error) {
      logger.error("Error in handleCreateTransferAcrossAccounts: ", error);
      throw new Error(error);
    }
  }
  async handleCreateMoneyTransferToAccount({
    moneyTransferDTO,
  }: {
    moneyTransferDTO: MoneyTransferDTO;
  }): Promise<any> {
    const { logger, transferClient, accountClient } = this;
    logger.debug(
      "[BanksService] create transfer to account DTO: ",
      moneyTransferDTO,
    );
    // TODO: in this step there will be an banks accountId for making that
    //money request and it will be added to the MoneyTransferDTO's fields
    // but for now it will be added statically.
    let createTransferDTO = new CreateTransferDTO();
    createTransferDTO = {
      ...moneyTransferDTO,
      fromAccount: "6528c8e67ac7b576c92439aa",
    };
    try {
      const transfer = await transferClient
        .send("handle_create_transfer_to_account", { createTransferDTO })
        .toPromise();

      logger.debug("returned transfer", transfer);

      const result = await accountClient
        .send("money_transfer_across_accounts_result", {
          createTransfer: createTransferDTO,
        })
        .toPromise();

      logger.debug("update accounts balance result: ", result);

      return result;
    } catch (error) {
      logger.error("Error in handleCreateMoneyTransferToAccount: ", error);
      throw error;
    }
  }
}
