import { Injectable, Logger, Scope } from "@nestjs/common";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { UserProfileDTO } from "src/dtos/auth.dto";
import { InvalidUserTypeException } from "src/exceptions";
import { CustomersService } from "src/services/customers.service";
import { Customer } from "src/schemas/customers.schema";
import { IUserProfile } from "src/interfaces/user-profiles/user-profile.interface";

@Injectable({ scope: Scope.REQUEST })
export class CustomerProfile implements IUserProfile {
  private readonly logger = new Logger(CustomerProfile.name);
  constructor(
    @InjectMapper() private readonly BankMapper: Mapper,
    private readonly customerService: CustomersService,
  ) {}
  getBankDirectorProfile(): Promise<UserProfileDTO> {
    throw new InvalidUserTypeException();
  }
  getBankDepartmentDirectorProfile(): Promise<UserProfileDTO> {
    throw new InvalidUserTypeException();
  }
  getBankCustomerRepresentativeProfile(): Promise<UserProfileDTO> {
    throw new InvalidUserTypeException();
  }
  async getCustomerProfile(customerId: string): Promise<UserProfileDTO> {
    const { logger, customerService, BankMapper } = this;
    logger.debug(`[getCustomerProfile] customerId: ${customerId}`);
    const customer = await customerService.getCustomer({ customerId });
    logger.debug("Customer: ", customer);
    return BankMapper.map<Customer, UserProfileDTO>(
      customer,
      Customer,
      UserProfileDTO,
    );
  }
}
