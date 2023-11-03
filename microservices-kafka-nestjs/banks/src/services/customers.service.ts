import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { ACCOUNT_ACTIONS } from "src/constants/banks.constants";
import { AuthenticatedUserDTO } from "src/dtos/auth.dto";
import {
  CustomerDTO,
  createCustomerDTOWithCustomerNumber,
} from "src/dtos/bank.dto";
import { UserCouldNotValidatedException } from "src/exceptions";
import { CustomersRepository } from "src/repositories/customer.repository";
import {
  Customer,
  PrivateCustomerRepresentative,
} from "src/schemas/customers.schema";

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);
  constructor(
    @InjectMapper() private readonly AuthMapper: Mapper,
    private readonly customersRepository: CustomersRepository,
  ) {}

  async getCustomer({ customerId }: { customerId: string }): Promise<Customer> {
    const { customersRepository } = this;
    const customer: Customer = await customersRepository.getCustomer({
      customerId,
    });
    return customer;
  }
  async getCustomerByEmail({ email }: { email: string }): Promise<Customer> {
    const { customersRepository } = this;
    const customer: Customer = await customersRepository.findCustomerByEmail({
      email,
    });
    return customer;
  }
  async setCustomersAccessToken({
    authenticatedUserDTO,
  }: {
    authenticatedUserDTO: AuthenticatedUserDTO;
  }): Promise<CustomerDTO> {
    const { logger, customersRepository, AuthMapper } = this;
    logger.debug(
      "[setCustomersAccessToken] authenticatedUserDTO:",
      authenticatedUserDTO,
    );
    const { userId, access_token } = authenticatedUserDTO;
    const updatedCustomer = await customersRepository.setCustomersAccessToken({
      _id: userId,
      accessToken: access_token,
    });
    if (updatedCustomer.accessToken.length < 5) {
      throw new UserCouldNotValidatedException({ data: authenticatedUserDTO });
    }
    return AuthMapper.map<Customer, CustomerDTO>(
      updatedCustomer,
      Customer,
      CustomerDTO,
    );
  }
  async createCustomerAuth({
    customerNumber,
    password,
  }: {
    customerNumber: number;
    password: string;
  }) {
    const { logger, customersRepository } = this;
    logger.debug("createCustomerAuth  DTO: ", customerNumber, ", ", password);
    const customerAuth = await customersRepository.createCustomerAuth({
      customerNumber,
      password,
    });
    if (!customerAuth) {
      throw new Error("Customer authentication failed");
    }
    return customerAuth;
  }
  async createCustomer({
    createCustomerDTOWithCustomerNumber,
  }: {
    createCustomerDTOWithCustomerNumber: createCustomerDTOWithCustomerNumber;
  }): Promise<CustomerDTO> {
    const { logger, customersRepository, AuthMapper } = this;
    logger.debug("create customer DTO: ", createCustomerDTOWithCustomerNumber);
    const customer: Customer = await customersRepository.createCustomer({
      createCustomerDTOWithCustomerNumber,
    });
    if (!customer) {
      throw new Error("Customer could not be created");
    }
    return AuthMapper.map<Customer, CustomerDTO>(
      customer,
      Customer,
      CustomerDTO,
    );
  }
  async getCustomersAccountIds({ customerId }: { customerId: string }) {
    const { logger, customersRepository } = this;
    logger.debug("getCustomersAccounts customerId: ", customerId);
    const accountIds = await customersRepository.getAccountIds({
      customerId,
    });
    if (!accountIds) {
      throw new Error("Account could not be found");
    }
    const stringAccountIds = accountIds.map((accountId) => {
      return accountId.toString();
    });
    return stringAccountIds;
  }
  async addAccountToCustomer({
    customerId,
    accountId,
  }: {
    customerId: string;
    accountId: string;
  }): Promise<Customer> {
    const { logger, customersRepository } = this;
    logger.debug(
      "addAccountToCustomer customerId: ",
      customerId,
      ", ",
      accountId,
    );
    const updatedCustomer = await customersRepository.addAccount({
      customerId,
      accountId,
      action: ACCOUNT_ACTIONS.CREATED,
    });
    if (!updatedCustomer) {
      throw new Error("Account could not added to the customer");
    }
    return updatedCustomer;
  }
  async registerCustomerRepresentativeToCustomer({
    customerId,
    customerRepresentative,
  }: {
    customerId: string;
    customerRepresentative: PrivateCustomerRepresentative;
  }): Promise<Customer> {
    const { logger, customersRepository } = this;
    logger.debug(
      "registerCustomerRepresentativeToCustomer customerId: ",
      customerId,
      ", customerRepresentative: ",
      customerRepresentative,
    );
    const updatedCustomer =
      await customersRepository.registerCustomerRepresentativeToCustomer({
        customerId,
        customerRepresentative,
      });
    return updatedCustomer;
  }
}
