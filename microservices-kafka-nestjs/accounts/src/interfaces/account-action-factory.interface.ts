import { ACCOUNT_ACTIONS } from "src/constants/account.constants";
import { IAccountAction } from "./account-action.interface";

export interface IAccountActionFactory {
  getAccountAction(action: ACCOUNT_ACTIONS): Promise<IAccountAction>;
}
