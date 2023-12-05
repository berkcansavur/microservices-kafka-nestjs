import { InvalidUserTypeException } from "src/exceptions";
import { scrypt as _scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import {
  ACCOUNT_TYPES,
  BANK_BRANCH_CODE,
  EMPLOYEE_MODEL_TYPES,
  USER_TYPES,
} from "types/app-types";

const scrypt = promisify(_scrypt);
export class Utils {
  static generateRandomNumber(): number {
    const min = 10000000;
    const max = 99999999;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  static getBanksBranchCode(branchName: string): number | null {
    const matchingKey: string = Object.keys(BANK_BRANCH_CODE).find(
      (key) => branchName === key,
    );
    if (!matchingKey) {
      return null;
    }
    return BANK_BRANCH_CODE[matchingKey];
  }
  static getAccountType(accountType: string): string | null {
    const matchingKey: string = Object.keys(ACCOUNT_TYPES).find(
      (key) => accountType === key,
    );
    if (!matchingKey) {
      return null;
    }
    return ACCOUNT_TYPES[matchingKey];
  }
  static combineNumbers({
    branchCode,
    accountNumber,
  }: {
    branchCode: number;
    accountNumber: number;
  }) {
    return parseInt(branchCode.toString() + accountNumber.toString());
  }
  static getEmployeeModelType(employeeType: USER_TYPES): EMPLOYEE_MODEL_TYPES {
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
  static getUserType({ userType }: { userType: USER_TYPES }): USER_TYPES {
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
  static async hashPassword({ password }: { password: string }) {
    const salt = randomBytes(8).toString("hex");

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const generatedPassword = salt + "." + hash.toString("hex");

    return generatedPassword;
  }
}
