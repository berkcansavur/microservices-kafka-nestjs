import { ACCOUNT_STATUS } from "src/constants/account.constants";
import { AccountCreatedState } from "./account-created.state";
import { AccountAvailableState } from "./account-available.state";
import { AccountNotAvailableState } from "./account-not-available.state";
import { AccountInTransactionState } from "./account-in-transaction.state";
import { AccountDeletedState } from "./account-deleted.state";
import { AccountBannedState } from "./account-banned.state";

export const AccountStateMap = {
  provide: "ACCOUNT_STATE",
  useValue: {
    [ACCOUNT_STATUS.CREATED]: AccountCreatedState,
    [ACCOUNT_STATUS.AVAILABLE]: AccountAvailableState,
    [ACCOUNT_STATUS.NOT_AVAILABLE]: AccountNotAvailableState,
    [ACCOUNT_STATUS.IN_TRANSACTION]: AccountInTransactionState,
    [ACCOUNT_STATUS.DELETED]: AccountDeletedState,
    [ACCOUNT_STATUS.BANNED]: AccountBannedState,
  },
};
