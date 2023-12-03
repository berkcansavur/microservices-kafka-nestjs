import { CreateAccountDTO } from "src/dtos/api.dtos";
import { BankDummies } from "src/dummies/bank.dummy";
import {
  ACCOUNT_TYPES,
  BANK_BRANCH_CODE,
  EVENT_RESULTS,
  TRANSFER_STATUSES,
} from "types/app-types";

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
  static isTransferSucceed(eventResult: EVENT_RESULTS): boolean {
    if (eventResult === EVENT_RESULTS.SUCCESS) {
      return true;
    }
    return false;
  }
  static isIncomingMoneyIsValid(serials: number[]): boolean {
    const serialSet = new Set(BankDummies.dummySerialNos);
    const fakeSerial = serials.filter((serial) => !serialSet.has(serial));
    if (fakeSerial.length >= 1) {
      return false;
    }
    return true;
  }
  static isAmountGreaterThanDesignatedAmount({
    designatedAmount,
    amount,
  }: {
    designatedAmount: number;
    amount: number;
  }): boolean {
    if (amount > designatedAmount) {
      return true;
    }
    return false;
  }
  static isTransferStatusEqualToExpectedStatus({
    status,
    expectedStatus,
  }: {
    status: TRANSFER_STATUSES;
    expectedStatus: TRANSFER_STATUSES;
  }): boolean {
    if (status === expectedStatus) {
      return true;
    }
    return false;
  }
}
