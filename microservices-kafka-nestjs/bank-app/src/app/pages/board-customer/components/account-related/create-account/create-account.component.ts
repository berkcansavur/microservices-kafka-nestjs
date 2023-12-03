import { Component } from "@angular/core";
import {
  ACCOUNT_TYPES,
  BANK_BRANCH_CODE,
} from "src/app/constants/app-constants";
import { IAccountItem } from "src/app/models/accounts.model";
import { AccountService } from "src/app/services/accounts.service";
import { TokenStorageService } from "src/app/services/token-storage.service";

@Component({
  selector: "[app-create-account]",
  templateUrl: "./create-account.component.html",
})
export class CreateAccountComponent {
  //constants
  accountTypes = Object.values(ACCOUNT_TYPES);
  bankBranchCodes = Object.values(BANK_BRANCH_CODE);
  createAccountForm: any = {
    accountName: null,
    interest: null,
  };

  // values
  selectedAccountType: string = "";
  selectedBankBranchCode: string = "";
  process: string = "";
  returnedCreatedAccount: IAccountItem | undefined;
  errorMessage: string = "";
  //conditions
  isLoading: boolean = false;
  isAccountTypeListOpen: boolean = false;
  isBankBranchCodeListOpen: boolean = false;

  constructor(
    private readonly accountService: AccountService,
    private readonly tokenStorage: TokenStorageService,
  ) {}
  //Events
  onCreateAccountSubmit(): void {
    const { selectedAccountType, selectedBankBranchCode, accountService } =
      this;
    const { accountName, interest } = this.createAccountForm;
    const userId = this.tokenStorage.getUser().userId;
    this.setLoading(true);
    this.setProcess("Creating account...");
    accountService
      .sendCreateAccountRequest({
        accountName,
        accountType: selectedAccountType,
        bankBranchCode: selectedBankBranchCode,
        userId,
        interest,
      })
      .subscribe({
        next: (data: any) => {
          this.returnedCreatedAccount = data;
          this.setLoading(false);
        },
        error: (err: any) => {
          this.setErrorMessage(
            "Account could not created: ",
            err.error.message,
          );
          this.setLoading(false);
        },
      });
  }
  onSelectedAccountType(): void {
    this.isAccountTypeListOpen = !this.isAccountTypeListOpen;
  }
  onSelectedBankBranchCodeType(): void {
    this.isBankBranchCodeListOpen = !this.isBankBranchCodeListOpen;
  }
  toggleAccountTypesMenu() {
    this.isAccountTypeListOpen = !this.isAccountTypeListOpen;
  }
  toggleBanksBranchCodesMenu() {
    this.isBankBranchCodeListOpen = !this.isBankBranchCodeListOpen;
  }
  //Setters
  setAccountType(accountType: string): void {
    this.selectedAccountType = accountType;
    this.onSelectedAccountType();
  }
  setBankBranchCode(bankBranchCode: string): void {
    this.selectedBankBranchCode = bankBranchCode;
    this.onSelectedBankBranchCodeType();
  }
  setLoading(state: boolean): void {
    this.isLoading = state;
  }
  setProcess(process: string): void {
    this.process = process;
  }
  setErrorMessage(errorMessage: string, serverError: any): void {
    this.errorMessage = errorMessage + serverError;
  }
}
