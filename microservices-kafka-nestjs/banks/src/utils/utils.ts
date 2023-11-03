import {
  ACCOUNT_TYPES,
  BANK_BRANCH_CODE,
  USER_TYPES,
} from "src/constants/banks.constants";
import { InvalidUserTypeException } from "src/exceptions";
import { EMPLOYEE_MODEL_TYPES } from "src/types/employee.types";
import { scrypt as _scrypt, randomBytes } from "crypto";
import { promisify } from "util";
const scrypt = promisify(_scrypt);
export class Utils {
  generateRandomNumber(): number {
    const min = 10000000;
    const max = 99999999;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  getBanksBranchCode(branchName: string): number | null {
    const matchingKey: string = Object.keys(BANK_BRANCH_CODE).find(
      (key) => branchName === key,
    );
    if (!matchingKey) {
      return null;
    }
    return BANK_BRANCH_CODE[matchingKey];
  }
  getAccountType(accountType: string): string | null {
    const matchingKey: string = Object.keys(ACCOUNT_TYPES).find(
      (key) => accountType === key,
    );
    if (!matchingKey) {
      return null;
    }
    return ACCOUNT_TYPES[matchingKey];
  }
  combineNumbers({
    branchCode,
    accountNumber,
  }: {
    branchCode: number;
    accountNumber: number;
  }) {
    return parseInt(branchCode.toString() + accountNumber.toString());
  }
  getEmployeeModelType(employeeType: USER_TYPES): EMPLOYEE_MODEL_TYPES {
    if (employeeType === USER_TYPES.BANK_DIRECTOR) {
      return EMPLOYEE_MODEL_TYPES.BANK_DIRECTOR;
    }
    if (employeeType === USER_TYPES.BANK_DEPARTMENT_DIRECTOR) {
      return EMPLOYEE_MODEL_TYPES.BANK_DEPARTMENT_DIRECTOR;
    }
    if (employeeType === USER_TYPES.BANK_CUSTOMER_REPRESENTATIVE) {
      return EMPLOYEE_MODEL_TYPES.BANK_CUSTOMER_REPRESENTATIVE;
    }
    throw new InvalidUserTypeException();
  }
  getUserType({ userType }: { userType: USER_TYPES }): USER_TYPES {
    if (userType === USER_TYPES.BANK_CUSTOMER_REPRESENTATIVE) {
      return USER_TYPES.BANK_CUSTOMER_REPRESENTATIVE;
    }
    if (userType === USER_TYPES.BANK_DEPARTMENT_DIRECTOR) {
      return USER_TYPES.BANK_DEPARTMENT_DIRECTOR;
    }
    if (userType === USER_TYPES.BANK_DIRECTOR) {
      return USER_TYPES.BANK_DIRECTOR;
    }
    if (userType === USER_TYPES.CUSTOMER) {
      return USER_TYPES.CUSTOMER;
    }
    if (userType === USER_TYPES.ADMIN) {
      return USER_TYPES.ADMIN;
    }
    throw new InvalidUserTypeException();
  }
  async hashPassword({ password }: { password: string }) {
    const salt = randomBytes(8).toString("hex");

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const generatedPassword = salt + "." + hash.toString("hex");

    return generatedPassword;
  }
}
