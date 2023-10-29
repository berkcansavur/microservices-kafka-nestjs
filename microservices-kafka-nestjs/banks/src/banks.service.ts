import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  TransferDTO,
  CreateAccountDTO,
  CreateTransferDTO,
  MoneyTransferDTO,
  CreateCustomerDTO,
  CreateBankDTO,
} from "src/dtos/bank.dto";
import { BanksRepository } from "./repositories/banks.repository";
import { ClientKafka } from "@nestjs/microservices";
import { Utils } from "./utils/utils";
import { Customer } from "./schemas/customers.schema";
import { CustomersService } from "./customers/customers.service";
import { BanksLogic } from "./logic/banks.logic";
import { AccountType, TransferType } from "./types/bank.types";
import { Bank } from "./schemas/banks.schema";
import { EVENT_RESULTS } from "./constants/banks.constants";
import { ACCOUNT_TOPICS, TRANSFER_TOPICS } from "./constants/kafka.constants";
import { IBankServiceInterface } from "./interfaces/banks-service.interface";
import {
  AccountCouldNotAddedToCustomerException,
  AccountCouldNotCreatedException,
  InvalidBankBranchCodeException,
  MoneyTransferCouldNotSucceedException,
  InvalidAccountTypeException,
  BankCouldNotCreatedException,
} from "./exceptions";
@Injectable()
export class BanksService implements OnModuleInit, IBankServiceInterface {
  private readonly logger = new Logger(BanksService.name);
  private readonly utils = new Utils();
  constructor(
    @Inject("ACCOUNT_SERVICE") private readonly accountClient: ClientKafka,
    @Inject("TRANSFER_SERVICE") private readonly transferClient: ClientKafka,
    private readonly banksRepository: BanksRepository,
    private readonly customersService: CustomersService,
  ) {}

