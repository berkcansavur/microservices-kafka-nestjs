import { Component, Input, OnInit } from "@angular/core";
import {
  IAccountItem,
  IActionLogItem,
  IBalanceItem,
} from "src/app/models/accounts.model";
import { AccountService } from "src/app/services/accounts.service";
import { UtilsService } from "src/app/services/utils.service";
@Component({
  selector: "[app-account-item]",
  templateUrl: "./account-item.component.html",
})
export class AccountItemComponent implements OnInit {
  isUserIsCustomer: boolean = false;
  accountName: string = "";
  accountsBalances: IBalanceItem[] = [];
  accountStatus: string | null = "";
  errorMessage: string = "";
  accountNumber: number | null = 0;
  interest: number | null = 0;
  accountType: string | null = "";
  accountId: string = "";
  actionCount: number = 10;
  createTransfer: boolean = false;
  actionLogs: IActionLogItem[] = [];
  showAccountActions: boolean = false;
  @Input() account: IAccountItem | undefined;
  constructor(
    private readonly accountService: AccountService,
    private readonly utilsService: UtilsService,
  ) {}
  ngOnInit(): void {
    this.setAccountProperties();
    this.isAllowedToUserType();
  }
  setAccountProperties() {
    if (this.account) {
      this.accountName = this.account.accountName;
      this.accountsBalances = this.account.balance;
      this.accountStatus = this.setAccountStatus(this.account);
      this.accountType = this.account.accountType;
      this.accountNumber = this.account.accountNumber;
      this.interest = this.account.interest;
      this.accountId = this.account._id;
      this.actionLogs = this.account.actionLogs;
    }
  }
  setAccountStatus(account: IAccountItem): string | null {
    const status: number = account.status;
    const mappedStatus = this.accountService.mapAccountStatus(status);
    return mappedStatus;
  }
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
  setShowActivities() {
    this.showAccountActions = !this.showAccountActions;
  }
  handleCreateTransfer() {
    this.createTransfer = !this.createTransfer;
  }
  handleShowActivities(): void {
    this.setShowActivities();
  }
}
