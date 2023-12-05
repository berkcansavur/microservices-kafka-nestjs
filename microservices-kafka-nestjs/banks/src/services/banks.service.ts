import { Injectable, Logger } from "@nestjs/common";
import { CreateBankDTO } from "src/dtos/bank.dto";
import { BanksRepository } from "../repositories/banks.repository";
import { PrivateCustomerRepresentative } from "../schemas/customers.schema";
import { CustomersService } from "./customers.service";
import { BanksLogic } from "../logic/banks.logic";
import { Bank } from "../schemas/banks.schema";
import { BANK_ACTIONS, USER_TYPES } from "../constants/banks.constants";
import { IBankServiceInterface } from "../interfaces/banks-service.interface";
import {
  BankCouldNotCreatedException,
  EmployeeCouldNotUpdatedException,
  BankCouldNotUpdatedException,
} from "../exceptions";
import { BankCustomerRepresentative } from "../schemas/employee-schema";
import { EmployeesService } from "./employees.service";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { CustomerRepresentativeService } from "./customer-representative.service";
@Injectable()
export class BanksService implements IBankServiceInterface {
  private readonly logger = new Logger(BanksService.name);
  constructor(
    private readonly banksRepository: BanksRepository,
    private readonly customersService: CustomersService,
    private readonly employeesService: EmployeesService,
    private readonly customerRepresentativeService: CustomerRepresentativeService,
    @InjectMapper() private readonly BankMapper: Mapper,
  ) {}

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
  // private async getAndFormatAccounts({
  //   accountIds,
  // }: {
  //   accountIds: string[];
  // }): Promise<PrivateAccountDTO[]> {
  //   const { logger, BankMapper } = this;
  //   const accounts: AccountDTO[] = (await this.handleKafkaAccountEvents(
  //     accountIds,
  //     ACCOUNT_TOPICS.GET_ACCOUNTS,
  //   )) as AccountDTO[];
  //   logger.debug("getAccountFromAccountsMicroService account: ", accounts);

