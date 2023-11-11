import { Component } from "@angular/core";
import { IAccountItem, IBalanceItem } from "src/app/models/accounts.model";
import { AccountService } from "src/app/services/accounts.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "[app-customer-account]",
  templateUrl: "./customer-account.component.html",
})
export class CustomerAccountComponent {
  constructor(
    private readonly accountService: AccountService,
    private readonly tokenStorage: TokenStorageService,
    private readonly utilsService: UtilsService,
  ) {}
  //Values
  process: string = "";
  accounts: IAccountItem[] = [];
  accountsBalances: IBalanceItem[] = [];
  accountStatus: string | null = "";
  customerId: string = "";
  errorMessage: string = "";
  currentIndex = 0;
  //Conditions
  isUserIsCustomer: boolean = false;
  isLoggedIn: boolean = false;
  failed: boolean = false;
  isLoading: boolean = false;
  isCreateAccountClicked: boolean = false;

  ngOnInit(): void {
    this.customerId = this.tokenStorage.getUser().userId.toString();
    this.getCustomersAccounts();
    this.isLoggedIn = this.tokenStorage.getIsLoggedIn();
    this.isAllowedToUserType();
  }
  //Events
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
  onCreateAccountClick(): void {
    this.isCreateAccountClicked = !this.isCreateAccountClicked;
  }
  getCustomersAccounts() {
    this.isLoading = this.utilsService.setLoading(true);
    this.process = this.utilsService.setProcess(
      "Retrieving customers accounts data...",
    );
    this.accountService
      .sendGetCustomersAccountsRequest({ customerId: this.customerId })
      .subscribe({
        next: (data: any) => {
          this.accounts = data;
          this.isLoading = this.utilsService.setLoading(false);
        },
        error: (err: any) => {
          this.isLoading = this.utilsService.setLoading(false);
          console.error(err.error.message);
          this.errorMessage = this.utilsService.setErrorMessage(
            "Customer accounts data retrieving failed",
            err.error.message,
          );
        },
      });
  }
  //Checkers
  isAllowedToUserType() {
    const isAllowed = this.utilsService.isUserCustomer();
    if (isAllowed === true) {
      this.isUserIsCustomer = true;
    } else {
      this.errorMessage = this.utilsService.setErrorMessage(
        "You are not allowed to view this page.",
      );
    }
  }
  //Setters
  setCurrentIndex(i: number) {
    this.currentIndex = i;
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
