import { Inject, Injectable, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { ACCOUNT_STATUS } from "src/constants/account.constants";
import { AccountStatusIsNotValidException } from "src/exceptions";
import { IAccountStateFactory } from "src/interfaces/account-state-factory.interface";
import { IAccountState } from "src/interfaces/account-state.interface";

@Injectable()
export class AccountStateFactory implements IAccountStateFactory {
  constructor(
    private readonly moduleReference: ModuleRef,
    @Inject("ACCOUNT_STATE")
    private readonly accountStateMap: Record<
      ACCOUNT_STATUS,
      Type<IAccountState>
    >,
  ) {}
  async getAccountState(state: ACCOUNT_STATUS): Promise<IAccountState> {
    const { accountStateMap } = this;
    const AccountStateClass = accountStateMap[state];
    if (!AccountStateClass) {
      throw new AccountStatusIsNotValidException({ message: state });
    }
    return this.moduleReference.create<IAccountState>(AccountStateClass);
  }
}