  async onModuleInit() {
    const transferTopics: string[] = Object.values(TRANSFER_TOPICS);
    const accountTopics: string[] = Object.values(ACCOUNT_TOPICS);
    try {
      transferTopics.forEach((topic) => {
        this.transferClient.subscribeToResponseOf(topic);
        this.logger.debug(`${topic} topic is subscribed`);
      });
      accountTopics.forEach((topic) => {
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
  }): Promise<AccountType> {
    const { logger, utils, customersService } = this;
    logger.debug("[BanksService] create account DTO: ", createAccountDTO);
    let accountNumber = utils.generateRandomNumber();
    if (!BanksLogic.isAccountTypeIsValid({ accountDTO: createAccountDTO })) {
      throw new InvalidAccountTypeException({
        data: createAccountDTO.accountType,
      });
    }
    if (!BanksLogic.isValidBankBranchCode(createAccountDTO.bankBranchCode)) {
      throw new InvalidBankBranchCodeException({
        data: createAccountDTO.bankBranchCode,
      });
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
    try {
      const createdAccount: AccountType = (await this.handleKafkaAccountEvents(
        createAccountDTOWithAccountNumber,
        ACCOUNT_TOPICS.HANDLE_CREATE_ACCOUNT,
      )) as AccountType;
      const accountId: string = createdAccount._id;
      const updatedCustomerAccounts =
        await customersService.addAccountToCustomer({
          customerId: createAccountDTO.userId,
          accountId: accountId,
        });
      if (!BanksLogic.isObjectValid(updatedCustomerAccounts)) {
        throw new AccountCouldNotAddedToCustomerException({
          data: createAccountDTO.userId,
        });
      }
      return createdAccount;
    } catch (error) {
      throw new AccountCouldNotCreatedException({ errorData: error });
    }
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
            TRANSFER_TOPICS.HANDLE_CREATE_TRANSFER_ACROSS_ACCOUNTS,
          );
        const approvePendingTransfer: TransferType =
          await this.handleKafkaTransferEvents(
            createdTransfer,
            TRANSFER_TOPICS.HANDLE_APPROVE_PENDING_TRANSFER,
          );
        return approvePendingTransfer;
      } catch (error) {
        throw new MoneyTransferCouldNotSucceedException({ errorData: error });
      }
    }
    try {
      const createdTransfer: TransferType =
        await this.handleKafkaTransferEvents(
          createTransferDTO,
          TRANSFER_TOPICS.HANDLE_CREATE_TRANSFER_ACROSS_ACCOUNTS,
        );
      const approvedTransfer: TransferType =
        await this.handleKafkaTransferEvents(
          createdTransfer,
          TRANSFER_TOPICS.HANDLE_APPROVE_TRANSFER,
        );
      const startedTransfer: TransferType =
        await this.handleKafkaTransferEvents(
          approvedTransfer,
          TRANSFER_TOPICS.HANDLE_START_TRANSFER,
        );
      const eventResult = (await this.handleKafkaAccountEvents(
        startedTransfer,
        ACCOUNT_TOPICS.MONEY_TRANSFER_ACROSS_ACCOUNTS_RESULT,
      )) as EVENT_RESULTS;
      if (BanksLogic.isTransferSucceed(eventResult)) {
        const completedTransfer: TransferType =
          await this.handleKafkaTransferEvents(
            startedTransfer,
            TRANSFER_TOPICS.HANDLE_COMPLETE_TRANSFER,
          );
        return completedTransfer;
      } else {
        const failedTransfer: TransferType =
          await this.handleKafkaTransferEvents(
            startedTransfer,
            TRANSFER_TOPICS.HANDLE_FAILURE_TRANSFER,
          );
        return failedTransfer;
      }
    } catch (error) {
      throw new MoneyTransferCouldNotSucceedException({ errorData: error });
    }
  }
  async handleCreateMoneyTransferToAccount({
    createTransferDTO,
  }: {
    createTransferDTO: MoneyTransferDTO;
  }): Promise<TransferType> {
    if (!BanksLogic.isIncomingMoneyIsValid(createTransferDTO.serials)) {
      throw new Error("Invalid money serial numbers");
    }
    try {
      const createdTransfer: TransferType =
        await this.handleKafkaTransferEvents(
          createTransferDTO,
          TRANSFER_TOPICS.HANDLE_CREATE_TRANSFER_TO_ACCOUNT,
        );
      const approvedTransfer: TransferType =
        await this.handleKafkaTransferEvents(
          createdTransfer,
          TRANSFER_TOPICS.HANDLE_APPROVE_TRANSFER,
        );
      const startedTransfer: TransferType =
        await this.handleKafkaTransferEvents(
          approvedTransfer,
          TRANSFER_TOPICS.HANDLE_START_TRANSFER,
        );
      const eventResult = (await this.handleKafkaAccountEvents(
        startedTransfer,
        ACCOUNT_TOPICS.MONEY_TRANSFER_ACROSS_ACCOUNTS_RESULT,
      )) as EVENT_RESULTS;
      if (BanksLogic.isTransferSucceed(eventResult)) {
        const completedTransfer: TransferType =
          await this.handleKafkaTransferEvents(
            startedTransfer,
            TRANSFER_TOPICS.HANDLE_COMPLETE_TRANSFER,
          );
        return completedTransfer;
      } else {
        const failedTransfer: TransferType =
          await this.handleKafkaTransferEvents(
            startedTransfer,
            TRANSFER_TOPICS.HANDLE_FAILURE_TRANSFER,
          );
        return failedTransfer;
      }
    } catch (error) {
      throw new MoneyTransferCouldNotSucceedException({ errorData: error });
    }
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
      throw new BankCouldNotCreatedException({ data: createBankDTO });
    }
    return bank;
  }
  private async handleKafkaTransferEvents(
    data: any,
    topic: TRANSFER_TOPICS,
  ): Promise<TransferType> {
    return new Promise((resolve, reject) => {
      this.transferClient.send(topic, data).subscribe({
        next: (response: any) => {
          this.logger.debug(`[${topic}] Response:`, response);
          if (!BanksLogic.isObjectValid(response)) {
            throw new Error("Retrieved data is not an object");
          }
          resolve(response);
        },
        error: (error) => {
          this.logger.error(`[${topic}] Error:`, error);
          reject(error);
        },
      });
    });
  }
  private async handleKafkaAccountEvents(
    data: any,
    topic: ACCOUNT_TOPICS,
  ): Promise<EVENT_RESULTS | AccountType> {
    return new Promise((resolve, reject) => {
      this.transferClient.send(topic, data).subscribe({
        next: (response: any) => {
          this.logger.debug(`[${topic}] Response:`, response);
          if (!BanksLogic.isObjectValid(response)) {
            throw new Error("Retrieved data is not an object");
          }
          resolve(response);
        },
        error: (error) => {
          this.logger.error(`[${topic}] Error:`, error);
          reject(error);
        },
      });
    });
  }
}
