import { Component, Input, OnInit } from "@angular/core";
import {
  IAccountItem,
  IActionLogItem,
  IBalanceItem,
} from "src/app/models/accounts.model";
import { AccountService } from "src/app/services/accounts.service";
@Component({
  selector: "[app-account-item]",
  templateUrl: "./account-item.component.html",
})
export class AccountItemComponent implements OnInit {
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
  constructor(private readonly accountService: AccountService) {}
  ngOnInit(): void {
    this.setAccountProperties();
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
      console.log("actionLogs: " + JSON.stringify(this.actionLogs));
      console.log("actionLogs: " + JSON.stringify(this.account));
    }
  }
  setAccountStatus(account: IAccountItem): string | null {
    const status: number = account.status;
    const mappedStatus = this.accountService.mapAccountStatus(status);
    return mappedStatus;
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
