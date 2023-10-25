import { Inject, Injectable, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { ACCOUNT_ACTIONS } from "src/constants/account.constants";
import { AccountActionIsNotValidException } from "src/exceptions";
import { IAccountActionFactory } from "src/interfaces/account-action-factory.interface";
import { IAccountAction } from "src/interfaces/account-action.interface";

@Injectable()
export class AccountActionFactory implements IAccountActionFactory {
  constructor(
    private readonly moduleReference: ModuleRef,
    @Inject("ACCOUNT_ACTION")
    private readonly accountActionMap: Record<
      ACCOUNT_ACTIONS,
      Type<IAccountAction>
    >,
  ) {}
  async getAccountAction(action: ACCOUNT_ACTIONS): Promise<IAccountAction> {
    const { accountActionMap } = this;
    const AccountActionClass = accountActionMap[action];
    if (!AccountActionClass) {
      throw new AccountActionIsNotValidException({ message: action });
    }
    return this.moduleReference.create<IAccountAction>(AccountActionClass);
  }
}
