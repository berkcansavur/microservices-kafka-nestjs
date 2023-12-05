import { Injectable, Logger, Scope } from "@nestjs/common";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { EmployeesService } from "src/services/employees.service";
import { BankDirector } from "src/schemas/employee-schema";
import { UserProfileDTO } from "src/dtos/auth.dto";
import { EMPLOYEE_MODEL_TYPES } from "src/types/employee.types";
import { InvalidUserTypeException } from "src/exceptions";
import { IUserProfile } from "src/interfaces/user-profiles/user-profile.interface";

@Injectable({ scope: Scope.REQUEST })
export class BankDirectorProfile implements IUserProfile {
  private readonly logger = new Logger(BankDirectorProfile.name);
  constructor(
    @InjectMapper() private readonly BankMapper: Mapper,
    private readonly employeeService: EmployeesService,
  ) {}
  async getBankDirectorProfile(
    employeeType: EMPLOYEE_MODEL_TYPES,
    employeeId: string,
  ): Promise<UserProfileDTO> {
    const { logger, employeeService, BankMapper } = this;
    logger.debug(
      `[getBankDirectorProfile] employeeId: ${employeeId} employeeType: ${employeeType}`,
    );
    const bankDirector = (await employeeService.getEmployee({
      employeeType,
      employeeId,
    })) as BankDirector;
    return BankMapper.map<BankDirector, UserProfileDTO>(
      bankDirector,
      BankDirector,
      UserProfileDTO,
    );
  }
  getBankDepartmentDirectorProfile(): Promise<UserProfileDTO> {
    throw new InvalidUserTypeException();
  }
  getBankCustomerRepresentativeProfile(): Promise<UserProfileDTO> {
    throw new InvalidUserTypeException();
  }
  getCustomerProfile(): Promise<UserProfileDTO> {
    throw new InvalidUserTypeException();
  }
}
