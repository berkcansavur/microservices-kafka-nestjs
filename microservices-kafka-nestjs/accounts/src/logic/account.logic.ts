import { ACCOUNT_STATUS } from "src/constants/account.constants";
import { AccountType } from "src/types/account.types";

export class AccountLogic {
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
  }
  static checkAccountAvailability({ account }: { account: AccountType }) {
    if (
      account.status !== ACCOUNT_STATUS.BANNED ||
      ACCOUNT_STATUS.DELETED ||
      ACCOUNT_STATUS.IN_TRANSACTION
    ) {
      return true;
    }
  }
}
