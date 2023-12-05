import { USER_TYPES } from "src/constants/banks.constants";
import { BankDirectorProfile } from "./bank-director-profile";
import { BankDepartmentDirectorProfile } from "./bank-department-director-profile";
import { BankCustomerRepresentativeProfile } from "./bank-customer-representative-profile";
import { CustomerProfile } from "./customer-profile";

export const UserProfileMap = {
  provide: "USER_PROFILE",
  useValue: {
    [USER_TYPES.BANK_DIRECTOR]: BankDirectorProfile,
    [USER_TYPES.BANK_DEPARTMENT_DIRECTOR]: BankDepartmentDirectorProfile,
    [USER_TYPES.BANK_CUSTOMER_REPRESENTATIVE]:
      BankCustomerRepresentativeProfile,
    [USER_TYPES.CUSTOMER]: CustomerProfile,
  },
};
