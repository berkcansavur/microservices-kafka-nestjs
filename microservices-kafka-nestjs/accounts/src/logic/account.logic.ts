import { ACCOUNT_STATUS } from "src/constants/account.constants";
import { AccountType } from "src/types/account.types";

export class AccountLogic {
  static checkAccountStatus(
    accountStatus: ACCOUNT_STATUS,
    expectedAccountStatus: ACCOUNT_STATUS[],
  ): boolean {
    if (expectedAccountStatus.includes(accountStatus)) {
      return true;
    }
    return false;
  }
  static checkAccountCurrencyBalanceIsAvailable({
    amount,
    accountBalance,
  }: {
    amount: number;
    accountBalance: number;
  }) {
    const result = accountBalance - amount;
    if (result < 0) {
      return false;
    }
    return true;
  }
  static checkAccountAvailability({ account }: { account: AccountType }) {
    if (
      account.status !== ACCOUNT_STATUS.BANNED ||
      ACCOUNT_STATUS.DELETED ||
      ACCOUNT_STATUS.IN_TRANSACTION
    ) {
      return true;
    }
    return false;
  }
}
