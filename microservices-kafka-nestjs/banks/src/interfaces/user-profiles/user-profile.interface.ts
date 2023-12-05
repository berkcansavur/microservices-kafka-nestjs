import { UserProfileDTO } from "src/dtos/auth.dto";
import { EMPLOYEE_MODEL_TYPES } from "src/types/employee.types";

export interface IUserProfile {
  getBankDirectorProfile(
    employeeType: EMPLOYEE_MODEL_TYPES,
    employeeId: string,
  ): Promise<UserProfileDTO>;
  getBankDepartmentDirectorProfile(
    employeeType: EMPLOYEE_MODEL_TYPES,
    employeeId: string,
  ): Promise<UserProfileDTO>;
  getBankCustomerRepresentativeProfile(
    employeeType: EMPLOYEE_MODEL_TYPES,
    employeeId: string,
  ): Promise<UserProfileDTO>;
  getCustomerProfile(customerId: string): Promise<UserProfileDTO>;
}
