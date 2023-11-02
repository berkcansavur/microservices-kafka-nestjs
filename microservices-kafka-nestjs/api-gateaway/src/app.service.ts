import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import {
  AddCustomerToRepresentativeDTO,
  CreateAccountDTO,
  CreateBankDTO,
  CreateCustomerDTO,
  CreateCustomerRepresentativeDTO,
  CreateDepartmentDirectorDTO,
  CreateDirectorDTO,
  CreateEmployeeRegistrationToBankDTO,
  CreateTransferDTO,
  GetCustomersAccountsDTO,
  GetEmployeesCustomerTransactionsDTO,
  GetTransferDTO,
  MoneyTransferDTO,
} from "./dtos/api.dtos";
import { ACCOUNT_TOPICS, BANK_TOPICS } from "./constants/kafka-constants";
import { AccountType } from "types/app-types";

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @Inject("BANK_SERVICE") private readonly bankClient: ClientKafka,
    @Inject("ACCOUNT_SERVICE") private readonly accountClient: ClientKafka,
  ) {}
  async onModuleInit() {
    const bankTopics: string[] = Object.values(BANK_TOPICS);
    const accountTopis: string[] = Object.values(ACCOUNT_TOPICS);
    try {
      bankTopics.forEach((topic) => {
        this.bankClient.subscribeToResponseOf(topic);
        this.logger.debug(`${topic} topic is subscribed`);
      });
      accountTopis.forEach((topic) => {
        this.accountClient.subscribeToResponseOf(topic);
        this.logger.debug(`${topic} topic is subscribed`);
      });
      this.logger.debug(
        "Subscription of responses is successfully established.",
      );
    } catch (error) {
      this.logger.error("Subscription of responses is failed", error);
    }
  }
  sendCreateMoneyTransferRequest(createTransferRequestDTO: CreateTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] createMoneyTransferRequest: ${JSON.stringify(
        createTransferRequestDTO,
      )}`,
    );
    return this.bankClient.send(
      BANK_TOPICS.CREATE_TRANSFER_ACROSS_ACCOUNTS_EVENT,
      {
        createTransferRequestDTO,
      },
    );
  }
  sendApproveTransferRequest(approveTransferDTO: GetTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] approveTransfer: ${JSON.stringify(approveTransferDTO)}`,
    );
    return this.bankClient.send(BANK_TOPICS.APPROVE_TRANSFER_EVENT, {
      approveTransferDTO,
    });
  }
  sendRejectTransferRequest(rejectTransferDTO: GetTransferDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] approveTransfer: ${JSON.stringify(rejectTransferDTO)}`,
    );
    return this.bankClient.send(BANK_TOPICS.REJECT_TRANSFER_EVENT, {
      rejectTransferDTO,
    });
  }
  sendCreateAccountRequest(createAccountRequestDTO: CreateAccountDTO) {
    const { logger } = this;
    logger.debug(
      `[AppService] createAccountRequest: ${JSON.stringify(
        createAccountRequestDTO,
      )}`,
    );
    return this.bankClient.send(BANK_TOPICS.CREATE_ACCOUNT_EVENT, {
      createAccountRequestDTO,
    });
  }
  sendTransferMoneyToAccountRequest(
    transferMoneyToAccountDTO: MoneyTransferDTO,
  ) {
    const { logger } = this;
    logger.debug(
      `[AppService] transferMoneyToAccountRequest: ${JSON.stringify(
        transferMoneyToAccountDTO,
      )}`,
    );
    return this.bankClient.send(BANK_TOPICS.TRANSFER_MONEY_TO_ACCOUNT_EVENT, {
      transferMoneyToAccountDTO,
    });
  }
  sendCreateCustomerRequest(createCustomerRequestDTO: CreateCustomerDTO) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateCustomerRequest DTO: ",
      createCustomerRequestDTO,
    );
    return this.bankClient.send(
      BANK_TOPICS.CREATE_CUSTOMER_EVENT,
      createCustomerRequestDTO,
    );
  }
  sendCreateBankRequest(createBankRequestDTO: CreateBankDTO) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateBankRequest DTO: ",
      createBankRequestDTO,
    );
    return this.bankClient.send(
      BANK_TOPICS.CREATE_BANK_EVENT,
      createBankRequestDTO,
    );
  }
  sendCreateDirectorRequest(createBankDirectorRequestDTO: CreateDirectorDTO) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateDirectorRequest DTO: ",
      createBankDirectorRequestDTO,
    );
    return this.bankClient.send(
      BANK_TOPICS.CREATE_BANK_DIRECTOR_EVENT,
      createBankDirectorRequestDTO,
    );
  }
  sendCreateCustomerRepresentativeRequest(
    createCustomerRepresentativeRequestDTO: CreateCustomerRepresentativeDTO,
  ) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateCustomerRepresentativeRequest DTO: ",
      createCustomerRepresentativeRequestDTO,
    );
    return this.bankClient.send(
      BANK_TOPICS.CREATE_BANK_CUSTOMER_REPRESENTATIVE_EVENT,
      createCustomerRepresentativeRequestDTO,
    );
  }
  sendAddCustomerToRepresentativeRequest({
    addCustomerToRepresentativeDTO,
  }: {
    addCustomerToRepresentativeDTO: AddCustomerToRepresentativeDTO;
  }) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendAddCustomerToRepresentativeRequest data: ",
      addCustomerToRepresentativeDTO,
    );
    return this.bankClient.send(
      BANK_TOPICS.ADD_CUSTOMER_TO_BANKS_CUSTOMER_REPRESENTATIVE_EVENT,
      addCustomerToRepresentativeDTO,
    );
  }
  sendCreateDepartmentDirectorRequest(
    createDepartmentDirectorRequestDTO: CreateDepartmentDirectorDTO,
  ) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateDirectorRequest DTO: ",
      createDepartmentDirectorRequestDTO,
    );
    return this.bankClient.send(
      BANK_TOPICS.CREATE_BANK_DEPARTMENT_DIRECTOR_EVENT,
      createDepartmentDirectorRequestDTO,
    );
  }
  sendCreateEmployeeRegistrationToBankRequest(
    createEmployeeRegistrationToBankDTO: CreateEmployeeRegistrationToBankDTO,
  ) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateDirectorRequest DTO: ",
      createEmployeeRegistrationToBankDTO,
    );
    return this.bankClient.send(
      BANK_TOPICS.CREATE_EMPLOYEE_REGISTRATION_TO_BANK_EVENT,
      createEmployeeRegistrationToBankDTO,
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
    return this.bankClient.send(
      BANK_TOPICS.GET_CUSTOMER_ACCOUNTS_EVENT,
      getCustomersAccountsDTO,
    );
  }
  sendGetEmployeesCustomerRelatedTransactionsRequest({
    getEmployeesCustomerTransactionsDTO,
  }: {
    getEmployeesCustomerTransactionsDTO: GetEmployeesCustomerTransactionsDTO;
  }) {
    const { logger } = this;
    logger.debug(
      "[AppService] sendCreateDirectorRequest customerId: ",
      getEmployeesCustomerTransactionsDTO,
    );
    return this.bankClient.send(
      BANK_TOPICS.GET_EMPLOYEES_CUSTOMER_RELATED_TRANSACTIONS,
      getEmployeesCustomerTransactionsDTO,
    );
  }
  async sendGetAccountRequest(accountId: string) {
    const { logger } = this;
    logger.debug("[AppService] getAccounts DTO: ", accountId);
    const account = await this.handleKafkaAccountEvents(
      accountId,
      ACCOUNT_TOPICS.GET_ACCOUNT,
    );
    return account;
  }
  async sendGetAccountsLastActionsRequest(data: {
    accountId: string;
    actionCount: number;
  }) {
    const { logger } = this;
    logger.debug("[AppService] GetAccountsLastActions DTO: ", data);
    const account = await this.handleKafkaAccountEvents(
      data,
      ACCOUNT_TOPICS.GET_ACCOUNTS_LAST_ACTIONS,
    );
    return account;
  }
  async sendGetAccountsBalanceRequest(accountId: string) {
    const { logger } = this;
    logger.debug("[AppService] getAccountsBalance DTO: ", accountId);
    const account = await this.handleKafkaAccountEvents(
      accountId,
      ACCOUNT_TOPICS.GET_ACCOUNTS_BALANCE,
    );
    return account;
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
    const account = await this.handleKafkaAccountEvents(
      data,
      ACCOUNT_TOPICS.GET_ACCOUNTS_CURRENCY_BALANCE,
    );
    return account;
  }
  async handleKafkaAccountEvents(
    data: any,
    topic: ACCOUNT_TOPICS,
  ): Promise<AccountType> {
    return new Promise((resolve, reject) => {
      this.accountClient.send(topic, data).subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
}
