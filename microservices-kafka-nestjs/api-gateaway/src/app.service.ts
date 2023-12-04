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
  TransferType,
} from "types/app-types";
import { GetUserProfileDTO } from "./dtos/api.dtos";
import { BanksLogic, CustomersLogic } from "./logic";
import { AddTransactionToEmployeeDTO, TransferDTO } from "./dtos/transfer.dto";
import { CustomerHasNotRepresentativeException } from "./exceptions/customer-exception";
import { MoneyTransferCouldNotSucceedException } from "./exceptions";

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
  async sendCreateMoneyTransferAccrossAccounts({
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
  async sendCreateMoneyTransferRequest(
    createTransferRequestDTO: CreateTransferDTO,
  ) {
    const { logger } = this;
    logger.debug(
      `[AppService] createMoneyTransferRequest: ${JSON.stringify(
        createTransferRequestDTO,
      )}`,
    );
    return this.handleKafkaBankEvents(
      createTransferRequestDTO,
      BANK_TOPICS.CREATE_TRANSFER_ACROSS_ACCOUNTS_EVENT,
    );
  }
  async sendApproveTransferRequest(approveTransferDTO: GetTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] approveTransfer: ${JSON.stringify(approveTransferDTO)}`,
    );
    return this.handleKafkaBankEvents(
      approveTransferDTO,
      BANK_TOPICS.APPROVE_TRANSFER_EVENT,
    );
  }
  async sendRejectTransferRequest(rejectTransferDTO: GetTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] approveTransfer: ${JSON.stringify(rejectTransferDTO)}`,
    );
    return this.handleKafkaBankEvents(
      rejectTransferDTO,
      BANK_TOPICS.REJECT_TRANSFER_EVENT,
    );
  }
  async sendCreateAccountRequest(createAccountRequestDTO: CreateAccountDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] createAccountRequest: ${JSON.stringify(
        createAccountRequestDTO,
      )}`,
    );
    return this.handleKafkaBankEvents(
      createAccountRequestDTO,
      BANK_TOPICS.CREATE_ACCOUNT_EVENT,
    );
  }
  async sendTransferMoneyToAccountRequest(
    transferMoneyToAccountDTO: MoneyTransferDTO,
  ) {
    const { logger } = this;
    logger.debug(
      `[AppService] transferMoneyToAccountRequest: ${JSON.stringify(
        transferMoneyToAccountDTO,
      )}`,
    );
    return this.handleKafkaBankEvents(
      transferMoneyToAccountDTO,
      BANK_TOPICS.TRANSFER_MONEY_TO_ACCOUNT_EVENT,
    );
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
    return this.handleKafkaBankEvents(
      deleteTransferRecordsDTO,
      BANK_TOPICS.DELETE_TRANSFER_RECORDS_EVENT,
    );
  }
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
    return this.handleKafkaBankEvents(
      getCustomersTransfersDTO,
      BANK_TOPICS.GET_CUSTOMERS_TRANSFERS_EVENT,
    );
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
    const accountIdDTO: AccountIdDTO = { accountId };
    logger.debug(
      "[AppService] sendCreateDirectorRequest customerId: ",
      accountIdDTO,
    );
    return this.handleKafkaBankEvents(
      accountIdDTO,
      BANK_TOPICS.GET_ACCOUNTS_TRANSFERS_EVENT,
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
