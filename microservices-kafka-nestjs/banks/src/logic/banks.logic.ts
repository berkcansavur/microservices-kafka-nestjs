import { ACCOUNT_TYPES, BANK_BRANCH_CODE } from "../constants/banks.constants";
import { CreateAccountDTO } from "src/dtos/bank.dto";

export class BanksLogic {
  static isObjectValid(object: object) {
    if (!object) {
      throw new Error(`Invalid object`);
    }
    return object;
  }
  static isAccountTypeIsValid({
    accountDTO,
  }: {
    accountDTO: CreateAccountDTO;
  }): boolean {
    const accountType: ACCOUNT_TYPES = accountDTO.accountType as ACCOUNT_TYPES;
    if (accountType === undefined) {
      return false;
    }
    return Object.keys(ACCOUNT_TYPES).includes(accountType);
  }
  static isValidBankBranchCode(branchCode: string): boolean {
    return Object.keys(BANK_BRANCH_CODE).includes(branchCode);
  }
}
