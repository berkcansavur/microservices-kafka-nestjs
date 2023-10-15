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
import { AccountType, TransferType } from "./types/bank.types";
import { Bank } from "./schemas/banks.schema";
import {
  BankCustomerRepresentative,
  BankDepartmentDirector,
  BankDirector,
} from "./schemas/employee-schema";
import { EVENT_RESULTS } from "./constants/banks.constants";
import { kafkaTopics } from "./constants/kafka.constants";
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
      kafkaTopics.forEach((topic) => {
        this.transferClient.subscribeToResponseOf(topic);
        this.logger.debug(`${topic} topic is subscribed`);
      });
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
  }): Promise<Customer> {
    const { logger, utils, customersService } = this;
    logger.debug("[BanksService] create customer DTO: ", createCustomerDTO);
    const customerNumber = utils.generateRandomNumber();
    await customersService.createCustomerAuth({
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
    return customer;
  }
  async handleCreateTransferAcrossAccounts({
    createTransferDTO,
  }: {
    createTransferDTO: CreateTransferDTO;
  }): Promise<TransferType> {
    if (
      BanksLogic.isAmountGreaterThanDesignatedAmount({
        designatedAmount: 5000,
        amount: createTransferDTO.amount,
      })
    ) {
      try {
        const createdTransfer: TransferType =
          await this.handleKafkaTransferEvents(
            createTransferDTO,
            "handle_create_transfer_across_accounts",
          );
        const approvePendingTransfer: TransferType =
          await this.handleKafkaTransferEvents(
            createdTransfer,
            "handle_approve_pending_transfer",
          );
        return approvePendingTransfer;
      } catch (error) {
        throw new Error(
          `Error in handleCreateTransferAcrossAccounts: ${error}`,
        );
      }
    }
    try {
      const createdTransfer: TransferType =
        await this.handleKafkaTransferEvents(
          createTransferDTO,
          "handle_create_transfer_across_accounts",
        );
      const approvedTransfer: TransferType =
        await this.handleKafkaTransferEvents(
          createdTransfer,
          "handle_approve_transfer",
        );
      const startedTransfer: TransferType =
        await this.handleKafkaTransferEvents(
          approvedTransfer,
          "handle_start_transfer",
        );
      const eventResult = (await this.handleKafkaAccountEvents(
        startedTransfer,
        "money_transfer_across_accounts_result",
      )) as EVENT_RESULTS;
      if (BanksLogic.isTransferSucceed(eventResult)) {
        const completedTransfer: TransferType =
          await this.handleKafkaTransferEvents(
            startedTransfer,
            "handle_complete_transfer",
          );
        return completedTransfer;
      } else {
        const failedTransfer: TransferType =
          await this.handleKafkaTransferEvents(
            startedTransfer,
            "handle_failure_transfer",
          );
        return failedTransfer;
      }
    } catch (error) {
      throw new Error(`Error in handleCreateTransferAcrossAccounts: ${error}`);
    }
  }
  async handleCreateMoneyTransferToAccount({
    createTransferDTO,
  }: {
    createTransferDTO: MoneyTransferDTO;
  }): Promise<TransferType> {
    // TODO: in this step there will incoming money serial no check for the
    //money request and it will be added to the MoneyTransferDTO's fields
    // but for now it will skipped and added statically.
    //const serials: number[] = [];
    if (!BanksLogic.isIncomingMoneyIsValid(createTransferDTO.serials)) {
      throw new Error("Invalid money serial numbers");
    }
    try {
      const createdTransfer: TransferType =
        await this.handleKafkaTransferEvents(
          createTransferDTO,
          "handle_create_transfer_to_account",
        );
      const approvedTransfer: TransferType =
        await this.handleKafkaTransferEvents(
          createdTransfer,
          "handle_approve_transfer",
        );
      const startedTransfer: TransferType =
        await this.handleKafkaTransferEvents(
          approvedTransfer,
          "handle_start_transfer",
        );
      const eventResult = (await this.handleKafkaAccountEvents(
        startedTransfer,
        "money_transfer_across_accounts_result",
      )) as EVENT_RESULTS;
      if (BanksLogic.isTransferSucceed(eventResult)) {
        const completedTransfer: TransferType =
          await this.handleKafkaTransferEvents(
            startedTransfer,
            "handle_complete_transfer",
          );
        return completedTransfer;
      } else {
        const failedTransfer: TransferType =
          await this.handleKafkaTransferEvents(
            startedTransfer,
            "handle_failure_transfer",
          );
        return failedTransfer;
      }
    } catch (error) {
      throw new Error(`Error in handleCreateMoneyTransferToAccount: ${error}`);
    }
  }
  async handleCreateBankDirector({
    createBankDirectorDTO,
  }: {
    createBankDirectorDTO: CreateBankDirectorDTO;
  }): Promise<BankDirector> {
    const { logger, banksRepository } = this;
    logger.debug(
      "[BanksService] handleCreateBankDirector DTO: ",
      createBankDirectorDTO,
    );
    const bankDirector: BankDirector = await banksRepository.createBankDirector(
      {
        createBankDirectorDTO,
      },
    );
    if (!BanksLogic.isObjectValid(bankDirector)) {
      throw new Error("BankDirector could not be created");
    }
    return bankDirector;
  }
  async handleCreateBankDepartmentDirector({
    createBankDepartmentDirectorDTO,
  }: {
    createBankDepartmentDirectorDTO: CreateBankDepartmentDirectorDTO;
  }): Promise<BankDepartmentDirector> {
    const { logger, banksRepository } = this;
    logger.debug(
      "[BanksService] handleCreateBankDepartmentDirector DTO: ",
      createBankDepartmentDirectorDTO,
    );
    const bankDepartmentDirector: BankDepartmentDirector =
      await banksRepository.createDepartmentDirector({
        createBankDepartmentDirectorDTO,
      });
    if (!BanksLogic.isObjectValid(bankDepartmentDirector)) {
      throw new Error("BankDirector could not be created");
    }
    return bankDepartmentDirector;
  }
  async handleCreateBankCustomerRepresentative({
    createBankCustomerRepresentativeDTO,
  }: {
    createBankCustomerRepresentativeDTO: CreateBankCustomerRepresentativeDTO;
  }): Promise<BankCustomerRepresentative> {
    const { logger, banksRepository } = this;
    logger.debug(
      "[BanksService] handleCreateBankDirector DTO: ",
      createBankCustomerRepresentativeDTO,
    );
    const bankCustomerRepresentative: BankCustomerRepresentative =
      await banksRepository.createCustomerRepresentative({
        createBankCustomerRepresentativeDTO,
      });
    if (!BanksLogic.isObjectValid(bankCustomerRepresentative)) {
      throw new Error("BankDirector could not be created");
    }
    return bankCustomerRepresentative;
  }
  async handleCreateBank({
    createBankDTO,
  }: {
    createBankDTO: CreateBankDTO;
  }): Promise<Bank> {
    const { logger, banksRepository } = this;
    logger.debug(
      "[BanksService] handleCreateBankDirector DTO: ",
      createBankDTO,
    );
    const bank: Bank = await banksRepository.createBank({
      createBankDTO,
    });

    if (!BanksLogic.isObjectValid(bank)) {
      throw new Error("BankDirector could not be created");
    }
    return bank;
  }
  async handleKafkaTransferEvents(
    data: any,
    topic: string,
  ): Promise<TransferType> {
    return new Promise((resolve, reject) => {
      this.transferClient.send(topic, data).subscribe({
        next: (response: any) => {
          console.log(`[${topic}] Response:`, response);
          if (!BanksLogic.isObjectValid(response)) {
            throw new Error("Retrieved data is not an object");
          }
          resolve(response);
        },
        error: (error) => {
          console.error(`[${topic}] Error:`, error);
          reject(error);
        },
      });
    });
  }
  async handleKafkaAccountEvents(
    data: any,
    topic: string,
  ): Promise<EVENT_RESULTS | AccountType> {
    return new Promise((resolve, reject) => {
      this.transferClient.send(topic, data).subscribe({
        next: (response: any) => {
          console.log(`[${topic}] Response:`, response);
          if (!BanksLogic.isObjectValid(response)) {
            throw new Error("Retrieved data is not an object");
          }
          resolve(response);
        },
        error: (error) => {
          console.error(`[${topic}] Error:`, error);
          reject(error);
        },
      });
    });
  }
}
