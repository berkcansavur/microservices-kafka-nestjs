import { Component, OnInit } from "@angular/core";
import { IAccountItem, IBalanceItem } from "src/app/models/accounts.model";
import { AccountService } from "src/app/services/accounts.service";
import { TokenStorageService } from "src/app/services/token-storage.service";

@Component({
  selector: "[app-accounts]",
  templateUrl: "./accounts.component.html",
})
export class AccountsComponent implements OnInit {
  constructor(
    private readonly accountService: AccountService,
    private readonly tokenStorage: TokenStorageService,
  ) {}
  process: string = "";
  failed: boolean = false;
  loading: boolean = false;
  accounts: IAccountItem[] = [];
  accountsBalances: IBalanceItem[] = [];
  accountStatus: string | null = "";
  customerId: string = "";
  errorMessage: string = "";
  currentIndex = 0;
  setLoading(state: boolean) {
    this.loading = state;
  }
  setProcess(process: string) {
    this.process = process;
  }
  ngOnInit(): void {
    this.customerId = this.tokenStorage.getUser()._id.toString();
    this.setCustomersAccounts();
  }
  onNextClick() {
    if (this.currentIndex < this.accounts.length - 1) {
      this.currentIndex = this.currentIndex + 1;
    }
    this.currentIndex = this.currentIndex;
  }
  onPrevClick() {
    if (this.currentIndex > 0) {
      this.currentIndex = this.currentIndex - 1;
    }
    this.currentIndex = this.currentIndex;
  }
  setCurrentIndex(i: number) {
    this.currentIndex = i;
  }
  setCustomersAccounts() {
    this.setLoading(true);
    this.setProcess("Create transfer");
    this.accountService
      .sendGetCustomersAccountsRequest({ customerId: this.customerId })
      .subscribe({
        next: (data: any) => {
          this.accounts = data;
          this.setLoading(false);
        },
        error: (err: any) => {
          this.setLoading(false);
          this.errorMessage = err.error.message;
        },
      });
  }
  setAccountCustomProps(accounts: IAccountItem[]) {
    accounts.map((accountItem: IAccountItem) => {
      const status: number | undefined = accountItem?.status;
      this.accountStatus = this.accountService.mapAccountStatus(status);
    });
  }
  setBalance(account: IAccountItem): IBalanceItem[] {
    const balances: IBalanceItem[] | undefined = account?.balance;
    this.accountsBalances = balances;
    return balances;
  }
}
