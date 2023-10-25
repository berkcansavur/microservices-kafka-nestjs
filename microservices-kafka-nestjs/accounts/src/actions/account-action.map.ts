import { ACCOUNT_ACTIONS } from "src/constants/account.constants";
import { MoneyTransferredFromAccountAction } from "./money-transferred-from-account.action";
import { MoneyTransferredToAccountAction } from "./money-transferred-to-account.action";

export const AccountActionMap = {
  provide: "ACCOUNT_ACTION",
  useValue: {
    [ACCOUNT_ACTIONS.MONEY_TRANSFERRED_FROM_ACCOUNT]:
      MoneyTransferredFromAccountAction,
    [ACCOUNT_ACTIONS.MONEY_TRANSFERRED_TO_ACCOUNT]:
      MoneyTransferredToAccountAction,
  },
};
