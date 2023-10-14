import { ACCOUNT_TYPES, BANK_BRANCH_CODE } from "src/constants/banks.constants";

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
}
