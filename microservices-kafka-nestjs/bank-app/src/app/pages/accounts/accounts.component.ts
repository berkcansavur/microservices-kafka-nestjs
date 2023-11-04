import { Component, OnInit } from "@angular/core";
import { IAccountItem } from "src/app/models/accounts.model";
import { AccountService } from "src/app/services/accounts.service";
import { TokenStorageService } from "src/app/services/token-storage.service";

@Component({
  selector: "app-accounts",
  templateUrl: "./accounts.component.html",
})
export class AccountsComponent implements OnInit {
  constructor(
    private readonly accountService: AccountService,
    private readonly tokenStorage: TokenStorageService,
  ) {}
  accounts: IAccountItem[] = [];
  customerId: string = "";
  errorMessage: string = "";

  ngOnInit(): void {
    this.customerId = this.tokenStorage.getUser()._id.toString();
    this.setCustomersAccounts();
  }
  setCustomersAccounts() {
    this.accountService
      .sendGetCustomersAccountsRequest({ customerId: this.customerId })
      .subscribe({
        next: (data: any) => {
          this.accounts = data;
          console.log("Accounts: ", this.accounts);
        },
        error: (err: any) => {
          this.errorMessage = err.error.message;
        },
      });
  }
}
