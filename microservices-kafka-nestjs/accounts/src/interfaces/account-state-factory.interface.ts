import { ACCOUNT_STATUS } from "src/constants/account.constants";
import { IAccountState } from "./account-state.interface";

export interface IAccountStateFactory {
  getAccountState(state: ACCOUNT_STATUS): Promise<IAccountState>;
}
