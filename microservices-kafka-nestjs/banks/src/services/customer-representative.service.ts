import { Injectable, Logger } from "@nestjs/common";
import {
  BankCustomerRepresentative,
  PrivateCustomer,
} from "../schemas/employee-schema";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { EmployeesRepository } from "src/repositories/employees.repository";
import {
  Customer,
  PrivateCustomerRepresentative,
} from "src/schemas/customers.schema";
import { EMPLOYEE_ACTIONS } from "src/types/employee.types";
import { BanksLogic } from "src/logic/banks.logic";
import { EmployeeCouldNotUpdatedException } from "src/exceptions";
import { CustomersService } from "./customers.service";

@Injectable()
export class CustomerRepresentativeService {
  private readonly logger = new Logger(CustomerRepresentativeService.name);
  constructor(
    private readonly employeesRepository: EmployeesRepository,
    private readonly customerService: CustomersService,
    @InjectMapper() private readonly BankMapper: Mapper,
  ) {}
  async addCustomer({
    customerRepresentativeId,
    customerId,
  }: {
    customerRepresentativeId: string;
    customerId: string;
  }): Promise<BankCustomerRepresentative> {
    const { logger, employeesRepository, customerService, BankMapper } = this;
    const customer = await customerService.getCustomer({ customerId });
    const mappedCustomer = BankMapper.map<Customer, PrivateCustomer>(
      customer,
      Customer,
      PrivateCustomer,
    );
    logger.debug(
      "[EmployeesService] addCustomerToCustomerRepresentative : ",
      customerRepresentativeId,
      customer,
    );
    const updatedCustomerRepresentative =
      await employeesRepository.addCustomerToCustomerRepresentative({
        customerRepresentativeId,
        customer: mappedCustomer,
        action: EMPLOYEE_ACTIONS.CUSTOMER_ASSIGNMENT,
      });
    if (!BanksLogic.isObjectValid(updatedCustomerRepresentative)) {
      throw new EmployeeCouldNotUpdatedException({
        data: { customerRepresentativeId },
      });
    }
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
    await customerService.registerCustomerRepresentativeToCustomer({
      customerId,
      customerRepresentative: formattedCustomerRepresentative,
    });
    return updatedCustomerRepresentative;
  }
}
