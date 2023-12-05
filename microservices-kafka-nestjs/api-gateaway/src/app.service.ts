import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import {
  AccountIdDTO,
  AddCustomerToRepresentativeDTO,
  CreateAccountDTO,
  CreateBankDTO,
  CreateCustomerDTO,
  CreateCustomerRepresentativeDTO,
  CreateDepartmentDirectorDTO,
  CreateDirectorDTO,
  CreateEmployeeRegistrationToBankDTO,
  CreateTransferDTO,
  DeleteTransferDTO,
  GetAccountsLastActionsDTO,
  GetCustomersAccountsDTO,
  GetCustomersTransfersDTO,
  GetEmployeeDTO,
  GetEmployeesCustomerTransactionsDTO,
  GetTransferDTO,
  LoginUserDTO,
  MoneyTransferDTO,
  SearchTextDTO,
} from "./dtos/api.dtos";
import {
  ACCOUNT_TOPICS,
  BANK_TOPICS,
  TRANSFER_TOPICS,
} from "./constants/kafka-constants";
import {
  AccountType,
  EMPLOYEE_MODEL_TYPES,
  EVENT_RESULTS,
  TRANSACTION_TYPES,
  TRANSFER_STATUSES,
  TransferType,
  USER_TYPES,
} from "types/app-types";
import { GetUserProfileDTO } from "./dtos/api.dtos";
import { BanksLogic, CustomersLogic } from "./logic";
import { AddTransactionToEmployeeDTO, TransferDTO } from "./dtos/transfer.dto";
import { CustomerHasNotRepresentativeException } from "./exceptions/customer-exception";
import {
  AccountCouldNotAddedToCustomerException,
  AccountCouldNotCreatedException,
  InvalidAccountTypeException,
  InvalidBankBranchCodeException,
  InvalidTransferStatusException,
  MoneyTransferCouldNotSucceedException,
  TransferCouldNotRejectedException,
  TransferNotFoundException,
  TransfersCouldNotDeletedException,
} from "./exceptions";
import { Utils } from "./utils/utils";
import {
  EMPLOYEE_ACTIONS,
  TRANSACTION_RESULTS,
} from "./constants/bank.constants";

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @Inject("BANK_SERVICE") private readonly bankClient: ClientKafka,
    @Inject("ACCOUNT_SERVICE") private readonly accountClient: ClientKafka,
    @Inject("TRANSFER_SERVICE") private readonly transferClient: ClientKafka,
  ) {}
  async onModuleInit() {
    this.handleSubscribeApplicationTopics();
  }
  private async handleSubscribeApplicationTopics() {
    const bankTopics: string[] = Object.values(BANK_TOPICS);
    const accountTopis: string[] = Object.values(ACCOUNT_TOPICS);
    const transferTopics: string[] = Object.values(TRANSFER_TOPICS);
    try {
      bankTopics.forEach((topic) => {
        this.bankClient.subscribeToResponseOf(topic);
        this.logger.debug(`${topic} topic is subscribed`);
      });
      accountTopis.forEach((topic) => {
        this.accountClient.subscribeToResponseOf(topic);
        this.logger.debug(`${topic} topic is subscribed`);
      });
      transferTopics.forEach((topic) => {
        this.transferClient.subscribeToResponseOf(topic);
        this.logger.debug(`${topic} topic is subscribed`);
      });
      this.logger.debug(
        "Subscription of responses is successfully established.",
      );
    } catch (error) {
      this.logger.error("Subscription of responses is failed", error);
    }
  }
  sendLoginCustomerRequest(loginUserDTO: LoginUserDTO) {
    const { logger } = this;
    logger.debug(
      `[sendLoginCustomerRequest] loginCustomerDTO: ${JSON.stringify(
        loginUserDTO,
      )}`,
    );
    return this.handleKafkaBankEvents(loginUserDTO, BANK_TOPICS.LOGIN_CUSTOMER);
  }
  sendLoginEmployeeRequest(loginUserDTO: LoginUserDTO) {
    const { logger } = this;
    logger.debug(
      `[sendLoginCustomerRequest] loginCustomerDTO: ${JSON.stringify(
        loginUserDTO,
      )}`,
    );
    return this.handleKafkaBankEvents(loginUserDTO, BANK_TOPICS.LOGIN_EMPLOYEE);
  }
  async sendCreateTransferAcrossAccounts({
    createTransferDTO,
  }: {
    createTransferDTO: CreateTransferDTO;
  }) {
    const { logger } = this;
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
        const customerId = createTransferDTO.userId;
        const customer = await this.handleKafkaBankEvents(
          customerId,
          BANK_TOPICS.GET_CUSTOMER,
        );
        logger.debug("[BanksService] create customer DTO: ", customer);
        if (!CustomersLogic.isCustomerHasCustomerRepresentative(customer)) {
          throw new CustomerHasNotRepresentativeException();
        }
        const addTransactionDTO = new AddTransactionToEmployeeDTO();
        (addTransactionDTO.customerId = createTransferDTO.userId),
          (addTransactionDTO.employeeType =
            EMPLOYEE_MODEL_TYPES.BANK_CUSTOMER_REPRESENTATIVE),
          (addTransactionDTO.customerId = createTransferDTO.userId),
          (addTransactionDTO.transactionType =
            TRANSACTION_TYPES.SAME_BANK_TRANSFER),
          (addTransactionDTO.transfer = approvePendingTransfer);
        await this.handleKafkaBankEvents(
          addTransactionDTO,
          BANK_TOPICS.ADD_TRANSACTION_TO_EMPLOYEE,
        );
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
  async sendCreateMoneyTransferRequest(createTransferDTO: CreateTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] createMoneyTransferRequest: ${JSON.stringify(
        createTransferDTO,
      )}`,
    );
    return this.handleKafkaBankEvents(
      createTransferDTO,
      BANK_TOPICS.CREATE_TRANSFER_ACROSS_ACCOUNTS_EVENT,
    );
  }
  async sendApproveTransferRequest(
    approveTransferDTO: GetTransferDTO,
  ): Promise<TransferType> {
    const { logger } = this;
    const { transferId, employeeId } = approveTransferDTO;
    logger.debug("[handleApproveTransfer] transferId: ", transferId);
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
        await this.handleKafkaBankEvents(
          {
            employeeType: USER_TYPES.BANK_CUSTOMER_REPRESENTATIVE,
            transferId,
            employeeId,
            transfer: completedTransfer,
            result: TRANSACTION_RESULTS.SUCCESS,
            action: EMPLOYEE_ACTIONS.TRANSFER_APPROVAL_SUCCESS,
          },
          BANK_TOPICS.UPDATE_CUSTOMER_TRANSACTION_RESULT,
        );
        return completedTransfer;
      } else {
        const failedTransfer: TransferType =
          (await this.handleKafkaTransferEvents(
            startedTransfer,
            TRANSFER_TOPICS.HANDLE_FAILURE_TRANSFER,
          )) as TransferType;
        await this.handleKafkaBankEvents(
          {
            employeeType: USER_TYPES.BANK_CUSTOMER_REPRESENTATIVE,
            transferId,
            employeeId,
            transfer: failedTransfer,
            result: TRANSACTION_RESULTS.FAILED,
            action: EMPLOYEE_ACTIONS.TRANSFER_APPROVAL_FAIL,
          },
          BANK_TOPICS.UPDATE_CUSTOMER_TRANSACTION_RESULT,
        );
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
  async sendRejectTransferRequest(
    rejectTransferDTO: GetTransferDTO,
  ): Promise<TransferType> {
    const { logger } = this;
    const { transferId, employeeId } = rejectTransferDTO;
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
      await this.handleKafkaBankEvents(
        {
          employeeType: USER_TYPES.BANK_CUSTOMER_REPRESENTATIVE,
          transferId,
          employeeId,
          transfer: rejectedTransfer,
          result: TRANSACTION_RESULTS.REJECTED,
          action: EMPLOYEE_ACTIONS.TRANSFER_APPROVAL_SUCCESS,
        },
        BANK_TOPICS.UPDATE_CUSTOMER_TRANSACTION_RESULT,
      );
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
  async sendCreateAccountRequest(createAccountDTO: CreateAccountDTO) {
    const { logger } = this;
    logger.debug("[BanksService] create account DTO: ", createAccountDTO);
    let accountNumber = Utils.generateRandomNumber();
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
    const branchCode = Utils.getBanksBranchCode(
      createAccountDTO.bankBranchCode,
    );
    const accountType = Utils.getAccountType(createAccountDTO.accountType);
    createAccountDTO.accountType = accountType;
    accountNumber = Utils.combineNumbers({ branchCode, accountNumber });
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
      if (!createdAccount) {
        throw new AccountCouldNotCreatedException();
      }
      const accountId: string = createdAccount._id;
      const updatedCustomerAccounts = await this.handleKafkaBankEvents(
        {
          customerId: createAccountDTO.userId,
          accountId: accountId,
        },
        BANK_TOPICS.ADD_ACCOUNT_TO_CUSTOMER,
      );

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
  async sendTransferMoneyToAccountRequest({
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
      const eventResult = EVENT_RESULTS.SUCCESS;
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
  async sendCreateCustomerRequest(createCustomerRequestDTO: CreateCustomerDTO) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateCustomerRequest DTO: ",
      createCustomerRequestDTO,
    );
    return this.handleKafkaBankEvents(
      createCustomerRequestDTO,
      BANK_TOPICS.CREATE_CUSTOMER_EVENT,
    );
  }
  async sendDeleteTransferRecordsRequest(
    deleteTransferRecordsDTO: DeleteTransferDTO,
  ) {
    const { logger } = this;
    logger.debug(
      "[AppService] deleteTransferRecordsDTO: ",
      deleteTransferRecordsDTO,
    );
    try {
      return this.handleKafkaTransferEvents(
        deleteTransferRecordsDTO.transferIds,
        TRANSFER_TOPICS.HANDLE_DELETE_TRANSFER_RECORDS,
      );
    } catch (error) {
      throw new TransfersCouldNotDeletedException(error.message);
    }
  }
  //OK
  async sendCreateBankRequest(createBankRequestDTO: CreateBankDTO) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateBankRequest DTO: ",
      createBankRequestDTO,
    );
    return this.handleKafkaBankEvents(
      createBankRequestDTO,
      BANK_TOPICS.CREATE_BANK_EVENT,
    );
  }
  //OK
  async sendCreateDirectorRequest(
    createBankDirectorRequestDTO: CreateDirectorDTO,
  ) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateDirectorRequest DTO: ",
      createBankDirectorRequestDTO,
    );
    return this.handleKafkaBankEvents(
      createBankDirectorRequestDTO,
      BANK_TOPICS.CREATE_BANK_DIRECTOR_EVENT,
    );
  }
  //OK
  async sendCreateCustomerRepresentativeRequest(
    createCustomerRepresentativeRequestDTO: CreateCustomerRepresentativeDTO,
  ) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateCustomerRepresentativeRequest DTO: ",
      createCustomerRepresentativeRequestDTO,
    );
    return this.handleKafkaBankEvents(
      createCustomerRepresentativeRequestDTO,
      BANK_TOPICS.CREATE_BANK_CUSTOMER_REPRESENTATIVE_EVENT,
    );
  }
  //OK
  async sendAddCustomerToRepresentativeRequest({
    addCustomerToRepresentativeDTO,
  }: {
    addCustomerToRepresentativeDTO: AddCustomerToRepresentativeDTO;
  }) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendAddCustomerToRepresentativeRequest data: ",
      addCustomerToRepresentativeDTO,
    );
    return this.handleKafkaBankEvents(
      addCustomerToRepresentativeDTO,
      BANK_TOPICS.ADD_CUSTOMER_TO_BANKS_CUSTOMER_REPRESENTATIVE_EVENT,
    );
  }
  //OK
  async sendCreateDepartmentDirectorRequest(
    createDepartmentDirectorRequestDTO: CreateDepartmentDirectorDTO,
  ) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateDirectorRequest DTO: ",
      createDepartmentDirectorRequestDTO,
    );
    return this.handleKafkaBankEvents(
      createDepartmentDirectorRequestDTO,
      BANK_TOPICS.CREATE_BANK_DEPARTMENT_DIRECTOR_EVENT,
    );
  }
  //OK
  async sendCreateEmployeeRegistrationToBankRequest(
    createEmployeeRegistrationToBankDTO: CreateEmployeeRegistrationToBankDTO,
  ) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateDirectorRequest DTO: ",
      createEmployeeRegistrationToBankDTO,
    );
    return this.handleKafkaBankEvents(
      createEmployeeRegistrationToBankDTO,
      BANK_TOPICS.CREATE_EMPLOYEE_REGISTRATION_TO_BANK_EVENT,
    );
  }
  async sendGetCustomersTransfersRequest({
    getCustomersTransfersDTO,
  }: {
    getCustomersTransfersDTO: GetCustomersTransfersDTO;
  }) {
    const { logger } = this;
    logger.debug(
      "[sendGetCustomersTransfersRequest] getCustomersTransfersDTO: ",
      getCustomersTransfersDTO,
    );
    try {
      return this.handleKafkaTransferEvents(
        getCustomersTransfersDTO.customerId,
        TRANSFER_TOPICS.HANDLE_GET_CUSTOMERS_TRANSFERS,
      );
    } catch (error) {
      throw new TransferNotFoundException();
    }
  }
  async sendSearchCustomerRequest({ searchText }: { searchText: string }) {
    const { logger } = this;
    const searchTextDTO: SearchTextDTO = { searchText };
    logger.debug(
      "[AppService] sendCreateDirectorRequest customerId: ",
      searchTextDTO,
    );
    return this.handleKafkaBankEvents(searchText, BANK_TOPICS.SEARCH_CUSTOMER);
  }
  async sendGetUsersProfileRequest({
    userType,
    userId,
  }: {
    userType: string;
    userId: string;
  }) {
    const { logger } = this;
    const getUserProfileDTO: GetUserProfileDTO = { userType, userId };
    logger.debug(
      "[AppService] sendCreateDirectorRequest customerId: ",
      getUserProfileDTO,
    );
    return this.handleKafkaBankEvents(
      getUserProfileDTO,
      BANK_TOPICS.GET_USER_PROFILE_EVENT,
    );
  }
  sendGetCustomersAccountsRequest({
    getCustomersAccountsDTO,
  }: {
    getCustomersAccountsDTO: GetCustomersAccountsDTO;
  }) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateDirectorRequest customerId: ",
      getCustomersAccountsDTO,
    );
    return this.handleKafkaBankEvents(
      getCustomersAccountsDTO,
      BANK_TOPICS.GET_CUSTOMER_ACCOUNTS_EVENT,
    );
  }
  async sendGetAccountsTransfersRequest({ accountId }: { accountId: string }) {
    const { logger } = this;
    //const accountIdDTO: AccountIdDTO = { accountId };
    logger.debug(
      "[AppService] sendCreateDirectorRequest customerId: ",
      accountId,
    );
    return this.handleKafkaTransferEvents(
      accountId,
      TRANSFER_TOPICS.HANDLE_GET_ACCOUNTS_TRANSFERS,
    );
  }
  async sendGetEmployeesCustomerRelatedTransactionsRequest({
    getEmployeesCustomerTransactionsDTO,
  }: {
    getEmployeesCustomerTransactionsDTO: GetEmployeesCustomerTransactionsDTO;
  }) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateDirectorRequest customerId: ",
      getEmployeesCustomerTransactionsDTO,
    );
    return this.handleKafkaBankEvents(
      getEmployeesCustomerTransactionsDTO,
      BANK_TOPICS.GET_EMPLOYEES_CUSTOMER_RELATED_TRANSACTIONS,
    );
  }
  async sendGetEmployeesTransactionsRequest({
    getEmployeeDTO,
  }: {
    getEmployeeDTO: GetEmployeeDTO;
  }) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateDirectorRequest customerId: ",
      getEmployeeDTO,
    );
    return this.handleKafkaBankEvents(
      getEmployeeDTO,
      BANK_TOPICS.GET_EMPLOYEES_TRANSACTIONS,
    );
  }
  async sendGetAccountRequest(accountId: AccountIdDTO) {
    const { logger } = this;
    logger.debug("[AppService] getAccounts DTO: ", accountId);
    return this.handleKafkaAccountEvents(accountId, ACCOUNT_TOPICS.GET_ACCOUNT);
  }
  async sendGetAccountsLastActionsRequest({
    getAccountsLastActionsDTO,
  }: {
    getAccountsLastActionsDTO: GetAccountsLastActionsDTO;
  }) {
    const { logger } = this;
    logger.debug(
      "[AppService] GetAccountsLastActions DTO: ",
      getAccountsLastActionsDTO,
    );
    return await this.handleKafkaAccountEvents(
      getAccountsLastActionsDTO,
      ACCOUNT_TOPICS.GET_ACCOUNTS_LAST_ACTIONS,
    );
  }
  async sendGetAccountsBalanceRequest(accountId: string) {
    const { logger } = this;
    logger.debug("[AppService] getAccountsBalance DTO: ", accountId);
    return this.handleKafkaAccountEvents(
      accountId,
      ACCOUNT_TOPICS.GET_ACCOUNTS_BALANCE,
    );
  }
  async sendGetAccountsCurrencyBalanceRequest(data: {
    accountId: string;
    currencyType: string;
  }) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendGetAccountsCurrencyBalanceRequest data: ",
      data,
    );
    return this.handleKafkaAccountEvents(
      data,
      ACCOUNT_TOPICS.GET_ACCOUNTS_CURRENCY_BALANCE,
    );
  }
  private async handleKafkaAccountEvents(
    data: any,
    topic: ACCOUNT_TOPICS,
  ): Promise<AccountType | any> {
    return new Promise((resolve, reject) => {
      this.accountClient.send(topic, data).subscribe({
        next: (response: any) => {
          this.logger.debug(
            `[handleKafkaAccountEvents] [${topic}] Response:`,
            response,
          );
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
  private async handleKafkaTransferEvents(
    data: any,
    topic: TRANSFER_TOPICS,
  ): Promise<TransferType | TransferDTO[]> {
    return new Promise((resolve, reject) => {
      this.transferClient.send(topic, data).subscribe({
        next: (response: any) => {
          this.logger.debug(
            `[handleKafkaTransferEvents] [${topic}] Response:`,
            response,
          );
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
  private async handleKafkaBankEvents(
    data: any,
    topic: BANK_TOPICS,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.bankClient.send(topic, data).subscribe({
        next: (response: any) => {
          this.logger.debug(
            `[handleKafkaBankEvents] [${topic}] Response:`,
            response,
          );
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
