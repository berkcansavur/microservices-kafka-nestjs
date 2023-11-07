import { Component, Input, OnInit } from "@angular/core";
import { IActionLogItem } from "src/app/models/accounts.model";

@Component({
  selector: "[app-account-actions]",
  templateUrl: "./account-actions.component.html",
})
export class AccountActionsComponent implements OnInit {
  @Input() accountsActions: IActionLogItem[] | undefined;
  actionCount: number = 10;
  constructor() {}
  ngOnInit(): void {
    this.setProps();
  }
  setProps(): void {
    console.log(JSON.stringify(this.accountsActions));
  }
}
