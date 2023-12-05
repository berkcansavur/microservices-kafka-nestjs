import { Injectable, Logger, Scope } from "@nestjs/common";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { EmployeesService } from "src/services/employees.service";
import { BankCustomerRepresentative } from "src/schemas/employee-schema";
import { UserProfileDTO } from "src/dtos/auth.dto";
import { EMPLOYEE_MODEL_TYPES } from "src/types/employee.types";
import { InvalidUserTypeException } from "src/exceptions";
import { IUserProfile } from "src/interfaces/user-profiles/user-profile.interface";

@Injectable({ scope: Scope.REQUEST })
export class BankCustomerRepresentativeProfile implements IUserProfile {
  private readonly logger = new Logger(BankCustomerRepresentativeProfile.name);
  constructor(
    @InjectMapper() private readonly BankMapper: Mapper,
    private readonly employeeService: EmployeesService,
  ) {}
  getBankDirectorProfile(): Promise<UserProfileDTO> {
    throw new InvalidUserTypeException();
  }
  getBankDepartmentDirectorProfile(): Promise<UserProfileDTO> {
    throw new InvalidUserTypeException();
  }
  async getBankCustomerRepresentativeProfile(
    employeeType: EMPLOYEE_MODEL_TYPES,
    employeeId: string,
  ): Promise<UserProfileDTO> {
    const { logger, employeeService, BankMapper } = this;
    logger.debug(
      `[getBankCustomerRepresentativeProfile] employeeId: ${employeeId} employeeType: ${employeeType}`,
    );
    const bankCustomerRepresentative = (await employeeService.getEmployee({
      employeeType,
      employeeId,
    })) as BankCustomerRepresentative;
    return BankMapper.map<BankCustomerRepresentative, UserProfileDTO>(
      bankCustomerRepresentative,
      BankCustomerRepresentative,
      UserProfileDTO,
    );
  }
  getCustomerProfile(): Promise<UserProfileDTO> {
    throw new InvalidUserTypeException();
  }
}
