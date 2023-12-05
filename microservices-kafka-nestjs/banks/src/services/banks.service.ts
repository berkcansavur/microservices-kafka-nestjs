import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  AccountDTO,
  CreateBankDTO,
  PrivateAccountDTO,
} from "src/dtos/bank.dto";
import { BanksRepository } from "../repositories/banks.repository";
import { PrivateCustomerRepresentative } from "../schemas/customers.schema";
import { CustomersService } from "./customers.service";
import { BanksLogic } from "../logic/banks.logic";
import { Bank } from "../schemas/banks.schema";
import {
  ACCOUNT_TOPICS,
  BANK_ACTIONS,
  USER_TYPES,
} from "../constants/banks.constants";
import { IBankServiceInterface } from "../interfaces/banks-service.interface";
import {
  BankCouldNotCreatedException,
  EmployeeCouldNotUpdatedException,
  BankCouldNotUpdatedException,
  UserNotFoundException,
} from "../exceptions";
import { BankCustomerRepresentative } from "../schemas/employee-schema";
import { EmployeesService } from "./employees.service";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { CustomerRepresentativeService } from "./customer-representative.service";
import { AccountType } from "src/types/bank.types";
import { ClientKafka } from "@nestjs/microservices";
import { Utils } from "src/utils/utils";
import { UserProfileDTO } from "src/dtos/auth.dto";
import { UserProfileFactory } from "src/factories/user-profile.factory";
import { EMPLOYEE_MODEL_TYPES } from "src/types/employee.types";
@Injectable()
export class BanksService implements IBankServiceInterface, OnModuleInit {
  private readonly logger = new Logger(BanksService.name);
  constructor(
    @Inject("ACCOUNT_SERVICE") private readonly accountClient: ClientKafka,
    @Inject("USER_PROFILE_FACTORY")
    private readonly userProfileFactory: UserProfileFactory,
    private readonly banksRepository: BanksRepository,
    private readonly customersService: CustomersService,
    private readonly employeesService: EmployeesService,
    private readonly customerRepresentativeService: CustomerRepresentativeService,
    @InjectMapper() private readonly BankMapper: Mapper,
  ) {}
  async onModuleInit() {
    this.handleSubscribeMicroserviceTopics();
  }
  private async handleSubscribeMicroserviceTopics() {
    const accountTopis: string[] = Object.values(ACCOUNT_TOPICS);
    try {
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
    const {
      logger,
      customersService,
      customerRepresentativeService,
      BankMapper,
    } = this;
    logger.debug(
      "[BanksService] handleAddCustomerToCustomerRepresentative DTO: ",
      customerId,
      customerRepresentativeId,
    );
    const customer = await customersService.getCustomer({
      customerId,
    });
    const updatedCustomerRepresentative =
      await customerRepresentativeService.addCustomer({
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
  //Ok
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
    const { logger, userProfileFactory } = this;
    logger.debug("[getUserProfile] userId: ", userId, " userType: ", userType);
    const mappedUserType = Utils.getUserType({ userType });
    if (mappedUserType === USER_TYPES.CUSTOMER) {
      return (
        await userProfileFactory.getUserProfile(mappedUserType)
      ).getCustomerProfile(userId);
    }
    const employeeModelType = Utils.getEmployeeModelType(userType);
    if (
      employeeModelType === EMPLOYEE_MODEL_TYPES.BANK_CUSTOMER_REPRESENTATIVE
    ) {
      return (
        await userProfileFactory.getUserProfile(mappedUserType)
      ).getBankCustomerRepresentativeProfile(employeeModelType, userId);
    }
    if (employeeModelType === EMPLOYEE_MODEL_TYPES.BANK_DEPARTMENT_DIRECTOR) {
      return (
        await userProfileFactory.getUserProfile(mappedUserType)
      ).getBankDepartmentDirectorProfile(employeeModelType, userId);
    }
    if (employeeModelType === EMPLOYEE_MODEL_TYPES.BANK_DIRECTOR) {
      return (
        await userProfileFactory.getUserProfile(mappedUserType)
      ).getBankDirectorProfile(employeeModelType, userId);
    }
    throw new UserNotFoundException();
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
}