  //   const privateAccounts: PrivateAccountDTO[] = accounts.map((account) => {
  //     return BankMapper.map<AccountDTO, PrivateAccountDTO>(
  //       account,
  //       AccountDTO,
  //       PrivateAccountDTO,
  //     );
  //   });
  //   logger.debug(
  //     "getAccountFromAccountsMicroService privateAccount: ",
  //     JSON.stringify(privateAccounts),
  //   );
  //   return privateAccounts;
  // }
  // async getCustomersAccounts({
  //   customerId,
  // }: {
  //   customerId: string;
  // }): Promise<PrivateAccountDTO[]> {
  //   const { logger, customersService } = this;
  //   logger.debug("getCustomersAccounts customerId: ", customerId);
  //   const accountIds = await customersService.getCustomersAccountIds({
  //     customerId,
  //   });
  //   if (!accountIds) {
  //     throw new Error("Account could not be found");
  //   }
  //   const accountList = await this.getAndFormatAccounts({
  //     accountIds,
  //   });
  //   return accountList;
  // }
  // async getUserProfile({
  //   userType,
  //   userId,
  // }: {
  //   userType: USER_TYPES;
  //   userId: string;
  // }): Promise<UserProfileDTO> {
  //   const { logger, customersService, employeesService, BankMapper } = this;
  //   logger.debug("[getUserProfile] userId: ", userId, " userType: ", userType);
  //   const mappedUserType = Utils.getUserType({ userType });
  //   if (mappedUserType === USER_TYPES.CUSTOMER) {
  //     const user = await customersService.getCustomer({ customerId: userId });
  //     logger.debug("User model: ", user);
  //     return BankMapper.map<Customer, UserProfileDTO>(
  //       user,
  //       Customer,
  //       UserProfileDTO,
  //     );
  //   }
  //   if (
  //     mappedUserType === USER_TYPES.BANK_DIRECTOR ||
  //     USER_TYPES.BANK_DEPARTMENT_DIRECTOR ||
  //     USER_TYPES.BANK_CUSTOMER_REPRESENTATIVE
  //   ) {
  //     const employeeModelType = Utils.getEmployeeModelType(userType);
  //     if (
  //       employeeModelType === EMPLOYEE_MODEL_TYPES.BANK_CUSTOMER_REPRESENTATIVE
  //     ) {
  //       const user = (await employeesService.getEmployee({
  //         employeeType: employeeModelType,
  //         employeeId: userId,
  //       })) as BankCustomerRepresentative;
  //       return BankMapper.map<BankCustomerRepresentative, UserProfileDTO>(
  //         user,
  //         BankCustomerRepresentative,
  //         UserProfileDTO,
  //       );
  //     }
  //     if (employeeModelType === EMPLOYEE_MODEL_TYPES.BANK_DEPARTMENT_DIRECTOR) {
  //       const user = (await employeesService.getEmployee({
  //         employeeType: employeeModelType,
  //         employeeId: userId,
  //       })) as BankDepartmentDirector;
  //       return BankMapper.map<BankDepartmentDirector, UserProfileDTO>(
  //         user,
  //         BankDepartmentDirector,
  //         UserProfileDTO,
  //       );
  //     }
  //     if (employeeModelType === EMPLOYEE_MODEL_TYPES.BANK_DIRECTOR) {
  //       const user = (await employeesService.getEmployee({
  //         employeeType: employeeModelType,
  //         employeeId: userId,
  //       })) as BankDirector;
  //       return BankMapper.map<BankDirector, UserProfileDTO>(
  //         user,
  //         BankDirector,
  //         UserProfileDTO,
  //       );
  //     }
  //   }
  //   throw new UserNotFoundException();
  // }
  // async getCustomersTransfers({
  //   customerId,
  // }: {
  //   customerId: string;
  // }): Promise<TransferDTO[]> {
  //   try {
  //     const transfers: TransferDTO[] = (await this.handleKafkaTransferEvents(
  //       customerId,
  //       TRANSFER_TOPICS.HANDLE_GET_CUSTOMERS_TRANSFERS,
  //     )) as TransferDTO[];
  //     return transfers;
  //   } catch (error) {
  //     throw new TransferNotFoundException();
  //   }
  // }
  // async handleDeleteTransferRecords({
  //   transferIds,
  //   customerId,
  // }: {
  //   transferIds: string[];
  //   customerId: string;
  // }): Promise<TransferDTO[]> {
  //   const { logger } = this;
  //   logger.debug("handleApproveTransfer transferId: ", transferIds, customerId);
  //   const transfers: TransferDTO[] = (await this.handleKafkaTransferEvents(
  //     transferIds,
  //     TRANSFER_TOPICS.HANDLE_DELETE_TRANSFER_RECORDS,
  //   )) as TransferDTO[];
  //   return transfers;
  // }
  // async handleRejectTransfer({
  //   transferId,
  //   employeeId,
  // }: {
  //   transferId: string;
  //   employeeId: string;
  // }): Promise<TransferType> {
  //   const { logger, employeesService } = this;
  //   logger.debug("handleApproveTransfer transferId: ", transferId);
  //   try {
  //     const transfer: TransferType = (await this.handleKafkaTransferEvents(
  //       transferId,
  //       TRANSFER_TOPICS.HANDLE_GET_TRANSFER,
  //     )) as TransferType;
  //     if (
  //       !BanksLogic.isTransferStatusEqualToExpectedStatus({
  //         status: transfer.status,
  //         expectedStatus: TRANSFER_STATUSES.APPROVE_PENDING,
  //       })
  //     ) {
  //       throw new InvalidTransferStatusException({
  //         data: `Invalid transfer status ${transfer.status}`,
  //       });
  //     }
  //     const rejectedTransfer: TransferType =
  //       (await this.handleKafkaTransferEvents(
  //         transfer,
  //         TRANSFER_TOPICS.HANDLE_REJECT_TRANSFER,
  //       )) as TransferType;
  //     if (!BanksLogic.isObjectValid(rejectedTransfer)) {
  //       throw new TransferCouldNotRejectedException();
  //     }
  //     await employeesService.updateEmployeesCustomerTransactionsResult({
  //       employeeType: USER_TYPES.BANK_CUSTOMER_REPRESENTATIVE,
  //       transferId,
  //       employeeId,
  //       transfer: rejectedTransfer,
  //       result: TRANSACTION_RESULTS.REJECTED,
  //       action: EMPLOYEE_ACTIONS.TRANSFER_APPROVAL_SUCCESS,
  //     });
  //     return rejectedTransfer;
  //   } catch (error) {
  //     if (error instanceof InvalidTransferStatusException) {
  //       throw new InvalidTransferStatusException({
  //         data: `Invalid transfer status ${error.data}`,
  //       });
  //     }
  //     if (error instanceof TransferCouldNotRejectedException) {
  //       throw new TransferCouldNotRejectedException({
  //         data: `Invalid transfer status ${error.data}`,
  //       });
  //     }
  //     throw new MoneyTransferCouldNotSucceedException({ errorData: error });
  //   }
  // }
  // async handleGetAccountsTransfers({
  //   fromAccount,
  // }: {
  //   fromAccount: string;
  // }): Promise<TransferDTO[]> {
  //   const { logger } = this;
  //   logger.debug("handleApproveTransfer transferId: ", fromAccount);
  //   const transfers: TransferDTO[] = (await this.handleKafkaTransferEvents(
  //     fromAccount,
  //     TRANSFER_TOPICS.HANDLE_GET_ACCOUNTS_TRANSFERS,
  //   )) as TransferDTO[];
  //   return transfers;
  // }
}
