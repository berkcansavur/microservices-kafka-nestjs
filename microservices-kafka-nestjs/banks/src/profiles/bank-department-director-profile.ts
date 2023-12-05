import { Injectable, Logger, Scope } from "@nestjs/common";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { EmployeesService } from "src/services/employees.service";
import { BankDepartmentDirector } from "src/schemas/employee-schema";
import { UserProfileDTO } from "src/dtos/auth.dto";
import { EMPLOYEE_MODEL_TYPES } from "src/types/employee.types";
import { InvalidUserTypeException } from "src/exceptions";
import { IUserProfile } from "src/interfaces/user-profiles/user-profile.interface";

@Injectable({ scope: Scope.REQUEST })
export class BankDepartmentDirectorProfile implements IUserProfile {
  private readonly logger = new Logger(BankDepartmentDirectorProfile.name);
  constructor(
    @InjectMapper() private readonly BankMapper: Mapper,
    private readonly employeeService: EmployeesService,
  ) {}
  getBankDirectorProfile(): Promise<UserProfileDTO> {
    throw new InvalidUserTypeException();
  }
  async getBankDepartmentDirectorProfile(
    employeeType: EMPLOYEE_MODEL_TYPES,
    employeeId: string,
  ): Promise<UserProfileDTO> {
    const { logger, employeeService, BankMapper } = this;
    logger.debug(
      `[getBankDepartmentDirectorProfile] employeeId: ${employeeId} employeeType: ${employeeType}`,
    );
    const bankDepartmentDirector = (await employeeService.getEmployee({
      employeeType,
      employeeId,
    })) as BankDepartmentDirector;
    return BankMapper.map<BankDepartmentDirector, UserProfileDTO>(
      bankDepartmentDirector,
      BankDepartmentDirector,
      UserProfileDTO,
    );
  }
  getBankCustomerRepresentativeProfile(): Promise<UserProfileDTO> {
    throw new InvalidUserTypeException();
  }
  getCustomerProfile(): Promise<UserProfileDTO> {
    throw new InvalidUserTypeException();
  }
}
