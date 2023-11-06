import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  CreateAccountDTO,
  CreateTransferDTO,
  MoneyTransferDTO,
  CreateCustomerDTO,
  CreateBankDTO,
  PrivateAccountDTO,
  AccountDTO,
  CustomerDTO,
  TransferDTO,
} from "src/dtos/bank.dto";
import { BanksRepository } from "../repositories/banks.repository";
import { ClientKafka } from "@nestjs/microservices";
import { Utils } from "../utils/utils";
import {
  Customer,
  PrivateCustomerRepresentative,
} from "../schemas/customers.schema";
import { CustomersService } from "./customers.service";
import { BanksLogic } from "../logic/banks.logic";
import { AccountType, TransferType } from "../types/bank.types";
import { Bank } from "../schemas/banks.schema";
import {
  BANK_ACTIONS,
  EVENT_RESULTS,
  TRANSACTION_RESULTS,
  TRANSACTION_TYPES,
  TRANSFER_STATUSES,
  USER_TYPES,
} from "../constants/banks.constants";
import { ACCOUNT_TOPICS, TRANSFER_TOPICS } from "../constants/kafka.constants";
import { IBankServiceInterface } from "../interfaces/banks-service.interface";
import {
  AccountCouldNotAddedToCustomerException,
  AccountCouldNotCreatedException,
  InvalidBankBranchCodeException,
  MoneyTransferCouldNotSucceedException,
  InvalidAccountTypeException,
  BankCouldNotCreatedException,
  EmployeeCouldNotUpdatedException,
  BankCouldNotUpdatedException,
  InvalidTransferStatusException,
  TransferCouldNotRejectedException,
  UserNotFoundException,
  TransferNotFoundException,
} from "../exceptions";
import {
  BankCustomerRepresentative,
  BankDepartmentDirector,
  BankDirector,
} from "../schemas/employee-schema";
import { EmployeesService } from "./employees.service";
import {
  EMPLOYEE_ACTIONS,
  EMPLOYEE_MODEL_TYPES,
} from "../types/employee.types";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { CustomersLogic } from "src/logic/customers.logic";
import { CustomerHasNotRepresentativeException } from "src/exceptions/customer-exception";
import { UserProfileDTO } from "src/dtos/auth.dto";
@Injectable()
export class BanksService implements OnModuleInit, IBankServiceInterface {
  private readonly logger = new Logger(BanksService.name);
  private readonly utils = new Utils();
  constructor(
    @Inject("ACCOUNT_SERVICE") private readonly accountClient: ClientKafka,
    @Inject("TRANSFER_SERVICE") private readonly transferClient: ClientKafka,
    private readonly banksRepository: BanksRepository,
    private readonly customersService: CustomersService,
    private readonly employeesService: EmployeesService,
    @InjectMapper() private readonly BankMapper: Mapper,
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
        this.accountClient.subscribeToResponseOf(topic);
        this.logger.debug(`${topic} topic is subscribed`);
      });
    } catch (error) {
      this.logger.error("Subscription of events are failed : ", error);
    }
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
      if (error instanceof AccountCouldNotAddedToCustomerException) {
        throw new AccountCouldNotAddedToCustomerException({
          data: createAccountDTO.userId,
        });
      }
      if (error instanceof InvalidBankBranchCodeException) {
        throw new InvalidBankBranchCodeException({
          data: createAccountDTO.bankBranchCode,
        });
      }
      if (error instanceof InvalidAccountTypeException) {
        throw new InvalidAccountTypeException({
          data: createAccountDTO.accountType,
        });
      }
      throw new AccountCouldNotCreatedException({ errorData: error });
    }
  }
  async handleCreateCustomer({
    createCustomerDTO,
  }: {
    createCustomerDTO: CreateCustomerDTO;
  }): Promise<CustomerDTO> {
    const { logger, utils, customersService } = this;
    logger.debug(
      "[handleCreateCustomer] createCustomerDTO: ",
      createCustomerDTO,
    );
    const customerNumber = utils.generateRandomNumber();
    const hashedPassword = await utils.hashPassword({
      password: createCustomerDTO.password,
    });
    createCustomerDTO.password = hashedPassword;
    const createCustomerDTOWithCustomerNumber = {
      ...createCustomerDTO,
      customerNumber,
    };
    const customer: CustomerDTO = await customersService.createCustomer({
      createCustomerDTOWithCustomerNumber,
    });
    return customer;
  }
  async handleCreateTransferAcrossAccounts({
    createTransferDTO,
  }: {
    createTransferDTO: CreateTransferDTO;
  }): Promise<TransferType> {
    const { logger, employeesService, customersService } = this;
    if (
      BanksLogic.isAmountGreaterThanDesignatedAmount({
        designatedAmount: 5000,
        amount: createTransferDTO.amount,
      })
    ) {
      try {
        const createdTransfer: TransferType =
          (await this.handleKafkaTransferEvents(
            createTransferDTO,
            TRANSFER_TOPICS.HANDLE_CREATE_TRANSFER_ACROSS_ACCOUNTS,
          )) as TransferType;
        const approvePendingTransfer: TransferType =
          (await this.handleKafkaTransferEvents(
            createdTransfer,
            TRANSFER_TOPICS.HANDLE_APPROVE_PENDING_TRANSFER,
          )) as TransferType;
        const customer: Customer = await customersService.getCustomer({
          customerId: createTransferDTO.userId,
        });
        logger.debug("[BanksService] create customer DTO: ", customer);
        if (!CustomersLogic.isCustomerHasCustomerRepresentative(customer)) {
          throw new CustomerHasNotRepresentativeException();
        }
        await employeesService.addTransactionToEmployee({
          employeeType: EMPLOYEE_MODEL_TYPES.BANK_CUSTOMER_REPRESENTATIVE,
          employeeId: customer.customerRepresentative._id,
          customerId: createTransferDTO.userId,
          transactionType: TRANSACTION_TYPES.SAME_BANK_TRANSFER,
          transfer: approvePendingTransfer,
        });
        return approvePendingTransfer;
      } catch (error) {
        if (error instanceof CustomerHasNotRepresentativeException) {
          throw new CustomerHasNotRepresentativeException();
        }
        throw new MoneyTransferCouldNotSucceedException({ errorData: error });
      }
    }
    try {
      const createdTransfer: TransferType =
        (await this.handleKafkaTransferEvents(
          createTransferDTO,
          TRANSFER_TOPICS.HANDLE_CREATE_TRANSFER_ACROSS_ACCOUNTS,
        )) as TransferType;
      const approvedTransfer: TransferType =
        (await this.handleKafkaTransferEvents(
          createdTransfer,
          TRANSFER_TOPICS.HANDLE_APPROVE_TRANSFER,
        )) as TransferType;
      const startedTransfer: TransferType =
        (await this.handleKafkaTransferEvents(
          approvedTransfer,
          TRANSFER_TOPICS.HANDLE_START_TRANSFER,
        )) as TransferType;
      const eventResult = (await this.handleKafkaAccountEvents(
        startedTransfer,
        ACCOUNT_TOPICS.MONEY_TRANSFER_ACROSS_ACCOUNTS_RESULT,
      )) as EVENT_RESULTS;
      if (BanksLogic.isTransferSucceed(eventResult)) {
        const completedTransfer: TransferType =
          (await this.handleKafkaTransferEvents(
            startedTransfer,
            TRANSFER_TOPICS.HANDLE_COMPLETE_TRANSFER,
          )) as TransferType;
        return completedTransfer;
      } else {
        const failedTransfer: TransferType =
          (await this.handleKafkaTransferEvents(
            startedTransfer,
            TRANSFER_TOPICS.HANDLE_FAILURE_TRANSFER,
          )) as TransferType;
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
        (await this.handleKafkaTransferEvents(
          createTransferDTO,
          TRANSFER_TOPICS.HANDLE_CREATE_TRANSFER_TO_ACCOUNT,
        )) as TransferType;
      const approvedTransfer: TransferType =
        (await this.handleKafkaTransferEvents(
          createdTransfer,
          TRANSFER_TOPICS.HANDLE_APPROVE_TRANSFER,
        )) as TransferType;
      const startedTransfer: TransferType =
        (await this.handleKafkaTransferEvents(
          approvedTransfer,
          TRANSFER_TOPICS.HANDLE_START_TRANSFER,
        )) as TransferType;
      const eventResult = (await this.handleKafkaAccountEvents(
        startedTransfer,
        ACCOUNT_TOPICS.MONEY_TRANSFER_ACROSS_ACCOUNTS_RESULT,
      )) as EVENT_RESULTS;
      if (BanksLogic.isTransferSucceed(eventResult)) {
        const completedTransfer: TransferType =
          (await this.handleKafkaTransferEvents(
            startedTransfer,
            TRANSFER_TOPICS.HANDLE_COMPLETE_TRANSFER,
          )) as TransferType;
        return completedTransfer;
      } else {
        const failedTransfer: TransferType =
          (await this.handleKafkaTransferEvents(
            startedTransfer,
            TRANSFER_TOPICS.HANDLE_FAILURE_TRANSFER,
          )) as TransferType;
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
  async handleAddCustomerToCustomerRepresentative({
    customerId,
    customerRepresentativeId,
  }: {
    customerId: string;
    customerRepresentativeId: string;
  }): Promise<BankCustomerRepresentative> {
    const { logger, customersService, employeesService, BankMapper } = this;
    logger.debug(
      "[BanksService] handleAddCustomerToCustomerRepresentative DTO: ",
      customerId,
      customerRepresentativeId,
    );
    const customer = await customersService.getCustomer({
      customerId,
    });
    const updatedCustomerRepresentative =
      await employeesService.addCustomerToCustomerRepresentative({
        customerRepresentativeId,
        customer,
      });
    const formattedCustomerRepresentative = BankMapper.map<
      BankCustomerRepresentative,
      PrivateCustomerRepresentative
    >(
      updatedCustomerRepresentative,
      BankCustomerRepresentative,
      PrivateCustomerRepresentative,
    );
    logger.debug(
      "[BanksService] formattedCustomerRepresentative: ",
      formattedCustomerRepresentative,
    );
    await customersService.registerCustomerRepresentativeToCustomer({
      customerId,
      customerRepresentative: formattedCustomerRepresentative,
    });
    return updatedCustomerRepresentative;
  }
  async handleCreateEmployeeRegistrationToBank({
    employeeType,
    employeeId,
    bankId,
  }: {
    employeeType: USER_TYPES;
    employeeId: string;
    bankId: string;
  }): Promise<Bank> {
    const { logger, banksRepository, employeesService } = this;
    logger.debug(
      "[BanksService] handleCreateBankDirector DTO: ",
      employeeType,
      employeeId,
      bankId,
    );
    const employee = await employeesService.createBankRegistrationToUser({
      employeeType,
      employeeId,
      bankId,
    });
    if (!BanksLogic.isObjectValid(employee)) {
      throw new EmployeeCouldNotUpdatedException({ data: employee });
    }
    const updatedBank = await banksRepository.addEmployeeToBank({
      bankId,
      employeeId,
      action: BANK_ACTIONS.EMPLOYEE_REGISTRATION,
    });
    if (!BanksLogic.isObjectValid(employee)) {
      throw new BankCouldNotUpdatedException({ data: employee });
    }
    return updatedBank;
  }
  private async getAndFormatAccounts({
    accountIds,
  }: {
    accountIds: string[];
  }): Promise<PrivateAccountDTO[]> {
    const { logger, BankMapper } = this;
    const accounts: AccountDTO[] = (await this.handleKafkaAccountEvents(
      accountIds,
      ACCOUNT_TOPICS.GET_ACCOUNTS,
    )) as AccountDTO[];
    logger.debug("getAccountFromAccountsMicroService account: ", accounts);

    const privateAccounts: PrivateAccountDTO[] = accounts.map((account) => {
      return BankMapper.map<AccountDTO, PrivateAccountDTO>(
        account,
        AccountDTO,
        PrivateAccountDTO,
      );
    });
    logger.debug(
      "getAccountFromAccountsMicroService privateAccount: ",
      JSON.stringify(privateAccounts),
    );
    return privateAccounts;
  }
  async getCustomersAccounts({
    customerId,
  }: {
    customerId: string;
  }): Promise<PrivateAccountDTO[]> {
    const { logger, customersService } = this;
    logger.debug("getCustomersAccounts customerId: ", customerId);
    const accountIds = await customersService.getCustomersAccountIds({
      customerId,
    });
    if (!accountIds) {
      throw new Error("Account could not be found");
    }
    const accountList = await this.getAndFormatAccounts({
      accountIds,
    });
    return accountList;
  }
  async getUserProfile({
    userType,
    userId,
  }: {
    userType: USER_TYPES;
    userId: string;
  }): Promise<UserProfileDTO> {
    const { logger, customersService, employeesService, utils, BankMapper } =
      this;
    logger.debug("[getUserProfile] userId: ", userId, " userType: ", userType);
    const mappedUserType = utils.getUserType({ userType });
    if (mappedUserType === USER_TYPES.CUSTOMER) {
      const user = await customersService.getCustomer({ customerId: userId });
      return BankMapper.map<Customer, UserProfileDTO>(
        user,
        Customer,
        UserProfileDTO,
      );
    }
    if (
      mappedUserType === USER_TYPES.BANK_DIRECTOR ||
      USER_TYPES.BANK_DEPARTMENT_DIRECTOR ||
      USER_TYPES.BANK_CUSTOMER_REPRESENTATIVE
    ) {
      const employeeModelType = utils.getEmployeeModelType(userType);
      const user = await employeesService.getEmployee({
        employeeType: employeeModelType,
        employeeId: userId,
      });
      return BankMapper.map<
        BankDirector | BankDepartmentDirector | BankCustomerRepresentative,
        UserProfileDTO
      >(
        user,
        BankDirector || BankDepartmentDirector || BankCustomerRepresentative,
        UserProfileDTO,
      );
    }
    throw new UserNotFoundException();
  }
  async getCustomersTransfers({
    customerId,
  }: {
    customerId: string;
  }): Promise<TransferDTO[]> {
    try {
      const transfers: TransferDTO[] = (await this.handleKafkaTransferEvents(
        customerId,
        TRANSFER_TOPICS.HANDLE_GET_CUSTOMERS_TRANSFERS,
      )) as TransferDTO[];
      return transfers;
    } catch (error) {
      throw new TransferNotFoundException();
    }
  }
  async handleDeleteTransferRecords({
    transferIds,
    customerId,
  }: {
    transferIds: string[];
    customerId: string;
  }): Promise<TransferDTO[]> {
    const { logger } = this;
    logger.debug("handleApproveTransfer transferId: ", transferIds, customerId);
    const transfers: TransferDTO[] = (await this.handleKafkaTransferEvents(
      transferIds,
      TRANSFER_TOPICS.HANDLE_DELETE_TRANSFER_RECORDS,
    )) as TransferDTO[];
    return transfers;
  }
  async handleApproveTransfer({
    transferId,
    employeeId,
  }: {
    transferId: string;
    employeeId: string;
  }): Promise<TransferType> {
    const { logger, employeesService } = this;
    logger.debug("handleApproveTransfer transferId: ", transferId);
    try {
      const transfer: TransferType = (await this.handleKafkaTransferEvents(
        transferId,
        TRANSFER_TOPICS.HANDLE_GET_TRANSFER,
      )) as TransferType;
      if (
        !BanksLogic.isTransferStatusEqualToExpectedStatus({
          status: transfer.status,
          expectedStatus: TRANSFER_STATUSES.APPROVE_PENDING,
        })
      ) {
        throw new InvalidTransferStatusException({
          data: `Invalid transfer status ${transfer.status}`,
        });
      }
      const approvedTransfer: TransferType =
        (await this.handleKafkaTransferEvents(
          transfer,
          TRANSFER_TOPICS.HANDLE_APPROVE_TRANSFER,
        )) as TransferType;
      const startedTransfer: TransferType =
        (await this.handleKafkaTransferEvents(
          approvedTransfer,
          TRANSFER_TOPICS.HANDLE_START_TRANSFER,
        )) as TransferType;
      const eventResult = (await this.handleKafkaAccountEvents(
        startedTransfer,
        ACCOUNT_TOPICS.MONEY_TRANSFER_ACROSS_ACCOUNTS_RESULT,
      )) as EVENT_RESULTS;
      if (BanksLogic.isTransferSucceed(eventResult)) {
        const completedTransfer: TransferType =
          (await this.handleKafkaTransferEvents(
            startedTransfer,
            TRANSFER_TOPICS.HANDLE_COMPLETE_TRANSFER,
          )) as TransferType;
        await employeesService.updateEmployeesCustomerTransactionsResult({
          employeeType: USER_TYPES.BANK_CUSTOMER_REPRESENTATIVE,
          transferId,
          employeeId,
          transfer: completedTransfer,
          result: TRANSACTION_RESULTS.SUCCESS,
          action: EMPLOYEE_ACTIONS.TRANSFER_APPROVAL_SUCCESS,
        });
        return completedTransfer;
      } else {
        const failedTransfer: TransferType =
          (await this.handleKafkaTransferEvents(
            startedTransfer,
            TRANSFER_TOPICS.HANDLE_FAILURE_TRANSFER,
          )) as TransferType;
        await employeesService.updateEmployeesCustomerTransactionsResult({
          employeeType: USER_TYPES.BANK_CUSTOMER_REPRESENTATIVE,
          transferId,
          employeeId,
          transfer: failedTransfer,
          result: TRANSACTION_RESULTS.FAILED,
          action: EMPLOYEE_ACTIONS.TRANSFER_APPROVAL_FAIL,
        });
        return failedTransfer;
      }
    } catch (error) {
      if (error instanceof InvalidTransferStatusException) {
        throw new InvalidTransferStatusException({
          data: `Invalid transfer status ${error.data}`,
        });
      }
      throw new MoneyTransferCouldNotSucceedException({ errorData: error });
    }
  }
  async handleRejectTransfer({
    transferId,
    employeeId,
  }: {
    transferId: string;
    employeeId: string;
  }): Promise<TransferType> {
    const { logger, employeesService } = this;
    logger.debug("handleApproveTransfer transferId: ", transferId);
    try {
      const transfer: TransferType = (await this.handleKafkaTransferEvents(
        transferId,
        TRANSFER_TOPICS.HANDLE_GET_TRANSFER,
      )) as TransferType;
      if (
        !BanksLogic.isTransferStatusEqualToExpectedStatus({
          status: transfer.status,
          expectedStatus: TRANSFER_STATUSES.APPROVE_PENDING,
        })
      ) {
        throw new InvalidTransferStatusException({
          data: `Invalid transfer status ${transfer.status}`,
        });
      }
      const rejectedTransfer: TransferType =
        (await this.handleKafkaTransferEvents(
          transfer,
          TRANSFER_TOPICS.HANDLE_REJECT_TRANSFER,
        )) as TransferType;
      if (!BanksLogic.isObjectValid(rejectedTransfer)) {
        throw new TransferCouldNotRejectedException();
      }
      await employeesService.updateEmployeesCustomerTransactionsResult({
        employeeType: USER_TYPES.BANK_CUSTOMER_REPRESENTATIVE,
        transferId,
        employeeId,
        transfer: rejectedTransfer,
        result: TRANSACTION_RESULTS.REJECTED,
        action: EMPLOYEE_ACTIONS.TRANSFER_APPROVAL_SUCCESS,
      });
      return rejectedTransfer;
    } catch (error) {
      if (error instanceof InvalidTransferStatusException) {
        throw new InvalidTransferStatusException({
          data: `Invalid transfer status ${error.data}`,
        });
      }
      if (error instanceof TransferCouldNotRejectedException) {
        throw new TransferCouldNotRejectedException({
          data: `Invalid transfer status ${error.data}`,
        });
      }
      throw new MoneyTransferCouldNotSucceedException({ errorData: error });
    }
  }
  private async handleKafkaTransferEvents(
    data: any,
    topic: TRANSFER_TOPICS,
  ): Promise<TransferType | TransferDTO[]> {
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
  ): Promise<EVENT_RESULTS | AccountType | AccountDTO | AccountDTO[]> {
    return new Promise((resolve, reject) => {
      this.accountClient.send(topic, data).subscribe({
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
