import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  TransferDTO,
  CreateAccountDTO,
  CreateTransferDTO,
  MoneyTransferDTO,
  CreateCustomerDTO,
  CreateBankCustomerRepresentativeDTO,
  CreateBankDTO,
  CreateBankDirectorDTO,
  CreateBankDepartmentDirectorDTO,
} from "src/dtos/bank.dto";
import { BanksRepository } from "./repositories/banks.repository";
import { ClientKafka } from "@nestjs/microservices";
import { Utils } from "./utils/utils";
import { Customer } from "./schemas/customers.schema";
import { CustomersService } from "./customers/customers.service";
import { BanksLogic } from "./logic/banks.logic";
import { AccountType } from "./types/bank.types";
@Injectable()
export class BanksService implements OnModuleInit {
  private readonly logger = new Logger(BanksService.name);
  private readonly utils = new Utils();
  constructor(
    @Inject("ACCOUNT_SERVICE") private readonly accountClient: ClientKafka,
    @Inject("TRANSFER_SERVICE") private readonly transferClient: ClientKafka,
    private readonly banksRepository: BanksRepository,
    private readonly customersService: CustomersService,
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
    const { logger, accountClient, utils, customersService } = this;
    logger.debug("[BanksService] create account DTO: ", createAccountDTO);
    let accountNumber = utils.generateRandomNumber();
    if (!BanksLogic.isAccountTypeIsValid({ accountDTO: createAccountDTO })) {
      throw new Error("Account type is not valid");
    }
    if (!BanksLogic.isValidBankBranchCode(createAccountDTO.bankBranchCode)) {
      throw new Error(
        "Invalid Bank Branch Code: " + createAccountDTO.bankBranchCode,
      );
    }
    const branchCode = utils.getBanksBranchCode(
      createAccountDTO.bankBranchCode,
    );
    const accountType = utils.getAccountType(createAccountDTO.accountType);
    createAccountDTO.accountType = accountType;
    accountNumber = utils.combineNumbers({ branchCode, accountNumber });
    const createAccountDTOWithAccountNumber = {
      ...createAccountDTO,
      accountNumber: accountNumber,
    };
    logger.debug(
      "[BanksService] createAccountDTOWithAccountNumber: ",
      createAccountDTO,
    );
    let createdAccount: AccountType;
    try {
      const result = await accountClient
        .send("handle_create_account", {
          createAccountDTOWithAccountNumber,
        })
        .toPromise();
      if (!BanksLogic.isObjectValid(result)) {
        throw new Error(`Object is not valid : ${result}`);
      }
      createdAccount = result;
    } catch (error) {
      throw new Error("Account creation failed");
    }
    const accountId: string = createdAccount._id;
    const updatedCustomerAccounts = await customersService.addAccountToCustomer(
      {
        customerId: createAccountDTO.userId,
        accountId: accountId,
      },
    );
    if (!BanksLogic.isObjectValid(updatedCustomerAccounts)) {
      throw new Error("Account could not added to customer");
    }
    return createdAccount;
  }
  async handleCreateCustomer({
    createCustomerDTO,
  }: {
    createCustomerDTO: CreateCustomerDTO;
  }) {
    const { logger, utils, customersService } = this;
    logger.debug("[BanksService] create customer DTO: ", createCustomerDTO);
    const customerNumber = utils.generateRandomNumber();
    const customerAuth = await customersService.createCustomerAuth({
      customerNumber,
      password: createCustomerDTO.password,
    });
    const createCustomerDTOWithCustomerNumber = {
      ...createCustomerDTO,
      customerNumber,
    };
    const customer: Customer = await customersService.createCustomer({
      createCustomerDTOWithCustomerNumber,
    });
    return `Created customers Customer Number is : ${customerAuth.customerNumber} and customer is ${customer}`;
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
  async handleCreateBankDirector({
    createBankDirectorDTO,
  }: {
    createBankDirectorDTO: CreateBankDirectorDTO;
  }): Promise<any> {
    const { logger, banksRepository } = this;
    logger.debug(
      "[BanksService] handleCreateBankDirector DTO: ",
      createBankDirectorDTO,
    );
    const bankDirector = await banksRepository.createBankDirector({
      createBankDirectorDTO,
    });
    if (!bankDirector) {
      throw new Error("BankDirector could not be created");
    }
    return bankDirector;
  }
  async handleCreateBankDepartmentDirector({
    createBankDepartmentDirectorDTO,
  }: {
    createBankDepartmentDirectorDTO: CreateBankDepartmentDirectorDTO;
  }): Promise<any> {
    const { logger, banksRepository } = this;
    logger.debug(
      "[BanksService] handleCreateBankDepartmentDirector DTO: ",
      createBankDepartmentDirectorDTO,
    );
    const bankDepartmentDirector =
      await banksRepository.createDepartmentDirector({
        createBankDepartmentDirectorDTO,
      });
    if (!bankDepartmentDirector) {
      throw new Error("BankDirector could not be created");
    }
    return bankDepartmentDirector;
  }
  async handleCreateBankCustomerRepresentative({
    createBankCustomerRepresentativeDTO,
  }: {
    createBankCustomerRepresentativeDTO: CreateBankCustomerRepresentativeDTO;
  }): Promise<any> {
    const { logger, banksRepository } = this;
    logger.debug(
      "[BanksService] handleCreateBankDirector DTO: ",
      createBankCustomerRepresentativeDTO,
    );
    const bankCustomerRepresentativeDTO =
      await banksRepository.createCustomerRepresentative({
        createBankCustomerRepresentativeDTO,
      });
    if (!bankCustomerRepresentativeDTO) {
      throw new Error("BankDirector could not be created");
    }
    return bankCustomerRepresentativeDTO;
  }
  async handleCreateBank({
    createBankDTO,
  }: {
    createBankDTO: CreateBankDTO;
  }): Promise<any> {
    const { logger, banksRepository } = this;
    logger.debug(
      "[BanksService] handleCreateBankDirector DTO: ",
      createBankDTO,
    );
    const bank = await banksRepository.createBank({
      createBankDTO,
    });
    if (!bank) {
      throw new Error("BankDirector could not be created");
    }
    return bank;
  }
}
