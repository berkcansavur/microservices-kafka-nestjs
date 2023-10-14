import { Injectable, Logger } from "@nestjs/common";
import { ACCOUNT_ACTIONS } from "src/constants/banks.constants";
import { createCustomerDTOWithCustomerNumber } from "src/dtos/bank.dto";
import { CustomersRepository } from "src/repositories/customer.repository";
import { Customer } from "src/schemas/customers.schema";

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);
  constructor(private readonly customersRepository: CustomersRepository) {}

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
  }) {
    const { logger, customersRepository } = this;
    logger.debug("create customer DTO: ", createCustomerDTOWithCustomerNumber);
    const customer: Customer = await customersRepository.createCustomer({
      createCustomerDTOWithCustomerNumber,
    });
    if (!customer) {
      throw new Error("Customer could not be created");
    }
    return customer;
  }
  async getCustomersAccounts({ customerId }: { customerId: string }) {
    const { logger, customersRepository } = this;
    logger.debug("getCustomersAccounts customerId: ", customerId);
    const accounts = await customersRepository.getAccountIds({
      customerId,
    });
    if (!accounts) {
      throw new Error("Account could not be found");
    }
    return accounts;
  }
  async addAccountToCustomer({
    customerId,
    accountId,
  }: {
    customerId: string;
    accountId: string;
  }) {
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
}
