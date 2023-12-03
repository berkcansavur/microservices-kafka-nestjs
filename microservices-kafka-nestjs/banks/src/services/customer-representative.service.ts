import { Injectable, Logger } from "@nestjs/common";
import {
  BankCustomerRepresentative,
  PrivateCustomer,
} from "../schemas/employee-schema";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { EmployeesRepository } from "src/repositories/employees.repository";
import { Customer } from "src/schemas/customers.schema";
import { EMPLOYEE_ACTIONS } from "src/types/employee.types";
import { BanksLogic } from "src/logic/banks.logic";
import { EmployeeCouldNotUpdatedException } from "src/exceptions";

@Injectable()
export class CustomerRepresentativeService {
  private readonly logger = new Logger(CustomerRepresentativeService.name);
  constructor(
    private readonly employeesRepository: EmployeesRepository,
    @InjectMapper() private readonly BankMapper: Mapper,
  ) {}
  async addCustomer({
    customerRepresentativeId,
    customer,
  }: {
    customerRepresentativeId: string;
    customer: Customer;
  }): Promise<BankCustomerRepresentative> {
    const { logger, employeesRepository, BankMapper } = this;
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
    return updatedCustomerRepresentative;
  }
}
