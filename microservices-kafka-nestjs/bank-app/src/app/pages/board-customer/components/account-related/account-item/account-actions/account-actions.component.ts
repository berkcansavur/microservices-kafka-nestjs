import { Component, Input, OnInit } from "@angular/core";
import { IActionLogItem } from "src/app/models/accounts.model";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "[app-account-actions]",
  templateUrl: "./account-actions.component.html",
})
export class AccountActionsComponent implements OnInit {
  @Input() accountsActions: IActionLogItem[] | undefined;
  isUserIsCustomer: boolean = false;
  errorMessage: string = "";
  actionCount: number = 10;
  constructor(private readonly utilsService: UtilsService) {}
  ngOnInit(): void {
    this.setProps();
    this.isAllowedToUserType();
  }
  setProps(): void {
    console.log(JSON.stringify(this.accountsActions));
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
}
